---js
const eleventyNavigation = {
 key: "libros",
 parent: "maquinas"
}
---

# Libros

{% for libro in libros.libros %}

- {{ libro.titulo }} de editorial {{ libro.editorial }}
{% endfor %}
