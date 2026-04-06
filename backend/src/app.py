from flask import Flask, jsonify, request

from db import get_connection

app = Flask(__name__)


@app.get("/health")
def health_check():
    return jsonify({"status": "ok"})


@app.get("/tasks")
def list_tasks():
    with get_connection() as connection:
        rows = connection.execute(
            "SELECT id, title, description, status, created_at, updated_at FROM tasks ORDER BY created_at DESC"
        ).fetchall()

    return jsonify([dict(row) for row in rows])


@app.post("/tasks")
def create_task():
    payload = request.get_json(silent=True) or {}
    title = (payload.get("title") or "").strip()
    description = (payload.get("description") or "").strip()

    if not title:
        return jsonify({"error": "El titulo es obligatorio"}), 400

    with get_connection() as connection:
        connection.execute(
            "INSERT INTO tasks (title, description, status) VALUES (?, ?, 'pending')",
            (title, description),
        )
        connection.commit()

    return jsonify({"message": "Tarea creada"}), 201


if __name__ == "__main__":
    app.run(debug=True)
