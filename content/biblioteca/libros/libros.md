---js
const eleventyNavigation = {
 key: "libros",
 parent: "maquinas"
}
---

# Libros

{% for libro in libros.libros %}

## {{ libro.titulo }}

- Autores: {% for autor in libro.autores %}{{ autor }}{% if not loop.last %}, {% endif %}{% endfor %}
- Editorial: {{ libro.editorial }}
- Año: {{ libro.agno }}
- Palabras clave: {% for palabra in libro.palabrasClave %}{{ palabra }}{% if not loop.last %}, {% endif %}{% endfor %}
  
Imágenes:
{% for imagen in libro.imagenes %}
{% if imagen %}
<img src="/public/libros-imagenes/{{ imagen }}" 
     alt="{{ libro.titulo }}" 
     eleventy:ignore />
{% endif %}
{% endfor %}
{% endfor %}

