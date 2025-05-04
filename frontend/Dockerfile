FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Use non-root user for better security
USER node

# Start the application
CMD ["npm", "start"]