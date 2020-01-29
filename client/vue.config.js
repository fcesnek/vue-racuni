const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, '../server/src/public'),
  configureWebpack: {
    externals: {
      Dynamsoft: 'Dynamsoft',
    },
  },
  transpileDependencies: [
    'vuetify',
  ],
};
