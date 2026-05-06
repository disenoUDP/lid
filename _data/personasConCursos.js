import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function personaKeys(nombre) {
  const normalized = normalizeName(nombre);
  const parts = normalized.split(" ").filter(Boolean);
  const keys = new Set();

  if (normalized) keys.add(normalized);
  if (parts.length >= 2) keys.add(`${parts[0]} ${parts[1]}`);

  return keys;
}

function ensureRole(persona, roleKey) {
  const role = persona[roleKey] || {};
  return {
    ...role,
    existencia: Boolean(role.existencia),
    cursos: [],
  };
}

function addTeachingEntry(accumulator, personKey, roleKey, sigla, nombre, semestre) {
  if (!accumulator.has(personKey)) {
    accumulator.set(personKey, {
      profeUDP: new Map(),
      ayudanteUDP: new Map(),
    });
  }

  const roleMap = accumulator.get(personKey)[roleKey];
  const courseKey = `${sigla}::${nombre}`;

  if (!roleMap.has(courseKey)) {
    roleMap.set(courseKey, {
      nombre: `${sigla} ${nombre}`,
      semestres: new Set(),
    });
  }

  roleMap.get(courseKey).semestres.add(semestre);
}

function mapToSortedCourses(roleMap) {
  return Array.from(roleMap.values())
    .map((course) => ({
      nombre: course.nombre,
      semestres: Array.from(course.semestres).sort((a, b) => b.localeCompare(a)),
    }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

function readYaml(filePath) {
  return YAML.parse(fs.readFileSync(filePath, "utf8"));
}

function buildPersonasConCursos() {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const personasPath = path.join(dirname, "personas.yaml");
  const cursosPath = path.join(dirname, "cursos.yaml");

  const personasData = readYaml(personasPath)?.personas || [];
  const cursosData = readYaml(cursosPath)?.cursos || [];

  const personaByKey = new Map();
  const canonicalNameByKey = new Map();

  personasData.forEach((persona) => {
    for (const key of personaKeys(persona.nombre)) {
      if (!personaByKey.has(key)) {
        personaByKey.set(key, persona);
        canonicalNameByKey.set(key, persona.nombre);
      }
    }
  });

  const teachingByCanonicalName = new Map();
  const validationErrors = [];

  cursosData.forEach((curso, cursoIndex) => {
    const sigla = String(curso?.sigla || "").trim();
    const nombre = String(curso?.nombre || "").trim();

    if (!sigla || !nombre) {
      validationErrors.push(
        `Curso inválido en índice ${cursoIndex}: falta sigla o nombre.`
      );
      return;
    }

    (curso.semestres || []).forEach((semestreData, semestreIndex) => {
      const semestre = String(semestreData?.semestre || "").trim();
      const secciones = Array.isArray(semestreData?.secciones) ? semestreData.secciones : [];

      if (!semestre) {
        validationErrors.push(
          `Curso ${sigla}: semestre inválido en índice ${semestreIndex}.`
        );
      }

      secciones.forEach((seccion, seccionIndex) => {
        const roleEntries = [
          { key: "profeUDP", label: "profes", values: seccion?.profes },
          { key: "ayudanteUDP", label: "ayudantes", values: seccion?.ayudantes },
        ];

        roleEntries.forEach(({ key, label, values }) => {
          if (!Array.isArray(values) || values.length === 0) {
            validationErrors.push(
              `Curso ${sigla} ${semestre} sección ${seccion?.seccion ?? seccionIndex + 1}: rol ${label} vacío.`
            );
            return;
          }

          values.forEach((rawName) => {
            const normalized = normalizeName(rawName);

            if (!normalized) {
              validationErrors.push(
                `Curso ${sigla} ${semestre} sección ${seccion?.seccion ?? seccionIndex + 1}: rol ${label} contiene nombre vacío.`
              );
              return;
            }

            const persona = personaByKey.get(normalized);
            if (!persona) {
              validationErrors.push(
                `Curso ${sigla} ${semestre} sección ${seccion?.seccion ?? seccionIndex + 1}: \"${rawName}\" no existe en personas.yaml.`
              );
              return;
            }

            addTeachingEntry(
              teachingByCanonicalName,
              canonicalNameByKey.get(normalized),
              key,
              sigla,
              nombre,
              semestre
            );
          });
        });
      });
    });
  });

  if (validationErrors.length > 0) {
    console.warn(
      `Errores de consistencia entre cursos/personas:\n- ${validationErrors.join("\n- ")}`
    );
  }

  return {
    personas: personasData.map((persona) => {
      const teaching = teachingByCanonicalName.get(persona.nombre);
      const profeUDP = ensureRole(persona, "profeUDP");
      const ayudanteUDP = ensureRole(persona, "ayudanteUDP");
      const estudianteUDP = ensureRole(persona, "estudianteUDP");

      return {
        ...persona,
        profeUDP: {
          ...profeUDP,
          cursos: teaching ? mapToSortedCourses(teaching.profeUDP) : [],
        },
        ayudanteUDP: {
          ...ayudanteUDP,
          cursos: teaching ? mapToSortedCourses(teaching.ayudanteUDP) : [],
        },
        estudianteUDP,
      };
    }),
  };
}

export default buildPersonasConCursos();
