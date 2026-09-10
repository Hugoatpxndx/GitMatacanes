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
});