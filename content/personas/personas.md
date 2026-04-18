---js
const eleventyNavigation = {
 key: "Personas",
 order: 2
}
---

# Personas

{% for persona in personas.personas %}

## {{ persona.nombre }}

{% if persona.profeUDP.existencia %}

{% if not persona.profeUDP.fin %}

- Profe desde {{ persona.profeUDP.inicio }} hasta ahora

{% else %}

- Profe desde {{ persona.profeUDP.inicio }} hasta {{ persona.profeUDP.fin }}

{% endif %}

    {% for curso in persona.profeUDP.cursos %}
    - {{ curso.nombre }} ({{ curso.semestres | join(", ") }})
    {% endfor %}

{% endif %}

{% if persona.ayudanteUDP.existencia %}

{% if not persona.ayudanteUDP.fin %}

- Ayudante desde {{ persona.ayudanteUDP.inicio }} hasta ahora

{% else %}

- Ayudante desde {{ persona.ayudanteUDP.inicio }} hasta {{ persona.ayudanteUDP.fin }}

{% endif %}

{% endif %}

{% if persona.estudianteUDP.existencia %}

{% if not persona.estudianteUDP.fin %}

- Estudiante desde {{ persona.estudianteUDP.inicio }} hasta ahora

{% else %}

- Estudiante desde {{ persona.estudianteUDP.inicio }} hasta {{ persona.estudianteUDP.fin }}

{% endif %}

{% endif %}

{% endfor %}
