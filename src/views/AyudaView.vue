<template>
  <div class="page" style="max-width:860px;">
    <h1 style="font-size:20px; font-weight:600; margin-bottom:6px;">Ayuda</h1>
    <p style="font-size:13px; color:#888; margin-bottom:28px;">Guía de uso y referencia de configuración de la aplicación.</p>

    <!-- Índice -->
    <nav class="ayuda-indice">
      <a href="#plano">Plano de ocupación</a>
      <a href="#residentes">Residentes</a>
      <a href="#historial">Historial</a>
      <a href="#analisis">Análisis</a>
      <a href="#buscador">Buscador</a>
      <a href="#configuracion">Configuración</a>
      <a href="#base-de-datos">Base de datos</a>
      <a href="#backup">Copias de seguridad</a>
      <a href="#impresion">Impresión</a>
      <a href="#excel">Exportación Excel</a>
    </nav>

    <!-- ── Plano ──────────────────────────────────────────────────────────── -->
    <section class="ayuda-seccion" id="plano">
      <h2>Plano de ocupación</h2>
      <p>Pantalla principal. Muestra el plano de cada planta con el estado de ocupación en tiempo real.</p>

      <h3>Colores de las habitaciones</h3>
      <div class="ayuda-tabla">
        <div class="ayuda-fila ayuda-fila--header">
          <span>Color</span><span>Significado</span>
        </div>
        <div class="ayuda-fila">
          <span><span class="color-chip" style="background:#4CAF50;"></span> Verde</span>
          <span>Habitación libre (ningún residente asignado)</span>
        </div>
        <div class="ayuda-fila">
          <span><span class="color-chip" style="background:#FF9800;"></span> Naranja</span>
          <span>Habitación doble parcialmente ocupada (1 de 2 plazas)</span>
        </div>
        <div class="ayuda-fila">
          <span><span class="color-chip" style="background:#e0e0e0; border:1px solid #bbb;"></span> Blanco</span>
          <span>Habitación completamente ocupada</span>
        </div>
        <div class="ayuda-fila">
          <span><span class="color-chip" style="background:#9E9E9E;"></span> Gris</span>
          <span>Habitación sin datos (no encontrada en la base de datos)</span>
        </div>
      </div>

      <h3>Acciones</h3>
      <ul>
        <li><strong>Clic en una habitación</strong> — abre el panel de detalle donde puedes asignar o registrar la salida de un residente.</li>
        <li><strong>Tabs Planta Baja / Primera / Segunda</strong> — cambia la planta visualizada.</li>
        <li><strong>Imprimir plano</strong> — imprime solo el SVG del plano en orientación apaisada (oculta la navegación).</li>
      </ul>

      <h3>Asignar un residente a una habitación</h3>
      <ol>
        <li>Haz clic en una habitación libre (verde).</li>
        <li>En el panel lateral, busca al residente por nombre o DNI.</li>
        <li>Selecciona la fecha de entrada (por defecto, hoy).</li>
        <li>Pulsa <strong>Asignar</strong>.</li>
      </ol>

      <h3>Registrar salida de un residente</h3>
      <ol>
        <li>Haz clic en la habitación ocupada.</li>
        <li>Pulsa el botón <strong>Registrar salida</strong> junto al nombre del residente.</li>
        <li>Introduce la fecha de salida, el motivo (obligatorio) y las notas opcionales.</li>
        <li>Pulsa <strong>Confirmar salida</strong>.</li>
      </ol>
    </section>

    <!-- ── Residentes ─────────────────────────────────────────────────────── -->
    <section class="ayuda-seccion" id="residentes">
      <h2>Residentes</h2>
      <p>Gestión del listado de residentes registrados en el sistema.</p>
      <ul>
        <li><strong>Nuevo residente</strong> — rellena nombre, apellidos, DNI (opcional) y código de residente (opcional). El DNI debe ser único si se introduce.</li>
        <li><strong>Editar</strong> — modifica los datos de un residente existente.</li>
        <li><strong>Eliminar</strong> — solo es posible si el residente no tiene ninguna ocupación activa ni historial.</li>
        <li>La columna <strong>Habitación actual</strong> muestra en qué habitación está el residente, si está asignado.</li>
      </ul>
    </section>

    <!-- ── Historial ──────────────────────────────────────────────────────── -->
    <section class="ayuda-seccion" id="historial">
      <h2>Historial</h2>
      <p>Registro completo de todas las ocupaciones pasadas y activas.</p>
      <ul>
        <li>Filtra por <strong>planta</strong>, <strong>rango de fechas</strong>, <strong>residente</strong> o <strong>motivo de salida</strong>.</li>
        <li>Las ocupaciones activas (sin fecha de salida) aparecen con la celda de salida en blanco.</li>
        <li><strong>Exportar Excel</strong> — genera un fichero <code>.xlsx</code> con tres hojas: estado actual, historial completo y habitaciones libres. El nombre del fichero incluye la fecha de exportación.</li>
      </ul>
    </section>

    <!-- ── Análisis ───────────────────────────────────────────────────────── -->
    <section class="ayuda-seccion" id="analisis">
      <h2>Análisis</h2>
      <p>Gráficos e indicadores estadísticos sobre la ocupación.</p>
      <div class="ayuda-tabla">
        <div class="ayuda-fila ayuda-fila--header"><span>Indicador</span><span>Descripción</span></div>
        <div class="ayuda-fila"><span>Grado de ocupación</span><span>% de plazas ocupadas sobre el total de plazas disponibles</span></div>
        <div class="ayuda-fila"><span>Estancia media actual</span><span>Media de días que llevan los residentes actuales en la residencia</span></div>
        <div class="ayuda-fila"><span>Estancia media histórica</span><span>Media de días de todas las estancias finalizadas</span></div>
        <div class="ayuda-fila"><span>Salidas del mes</span><span>Número de salidas registradas en el mes en curso</span></div>
        <div class="ayuda-fila"><span>Evolución mensual</span><span>% de ocupación por mes en los últimos 12 meses</span></div>
        <div class="ayuda-fila"><span>Motivos de salida</span><span>Distribución de los motivos de salida registrados</span></div>
        <div class="ayuda-fila"><span>Duración de estancias</span><span>Histograma por intervalos: &lt;30 días, 1-6 meses, 6-12 meses, &gt;1 año</span></div>
      </div>
    </section>

    <!-- ── Buscador ───────────────────────────────────────────────────────── -->
    <section class="ayuda-seccion" id="buscador">
      <h2>Buscador</h2>
      <p>Tres modos de búsqueda rápida:</p>
      <ul>
        <li><strong>Por número de habitación</strong> — muestra el residente actual y el historial completo de esa habitación.</li>
        <li><strong>Por nombre o apellidos</strong> — localiza a un residente y muestra en qué habitación está y su historial. La búsqueda ignora tildes y mayúsculas.</li>
        <li><strong>Habitaciones libres</strong> — lista todas las habitaciones sin ocupación activa, con su tipo y plazas disponibles.</li>
      </ul>
    </section>

    <!-- ── Configuración ──────────────────────────────────────────────────── -->
    <section class="ayuda-seccion" id="configuracion">
      <h2>Configuración</h2>

      <h3>Identidad de la residencia</h3>
      <ul>
        <li><strong>Nombre de la residencia</strong> — aparece en la barra lateral y en el encabezado del plano al imprimir.</li>
        <li><strong>Logotipo</strong> — imagen SVG, PNG o JPG. Se escala automáticamente. Aparece en la barra lateral y en el encabezado de impresión. Para quitarlo, pulsa <em>Quitar logotipo</em>.</li>
      </ul>

      <h3>Habitaciones</h3>
      <p>Permite marcar habitaciones como <strong>dobles</strong> (2 plazas) o <strong>individuales</strong> (1 plaza).</p>
      <ul>
        <li>Una habitación doble con un solo residente aparece en <strong>naranja</strong> (parcialmente ocupada).</li>
        <li>Una habitación doble con dos residentes aparece en <strong>blanco</strong> (completamente ocupada).</li>
        <li>Este ajuste no suele cambiar una vez configurado inicialmente.</li>
      </ul>

      <h3>Motivos de salida</h3>
      <p>Lista de motivos disponibles al registrar la salida de un residente. Cada motivo tiene un <strong>código numérico único</strong> (no modificable) y un nombre descriptivo.</p>
      <ul>
        <li>El código numérico lo elige el usuario al crear el motivo y no puede cambiarse después.</li>
        <li>No se puede eliminar un motivo que ya esté asociado a ocupaciones del historial.</li>
        <li>Ejemplos habituales: <em>1 - Fallecimiento</em>, <em>2 - Traslado</em>, <em>3 - Alta voluntaria</em>.</li>
      </ul>
    </section>

    <!-- ── Base de datos ──────────────────────────────────────────────────── -->
    <section class="ayuda-seccion" id="base-de-datos">
      <h2>Base de datos</h2>
      <p>Todos los datos se guardan en un único fichero <code>gestion-habitaciones.sqlite</code>.</p>

      <h3>Ubicación por defecto</h3>
      <p>La base de datos se guarda en la <strong>misma carpeta que el ejecutable</strong>. Esto facilita mover o copiar la aplicación junto con sus datos a cualquier equipo.</p>

      <h3>Cambiar la ubicación</h3>
      <p>En <em>Configuración → Base de datos</em> puedes seleccionar cualquier carpeta, incluyendo unidades de red. La aplicación se reiniciará para aplicar el cambio.</p>
      <div class="ayuda-aviso">
        Si el fichero no existe en la nueva ubicación, se creará uno nuevo vacío. Para migrar los datos existentes, <strong>copia o mueve el fichero <code>.sqlite</code> a la nueva carpeta antes de cambiar la ruta</strong>.
      </div>

      <h3>Acceso compartido desde varios equipos</h3>
      <p>Si varios ordenadores deben acceder a los mismos datos, configura en todos ellos la misma ruta de red (por ejemplo <code>\\servidor\residencia\gestion-habitaciones.sqlite</code>). SQLite admite acceso concurrente limitado; se recomienda que solo un usuario trabaje con la aplicación a la vez.</p>

      <h3>Variable de entorno <code>DB_PATH</code></h3>
      <p>La ruta también puede fijarse mediante la variable de entorno <code>DB_PATH</code>, que tiene prioridad sobre cualquier otro ajuste:</p>
      <pre>DB_PATH=\\servidor\residencia\db.sqlite</pre>
    </section>

    <!-- ── Backup ─────────────────────────────────────────────────────────── -->
    <section class="ayuda-seccion" id="backup">
      <h2>Copias de seguridad automáticas</h2>
      <p>Cada vez que se inicia la aplicación, se crea automáticamente una copia de seguridad del fichero <code>.sqlite</code>.</p>
      <ul>
        <li>Las copias se guardan en la subcarpeta <code>backups/</code>, junto al fichero principal.</li>
        <li>El nombre incluye la fecha y hora: <code>db-2026-03-15_10-30-00.sqlite</code>.</li>
        <li>Se conservan las <strong>5 copias más recientes</strong>; las anteriores se eliminan automáticamente.</li>
      </ul>
      <div class="ayuda-aviso">
        Las copias de seguridad automáticas no sustituyen a una política de backup externa. Se recomienda realizar copias periódicas de la carpeta completa en un medio externo o en la nube.
      </div>
    </section>

    <!-- ── Impresión ──────────────────────────────────────────────────────── -->
    <section class="ayuda-seccion" id="impresion">
      <h2>Impresión del plano</h2>
      <ul>
        <li>Usa el botón <strong>Imprimir plano</strong> en la pantalla del plano, o pulsa <kbd>Ctrl+P</kbd>.</li>
        <li>Se imprime solo el SVG de la planta activa, en <strong>orientación apaisada (A4)</strong>.</li>
        <li>El encabezado de impresión incluye el logotipo (si está configurado), el nombre de la residencia, la planta y la fecha.</li>
        <li>La barra lateral, los botones y la leyenda se ocultan automáticamente al imprimir.</li>
      </ul>
    </section>

    <!-- ── Excel ─────────────────────────────────────────────────────────── -->
    <section class="ayuda-seccion" id="excel">
      <h2>Exportación Excel</h2>
      <p>Disponible desde la pantalla de <strong>Historial</strong>. Genera un fichero <code>.xlsx</code> con tres hojas:</p>
      <div class="ayuda-tabla">
        <div class="ayuda-fila ayuda-fila--header"><span>Hoja</span><span>Contenido</span></div>
        <div class="ayuda-fila"><span>Estado actual</span><span>Habitación, planta, tipo, residente, DNI, código, fecha de entrada</span></div>
        <div class="ayuda-fila"><span>Historial</span><span>Todas las ocupaciones con fechas de entrada/salida, motivo y notas</span></div>
        <div class="ayuda-fila"><span>Habitaciones libres</span><span>Habitaciones sin ocupación activa con su tipo y plazas disponibles</span></div>
      </div>
      <p style="margin-top:10px;">El nombre del fichero incluye la fecha de exportación: <code>gestion-habitaciones-2026-03-15.xlsx</code>.</p>
    </section>

  </div>
</template>

<script setup>
</script>

<style scoped>
.ayuda-indice {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
  padding: 14px 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.ayuda-indice a {
  font-size: 12.5px;
  color: #2563eb;
  text-decoration: none;
  padding: 3px 10px;
  border-radius: 4px;
  background: #eff6ff;
}

.ayuda-indice a:hover {
  background: #dbeafe;
}

.ayuda-seccion {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  scroll-margin-top: 16px;
}

.ayuda-seccion h2 {
  font-size: 15px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
}

.ayuda-seccion h3 {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin: 16px 0 6px;
}

.ayuda-seccion p,
.ayuda-seccion li {
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
}

.ayuda-seccion ul,
.ayuda-seccion ol {
  padding-left: 20px;
  margin: 6px 0;
}

.ayuda-seccion li {
  margin-bottom: 4px;
}

.ayuda-seccion pre {
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 12px;
  margin-top: 6px;
  color: #374151;
}

.ayuda-seccion code {
  background: #f3f4f6;
  border-radius: 3px;
  padding: 1px 5px;
  font-size: 12px;
  color: #374151;
}

.ayuda-tabla {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
  margin-top: 8px;
  font-size: 13px;
}

.ayuda-fila {
  display: grid;
  grid-template-columns: 200px 1fr;
  border-bottom: 1px solid #f3f4f6;
}

.ayuda-fila:last-child {
  border-bottom: none;
}

.ayuda-fila > span {
  padding: 8px 12px;
  color: #4b5563;
  line-height: 1.5;
}

.ayuda-fila > span:first-child {
  background: #f9fafb;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ayuda-fila--header > span {
  background: #f0f4f8;
  font-weight: 600;
  font-size: 12px;
  color: #374151;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.color-chip {
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 3px;
  flex-shrink: 0;
}

.ayuda-aviso {
  margin-top: 10px;
  padding: 10px 14px;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 6px;
  font-size: 12.5px;
  color: #92400e;
  line-height: 1.5;
}

kbd {
  display: inline-block;
  padding: 1px 6px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 11px;
  font-family: monospace;
  color: #374151;
}
</style>
