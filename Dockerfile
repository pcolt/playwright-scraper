FROM node:20.3.1-slim

FROM mcr.microsoft.com/playwright:focal
# playwright verbose logging
ENV DEBUG=pw:api
# Set production environment
ENV NODE_ENV="production"

# Install dumb-init to gracefully handle stopping the container
RUN apt update && apt install dumb-init

# Set the working directory in the Docker container to /scraper
WORKDIR /scraper

# Create a new user named 'node' and create a home directory for the user
RUN useradd -m node

# Copy all from current directory to /scraper directory in the container
# Change the owner and group of the copied files to 'node'
COPY --chown=node:node . .

# Install dependencies without updating versions and package-lock.json
# Install only production dependencies
RUN npm ci --only=production

# Set the user (and group)
USER node:node

# Runs "/usr/bin/dumb-init -- /my/script --with --args"
ENTRYPOINT ["/usr/bin/dumb-init", "--"]
# The command that Docker will run by default when you start a container from this image
CMD ["node", "index.js"] 