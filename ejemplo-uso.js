const {
  initColonia,
  getColonia,
  agregarResidente,
  eliminarResidente,
  completarOnboarding,
  resetColonia
} = require('./colonia-onboarding.js');

// Ejemplo de uso

// 1. Inicializar colonia con 10 casas
console.log('=== Inicializando colonia con 10 casas ===');
initColonia(10);

// 2. Agregar residentes a la casa 1
console.log('\n=== Agregando residentes a casa 1 ===');
agregarResidente(1, { nombre: 'Juan Pérez', edad: 35, telefono: '555-1234' });
agregarResidente(1, { nombre: 'María González', edad: 32, telefono: '555-5678' });

// 3. Agregar residentes a la casa 5
console.log('\n=== Agregando residentes a casa 5 ===');
agregarResidente(5, { nombre: 'Carlos López', edad: 28, telefono: '555-9012' });

// 4. Ver estado actual
console.log('\n=== Estado actual de la colonia ===');
const colonia = getColonia();
console.log(`Total casas: ${colonia.totalCasas}`);
console.log(`Onboarding completado: ${colonia.completed}`);
colonia.casas.forEach(casa => {
  if (casa.residentes.length > 0) {
    console.log(`\nCasa ${casa.numero}:`);
    casa.residentes.forEach(r => console.log(`  - ${r.nombre}, ${r.edad} años, ${r.telefono}`));
  }
});

// 5. Eliminar un residente
console.log('\n=== Eliminando residente de casa 1 ===');
const residenteId = colonia.casas[0].residentes[0].id;
eliminarResidente(1, residenteId);

// 6. Completar onboarding
console.log('\n=== Completando onboarding ===');
completarOnboarding();
console.log('Onboarding completado:', getColonia().completed);