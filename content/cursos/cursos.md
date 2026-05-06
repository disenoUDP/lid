---js
const eleventyNavigation = {
 key: "Cursos",
 order: 3
}
---

# Cursos

<div class="cursos-filtros">
  <div class="filtro-grupo">
    <label for="filtro-semestre">semestre</label>
    <select id="filtro-semestre">
      <option value="">todos</option>
    </select>
  </div>
  <div class="filtro-grupo">
    <label for="filtro-profe">profesor/a</label>
    <select id="filtro-profe">
      <option value="">todos</option>
    </select>
  </div>
  <div class="filtro-grupo">
    <label for="filtro-ayudante">ayudante</label>
    <select id="filtro-ayudante">
      <option value="">todos</option>
    </select>
  </div>
  <button id="filtro-reset">limpiar filtros</button>
</div>

<div id="cursos-lista">
{% for curso in cursos.cursos %}
<div class="curso-item">
  <h2>{{ curso.nombre }} <span class="curso-sigla">{{ curso.sigla }}</span></h2>
  {% for semestre in curso.semestres %}
  {% for seccion in semestre.secciones %}
  <div class="seccion-item"
    data-semestre="{{ semestre.semestre }}"
    data-profes="{{ seccion.profes | join('|') | lower }}"
    data-ayudantes="{{ seccion.ayudantes | join('|') | lower }}">
    <h3>{{ semestre.semestre }} — sección {{ seccion.seccion }}</h3>
    <ul>
      <li>profes: {{ seccion.profes | join(", ") }}</li>
      <li>ayudantes: {{ seccion.ayudantes | join(", ") }}</li>
    </ul>
  </div>
  {% endfor %}
  {% endfor %}
</div>
{% endfor %}
</div>

<script>
(function () {
  const secciones = document.querySelectorAll('.seccion-item');
  const semestresSet = new Set();
  const profesSet = new Set();
  const ayudantesSet = new Set();

  secciones.forEach(function (sec) {
    if (sec.dataset.semestre) semestresSet.add(sec.dataset.semestre);
    sec.dataset.profes.split('|').forEach(function (p) {
      if (p.trim()) profesSet.add(p.trim());
    });
    sec.dataset.ayudantes.split('|').forEach(function (a) {
      if (a.trim()) ayudantesSet.add(a.trim());
    });
  });

  const semestresOrdenados = Array.from(semestresSet).sort(function (a, b) {
    return b.localeCompare(a);
  });

  function populateSelect(id, values) {
    const sel = document.getElementById(id);
    values.forEach(function (v) {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      sel.appendChild(opt);
    });
  }

  populateSelect('filtro-semestre', semestresOrdenados);
  populateSelect('filtro-profe', Array.from(profesSet).sort());
  populateSelect('filtro-ayudante', Array.from(ayudantesSet).sort());

  function aplicarFiltros() {
    const sem = document.getElementById('filtro-semestre').value;
    const prof = document.getElementById('filtro-profe').value;
    const ay = document.getElementById('filtro-ayudante').value;

    document.querySelectorAll('.curso-item').forEach(function (curso) {
      let algunaVisible = false;
      curso.querySelectorAll('.seccion-item').forEach(function (sec) {
        const matchSem = !sem || sec.dataset.semestre === sem;
        const matchProf = !prof || sec.dataset.profes.split('|').map(function (p) { return p.trim(); }).includes(prof);
        const matchAy = !ay || sec.dataset.ayudantes.split('|').map(function (a) { return a.trim(); }).includes(ay);
        const visible = matchSem && matchProf && matchAy;
        sec.style.display = visible ? '' : 'none';
        if (visible) algunaVisible = true;
      });
      curso.style.display = algunaVisible ? '' : 'none';
    });
  }

  document.getElementById('filtro-semestre').addEventListener('change', aplicarFiltros);
  document.getElementById('filtro-profe').addEventListener('change', aplicarFiltros);
  document.getElementById('filtro-ayudante').addEventListener('change', aplicarFiltros);

  document.getElementById('filtro-reset').addEventListener('click', function () {
    document.getElementById('filtro-semestre').value = '';
    document.getElementById('filtro-profe').value = '';
    document.getElementById('filtro-ayudante').value = '';
    aplicarFiltros();
  });
}());
</script>
