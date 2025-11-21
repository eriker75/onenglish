#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Starting OnEnglish Backend Setup    ${NC}"
echo -e "${GREEN}========================================${NC}"

# Function to wait for PostgreSQL
wait_for_postgres() {
  echo -e "${YELLOW}Waiting for PostgreSQL to be ready...${NC}"
  until pg_isready -h postgres -p 5432 -U ${POSTGRES_USER} > /dev/null 2>&1; do
    echo -e "${YELLOW}PostgreSQL is unavailable - sleeping${NC}"
    sleep 2
  done
  echo -e "${GREEN}✓ PostgreSQL is ready!${NC}"
}

# Function to wait for Redis
wait_for_redis() {
  echo -e "${YELLOW}Waiting for Redis to be ready...${NC}"
  until redis-cli -h redis ping > /dev/null 2>&1; do
    echo -e "${YELLOW}Redis is unavailable - sleeping${NC}"
    sleep 2
  done
  echo -e "${GREEN}✓ Redis is ready!${NC}"
}

# Function to run Prisma operations
run_prisma_operations() {
  echo -e "${YELLOW}Running Prisma operations...${NC}"
  
  # Generate Prisma Client
  echo -e "${YELLOW}Generating Prisma Client...${NC}"
  npx prisma generate
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Prisma Client generated successfully!${NC}"
  else
    echo -e "${RED}✗ Failed to generate Prisma Client${NC}"
    exit 1
  fi
  
  # Run migrations
  echo -e "${YELLOW}Running database migrations...${NC}"
  npx prisma migrate deploy
  if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database migrations completed successfully!${NC}"
  else
    echo -e "${RED}✗ Failed to run database migrations${NC}"
    exit 1
  fi
}

# Main execution flow
echo -e "${YELLOW}Step 1: Waiting for services...${NC}"
wait_for_postgres
wait_for_redis

echo -e "${YELLOW}Step 2: Running Prisma operations...${NC}"
run_prisma_operations

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   Setup Complete - Starting App      ${NC}"
echo -e "${GREEN}========================================${NC}"

# Start the application
exec npm run start:dev

