# Plan de pruebas unitarias (Jest)

| # | Módulo / función | Descripción | Estado |
|---|---|---|---|
| 1 | `initColonia` | Crea las casas indicadas, vacías y sin onboarding completado. Verifica que los datos persistan en localStorage. | ✅ Implementada |
| 2 | `agregarResidente` | Agrega un residente a una casa válida y lo asigna correctamente (incluye id y datos). | ✅ Implementada |
| 3 | `agregarResidente` (caso de error) | Lanza error si la colonia no está inicializada o si la casa está fuera de rango. | ⬜ Pendiente |
| 4 | `eliminarResidente` | Elimina un residente por id y verifica que la casa quede sin él. | ✅ Implementada |
| 5 | `mostrarResidentes` | Devuelve todos los residentes con su número de casa, respetando el documento original. | ⬜ Pendiente |
| 6 | `completarOnboarding` / `resetColonia` | Marca `completed: true` al completar el onboarding y verifica que `resetColonia` limpia el localStorage. | ⬜ Pendiente |

## Reglas del documento de diseño a cubrir

- `totalUnits` define las casas disponibles.
- Cada unidad puede estar vacía o tener un residente.
- Cada residente debe tener exactamente una unidad.
- Una unidad solo puede tener un residente.
- Al eliminar un residente, su unidad queda libre.