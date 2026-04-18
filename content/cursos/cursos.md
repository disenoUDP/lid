---js
const eleventyNavigation = {
 key: "Cursos",
 order: 3
}
---

# Cursos

{% for curso in cursos.cursos %}

## {{ curso.nombre }}

  {% for semestre in curso.semestres %}

### {{ semestre.semestre }}

    {% for seccion in semestre.secciones %}
    - Sección {{ seccion.seccion }}
      - Profes: {{ seccion.profes | join(", ") }}
      - Ayudantes: {{ seccion.ayudantes | join(", ") }}
    {% endfor %}
  {% endfor %}

{% endfor %}
