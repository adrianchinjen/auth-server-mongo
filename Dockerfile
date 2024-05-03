# Use a smaller base image like Alpine Linux for the build stage
FROM node:20.11.0-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock into the container
COPY package.json yarn.lock ./

# Install dependencies using Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the application code into the container
COPY . .

# Build TypeScript code
RUN yarn build

# Rebuild bcrypt
RUN npm rebuild bcrypt --build-from-source

# Use a smaller base image for the runtime environment
FROM node:20.11.0-alpine

# Set the working directory
WORKDIR /app

# Copy only necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Expose port 3000
EXPOSE 3000

# Set the startup command
CMD ["node", "dist/index.js"]
