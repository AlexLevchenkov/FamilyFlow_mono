# Server - Застосунок для домашніх справ

Backend API для застосунку управління домашніми справами.

## 🚀 Швидкий старт

### Вимоги

- Node.js (v18 або новіше)
- npm або yarn
- PostgreSQL або MongoDB (залежить від вибору)

### Встановлення

1. Встанови залежності:

```bash
npm install
```

2. Налаштуй змінні оточення:

```bash
cp .env.example .env
# Відредагуй .env файл
```

3. Запусти сервер:

```bash
npm run dev
```

## 📁 Структура проекту

```
Server/
├── src/
│   ├── controllers/     # Контролери (обробка запитів)
│   ├── models/          # Моделі даних
│   ├── routes/          # Маршрути API
│   ├── middleware/      # Middleware
│   ├── services/        # Бізнес-логіка
│   ├── utils/           # Допоміжні функції
│   └── config/          # Конфігурація
├── tests/               # Тести
├── .env                 # Змінні оточення
└── package.json
```

## 📚 Документація API

Після запуску сервера, API документація буде доступна за адресою:

- Swagger: `http://localhost:3000/api-docs`

## 🔧 Технології

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma

## 📝 План розробки

Дивись детальний план в `PROJECT_PLAN.md`
