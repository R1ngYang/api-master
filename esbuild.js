const esbuild = require('esbuild');
esbuild.build({
  entryPoints: ['./src/app.ts'],
  bundle: true,
  platform: 'node',
  outfile: './dist/app.js',
  logLevel: 'error',
  watch: {
    onRebuild(error) {
      if (!error) console.log('rebuild succsee');
    }
  }
});
