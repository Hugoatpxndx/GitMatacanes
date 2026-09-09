# GitMatacanes

Un sistema bien padre para control de accesos a una colonia privada

## Requerimientos
- El dueño especifica el número de casas/deptos
- Agregar residentes
- Quitar Residentes
- Editar Residentes
- Mostrar Residentes

Cada casa puede estar vacía o tener un residente
Cada residente DEBE de tener una casa

Local Storage

La información se guarda en localStorage bajo la key:

gitmatacanes


Estructura:

```
{
  "version": 1,
  "colony": {
    "totalUnits": 10
  },
  "units": [
    {
      "id": "unit-001",
      "residentId": "resident-001"
    },
    {
      "id": "unit-002",
      "residentId": null
    }
  ],
  "residents": [
    {
      "id": "resident-001",
      "name": "Juan Pérez",
      "createdAt": "2026-09-09T21:00:00.000Z",
      "updatedAt": "2026-09-09T21:00:00.000Z"
    }
  ]
}
```

### Reglas
`totalUnits:` número de casas/departamentos.
`units:` todas las unidades disponibles.
`residentId:` null: unidad vacía.
Cada residente debe tener exactamente una unidad.
Una unidad solo puede tener un residente.
Al eliminar un residente, su unidad queda libre.
Los módulos deben usar una capa de storage para leer/escribir en localStorage, evitando acceder directamente desde la UI.
