# Use the official Node.js image as the base image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire application to the working directory
COPY . .

# Build the frontend application
RUN npm run build

# Expose the port that your frontend application will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
