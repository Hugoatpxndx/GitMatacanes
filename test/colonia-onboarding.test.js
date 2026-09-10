const {
  initColonia,
  getColonia,
  agregarResidente,
  eliminarResidente,
  mostrarResidentes,
  completarOnboarding,
  resetColonia
} = require('../colonia-onboarding.js');

class LocalStorageMock {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key)
      ? this.store[key]
      : null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
}

beforeEach(() => {
  global.localStorage = new LocalStorageMock();
});

describe('colonia-onboarding', () => {
  describe('initColonia', () => {
    test('crea las casas indicadas, vacías y sin onboarding completado', () => {
      const data = initColonia(10);

      expect(data.totalCasas).toBe(10);
      expect(data.casas).toHaveLength(10);
      expect(data.casas[0]).toEqual({ numero: 1, residentes: [] });
      expect(data.casas[9]).toEqual({ numero: 10, residentes: [] });
      expect(data.completed).toBe(false);
    });
  });

  describe('agregarResidente', () => {
    test('agrega un residente a una casa válida y lo asigna correctamente', () => {
      initColonia(10);

      const colonia = agregarResidente(3, { nombre: 'Juan', apellido: 'Pérez' });

      expect(colonia.casas[2].residentes).toHaveLength(1);
      expect(colonia.casas[2].residentes[0]).toMatchObject({
        nombre: 'Juan',
        apellido: 'Pérez'
      });
      expect(colonia.casas[2].residentes[0].id).toBeDefined();
      expect(getColonia().casas[2].residentes).toHaveLength(1);
    });
  });
});