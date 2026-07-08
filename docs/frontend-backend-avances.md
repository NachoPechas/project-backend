# Avances Backend Para Integracion Frontend

Este documento resume los endpoints disponibles en el backend y lo que el frontend puede conectar.

Base URL local:

```http
http://localhost:3000
```

Las rutas protegidas requieren enviar el token JWT:

```http
Authorization: Bearer TOKEN
```

## Roles

- `1`: Administrador
- `2`: Bibliotecario
- `3`: Estudiante

El login devuelve `roleId`. El frontend debe usarlo para mostrar u ocultar acciones segun el perfil.

## Autenticacion Y Usuarios

### Registro

```http
POST /api/usuarios/registro
```

Body:

```json
{
  "nombre": "Usuario Prueba",
  "email": "usuario@unal.edu.co",
  "password": "123456"
}
```

Notas:

- Solo acepta correos `@unal.edu.co`.
- Registra usuarios como estudiante por defecto.

### Login

```http
POST /api/auth/login
```

Body:

```json
{
  "email": "usuario@unal.edu.co",
  "password": "123456"
}
```

Respuesta esperada:

```json
{
  "success": true,
  "message": "Inicio de sesion exitoso.",
  "token": "JWT",
  "user": {
    "id": 1,
    "nombre": "Usuario Prueba",
    "email": "usuario@unal.edu.co",
    "roleId": 3
  }
}
```

Incluye bloqueo temporal despues de intentos fallidos.

## Puestos Y Reservas

### Consultar Puestos

```http
GET /api/puestos
```

Filtros:

```http
GET /api/puestos?date=2026-07-08
GET /api/puestos?status=Disponible
GET /api/puestos?details=Piso 1
GET /api/puestos?computers=1
```

Devuelve:

- `id`
- `code`
- `location`
- `status`
- `computers`
- `remainingMinutes`
- `availableSlots`
- `reservedSlots`

### Crear Reserva

```http
POST /api/reservas-puestos
```

Body:

```json
{
  "seatId": 1,
  "slotId": 1,
  "reservationDate": "2026-07-08",
  "durationMinutes": 120
}
```

Notas:

- Valida conflictos de puesto, fecha y franja.
- Actualiza disponibilidad del puesto.
- Si el usuario esta suspendido, no puede reservar.

### Detectar Inasistencias

```http
POST /api/reservas-puestos/inasistencias
```

Requiere admin o bibliotecario.

Body:

```json
{
  "toleranceMinutes": 15
}
```

Marca reservas como `Inasistencia` y libera puestos.

### Suspender Usuarios Por Inasistencias

```http
POST /api/reservas-puestos/suspensiones
```

Requiere admin o bibliotecario.

Body:

```json
{
  "maxNoShows": 3
}
```

Suspende usuarios con inasistencias repetidas.

## Libros Y Catalogo

### Listar Libros

```http
GET /api/libros
```

### Busqueda Avanzada

```http
GET /api/libros?title=clean
GET /api/libros?author=martin
GET /api/libros?category=software
GET /api/libros?title=clean&author=martin&category=software
```

## Ejemplares

### Consultar Estado

```http
GET /api/ejemplares/estado/:id
```

Ejemplo:

```http
GET /api/ejemplares/estado/1
```

### Actualizar Estado Fisico

```http
PATCH /api/ejemplares/:id/estado-fisico
```

Requiere admin o bibliotecario.

Body:

```json
{
  "physicalCondition": "danado en portada"
}
```

Si se marca como danado, roto, malo o deteriorado, el ejemplar pasa a `Mantenimiento`.

## Prestamos E Historial

### Historial Del Usuario

```http
GET /api/prestamos/historial/mio
```

Filtros:

```http
GET /api/prestamos/historial/mio?type=all
GET /api/prestamos/historial/mio?type=loans
GET /api/prestamos/historial/mio?type=reservations
GET /api/prestamos/historial/mio?from=2026-07-01&to=2026-07-08
```

Devuelve historial combinado de prestamos y reservas.

### Crear Prestamo

```http
POST /api/prestamos/prestar
```

Requiere admin o bibliotecario.

Body:

```json
{
  "itemId": 1
}
```

## Notificaciones

### Mis Notificaciones

```http
GET /api/notificaciones/mis
```

### Todas Las Notificaciones

```http
GET /api/notificaciones
```

Requiere admin o bibliotecario.

### Generar Notificaciones De Vencimiento

```http
POST /api/notificaciones/vencimientos
```

Requiere admin o bibliotecario.

Body opcional:

```json
{
  "date": "2026-07-08"
}
```

### Generar Notificaciones De Retraso

```http
POST /api/notificaciones/retrasos
```

Requiere admin o bibliotecario.

Body opcional:

```json
{
  "date": "2026-07-08"
}
```

Calcula dias acumulados y multa.

## Reportes Y Dashboard

### Reporte De Prestamos

```http
GET /api/reportes/prestamos
GET /api/reportes/prestamos?from=2026-07-01&to=2026-07-08
```

Requiere admin o bibliotecario.

### Reporte De Retrasos

```http
GET /api/reportes/retrasos
GET /api/reportes/retrasos?date=2026-07-08
```

Requiere admin o bibliotecario.

### Reporte De Inventario

```http
GET /api/reportes/inventario
```

Requiere admin o bibliotecario.

### Dashboard

```http
GET /api/reportes/dashboard
```

Requiere admin o bibliotecario.

Devuelve indicadores de:

- prestamos activos
- prestamos retrasados
- inventario total/disponible/mantenimiento
- reservas activas
- inasistencias
- puestos disponibles/ocupados
- usuarios suspendidos
- notificaciones pendientes

## Auditoria

### Consultar Bitacora

```http
GET /api/auditoria
```

Solo admin.

Filtros:

```http
GET /api/auditoria?action=LOGIN
GET /api/auditoria?entity=User
GET /api/auditoria?userId=1
GET /api/auditoria?from=2026-07-01&to=2026-07-08
GET /api/auditoria?limit=50
```

## Requisitos Backend Implementados

- RF_01: datos de mapa de puestos con ubicacion, estado y franjas.
- RF_02: actualizacion de disponibilidad al confirmar reserva.
- RF_03: creacion de reservas.
- RF_04: validacion de conflictos de reserva.
- RF_05: consulta de estado de ejemplar.
- RF_06: notificaciones de vencimiento.
- RF_07: notificaciones por retraso, dias acumulados y multa.
- RF_08: registro de estado fisico.
- RF_09: mantenimiento automatico por dano.
- RF_10: reportes de prestamos, retrasos e inventario.
- RF_11: registro institucional.
- RF_12: login con bloqueo por intentos.
- RF_13: inasistencias y liberacion de puestos.
- RF_16: suspension por incumplimientos repetidos.
- RF_18: busqueda avanzada.
- RF_19: historial con filtros.
- RF_20: dashboard de indicadores.
- RF_21: roles y permisos.
- RNF_1 / RF_17: bitacora de auditoria.

## Pendiente

- RF_14: lista de espera.
- RF_15: tiempo limite para confirmar disponibilidad desde lista de espera.
