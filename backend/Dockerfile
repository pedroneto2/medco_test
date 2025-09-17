FROM node:18

WORKDIR /usr/src/app

# Copy package.json first for caching
COPY package*.json ./

# Copy Prisma schema
COPY prisma ./usr/src/app/prisma/

RUN npm install

# Copy all source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript (for production)
RUN npm run build

# Install MySQL client for DB readiness check
RUN apt-get update && apt-get install -y default-mysql-client

# Copy entrypoint
COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
