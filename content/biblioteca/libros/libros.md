---js
const eleventyNavigation = {
 key: "libros",
 parent: "maquinas"
}
---

# Libros

<div class="cursos-filtros">
  <div class="filtro-grupo">
    <label for="filtro-autor">autor/a</label>
    <select id="filtro-autor">
      <option value="">todos</option>
    </select>
  </div>
  <div class="filtro-grupo">
    <label for="filtro-editorial">editorial</label>
    <select id="filtro-editorial">
      <option value="">todas</option>
    </select>
  </div>
  <div class="filtro-grupo">
    <label for="filtro-tema">tema</label>
    <select id="filtro-tema">
      <option value="">todos</option>
    </select>
  </div>
  <button id="filtro-reset">limpiar filtros</button>
</div>

<div id="libros-lista">
{% for libro in libros.libros | sortBooksByTitle %}
<div class="libro-item"
  data-autores="{{ libro.autores | join('|') | lower }}"
  data-editorial="{{ libro.editorial | lower }}"
  data-temas="{{ libro.palabrasClave | join('|') | lower }}">
  <h2>{{ libro.titulo }}</h2>
  <ul>
    {% if libro.id %}<li>ID: {{ libro.id }}</li>{% endif %}
    <li>autores: {% for autor in libro.autores %}{{ autor }}{% if not loop.last %}, {% endif %}{% endfor %}</li>
    <li>editorial: {{ libro.editorial }}</li>
    <li>año: {{ libro.agno }}</li>
    <li>palabras clave: {% for palabra in libro.palabrasClave %}{{ palabra }}{% if not loop.last %}, {% endif %}{% endfor %}</li>
  </ul>
  {% for imagen in libro.imagenes %}
  {% if imagen %}
  <img src="/public/libros-imagenes/{{ imagen }}"
       alt="{{ libro.titulo }}"
       eleventy:ignore />
  {% endif %}
  {% endfor %}
</div>
{% endfor %}
</div>

<script>
(function () {
  var libros = document.querySelectorAll('.libro-item');
  var autoresSet = new Set();
  var editorialesSet = new Set();
  var temasSet = new Set();

  libros.forEach(function (libro) {
    var autores = libro.dataset.autores.split('|').map(function (a) { return a.trim(); }).filter(Boolean);
    var editorial = libro.dataset.editorial.trim();
    var temas = libro.dataset.temas.split('|').map(function (t) { return t.trim(); }).filter(Boolean);
    autores.forEach(function (a) { autoresSet.add(a); });
    if (editorial) editorialesSet.add(editorial);
    temas.forEach(function (t) { temasSet.add(t); });
  });

  function populateSelect(id, values) {
    var sel = document.getElementById(id);
    Array.from(values).sort().forEach(function (v) {
      var opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      sel.appendChild(opt);
    });
  }

  populateSelect('filtro-autor', autoresSet);
  populateSelect('filtro-editorial', editorialesSet);
  populateSelect('filtro-tema', temasSet);

  function aplicarFiltros() {
    var filtroAutor = document.getElementById('filtro-autor').value;
    var filtroEditorial = document.getElementById('filtro-editorial').value;
    var filtroTema = document.getElementById('filtro-tema').value;

    libros.forEach(function (libro) {
      var autores = libro.dataset.autores.split('|').map(function (a) { return a.trim(); }).filter(Boolean);
      var editorial = libro.dataset.editorial.trim();
      var temas = libro.dataset.temas.split('|').map(function (t) { return t.trim(); }).filter(Boolean);
      var matchAutor = !filtroAutor || autores.includes(filtroAutor);
      var matchEditorial = !filtroEditorial || editorial === filtroEditorial;
      var matchTema = !filtroTema || temas.includes(filtroTema);
      libro.style.display = (matchAutor && matchEditorial && matchTema) ? '' : 'none';
    });
  }

  document.getElementById('filtro-autor').addEventListener('change', aplicarFiltros);
  document.getElementById('filtro-editorial').addEventListener('change', aplicarFiltros);
  document.getElementById('filtro-tema').addEventListener('change', aplicarFiltros);

  document.getElementById('filtro-reset').addEventListener('click', function () {
    document.getElementById('filtro-autor').value = '';
    document.getElementById('filtro-editorial').value = '';
    document.getElementById('filtro-tema').value = '';
    aplicarFiltros();
  });
}());
</script>
