const fs = require('fs');
const f = 'C:/dev/tindapi/src/auth/auth.ts';
let c = fs.readFileSync(f, 'utf8');

c = c.replace(
  "trustedOrigins: [",
  `trustedOrigins: (origin) => {
    if (!origin) return true;
    if (origin.startsWith('http://192.168.') || origin.startsWith('https://192.168.')) return true;
    if (origin.startsWith('http://10.') || origin.startsWith('https://10.')) return true;
    if (origin.startsWith('capacitor://192.168.') || origin.startsWith('capacitor://10.')) return true;
    if (origin === 'http://localhost:5173' || origin === 'http://localhost:8787' || origin === 'http://localhost:3000' || origin === 'http://localhost:9000') return true;
    if (origin === 'https://d.tindecken.com') return true;
    return false;
  },
[`
);

fs.writeFileSync(f, c);
console.log('done');
