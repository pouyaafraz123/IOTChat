# Use an official Node.js runtime as the base image
FROM node:alpine
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY . .

# Install dependencies
RUN npm install
RUN npm run tsc

# Expose the desired port (replace 3000 with your application's port)
EXPOSE 3000

# Run the application when the container starts
CMD npm start