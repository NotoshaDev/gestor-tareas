# Gestor de Tareas

Aplicacion base para gestion de tareas internas del equipo.

## Estructura

- `backend/`: API y logica de negocio.
- `frontend/`: interfaz de usuario.
- `database/`: scripts y modelos de base de datos.
- `docs/`: documentacion tecnica del proyecto.



## Actividad 2 - Estructura y arquitectura

### 1) Tipo de arquitectura del proyecto base

Por como esta armado, el proyecto tiene una arquitectura por capas o sea frontend, backend y base de datos separados. Tambien se puede ver como una estructura modular bien basica por carpetas

### 2) Modulos o componentes identificados

- Backend: API para salud del sistema y gestion de tareas.
- Frontend: vista inicial con formulario y listado de tareas, con muchas mejoras posibles pero por tema tiempo y examen, se haran a futuro.
- Database: esquema SQL y estructura de la tabla `tasks` lo hice en ingles para mejor entendimiento.
- Docs: notas de arquitectura y documentacion inicial.

### 3) Mejoras arquitectonicas propuestas

- Separar mejor el backend por capas (rutas, servicios y acceso a datos).
- Agregar archivo de configuracion por entorno (dev, test, prod).
- Definir un contrato de API mas claro (validaciones y respuestas estandar).
- Incorporar pruebas basicas para evitar romper funcionalidades al cambiar codigo.
