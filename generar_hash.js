const bcrypt = require('bcryptjs');

async function crearHash() {
  const passwordPlana = '123456'; // Esta será tu contraseña (puedes cambiarla si prefieres otra)
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(passwordPlana, salt);
  
  console.log('--- COPIA ESTE HASH ---');
  console.log(hash);
  console.log('------------------------');
}

crearHash();