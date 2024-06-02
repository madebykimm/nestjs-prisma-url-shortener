# Use the official Node.js image.
FROM node:20

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install production dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Generate Prisma Client
RUN npx prisma generate

CMD ["npx", "prisma", "migrate","dev"]

CMD ["bash", "-c", "npm run seed"]

# Run the seed script and then start the application
CMD ["bash", "-c", "npm run start:dev"]
