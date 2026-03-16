# Gestión de Habitaciones

![Build Windows](https://github.com/ebergasa/gestion-habitaciones/actions/workflows/build-windows.yml/badge.svg)

App de escritorio para gestionar la ocupación de habitaciones en una residencia. Muestra planos SVG interactivos por planta, permite asignar/desasignar residentes y exporta a Excel.

## Stack

- **Electron** + **electron-vite** (build tool)
- **Vue 3** + Pinia + Vue Router
- **better-sqlite3** (base de datos local)
- **exceljs** (exportación Excel)
- **Chart.js** / vue-chartjs (gráficos)

## Instalación

```bash
npm install --ignore-scripts
npx @electron/rebuild -f -w better-sqlite3
```

> `better-sqlite3` es un módulo nativo que debe compilarse contra la versión de Node que usa Electron. Si se instala con `npm install` directamente en Node v24 fallará; hay que usar `--ignore-scripts` y luego `@electron/rebuild`.

## Desarrollo

```bash
npm run dev
```

Arranca Electron con hot-reload. La base de datos se crea automáticamente junto al ejecutable (modo portable) o en la ruta definida por `DB_PATH`.

## Build / distribución

```bash
npm run build   # compila main + renderer con electron-vite
npm run dist    # genera instalador Windows (.exe NSIS) en /release
```

El instalador resultante (`release/*.exe`) permite instalar la app en cualquier PC Windows x64 con un asistente NSIS estándar.

## CI/CD — GitHub Actions

El repositorio incluye un workflow que compila automáticamente el instalador Windows en cada push.

**Triggers:**

| Evento | Resultado |
|---|---|
| Push a `main` | Compila y guarda el `.exe` como artefacto (30 días) |
| `workflow_dispatch` | Lanzamiento manual desde la pestaña Actions |
| Push de tag `v*` | Crea un Release en GitHub con el `.exe` adjunto |

**Publicar una nueva versión:**

```bash
git tag v1.2.0
git push origin v1.2.0
```

Esto lanza el workflow, compila el instalador y crea automáticamente un Release en GitHub con las notas de cambios generadas a partir de los commits.

Los artefactos de cada build están disponibles en la pestaña **Actions → Build Windows → Artifacts**.

## Edificio

| Planta | Habitaciones | Rango |
|---|---|---|
| Planta Baja | 13 | 1 – 13 |
| Primera Planta | 75 | 101 – 175 |
| Segunda Planta | 39 | 201 – 239 |
| **Total** | **127** | |

## Funcionalidades

- **Plano interactivo** — SVG por planta con colores de ocupación en tiempo real (verde / naranja / rojo). Habitaciones ocupadas muestran el número en banda de color y los nombres de los residentes debajo.
- **Asignación de residentes** — buscar por nombre/DNI, asignar con fecha de entrada
- **Registro de salida** — fecha de salida + motivo obligatorio + notas
- **Historial** — tabla filtrable por planta, fechas, residente y motivo; exportable a Excel (3 hojas)
- **Análisis** — gráficos de ocupación, evolución mensual, motivos de salida y distribución de estancias, con filtro de rango de fechas
- **Buscador** — por número de habitación, por residente o listado de habitaciones libres
- **Configuración** — identidad de la residencia (nombre + logotipo), tipos de habitación, base de datos y motivos de salida
- **Backup automático** — copia del `.sqlite` al arrancar (conserva los 5 últimos); visible desde Configuración
- **Impresión** — `Ctrl+P` imprime solo el plano SVG en A4 landscape con cabecera de la residencia

## Ruta de la base de datos

Por defecto el fichero `gestion-habitaciones.sqlite` se guarda en la misma carpeta que el ejecutable (modo portable), lo que permite copiar ejecutable + base de datos a cualquier equipo o unidad de red.

La ruta puede cambiarse desde **Configuración → Base de datos** o mediante la variable de entorno `DB_PATH`:

```bash
DB_PATH=\\servidor\residencia\db.sqlite npm run dev
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `DB_PATH` | Ruta absoluta al fichero `.sqlite` |

## Estructura del proyecto

```
gestion-habitaciones/
├── electron/
│   ├── main/
│   │   ├── index.js      # Proceso main, crea ventana BrowserWindow
│   │   ├── db.js         # SQLite: schema, seed 127 hab., todas las queries
│   │   ├── ipc.js        # Handlers IPC + exportación Excel
│   │   └── backup.js     # Backup automático al arrancar
│   └── preload/
│       └── index.js      # contextBridge → window.api
├── src/
│   ├── main.js
│   ├── App.vue           # Layout con nav lateral
│   ├── router/index.js
│   ├── stores/
│   │   ├── habitaciones.js
│   │   └── residentes.js
│   ├── views/
│   │   ├── PlanoView.vue
│   │   ├── ResidentesView.vue
│   │   ├── HistorialView.vue
│   │   ├── InsightsView.vue
│   │   ├── BuscadorView.vue
│   │   └── ConfigView.vue
│   ├── components/
│   │   ├── planos/
│   │   │   ├── PlanoBase.vue
│   │   │   ├── PlantaBaja.vue
│   │   │   ├── PrimeraPlanta.vue
│   │   │   └── SegundaPlanta.vue
│   │   └── HabitacionModal.vue
│   └── data/
│       ├── plano-baja.js
│       ├── plano-primera.js
│       └── plano-segunda.js
├── electron.vite.config.js
├── electron-builder.config.js
└── package.json
```

## Datos de prueba

El script `scripts/seed-demo.cjs` genera una base de datos sintética completa para desarrollo y pruebas:

| Dato | Cantidad |
|---|---|
| Habitaciones | 127 (tipos y capacidades reales) |
| Motivos de alta | 6 |
| Residentes | 550 |
| Ocupaciones | ~750 (2 años de historial, mar 2024 – mar 2026) |

```bash
node scripts/seed-demo.cjs
```

> **Peligro:** el script **borra irreversiblemente** la base de datos actual antes de cargar los datos sintéticos. Pedirá confirmación explícita escribiendo `si` antes de proceder. No ejecutar en entornos con datos reales.

## Licencia

[MIT](LICENSE) © 2026 Eduardo Bergasa
