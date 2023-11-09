# App build
FROM python:3.11.4-slim-buster AS app-base
FROM app-base as app-dev
WORKDIR /app/backend
ENV PYTHONDONTWRITEBYTECODE 1 \
  PYTHONUNBUFFERED 1
RUN apt-get update -y && \
  apt-get install -y postgresql gcc libpq-dev musl-dev
COPY ./backend/requirements.txt .
RUN pip install -r requirements.txt
COPY ./backend .

# Web build
FROM node:17-alpine AS web-base
FROM web-base as web-dev
WORKDIR /app/frontend
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/ ./
# EXPOSE 3000
CMD npm start
