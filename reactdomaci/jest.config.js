module.exports = {
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/"  // Ovo će omogućiti Jest-u da transpilira `axios` paket
    ]
  };