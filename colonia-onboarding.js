const STORAGE_KEY = 'colonia_onboarding';

function initColonia(totalCasas) {
  const data = {
    totalCasas,
    casas: Array.from({ length: totalCasas }, (_, i) => ({
      numero: i + 1,
      residentes: []
    })),
    completed: false
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

function getColonia() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

function agregarResidente(numeroCasa, residente) {
  const colonia = getColonia();
  if (!colonia) throw new Error('Colonia no inicializada');
  if (numeroCasa < 1 || numeroCasa > colonia.totalCasas) {
    throw new Error(`Casa inválida. Debe ser entre 1 y ${colonia.totalCasas}`);
  }
  const casa = colonia.casas.find(c => c.numero === numeroCasa);
  casa.residentes.push({
    id: Date.now(),
    ...residente
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(colonia));
  return colonia;
}

function eliminarResidente(numeroCasa, residenteId) {
  const colonia = getColonia();
  if (!colonia) throw new Error('Colonia no inicializada');
  const casa = colonia.casas.find(c => c.numero === numeroCasa);
  casa.residentes = casa.residentes.filter(r => r.id !== residenteId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(colonia));
  return colonia;
}

function completarOnboarding() {
  const colonia = getColonia();
  if (!colonia) throw new Error('Colonia no inicializada');
  colonia.completed = true;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(colonia));
  return colonia;
}

function resetColonia() {
  localStorage.removeItem(STORAGE_KEY);
}

module.exports = {
  initColonia,
  getColonia,
  agregarResidente,
  eliminarResidente,
  completarOnboarding,
  resetColonia
};