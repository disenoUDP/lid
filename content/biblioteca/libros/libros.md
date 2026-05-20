---js
const eleventyNavigation = {
 key: "libros",
 parent: "maquinas"
}
---

# Libros

<p><a href="https://forms.gle/JUgnqqPrUZ1GnYPf9" aria-label="Formulario para arrendar un libro">Arrendar un libro</a></p>

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
  <div class="filtro-grupo">
    <label for="ordenar">ordenar</label>
    <select id="ordenar">
      <option value="az">a → z</option>
      <option value="za">z → a</option>
      <option value="agno-asc">año ↑</option>
      <option value="agno-desc">año ↓</option>
    </select>
  </div>
  <button id="btn-scramble">mezclar</button>
  <button id="btn-random">libro al azar</button>
  <button id="filtro-reset">limpiar filtros</button>
</div>

<div id="libros-lista">
{% for libro in libros.libros | sortBooksByTitle %}
<div class="libro-item"
  data-autores="{{ libro.autores | join('|') | lower }}"
  data-editorial="{{ libro.editorial | lower }}"
  data-temas="{{ libro.palabrasClave | join('|') | lower }}"
  data-titulo="{{ libro.titulo | lower }}"
  data-agno="{{ libro.agno }}">
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
  var lista = document.getElementById('libros-lista');
  var libros = Array.from(document.querySelectorAll('.libro-item'));
  var autoresSet = new Set();
  var editorialesSet = new Set();
  var temasSet = new Set();
  var modoRandom = false;

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

  function reordenar(arr) {
    arr.forEach(function (el) { lista.appendChild(el); });
  }

  function ordenarLibros(criterio) {
    var copia = libros.slice();
    if (criterio === 'az') {
      copia.sort(function (a, b) {
        var ta = a.dataset.titulo || '';
        var tb = b.dataset.titulo || '';
        return ta.localeCompare(tb, 'es', { sensitivity: 'base', numeric: true });
      });
    } else if (criterio === 'za') {
      copia.sort(function (a, b) {
        var ta = a.dataset.titulo || '';
        var tb = b.dataset.titulo || '';
        return tb.localeCompare(ta, 'es', { sensitivity: 'base', numeric: true });
      });
    } else if (criterio === 'agno-asc') {
      copia.sort(function (a, b) {
        var ya = parseInt(a.dataset.agno, 10) || 0;
        var yb = parseInt(b.dataset.agno, 10) || 0;
        return ya - yb;
      });
    } else if (criterio === 'agno-desc') {
      copia.sort(function (a, b) {
        var ya = parseInt(a.dataset.agno, 10) || 0;
        var yb = parseInt(b.dataset.agno, 10) || 0;
        return yb - ya;
      });
    }
    reordenar(copia);
  }

  function mezclar() {
    var copia = libros.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = copia[i]; copia[i] = copia[j]; copia[j] = tmp;
    }
    reordenar(copia);
  }

  function salirModoRandom() {
    if (!modoRandom) return;
    modoRandom = false;
    libros.forEach(function (el) { el.style.display = ''; });
    var btn = document.getElementById('btn-ver-todos');
    if (btn) btn.remove();
    aplicarFiltros();
  }

  function aplicarFiltros() {
    if (modoRandom) return;
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

  document.getElementById('ordenar').addEventListener('change', function () {
    salirModoRandom();
    ordenarLibros(this.value);
    aplicarFiltros();
  });

  document.getElementById('btn-scramble').addEventListener('click', function () {
    salirModoRandom();
    mezclar();
    aplicarFiltros();
  });

  document.getElementById('btn-random').addEventListener('click', function () {
    salirModoRandom();
    var visibles = libros.filter(function (el) { return el.style.display !== 'none'; });
    if (visibles.length === 0) return;
    var elegido = visibles[Math.floor(Math.random() * visibles.length)];
    modoRandom = true;
    libros.forEach(function (el) { el.style.display = el === elegido ? '' : 'none'; });

    var btnVerTodos = document.createElement('button');
    btnVerTodos.id = 'btn-ver-todos';
    btnVerTodos.textContent = 'ver todos';
    btnVerTodos.addEventListener('click', function () { salirModoRandom(); });
    lista.insertAdjacentElement('beforebegin', btnVerTodos);
  });

  document.getElementById('filtro-reset').addEventListener('click', function () {
    salirModoRandom();
    document.getElementById('filtro-autor').value = '';
    document.getElementById('filtro-editorial').value = '';
    document.getElementById('filtro-tema').value = '';
    document.getElementById('ordenar').value = 'az';
    ordenarLibros('az');
    aplicarFiltros();
  });
}());
</script>
