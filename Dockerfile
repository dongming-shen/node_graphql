# Use the official Node.js 16 image as a parent image
FROM node:16

# Argument for setting the working directory, with a default value
ARG WORKDIR=/app

# Set the working directory inside the container
WORKDIR ${WORKDIR}

# Copy the package.json and package-lock.json files into the working directory
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the remaining application source code from your host to your image filesystem.
COPY . .

# Inform Docker that the container listens on the specified network port at runtime.
EXPOSE 3005

# Define the command to run your app using CMD which defines your runtime.
CMD ["node", "src/server.js"]
