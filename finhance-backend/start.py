#!/usr/bin/env python3
"""
Скрипт для запуска FastAPI backend сервера
"""
import uvicorn
import os
import sys
from pathlib import Path


# === ФИКС Windows: принудительный UTF-8 для stdout/stderr ===
if sys.stdout.encoding and sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        sys.stderr.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass


# Добавляем текущую директорию в Python path
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

if __name__ == "__main__":
    # Проверяем наличие .env файла
    env_file = current_dir / ".env"
    if not env_file.exists():
        print("⚠️  Файл .env не найден. Создайте его на основе env.example")
        print("📝 Скопируйте env.example в .env и настройте переменные окружения")
        sys.exit(1)

    port = int(os.environ.get("BACKEND_PORT", "8000"))

    # Запускаем сервер
    print("🚀 Запуск Finhance Backend API...")
    print(f"📡 API будет доступен по адресу: http://127.0.0.1:{port}")
    print(f"📚 Документация: http://127.0.0.1:{port}/docs")
    print("🔄 Для остановки нажмите Ctrl+C")
    print("-" * 50)

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=port,
        reload=True,
        reload_dirs=[str(current_dir)],
        log_level="info"
    )
