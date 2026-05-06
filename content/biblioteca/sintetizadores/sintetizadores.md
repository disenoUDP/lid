---js
const eleventyNavigation = {
 key: "sintetizadores",
 parent: "maquinas"
}
---

# Sintetizadores

{% for sintetizador in sintetizadores.sintetizadores %}

## {{ sintetizador.marca }} {{ sintetizador.modelo }}

Categorías: {{ sintetizador.categorias | join(", ") }}

Enlaces:
{% for enlace in sintetizador.enlaces %}

- [{{ enlace }}]({{ enlace }})
{% endfor %}

Imágenes:
{% for imagen in sintetizador.imagenes %}
{% if imagen %}
<img src="/public/sintetizadores-imagenes/{{ imagen }}" alt="{{ sintetizador.marca }} {{ sintetizador.modelo }}" eleventy:ignore />
{% endif %}
{% endfor %}

{% endfor %}
