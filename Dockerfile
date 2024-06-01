# Use the official Node.js image.
FROM node:20

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Ensure we install dependencies from within the container environment
RUN npm rebuild bcrypt

# Copy local code to the container image.
COPY . .

RUN npm install bcrypt

# Install Prisma CLI
RUN npm install prisma


# Generate Prisma Client
RUN npx prisma generate

# Run the web service on container startup.
CMD ["bash", "-c", "npx prisma migrate dev && npm run start:dev && npx prisma seed"]
