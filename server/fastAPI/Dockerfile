# Use a temporary build stage
FROM python:3.9-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create the final minimal image
FROM python:3.9-slim
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80", "--reload"]

# # syntax=docker/dockerfile:1

# ############################
# # Build Stage
# ############################
# FROM python:3.11-slim as builder

# # Install build dependencies
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     gcc \
#     libffi-dev \
#     && rm -rf /var/lib/apt/lists/*

# WORKDIR /install

# # Copy the requirements file
# COPY requirements.txt .

# # Upgrade pip and install Python packages into a dedicated directory
# RUN pip install --upgrade pip && \
#     pip install --no-cache-dir --prefix=/install -r requirements.txt

# ############################
# # Final Stage
# ############################
# FROM python:3.11-slim

# WORKDIR /app

# # Copy installed packages from the builder stage
# COPY --from=builder /install /usr/local

# # Copy your application code into the container
# COPY . .


# # Set the default command to run the uvicorn server.
# CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80", "--reload"]
