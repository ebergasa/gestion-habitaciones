module.exports = {
  appId: 'com.residencia.gestion-habitaciones',
  productName: 'Gestión de Habitaciones',
  directories: {
    buildResources: 'build',
    output: 'release'
  },
  files: [
    'out/**'
  ],
  extraResources: [],
  win: {
    target: [{ target: 'portable', arch: ['x64'] }]
  },
  portable: {
    artifactName: '${productName}-${version}-portable.exe'
  }
}
