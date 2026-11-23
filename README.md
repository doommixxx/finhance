# Finhance - Personal Finance Management App

Полнофункциональное приложение для управления личными финансами с современным frontend на Next.js и мощным backend на FastAPI.

**Версия:** 0.0.1  
**Разработчик:** MeowTeam  
**Лицензия:** MeowTeam

## 🚀 Быстрый старт

### Windows и терминал PowerShell в VS Code

Откройте папку `fin-hance-nextjs`, в которой находится `package.json`.
Для запуска нужны Node.js, Python 3.12 и доступный PostgreSQL.

```powershell
npm.cmd ci
py -3.12 -m venv finhance-backend/.venv
.\finhance-backend\.venv\Scripts\python.exe -m pip install -r finhance-backend/requirements.txt
if (-not (Test-Path finhance-backend/.env)) {
    Copy-Item finhance-backend/env.example finhance-backend/.env
}
```

Если команда `py` недоступна, вызовите установленный Python 3.12 по полному пути с теми же аргументами `-m venv finhance-backend/.venv`. Сохраните существующий `.env`, если база уже настроена. Для новой установки создайте базу в PostgreSQL и укажите в `finhance-backend/.env` свои `DATABASE_URL` и `SECRET_KEY`.

Для совместного запуска выполните команду ниже. Скрипт сам выбирает Python из `finhance-backend/.venv`, если эта среда существует.

```powershell
npm.cmd run dev
```

Если порт 8000 занят, перед запуском задайте `$env:BACKEND_PORT = "8001"`. В этом случае Swagger доступен по адресу http://127.0.0.1:8001/docs.

Для раздельного запуска откройте два терминала в папке `fin-hance-nextjs`. В первом выполните `npm.cmd run dev:frontend`, во втором — `npm.cmd run dev:backend`.

Если стандартные порты заняты, остановите прежние экземпляры через их терминалы или выберите свободные порты. При совместном запуске Next.js выводит фактический адрес frontend в строке `Local`. Для раздельного запуска на других портах используйте:

```powershell
# Терминал frontend
npm.cmd run dev:frontend -- --port 3002

# Терминал backend
$env:BACKEND_PORT = '8017'
npm.cmd run dev:backend
```

Frontend хранит операции, цели, достижения и настройки в `localStorage` текущего браузера. FastAPI предоставляет отдельный JWT API с хранением данных в PostgreSQL. Интерфейс пока не обращается к API, поэтому можно запускать его отдельно.
Данные браузера привязаны к адресу и порту. Открывайте привычный адрес, чтобы продолжить работу с ранее сохранёнными данными.

## 📁 Структура проекта

```
fin-hance-nextjs/
├── app/                    # Next.js приложение
│   ├── components/         # React компоненты
│   ├── hooks/             # Custom hooks
│   ├── types/             # TypeScript типы
│   └── page.tsx           # Главная страница
├── finhance-backend/       # FastAPI backend
│   ├── app/               # Backend приложение
│   │   ├── api/v1/        # API маршруты
│   │   ├── core/          # Основные настройки
│   │   ├── models/        # SQLAlchemy модели
│   │   ├── schemas/       # Pydantic схемы
│   │   └── services/      # Бизнес-логика
│   ├── main.py            # Точка входа FastAPI
│   ├── start.py           # Скрипт запуска
│   └── requirements.txt   # Python зависимости
├── scripts/               # Утилиты запуска
│   ├── dev.js            # Скрипт запуска dev окружения
│   └── install-backend.js # Установка backend зависимостей
└── package.json          # Node.js зависимости
```

## 🛠 Доступные команды

### Основные команды
- `npm run dev` - Запуск полного приложения (frontend + backend)
- `npm run dev:setup` - Настройка backend зависимостей
- `npm run build` - Сборка production версии
- `npm run start` - Запуск production версии

### Отдельные сервисы
- `npm run dev:frontend` - Только frontend
- `npm run dev:backend` - Только backend
- `npm run dev:backend:install` - Установка backend зависимостей

## 🌐 Доступные URL

После запуска `npm run dev`:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔧 Настройка

### 1. База данных
Создайте PostgreSQL базу данных и обновите `DATABASE_URL` в файле `finhance-backend/.env`:

```env
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/finhance_db
```

### 2. Переменные окружения
Скопируйте `finhance-backend/env.example` в `finhance-backend/.env` и настройте:

```env
# Database
DATABASE_URL=postgresql+asyncpg://username:password@localhost:5432/finhance_db

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]

# Environment
ENVIRONMENT=development
```

## 🎯 Функциональность

### Frontend (Next.js + React)
- 📊 **Dashboard** - Обзор финансов
- 💰 **Транзакции** - Управление доходами и расходами
- 🎯 **Цели** - Финансовые цели и их отслеживание
- 🏆 **Достижения** - Система достижений
- 📱 **Responsive Design** - Адаптивный дизайн

### Backend (FastAPI)
- 🔐 **Аутентификация** - JWT токены
- 👤 **Пользователи** - Управление профилем
- 💳 **Транзакции** - CRUD операции
- 🎯 **Цели** - Финансовые цели
- 📊 **Аналитика** - Сводки и отчеты

## 🚀 Развертывание

### Production сборка
```bash
# Сборка frontend
npm run build

# Запуск production
npm run start
```

### Docker (опционально)
```bash
# Создание Dockerfile для backend
# Настройка docker-compose.yml
# Запуск через Docker
```

## 📚 API Документация

После запуска backend, документация доступна по адресам:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🐛 Устранение неполадок

### Backend не запускается
1. Проверьте установку Python 3.12 и путь к виртуальной среде
2. Установите зависимости: `npm run dev:setup`
3. Настройте .env файл
4. Проверьте подключение к базе данных

### Frontend не запускается
1. Установите зависимости: `npm install`
2. Проверьте версию Node.js (18+)
3. Проверьте сборку командой `npm.cmd run build`

### Проблемы с базой данных
1. Убедитесь, что PostgreSQL запущен
2. Проверьте правильность DATABASE_URL
3. Создайте базу данных вручную

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функции
3. Внесите изменения
4. Создайте Pull Request
