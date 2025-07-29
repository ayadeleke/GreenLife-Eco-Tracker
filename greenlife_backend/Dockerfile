# Multi-stage build for smaller image
FROM python:3.11-alpine3.22 AS builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install build dependencies and security patches
RUN apk update && apk upgrade && \
    apk add --no-cache \
    gcc \
    musl-dev \
    mysql-dev \
    python3-dev \
    libffi-dev \
    openssl-dev \
    build-base

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip
# Upgrade setuptools to patched version
RUN pip install --upgrade "setuptools>=78.1.1"
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-alpine3.22

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Upgrade SQLite and install runtime dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache \
    mysql-client \
    mariadb-connector-c \
    sqlite-libs=3.49.2-r1 \
    && rm -rf /var/cache/apk/*

# Copy Python packages from builder
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy project files
COPY manage.py .
COPY config/ ./config/
COPY tracker/ ./tracker/
COPY requirements.txt .

# Create media directory
RUN mkdir -p media/tree_photos

# Create non-root user
RUN adduser -D -u 1000 appuser && chown -R appuser:appuser /app
USER appuser

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
