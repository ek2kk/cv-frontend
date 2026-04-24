# Egor Kuznetsov CV Landing

Статический лендинг по резюме Егора Кузнецова.

## Деплой на Vercel

Проект подготовлен как статический сайт с Vercel Function-прокси для чат-виджета.

Настройки проекта:

- Root Directory: корень этого репозитория (`website`), если импортируете монорепозиторий - выберите папку `website`.
- Build Command: `npm run build`.
- Output Directory: `.`.
- Framework Preset: Other.

Переменные окружения в Vercel:

- `CV_CHAT_API_URL` - production endpoint backend-чата, например `https://api.example.com/chat`.
- `CV_CHAT_API_TOKEN` - опционально, если backend принимает Bearer token.

Без `CV_CHAT_API_URL` лендинг всё равно задеплоится, но чат будет возвращать ошибку конфигурации.

Локальная проверка перед деплоем:

```bash
npm run build
```

Деплой через Vercel CLI:

```bash
npx vercel
npx vercel --prod
```

## Запуск

Откройте `index.html` в браузере или запустите любой статический сервер из этой папки.

Пример:

```bash
python3 -m http.server 4173
```

После этого сайт будет доступен на `http://localhost:4173`.

При локальном запуске через обычный статический сервер чат-виджет отправляет запросы в backend на `http://127.0.0.1:8000/chat`.
На Vercel frontend ходит в `/api/chat`, а функция проксирует запрос в `CV_CHAT_API_URL`.
Для локальной проверки чата запустите API из `backend/cv-rag`:

```bash
make run
```

## Структура

- `index.html` - контент и семантическая структура лендинга.
- `styles.css` - responsive-дизайн в черно-серо-белой палитре и стили чат-виджета.
- `script.js` - мобильное меню, reveal-анимации, активная навигация и логика чата.
- `api/chat.js` - Vercel Function-прокси для production backend-чата.
- `vercel.json` - настройки сборки, output directory и headers для Vercel.
- `scripts/check-static-assets.mjs` - проверка наличия файлов, на которые ссылается HTML.
- `assets/hero-ml-systems.png` - hero-визуал.
- `assets/egor-kuznetsov-cv.pdf` - PDF-резюме для скачивания.
