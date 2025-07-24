# Multi-stage build for smaller image
FROM python:3.11-alpine AS builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
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
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-alpine

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory
WORKDIR /app

# Install only runtime dependencies
RUN apk add --no-cache \
    mysql-client \
    mariadb-connector-c \
    && rm -rf /var/cache/apk/*

# Copy Python packages from builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Copy project files (exclude unnecessary files)
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

# Expose port
EXPOSE 8000

# Run your app
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]

