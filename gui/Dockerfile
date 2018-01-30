# Docker image for setting up a webpack development server, to effectively utilize hot reloading when developing
FROM node:carbon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install dependencies, if necessary
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source, not necessary since we mount the app folder so file changes are detected and hot reloaded
#COPY . /usr/src/app

# Expose port 8090
EXPOSE 8090

# Default command to start
CMD ["npm","run-script","dev-server"]