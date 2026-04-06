# Backend

Carpeta destinada al servicio backend.

Se recomienda usar arquitectura por capas:
- controllers
- services
- repositories
- models

## Estado actual

Backend inicial en Python con Flask:
- endpoint `GET /health`
- endpoint `GET /tasks`
- endpoint `POST /tasks`

## Ejecucion local

1. Instalar dependencias:
	`pip install -r requirements.txt`
2. Ejecutar API:
	`python src/app.py`
