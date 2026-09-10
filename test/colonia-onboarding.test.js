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

  describe('casos de error', () => {
    test('lanza error si la colonia no está inicializada', () => {
      expect(() => agregarResidente(1, { nombre: 'Juan', apellido: 'Pérez' }))
        .toThrow('Colonia no inicializada');
    });

    test('lanza error si el número de casa es menor a 1', () => {
      initColonia(10);

      expect(() => agregarResidente(0, { nombre: 'Juan', apellido: 'Pérez' }))
        .toThrow('Casa inválida. Debe ser entre 1 y 10');
    });

    test('lanza error si el número de casa excede el total', () => {
      initColonia(10);

      expect(() => agregarResidente(11, { nombre: 'Juan', apellido: 'Pérez' }))
        .toThrow('Casa inválida. Debe ser entre 1 y 10');
    });
  });
});

  describe('eliminarResidente', () => {
    test('elimina un residente por id y deja la casa sin él', () => {
      initColonia(10);
      const residente = agregarResidente(3, { nombre: 'Juan', apellido: 'Pérez' })
        .casas[2].residentes[0];

      const colonia = eliminarResidente(3, residente.id);

      expect(colonia.casas[2].residentes).toHaveLength(0);
      expect(getColonia().casas[2].residentes).toHaveLength(0);
    });

    test('no afecta a otras casas al eliminar', () => {
      initColonia(10);
      agregarResidente(3, { nombre: 'Juan', apellido: 'Pérez' });
      const residenteCasa5 = agregarResidente(5, { nombre: 'María', apellido: 'Gómez' })
        .casas[4].residentes[0];

      eliminarResidente(5, residenteCasa5.id);

      expect(getColonia().casas[2].residentes).toHaveLength(1);
      expect(getColonia().casas[4].residentes).toHaveLength(0);
    });
  });

  describe('mostrarResidentes', () => {
    test('lista todos los residentes con el número de su casa', () => {
      initColonia(10);
      agregarResidente(3, { nombre: 'Juan', apellido: 'Pérez' });
      agregarResidente(5, { nombre: 'María', apellido: 'Gómez' });

      const residentes = mostrarResidentes();

      expect(residentes).toHaveLength(2);
      expect(residentes[0]).toMatchObject({
        numeroCasa: 3,
        nombre: 'Juan',
        apellido: 'Pérez'
      });
      expect(residentes[1]).toMatchObject({
        numeroCasa: 5,
        nombre: 'María',
        apellido: 'Gómez'
      });
    });
  });

  describe('completarOnboarding', () => {
    test('marca la colonia como completada', () => {
      initColonia(10);

      const colonia = completarOnboarding();

      expect(colonia.completed).toBe(true);
      expect(getColonia().completed).toBe(true);
    });
  });
});
