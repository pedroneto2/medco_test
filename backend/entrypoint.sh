#!/bin/sh
set -e

echo "⏳ Waiting for MySQL to be ready..."

# Wait until DB accepts queries
until mysql -h mysql -u"$DB_USER" -p"$DB_PASS" -e "SELECT 1;" > /dev/null 2>&1; do
  echo "MySQL is unavailable - sleeping 2s"
  sleep 2
done

echo "✅ MySQL is ready!"

echo "🚀 Running Prisma migrations..."
npx prisma migrate deploy

# Check if we are in dev mode (optional)
if [ "$DEV_MODE" = "true" ]; then
  echo "🌟 Starting backend in dev mode..."
  npm run dev
else
  echo "🌟 Starting backend in production mode..."
  npm run start
fi
