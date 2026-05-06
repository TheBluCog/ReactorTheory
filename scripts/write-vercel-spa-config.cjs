const fs = require('fs');
const path = require('path');

const distDir = path.join(process.cwd(), 'dist');

if (!fs.existsSync(distDir)) {
  process.exit(0);
}

const config = {
  rewrites: [
    {
      source: '/((?!api/).*)',
      destination: '/index.html'
    }
  ]
};

fs.writeFileSync(
  path.join(distDir, 'config.json'),
  JSON.stringify(config, null, 2)
);

console.log('Generated dist/config.json');
