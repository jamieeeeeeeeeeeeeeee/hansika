FROM oven/bun:debian

# Set non-interactive frontend flag
ENV DEBIAN_FRONTEND=noninteractive

# Copy project /home/app
COPY . /home/app

# Go to copied directory
WORKDIR /home/app

# Install node_modules, build project
RUN bun install
RUN bun bun build