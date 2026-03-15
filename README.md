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

Arranca Electron con hot-reload. La base de datos se crea automáticamente en `%APPDATA%/gestion-habitaciones/gestion-habitaciones.sqlite` (o en la ruta definida por la variable de entorno `DB_PATH`).

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

- **Plano interactivo** — SVG por planta con colores de ocupación en tiempo real (verde / naranja / rojo)
- **Asignación de residentes** — buscar por nombre/DNI, asignar con fecha de entrada
- **Alta de residentes** — fecha de salida + motivo obligatorio + notas
- **Historial** — tabla filtrable por planta, fechas, residente y motivo; exportable a Excel (3 hojas)
- **Análisis** — gráficos de ocupación, evolución mensual, motivos de salida, distribución de estancias
- **Buscador** — por número de habitación, por residente o listado de habitaciones libres
- **Configuración** — gestión de motivos de salida con código numérico
- **Backup automático** — copia del `.sqlite` al arrancar (conserva los 5 últimos)
- **Impresión** — `Ctrl+P` imprime solo el plano SVG en landscape

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

## Ruta de la base de datos

Por defecto: carpeta de datos de usuario del sistema operativo.

Para usar una ruta personalizada (p. ej. disco de red):

```bash
DB_PATH=\\servidor\residencia\db.sqlite npm run dev
```

## Variables de entorno

| Variable | Descripción |
|---|---|
| `DB_PATH` | Ruta absoluta al fichero `.sqlite` |

## Licencia

[MIT](LICENSE) © 2026 Eduardo Bergasa
