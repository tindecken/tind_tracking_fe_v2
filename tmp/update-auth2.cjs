const fs = require('fs');
const f = 'C:/dev/tindapi/src/auth/auth.ts';
let c = fs.readFileSync(f, 'utf8');

c = c.replace(/trustedOrigins: \[[\s\S]*?\],/,
`trustedOrigins: [
			'http://localhost:8787',
			'http://localhost:5173',
			'http://localhost:3000',
			'http://localhost:9000',
			'https://d.tindecken.com',
			'http://192.168.1.3:9000',
			'capacitor://192.168.1.3',
		],`
);

fs.writeFileSync(f, c);
console.log('done');
