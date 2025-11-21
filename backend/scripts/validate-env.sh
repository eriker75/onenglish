#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Validating .env Configuration      ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${RED}✗ Error: .env file not found!${NC}"
    echo -e "${YELLOW}  Run: cp .env.example .env${NC}"
    exit 1
fi

echo -e "${GREEN}✓ .env file exists${NC}"
echo ""

# Load .env file
export $(cat .env | grep -v '^#' | xargs)

# Variables to check
ERRORS=0
WARNINGS=0

echo -e "${BLUE}Checking required variables...${NC}"
echo ""

# Function to check variable
check_var() {
    local var_name=$1
    local var_value="${!var_name}"
    local is_required=$2
    
    if [ -z "$var_value" ]; then
        if [ "$is_required" = "true" ]; then
            echo -e "${RED}✗ $var_name is not set${NC}"
            ((ERRORS++))
        else
            echo -e "${YELLOW}⚠ $var_name is not set (optional)${NC}"
            ((WARNINGS++))
        fi
    else
        echo -e "${GREEN}✓ $var_name is set${NC}"
    fi
}

# Check PostgreSQL variables
echo -e "${BLUE}PostgreSQL Configuration:${NC}"
check_var "POSTGRES_USER" true
check_var "POSTGRES_PASSWORD" true
check_var "POSTGRES_DB" true
check_var "DATABASE_URL" true
echo ""

# Validate DATABASE_URL uses 'postgres' as host (for Docker)
if [[ "$DATABASE_URL" == *"@localhost:"* ]]; then
    echo -e "${RED}✗ DATABASE_URL uses 'localhost' instead of 'postgres'${NC}"
    echo -e "${YELLOW}  For Docker, use: postgresql://user:password@postgres:5432/dbname${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✓ DATABASE_URL uses correct host for Docker${NC}"
fi
echo ""

# Check Redis variables
echo -e "${BLUE}Redis Configuration:${NC}"
check_var "REDIS_URL" true

# Validate REDIS_URL uses 'redis' as host (for Docker)
if [[ "$REDIS_URL" == *"localhost:"* ]]; then
    echo -e "${RED}✗ REDIS_URL uses 'localhost' instead of 'redis'${NC}"
    echo -e "${YELLOW}  For Docker, use: redis://redis:6379${NC}"
    ((ERRORS++))
else
    echo -e "${GREEN}✓ REDIS_URL uses correct host for Docker${NC}"
fi
echo ""

# Check JWT variables
echo -e "${BLUE}JWT Configuration:${NC}"
check_var "JWT_ACCESS_SECRET" true
check_var "JWT_REFRESH_SECRET" true
echo ""

# Check if using default passwords
if [ "$POSTGRES_PASSWORD" = "onenglish_secure_password_2024" ]; then
    echo -e "${YELLOW}⚠ Warning: Using default PostgreSQL password${NC}"
    echo -e "${YELLOW}  Change this in production!${NC}"
    ((WARNINGS++))
fi

if [ "$JWT_ACCESS_SECRET" = "onenglish_jwt_access_secret_change_in_production_2024" ]; then
    echo -e "${YELLOW}⚠ Warning: Using default JWT access secret${NC}"
    echo -e "${YELLOW}  Change this in production!${NC}"
    ((WARNINGS++))
fi

# Summary
echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Validation Summary                  ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All required variables are configured!${NC}"
else
    echo -e "${RED}✗ Found $ERRORS error(s)${NC}"
fi

if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠ Found $WARNINGS warning(s)${NC}"
fi

echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}Your .env file is ready for Docker! 🚀${NC}"
    echo -e "${GREEN}Run: make up-dev${NC}"
    exit 0
else
    echo -e "${RED}Please fix the errors before running Docker containers${NC}"
    exit 1
fi

