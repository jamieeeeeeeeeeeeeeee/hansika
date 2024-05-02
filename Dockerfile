FROM oven/bun:debian

# Set the non-interactive frontend flag
ENV DEBIAN_FRONTEND=noninteractive

# Copy the project to /home/app
COPY . /home/app

# Go to the copied directory
WORKDIR /home/app

# Install node_modules, and build the project
RUN bun install
RUN bun run build