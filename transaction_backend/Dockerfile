# Use an official Node.js runtime as a parent image
# Using alpine for a smaller image size
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
# This caches the npm install layer if package files haven't changed
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# The backend code uses 4000 as its default port
EXPOSE 4000

# Define the command to run the application
CMD ["node", "index.js"]