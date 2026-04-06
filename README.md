# Gestor de Tareas Pokemon

Aplicacion base para gestionar tareas internas del equipo en formato de misiones.

Objetivo

Este proyecto se desarrollo para organizar actividades del equipo, priorizarlas y llevar control del estado de cada tarea.

Stack usado

- Backend: Python + Flask
- Frontend: HTML, CSS y JavaScript
- Base de datos: SQLite (scripts SQL)
- Pruebas: Node.js test runner


Tipo de arquitectura del proyecto base

El proyecto tiene una arquitectura por capas simple: frontend, backend y base de datos separados. Tambien esta organizado por modulos en carpetas.

Modulos o componentes identificados

- Backend: API base para salud del sistema y gestion de tareas.
- Frontend: interfaz para registrar, buscar, filtrar y actualizar misiones.
- Database: scripts SQL para estructura de la tabla de tareas.
- Docs: notas de arquitectura y documentacion tecnica basica.

Mejoras arquitectonicas propuestas

- Separar mejor backend por capas (rutas, servicios y acceso a datos).
- Agregar configuracion por ambiente (dev, test, prod).
- Definir mejor contrato de API (errores y respuestas estandar).
- Aumentar cobertura de pruebas para cambios futuros.

Funcionalidades implementadas

- Registro de nuevas misiones.
- Validacion de datos obligatorios.
- Marcar mision como completada o reactivarla.
- Eliminar misiones.
- Filtros por estado (todas, pendientes, completadas, fuera de tiempo).
- Busqueda por nombre o descripcion.
- Ordenamiento por fecha, prioridad y limite.
- Persistencia local con localStorage.

## Como ejecutar el proyecto

Frontend

1. Abrir [frontend/src/index.html](frontend/src/index.html) en el navegador.
2. Registrar misiones desde el formulario.

Backend

1. Entrar a la carpeta backend.
2. Instalar dependencias:

pip install -r requirements.txt

Mejoras futuras

- Conectar frontend con backend real por API.
- Agregar autenticacion de usuarios.
- Implementar pruebas E2E de interfaz.
- Agregar paginacion y historial de cambios.

Desarrollado por su fiel servidor

- Gustavo Villarroel
- Rama de trabajo: examen-gustavo-villarroel
