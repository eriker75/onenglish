import { config } from 'dotenv';

// Load test environment variables
config({ path: '.env.test' });

// Set test timeout (60 seconds for file uploads and processing)
jest.setTimeout(60000);

// Global test configuration
beforeAll(() => {
  console.log('🧪 Starting E2E tests...');
  console.log(
    `📊 Database: ${process.env.DATABASE_URL?.split('@')[1] || 'Not configured'}`,
  );
});

afterAll(() => {
  console.log('✅ E2E tests completed');
});
