# App build base
FROM python:3.11.4-slim-buster AS app-builder

ENV PYTHONDONTWRITEBYTECODE 1 \
  PYTHONUNBUFFERED 1 \
  PYTHONPATH="${PYTHONPATH}:/app/backend"

RUN echo $POETRY_VERSION

RUN apt-get update -y && \
  apt-get install -y postgresql gcc libpq-dev musl-dev

RUN pip install --upgrade pip
RUN pip install "poetry==1.7.0"

WORKDIR /app/backend
COPY ./backend/poetry.lock ./backend/pyproject.toml ./

RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi --no-root

# App build dev
FROM app-builder as app-dev
CMD python manage.py runserver 0.0.0.0:8000

FROM app-builder as app-test

RUN poetry config virtualenvs.create false && poetry install --no-interaction --no-ansi --no-root --only test


# Web build
FROM node:17-alpine AS web-builder

FROM web-builder as web-dev
WORKDIR /app/frontend

COPY ./frontend/package*.json ./

RUN npm install
CMD npm start
