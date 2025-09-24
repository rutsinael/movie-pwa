# Movie Organizer — PWA

React + Vite + TypeScript + Tailwind + vite-plugin-pwa. Локальная БД IndexedDB (Dexie), состояние Zustand, серверлесс-функции (TMDB, OpenAI) и синхронизция для двух устройств через Supabase.

## Быстрый старт (локально)

1. Установка зависимостей:
   ```bash
   npm i
   ```
2. (Опционально для serverless локально) Установите Vercel CLI и привяжите проект:
   ```bash
   npm i -g vercel
   vercel link
   ```
3. Задайте переменные окружения (локально для vercel dev):
   ```bash
   vercel env add OPENAI_API_KEY      # ключ OpenAI (serverless)
   vercel env add TMDB_V4_TOKEN       # токен TMDB v4 (serverless)
   vercel env add VITE_SUPABASE_URL   # URL вашего проекта Supabase (клиент)
   vercel env add VITE_SUPABASE_ANON_KEY
   ```
4. Запуск dev с серверлесс-функциями:
   ```bash
   vercel dev
   ```
   Либо обычный vite (без serverless):
   ```bash
   npm run dev
   ```

## Продакшен деплой (Vercel)

1. Репозиторий подключите к Vercel.
2. В разделе Project Settings → Environment Variables добавьте:
   - `OPENAI_API_KEY`
   - `TMDB_V4_TOKEN`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Запустите деплой. Серверлесс-функции доступны по `/api/*`.

## Supabase: схема и политика

Создайте таблицу `movies`:
```sql
create table if not exists public.movies (
  room_key text not null,
  uuid text not null,
  title text not null,
  status text not null check (status in ('to_watch','watched')),
  ai_tip boolean not null default false,
  created_at text not null,
  updated_at text not null,
  tags jsonb,
  primary key (room_key, uuid)
);
```

Пример RLS (по room_key):
```sql
alter table public.movies enable row level security;
create policy "room read" on public.movies
  for select using (true);
create policy "room upsert" on public.movies
  for insert with check (true);
create policy "room update" on public.movies
  for update using (true) with check (true);
```

Примечание: для простоты пример открыт. Настройте RLS под ваши требования.

## Конфигурация PWA

- Service Worker — autoUpdate (см. `vite.config.ts`).
- Иконки: `public/pwa-192.png`, `public/pwa-512.png`, `public/masked-icon.svg`.
- iOS мета в `index.html` для установки на iPhone.

## API

- TMDB поиск: `GET /api/tmdb/search?q=...&page=1`
- OpenAI подборки: `POST /api/ai/suggestions` body: `{ preferences, movies }`

## Переменные окружения

- `OPENAI_API_KEY` — секрет для OpenAI (serverless)
- `TMDB_V4_TOKEN` — v4 Bearer токен TMDB (serverless)
- `VITE_SUPABASE_URL` — URL проекта Supabase
- `VITE_SUPABASE_ANON_KEY` — anon ключ Supabase

## Установка на iPhone (PWA)

1. Откройте сайт в Safari.
2. Share → Add to Home Screen (Добавить на экран «Домой»).
3. Запустите приложение с иконки на домашнем экране.

## Заметки по офлайн

- Данные фильмов — IndexedDB (Dexie), доступны офлайн.
- Синхронизация выполняется вручную в Библиотеке по `roomKey`.
