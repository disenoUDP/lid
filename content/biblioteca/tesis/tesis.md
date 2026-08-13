---js
const eleventyNavigation = {
 key: "tesis",
 parent: "maquinas"
}
---

# Tesis

Colección de tesis del Laboratorio de Interacción Digital.

<div class="cursos-filtros">
  <div class="filtro-grupo">
    <label for="filtro-anho">año</label>
    <select id="filtro-anho">
      <option value="">todos</option>
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
  <button id="filtro-reset">limpiar filtros</button>
</div>

<div id="tesis-lista">
{% for entrada in tesis | sortBooksByTitle %}
<div class="libro-item"
  data-temas="{{ entrada.temas | join('|') | lower }}"
  data-titulo="{{ entrada.titulo | lower }}"
  data-agno="{{ entrada.anho }}">
  <h2>{{ entrada.titulo }}</h2>
  <ul>
    <li>autor/a: {{ entrada["autor-nombres"] }} {{ entrada["autor-apellidos"] }}</li>
    <li>profesores guía: {% for profesor in entrada["profesores-guia"] %}{{ profesor }}{% if not loop.last %}, {% endif %}{% endfor %}</li>
    <li>año: {{ entrada.anho }}</li>
    <li>institución: {{ entrada.institucion }}</li>
    <li>grado: {{ entrada.grado }}</li>
    <li>temas: {% for tema in entrada.temas %}{{ tema }}{% if not loop.last %}, {% endif %}{% endfor %}</li>
    {% if entrada.url %}<li><a href="{{ entrada.url }}">ver en catálogo</a></li>{% endif %}
    {% if entrada.pdf %}<li><a href="https://github.com/disenoUDP/coleccion-tesis-interaccion-digital/blob/main/{{ entrada.pdf }}">ver PDF</a></li>{% endif %}
  </ul>
</div>
{% endfor %}
</div>

<script>
(function () {
  var lista = document.getElementById('tesis-lista');
  var entradas = Array.from(document.querySelectorAll('#tesis-lista .libro-item'));
  var anhosSet = new Set();
  var temasSet = new Set();

  entradas.forEach(function (entrada) {
    var anho = entrada.dataset.agno.trim();
    var temas = entrada.dataset.temas.split('|').map(function (t) { return t.trim(); }).filter(Boolean);
    if (anho) anhosSet.add(anho);
    temas.forEach(function (t) { temasSet.add(t); });
  });

  function populateSelect(id, values, sortDescending) {
    var sel = document.getElementById(id);
    Array.from(values).sort(function (a, b) {
      return sortDescending ? b.localeCompare(a) : a.localeCompare(b);
    }).forEach(function (v) {
      var opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      sel.appendChild(opt);
    });
  }

  populateSelect('filtro-anho', anhosSet, true);
  populateSelect('filtro-tema', temasSet, false);

  function reordenar(arr) {
    arr.forEach(function (el) { lista.appendChild(el); });
  }

  function ordenarEntradas(criterio) {
    var copia = entradas.slice();
    if (criterio === 'az') {
      copia.sort(function (a, b) {
        return (a.dataset.titulo || '').localeCompare(b.dataset.titulo || '', 'es', { sensitivity: 'base', numeric: true });
      });
    } else if (criterio === 'za') {
      copia.sort(function (a, b) {
        return (b.dataset.titulo || '').localeCompare(a.dataset.titulo || '', 'es', { sensitivity: 'base', numeric: true });
      });
    } else if (criterio === 'agno-asc') {
      copia.sort(function (a, b) {
        return (parseInt(a.dataset.agno, 10) || 0) - (parseInt(b.dataset.agno, 10) || 0);
      });
    } else if (criterio === 'agno-desc') {
      copia.sort(function (a, b) {
        return (parseInt(b.dataset.agno, 10) || 0) - (parseInt(a.dataset.agno, 10) || 0);
      });
    }
    reordenar(copia);
  }

  function aplicarFiltros() {
    var filtroAnho = document.getElementById('filtro-anho').value;
    var filtroTema = document.getElementById('filtro-tema').value;

    entradas.forEach(function (entrada) {
      var anho = entrada.dataset.agno.trim();
      var temas = entrada.dataset.temas.split('|').map(function (t) { return t.trim(); }).filter(Boolean);
      var matchAnho = !filtroAnho || anho === filtroAnho;
      var matchTema = !filtroTema || temas.includes(filtroTema);
      entrada.style.display = (matchAnho && matchTema) ? '' : 'none';
    });
  }

  document.getElementById('filtro-anho').addEventListener('change', aplicarFiltros);
  document.getElementById('filtro-tema').addEventListener('change', aplicarFiltros);

  document.getElementById('ordenar').addEventListener('change', function () {
    ordenarEntradas(this.value);
    aplicarFiltros();
  });

  document.getElementById('filtro-reset').addEventListener('click', function () {
    document.getElementById('filtro-anho').value = '';
    document.getElementById('filtro-tema').value = '';
    document.getElementById('ordenar').value = 'az';
    ordenarEntradas('az');
    aplicarFiltros();
  });
}());
</script>
