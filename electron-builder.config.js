module.exports = {
  appId: 'com.residencia.gestion-habitaciones',
  productName: 'Gestión de Habitaciones',
  directories: {
    buildResources: 'build',
    output: 'release'
  },
  files: [
    'out/**',
    'dist/**'
  ],
  extraResources: [],
  win: {
    target: [{ target: 'nsis', arch: ['x64'] }]
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    installerIcon: 'build/icon.ico',
    uninstallerIcon: 'build/icon.ico'
  },
  linux: {
    target: ['AppImage']
  },
  mac: {
    target: ['dmg']
  }
}
