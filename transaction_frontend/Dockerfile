# --- Stage 1: Build the React App ---
# We name this stage 'build'
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Run the build script to create static files in /app/build
RUN npm run build

# --- Stage 2: Serve with Nginx ---
# Use a lightweight Nginx image
FROM nginx:1.25-alpine

# Copy the static build files from the 'build' stage
# into the Nginx directory for serving
COPY --from=build /app/build /usr/share/nginx/html

# Copy our custom Nginx configuration
# This overwrites the default Nginx config
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# The default command to start Nginx
CMD ["nginx", "-g", "daemon off;"]