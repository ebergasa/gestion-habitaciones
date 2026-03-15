module.exports = {
  appId: 'com.residencia.gestion-habitaciones',
  productName: 'Gestión de Habitaciones',
  directories: {
    buildResources: 'build',
    output: 'release'
  },
  files: [
    'out/**',
    'build/icon.ico'
  ],
  extraResources: [],
  win: {
    icon: 'build/icon.ico',
    target: [{ target: 'portable', arch: ['x64'] }]
  },
  portable: {
    artifactName: '${productName}-${version}-portable.exe'
  }
}
