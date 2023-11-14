# This file is used to build a Docker image that will run the scraper
FROM node:20.3.1-slim

# Install the latest version of Chromium
FROM mcr.microsoft.com/playwright:focal

# Install dumb-init to handle signals from Docker
RUN apt update && apt install dumb-init

# Set the working directory in the Docker container to /scraper
WORKDIR /scraper

# Create a new user named 'node' and create a home directory for the user
RUN useradd -m node

# Copy all files from the current directory on the host to the current directory in the Docker container
# Change the owner and group of the copied files to 'node'
COPY --chown=node:node . .

# Install the project dependencies using npm ci
RUN npm ci

# Set the user (and group) that will run subsequent commands in the Docker container to 'node'
USER node:node

# Runs "/usr/bin/dumb-init -- /my/script --with --args"
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
# The command that Docker will run by default when you start a container from this image
CMD ["node", "index.js"] 