export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'coordinator' | 'teacher';
  avatar?: string;
}

const DEMO_USERS: Array<DemoUser & { password: string }> = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'demo123',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Coordinator User',
    email: 'coordinator@example.com',
    password: 'demo123',
    role: 'coordinator',
  },
  {
    id: '3',
    name: 'Teacher User',
    email: 'teacher@example.com',
    password: 'demo123',
    role: 'teacher',
  },
];

export async function loginWithDemo(email: string, password: string): Promise<DemoUser | null> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 800));

  const user = DEMO_USERS.find(u => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}

export function setCurrentUser(user: DemoUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('demo-user', JSON.stringify(user));
  }
}

export function getCurrentUser(): DemoUser | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('demo-user');
    return stored ? JSON.parse(stored) : null;
  }
  return null;
}

export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('demo-user');
  }
}
