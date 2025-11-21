// Simulates NextAuth with demo credentials and no actual API calls

interface DemoSession {
  user: {
    id: string;
    name: string;
    firstName: string;
    email: string;
    role: 'admin' | 'coordinator' | 'teacher';
  };
  expires: string;
}

const DEMO_CREDENTIALS = {
  email: 'admin@onenglish.ve',
  password: 'demo123'
};

export async function simulateLogin(email: string, password: string): Promise<DemoSession | null> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Allow demo credentials or any non-empty combo for testing
  if (email && password) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      user: {
        id: '1',
        name: 'Admin User',
        firstName: 'Admin',
        email: email,
        role: 'admin'
      },
      expires: tomorrow.toISOString()
    };
  }
  
  return null;
}

export function getDemoSession(): DemoSession {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return {
    user: {
      id: '1',
      name: 'Admin User',
      firstName: 'Admin',
      email: DEMO_CREDENTIALS.email,
      role: 'admin'
    },
    expires: tomorrow.toISOString()
  };
}
