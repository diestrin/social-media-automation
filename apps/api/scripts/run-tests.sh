#!/bin/bash

# Script to run all tests

# Set environment variables
export NODE_ENV=test

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Running linting...${NC}"
npm run lint
LINT_RESULT=$?

echo -e "${YELLOW}Running unit tests...${NC}"
npm run test:cov
UNIT_RESULT=$?

echo -e "${YELLOW}Running E2E tests...${NC}"
npm run test:e2e
E2E_RESULT=$?

echo -e "${YELLOW}Running performance tests...${NC}"
npm run test:perf
PERF_RESULT=$?

# Print summary
echo -e "\n${YELLOW}Test Summary:${NC}"
if [ $LINT_RESULT -eq 0 ]; then
  echo -e "${GREEN}✓ Linting passed${NC}"
else
  echo -e "${RED}✗ Linting failed${NC}"
fi

if [ $UNIT_RESULT -eq 0 ]; then
  echo -e "${GREEN}✓ Unit tests passed${NC}"
else
  echo -e "${RED}✗ Unit tests failed${NC}"
fi

if [ $E2E_RESULT -eq 0 ]; then
  echo -e "${GREEN}✓ E2E tests passed${NC}"
else
  echo -e "${RED}✗ E2E tests failed${NC}"
fi

if [ $PERF_RESULT -eq 0 ]; then
  echo -e "${GREEN}✓ Performance tests passed${NC}"
else
  echo -e "${RED}✗ Performance tests failed${NC}"
fi

# Exit with error if any test failed
if [ $LINT_RESULT -ne 0 ] || [ $UNIT_RESULT -ne 0 ] || [ $E2E_RESULT -ne 0 ] || [ $PERF_RESULT -ne 0 ]; then
  echo -e "\n${RED}Some tests failed!${NC}"
  exit 1
else
  echo -e "\n${GREEN}All tests passed!${NC}"
  exit 0
fi 