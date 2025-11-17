// All functions return promises with delays to simulate API response times

interface DemoUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'coordinator' | 'teacher';
  avatar: string;
}

interface DemoStatistic {
  totalStudents: number;
  registeredSchools: number;
  participationRate: number;
  paidStudents: number;
  olympiadProgress: number;
  revenueCollected: number;
  activeStudents: number;
  completionRate: number;
}

interface DemoSchool {
  id: string;
  name: string;
  code: string;
  type: 'bilingual' | 'regular';
  city: string;
  state: string;
  email: string;
  phone: string;
  totalStudents: number;
  registeredStudents: number;
  participationRate: number;
}

interface DemoChallenge {
  id: string;
  name: string;
  grade: string;
  type: 'regular' | 'bilingual';
  totalQuestions: number;
  totalTime: number;
  isDemo?: boolean;
  year?: number;
  exactDate?: string;
  stage?: string;
}

interface DemoActivity {
  id: string;
  user: string;
  action: string;
  item: string;
  time: string;
  avatar: string;
}

interface DemoPerformanceData {
  area: string;
  percentage: number;
  students: number;
  color: string;
}

interface DemoOlympicStats {
  registeredSchools: number;
  totalStudents: number;
  participatingStudents: number;
  totalQuestions: number;
  averageScore: number;
  performanceByArea: DemoPerformanceData[];
  performanceByGrade: Array<{ grade: string; percentage: number }>;
  topSchools: Array<{ name: string; students: number; participation: number }>;
}

const DEMO_DELAY = 500; // Simulate network delay

// Mock current user
export const mockCurrentUser: DemoUser = {
  id: '1',
  firstName: 'Admin',
  lastName: 'User',
  email: 'admin@onenglish.ve',
  role: 'admin',
  avatar: 'A'
};

// Simulated API: Get current user
export async function getDemoCurrentUser(): Promise<DemoUser> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCurrentUser);
    }, DEMO_DELAY);
  });
}

// Simulated API: Get dashboard statistics
export async function getDemoDashboardStats(): Promise<DemoStatistic> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalStudents: 1245,
        registeredSchools: 18,
        participationRate: 87.5,
        paidStudents: 1089,
        olympiadProgress: 68,
        revenueCollected: 87120,
        activeStudents: 856,
        completionRate: 76.8
      });
    }, DEMO_DELAY);
  });
}

// Simulated API: Get all schools
export async function getDemoSchools(): Promise<DemoSchool[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        [
          {
            id: '1',
            name: 'School Bolivariano Andrés Bello',
            code: 'SCH0001',
            type: 'bilingual',
            city: 'Caracas',
            state: 'Distrito Capital',
            email: 'andres.bello@school.ve',
            phone: '+58 212 334-5678',
            totalStudents: 125,
            registeredStudents: 118,
            participationRate: 94
          },
          {
            id: '2',
            name: 'Colegio Emmanuel',
            code: 'SCH0002',
            type: 'bilingual',
            city: 'Valencia',
            state: 'Carabobo',
            email: 'emmanuel@school.ve',
            phone: '+58 241 456-7890',
            totalStudents: 98,
            registeredStudents: 92,
            participationRate: 94
          },
          {
            id: '3',
            name: 'U.E. Juan XXIII',
            code: 'SCH0003',
            type: 'regular',
            city: 'Barquisimeto',
            state: 'Lara',
            email: 'juan23@school.ve',
            phone: '+58 251 567-8901',
            totalStudents: 87,
            registeredStudents: 78,
            participationRate: 90
          },
          {
            id: '4',
            name: 'Liceo Mariano Picón Salas',
            code: 'SCH0004',
            type: 'regular',
            city: 'Maracaibo',
            state: 'Zulia',
            email: 'piconsalas@school.ve',
            phone: '+58 261 678-9012',
            totalStudents: 142,
            registeredStudents: 128,
            participationRate: 90
          },
          {
            id: '5',
            name: 'Colegio San José',
            code: 'SCH0005',
            type: 'bilingual',
            city: 'Mérida',
            state: 'Mérida',
            email: 'sanjose@school.ve',
            phone: '+58 274 789-0123',
            totalStudents: 110,
            registeredStudents: 105,
            participationRate: 95
          },
          {
            id: '6',
            name: 'Colegio San Ignacio',
            code: 'SCH0006',
            type: 'bilingual',
            city: 'Caracas',
            state: 'Distrito Capital',
            email: 'sanignacio@school.ve',
            phone: '+58 212 445-6789',
            totalStudents: 135,
            registeredStudents: 129,
            participationRate: 96
          },
          {
            id: '7',
            name: 'U.E. El Libertador',
            code: 'SCH0007',
            type: 'regular',
            city: 'Maracay',
            state: 'Aragua',
            email: 'libertador@school.ve',
            phone: '+58 243 556-7890',
            totalStudents: 156,
            registeredStudents: 142,
            participationRate: 91
          },
          {
            id: '8',
            name: 'Liceo Los Andes',
            code: 'SCH0008',
            type: 'regular',
            city: 'San Cristóbal',
            state: 'Táchira',
            email: 'losandes@school.ve',
            phone: '+58 276 667-8901',
            totalStudents: 103,
            registeredStudents: 92,
            participationRate: 89
          },
          {
            id: '9',
            name: 'Colegio La Salle',
            code: 'SCH0009',
            type: 'bilingual',
            city: 'Barquisimeto',
            state: 'Lara',
            email: 'lasalle@school.ve',
            phone: '+58 251 778-9012',
            totalStudents: 120,
            registeredStudents: 114,
            participationRate: 95
          },
          {
            id: '10',
            name: 'U.E. Simón Bolívar',
            code: 'SCH0010',
            type: 'regular',
            city: 'Valencia',
            state: 'Carabobo',
            email: 'simonbolivar@school.ve',
            phone: '+58 241 889-0123',
            totalStudents: 168,
            registeredStudents: 151,
            participationRate: 90
          },
          {
            id: '11',
            name: 'Colegio Los Pinos',
            code: 'SCH0011',
            type: 'bilingual',
            city: 'Mérida',
            state: 'Mérida',
            email: 'lospinos@school.ve',
            phone: '+58 274 990-1234',
            totalStudents: 95,
            registeredStudents: 88,
            participationRate: 93
          },
          {
            id: '12',
            name: 'Liceo Arturo Michelena',
            code: 'SCH0012',
            type: 'regular',
            city: 'Valencia',
            state: 'Carabobo',
            email: 'michelena@school.ve',
            phone: '+58 241 001-2345',
            totalStudents: 148,
            registeredStudents: 133,
            participationRate: 90
          },
          {
            id: '13',
            name: 'Colegio Los Rosales',
            code: 'SCH0013',
            type: 'bilingual',
            city: 'Caracas',
            state: 'Distrito Capital',
            email: 'losrosales@school.ve',
            phone: '+58 212 112-3456',
            totalStudents: 112,
            registeredStudents: 107,
            participationRate: 96
          },
          {
            id: '14',
            name: 'U.E. Don Bosco',
            code: 'SCH0014',
            type: 'regular',
            city: 'Barquisimeto',
            state: 'Lara',
            email: 'donbosco@school.ve',
            phone: '+58 251 223-4567',
            totalStudents: 134,
            registeredStudents: 120,
            participationRate: 90
          },
          {
            id: '15',
            name: 'Liceo Andrés Bello',
            code: 'SCH0015',
            type: 'bilingual',
            city: 'Maracaibo',
            state: 'Zulia',
            email: 'bello@school.ve',
            phone: '+58 261 334-5678',
            totalStudents: 108,
            registeredStudents: 102,
            participationRate: 94
          },
          {
            id: '16',
            name: 'Colegio Santa Rosa',
            code: 'SCH0016',
            type: 'regular',
            city: 'Mérida',
            state: 'Mérida',
            email: 'santarosa@school.ve',
            phone: '+58 274 445-6789',
            totalStudents: 126,
            registeredStudents: 113,
            participationRate: 90
          },
          {
            id: '17',
            name: 'U.E. El Nazareno',
            code: 'SCH0017',
            type: 'bilingual',
            city: 'Valencia',
            state: 'Carabobo',
            email: 'nazareno@school.ve',
            phone: '+58 241 556-7890',
            totalStudents: 117,
            registeredStudents: 111,
            participationRate: 95
          },
          {
            id: '18',
            name: 'Liceo Rafael Urdaneta',
            code: 'SCH0018',
            type: 'regular',
            city: 'Maracaibo',
            state: 'Zulia',
            email: 'urdaneta@school.ve',
            phone: '+58 261 667-8901',
            totalStudents: 152,
            registeredStudents: 137,
            participationRate: 90
          },
          {
            id: '19',
            name: 'Colegio San Antonio',
            code: 'SCH0019',
            type: 'bilingual',
            city: 'Caracas',
            state: 'Distrito Capital',
            email: 'sanantonio@school.ve',
            phone: '+58 212 778-9012',
            totalStudents: 99,
            registeredStudents: 94,
            participationRate: 95
          },
          {
            id: '20',
            name: 'U.E. Los Samanes',
            code: 'SCH0020',
            type: 'regular',
            city: 'Valencia',
            state: 'Carabobo',
            email: 'lossamanes@school.ve',
            phone: '+58 241 889-0123',
            totalStudents: 145,
            registeredStudents: 130,
            participationRate: 90
          },
          {
            id: '21',
            name: 'Liceo La Concordia',
            code: 'SCH0021',
            type: 'bilingual',
            city: 'Barquisimeto',
            state: 'Lara',
            email: 'laconcordia@school.ve',
            phone: '+58 251 990-1234',
            totalStudents: 114,
            registeredStudents: 108,
            participationRate: 95
          },
          {
            id: '22',
            name: 'Colegio Montesinos',
            code: 'SCH0022',
            type: 'regular',
            city: 'Mérida',
            state: 'Mérida',
            email: 'montesinos@school.ve',
            phone: '+58 274 001-2345',
            totalStudents: 131,
            registeredStudents: 118,
            participationRate: 90
          },
          {
            id: '23',
            name: 'U.E. San Juan',
            code: 'SCH0023',
            type: 'bilingual',
            city: 'Maracay',
            state: 'Aragua',
            email: 'sanjuan@school.ve',
            phone: '+58 243 112-3456',
            totalStudents: 106,
            registeredStudents: 101,
            participationRate: 95
          },
          {
            id: '24',
            name: 'Liceo César Rengifo',
            code: 'SCH0024',
            type: 'regular',
            city: 'Caracas',
            state: 'Distrito Capital',
            email: 'rengifo@school.ve',
            phone: '+58 212 223-4567',
            totalStudents: 139,
            registeredStudents: 125,
            participationRate: 90
          },
          {
            id: '25',
            name: 'Colegio Fátima',
            code: 'SCH0025',
            type: 'bilingual',
            city: 'Valencia',
            state: 'Carabobo',
            email: 'fatima@school.ve',
            phone: '+58 241 334-5678',
            totalStudents: 121,
            registeredStudents: 115,
            participationRate: 95
          },
          {
            id: '26',
            name: 'U.E. Antonio José de Sucre',
            code: 'SCH0026',
            type: 'regular',
            city: 'Ciudad Bolívar',
            state: 'Bolívar',
            email: 'sucre@school.ve',
            phone: '+58 285 445-6789',
            totalStudents: 154,
            registeredStudents: 139,
            participationRate: 90
          },
          {
            id: '27',
            name: 'Colegio San Vicente',
            code: 'SCH0027',
            type: 'bilingual',
            city: 'Barcelona',
            state: 'Anzoátegui',
            email: 'sanvicente@school.ve',
            phone: '+58 281 556-7890',
            totalStudents: 113,
            registeredStudents: 107,
            participationRate: 95
          },
          {
            id: '28',
            name: 'Liceo José Gregorio Hernández',
            code: 'SCH0028',
            type: 'regular',
            city: 'Punto Fijo',
            state: 'Falcón',
            email: 'jgh@school.ve',
            phone: '+58 269 667-8901',
            totalStudents: 128,
            registeredStudents: 115,
            participationRate: 90
          },
          {
            id: '29',
            name: 'Colegio San Patricio',
            code: 'SCH0029',
            type: 'bilingual',
            city: 'Caracas',
            state: 'Distrito Capital',
            email: 'sanpatricio@school.ve',
            phone: '+58 212 778-9012',
            totalStudents: 107,
            registeredStudents: 102,
            participationRate: 95
          },
          {
            id: '30',
            name: 'U.E. Luis Beltrán Prieto Figueroa',
            code: 'SCH0030',
            type: 'regular',
            city: 'Puerto La Cruz',
            state: 'Anzoátegui',
            email: 'prietofigueroa@school.ve',
            phone: '+58 281 889-0123',
            totalStudents: 147,
            registeredStudents: 132,
            participationRate: 90
          },
          {
            id: '31',
            name: 'Liceo Fermín Toro',
            code: 'SCH0031',
            type: 'bilingual',
            city: 'Valencia',
            state: 'Carabobo',
            email: 'fermintoro@school.ve',
            phone: '+58 241 990-1234',
            totalStudents: 119,
            registeredStudents: 113,
            participationRate: 95
          },
          {
            id: '32',
            name: 'Colegio Sagrado Corazón',
            code: 'SCH0032',
            type: 'regular',
            city: 'Coro',
            state: 'Falcón',
            email: 'sagrado@school.ve',
            phone: '+58 268 001-2345',
            totalStudents: 132,
            registeredStudents: 119,
            participationRate: 90
          },
          {
            id: '33',
            name: 'U.E. Los Próceres',
            code: 'SCH0033',
            type: 'bilingual',
            city: 'Barquisimeto',
            state: 'Lara',
            email: 'proceres@school.ve',
            phone: '+58 251 112-3456',
            totalStudents: 116,
            registeredStudents: 110,
            participationRate: 95
          },
          {
            id: '34',
            name: 'Liceo Rómulo Gallegos',
            code: 'SCH0034',
            type: 'regular',
            city: 'Ciudad Guayana',
            state: 'Bolívar',
            email: 'romulogallegos@school.ve',
            phone: '+58 286 223-4567',
            totalStudents: 149,
            registeredStudents: 134,
            participationRate: 90
          },
          {
            id: '35',
            name: 'Colegio San Pablo',
            code: 'SCH0035',
            type: 'bilingual',
            city: 'Maturín',
            state: 'Monagas',
            email: 'sanpablo@school.ve',
            phone: '+58 291 334-5678',
            totalStudents: 104,
            registeredStudents: 99,
            participationRate: 95
          },
          {
            id: '36',
            name: 'U.E. Francisco de Miranda',
            code: 'SCH0036',
            type: 'regular',
            city: 'Caracas',
            state: 'Distrito Capital',
            email: 'miranda@school.ve',
            phone: '+58 212 445-6789',
            totalStudents: 136,
            registeredStudents: 122,
            participationRate: 90
          },
          {
            id: '37',
            name: 'Liceo Páez',
            code: 'SCH0037',
            type: 'bilingual',
            city: 'Acarigua',
            state: 'Portuguesa',
            email: 'paez@school.ve',
            phone: '+58 255 556-7890',
            totalStudents: 111,
            registeredStudents: 106,
            participationRate: 95
          },
          {
            id: '38',
            name: 'Colegio Nuestra Señora de Chiquinquirá',
            code: 'SCH0038',
            type: 'regular',
            city: 'Maracaibo',
            state: 'Zulia',
            email: 'chiquinquira@school.ve',
            phone: '+58 261 667-8901',
            totalStudents: 127,
            registeredStudents: 114,
            participationRate: 90
          },
          {
            id: '39',
            name: 'U.E. Simón Rodríguez',
            code: 'SCH0039',
            type: 'bilingual',
            city: 'Valencia',
            state: 'Carabobo',
            email: 'simonrodriguez@school.ve',
            phone: '+58 241 778-9012',
            totalStudents: 118,
            registeredStudents: 112,
            participationRate: 95
          },
          {
            id: '40',
            name: 'Liceo Miguel José Sanz',
            code: 'SCH0040',
            type: 'regular',
            city: 'Barquisimeto',
            state: 'Lara',
            email: 'miguelsanz@school.ve',
            phone: '+58 251 889-0123',
            totalStudents: 143,
            registeredStudents: 129,
            participationRate: 90
          },
          {
            id: '41',
            name: 'U.E. Cecilio Acosta',
            code: 'SCH0041',
            type: 'bilingual',
            city: 'Caracas',
            state: 'Distrito Capital',
            email: 'acosta@school.ve',
            phone: '+58 212 445-6789',
            totalStudents: 109,
            registeredStudents: 104,
            participationRate: 95
          },
          {
            id: '42',
            name: 'Colegio Los Olivos',
            code: 'SCH0042',
            type: 'regular',
            city: 'Valencia',
            state: 'Carabobo',
            email: 'olivos@school.ve',
            phone: '+58 241 556-7890',
            totalStudents: 141,
            registeredStudents: 127,
            participationRate: 90
          },
          {
            id: '43',
            name: 'Liceo José María Vargas',
            code: 'SCH0043',
            type: 'bilingual',
            city: 'Maracaibo',
            state: 'Zulia',
            email: 'vargas@school.ve',
            phone: '+58 261 667-8901',
            totalStudents: 122,
            registeredStudents: 116,
            participationRate: 95
          },
          {
            id: '44',
            name: 'U.E. Rafael Urdaneta',
            code: 'SCH0044',
            type: 'regular',
            city: 'San Cristóbal',
            state: 'Táchira',
            email: 'urdaneta2@school.ve',
            phone: '+58 276 778-9012',
            totalStudents: 137,
            registeredStudents: 123,
            participationRate: 90
          },
          {
            id: '45',
            name: 'Colegio San Tomás',
            code: 'SCH0045',
            type: 'bilingual',
            city: 'Mérida',
            state: 'Mérida',
            email: 'santomas@school.ve',
            phone: '+58 274 889-0123',
            totalStudents: 115,
            registeredStudents: 109,
            participationRate: 95
          },
          {
            id: '46',
            name: 'Liceo La Salle Barquisimeto',
            code: 'SCH0046',
            type: 'regular',
            city: 'Barquisimeto',
            state: 'Lara',
            email: 'lasalle2@school.ve',
            phone: '+58 251 990-1234',
            totalStudents: 146,
            registeredStudents: 131,
            participationRate: 90
          },
          {
            id: '47',
            name: 'U.E. Los Libertadores',
            code: 'SCH0047',
            type: 'bilingual',
            city: 'Valencia',
            state: 'Carabobo',
            email: 'libertadores@school.ve',
            phone: '+58 241 001-2345',
            totalStudents: 124,
            registeredStudents: 118,
            participationRate: 95
          },
          {
            id: '48',
            name: 'Colegio Nuestra Señora del Valle',
            code: 'SCH0048',
            type: 'regular',
            city: 'Ciudad Bolívar',
            state: 'Bolívar',
            email: 'valle@school.ve',
            phone: '+58 285 112-3456',
            totalStudents: 133,
            registeredStudents: 120,
            participationRate: 90
          },
          {
            id: '49',
            name: 'Liceo Andrés Eloy Blanco',
            code: 'SCH0049',
            type: 'bilingual',
            city: 'Caracas',
            state: 'Distrito Capital',
            email: 'andreseloy@school.ve',
            phone: '+58 212 223-4567',
            totalStudents: 101,
            registeredStudents: 96,
            participationRate: 95
          },
          {
            id: '50',
            name: 'U.E. Generalísimo Francisco de Miranda',
            code: 'SCH0050',
            type: 'regular',
            city: 'Maracay',
            state: 'Aragua',
            email: 'franciscomiranda@school.ve',
            phone: '+58 243 334-5678',
            totalStudents: 159,
            registeredStudents: 143,
            participationRate: 90
          },
          {
            id: '51',
            name: 'Colegio San Juan Bautista',
            code: 'SCH0051',
            type: 'bilingual',
            city: 'Barcelona',
            state: 'Anzoátegui',
            email: 'juanbautista@school.ve',
            phone: '+58 281 445-6789',
            totalStudents: 103,
            registeredStudents: 98,
            participationRate: 95
          },
          {
            id: '52',
            name: 'Liceo José Ángel Lamas',
            code: 'SCH0052',
            type: 'regular',
            city: 'Valencia',
            state: 'Carabobo',
            email: 'lamas@school.ve',
            phone: '+58 241 556-7890',
            totalStudents: 138,
            registeredStudents: 124,
            participationRate: 90
          }
        ]);
    }, DEMO_DELAY);
  });
}

// Simulated API: Get all challenges
export async function getDemoChallenges(): Promise<DemoChallenge[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          name: 'Challenge 5th Grade - Regular',
          grade: '5th_grade',
          type: 'regular',
          totalQuestions: 28,
          totalTime: 120,
          isDemo: false,
          year: 2025,
          exactDate: '2025-03-15',
          stage: 'Regional'
        },
        {
          id: '2',
          name: 'Challenge 6th Grade - Regular',
          grade: '6th_grade',
          type: 'regular',
          totalQuestions: 35,
          totalTime: 150,
          isDemo: true,
          year: 2025,
          exactDate: '2025-03-20',
          stage: 'National'
        },
        {
          id: '3',
          name: 'Challenge 1st Year - Regular',
          grade: '1st_year',
          type: 'regular',
          totalQuestions: 44,
          totalTime: 180,
          isDemo: false,
          year: 2025,
          exactDate: '2025-04-10',
          stage: 'State'
        },
        {
          id: '4',
          name: 'Challenge 5th Grade - Bilingual',
          grade: '5th_grade',
          type: 'bilingual',
          totalQuestions: 44,
          totalTime: 180,
          isDemo: false,
          year: 2025,
          exactDate: '2025-03-15',
          stage: 'Regional'
        },
        {
          id: '5',
          name: 'Challenge 6th Grade - Bilingual',
          grade: '6th_grade',
          type: 'bilingual',
          totalQuestions: 54,
          totalTime: 210,
          isDemo: true,
          year: 2025,
          exactDate: '2025-04-25',
          stage: 'National'
        },
        {
          id: '6',
          name: 'Challenge 2nd Year - Regular',
          grade: '2nd_year',
          type: 'regular',
          totalQuestions: 50,
          totalTime: 195,
          isDemo: false,
          year: 2025,
          exactDate: '2025-04-12',
          stage: 'State'
        },
        {
          id: '7',
          name: 'Challenge 3rd Year - Bilingual',
          grade: '3rd_year',
          type: 'bilingual',
          totalQuestions: 58,
          totalTime: 225,
          isDemo: false,
          year: 2025,
          exactDate: '2025-04-18',
          stage: 'Regional'
        },
        {
          id: '8',
          name: 'Challenge 4th Year - Regular',
          grade: '4th_year',
          type: 'regular',
          totalQuestions: 52,
          totalTime: 200,
          isDemo: true,
          year: 2025,
          exactDate: '2025-05-05',
          stage: 'State'
        },
        {
          id: '9',
          name: 'Challenge 5th Year - Bilingual',
          grade: '5th_year',
          type: 'bilingual',
          totalQuestions: 60,
          totalTime: 240,
          isDemo: false,
          year: 2025,
          exactDate: '2025-04-28',
          stage: 'National'
        },
        {
          id: '10',
          name: 'Challenge 2nd Year - Bilingual',
          grade: '2nd_year',
          type: 'bilingual',
          totalQuestions: 55,
          totalTime: 210,
          isDemo: false,
          year: 2025,
          exactDate: '2025-04-15',
          stage: 'Regional'
        },
        {
          id: '11',
          name: 'Challenge 3rd Year - Regular',
          grade: '3rd_year',
          type: 'regular',
          totalQuestions: 48,
          totalTime: 190,
          isDemo: true,
          year: 2024,
          exactDate: '2024-11-20',
          stage: 'State'
        },
        {
          id: '12',
          name: 'Challenge 4th Year - Bilingual',
          grade: '4th_year',
          type: 'bilingual',
          totalQuestions: 62,
          totalTime: 250,
          isDemo: false,
          year: 2025,
          exactDate: '2025-05-10',
          stage: 'National'
        }
      ]);
    }, DEMO_DELAY);
  });
}

interface DemoActivity {
  id: string;
  user: string;
  action: string;
  item: string;
  time: string;
  avatar: string;
  type?: 'payment' | 'achievement' | 'registration' | 'completion' | 'review' | 'milestone';
}

// Simulated API: Get recent activities
export async function getDemoActivities(): Promise<DemoActivity[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          user: 'Colegio Emmanuel',
          action: 'completó el pago de',
          item: '125 estudiantes',
          time: 'Hace 15 minutos',
          avatar: '💰',
          type: 'payment'
        },
        {
          id: '2',
          user: 'María González',
          action: 'alcanzó',
          item: '98% - Nuevo Top Score',
          time: 'Hace 1 hora',
          avatar: '🏆',
          type: 'achievement'
        },
        {
          id: '3',
          user: 'School Bolivariano',
          action: 'registró',
          item: '45 nuevos estudiantes',
          time: 'Hace 2 horas',
          avatar: '📚',
          type: 'registration'
        },
        {
          id: '4',
          user: 'U.E. Juan XXIII',
          action: 'completó',
          item: 'todas las áreas de Grammar',
          time: 'Hace 3 horas',
          avatar: '✅',
          type: 'completion'
        },
        {
          id: '5',
          user: 'Carlos Rodríguez',
          action: 'obtuvo medalla de plata en',
          item: 'Vocabulary Challenge',
          time: 'Hace 4 horas',
          avatar: '🥈',
          type: 'achievement'
        },
        {
          id: '6',
          user: '32 respuestas',
          action: 'pendientes de revisión en',
          item: 'Speaking Area',
          time: 'Hace 5 horas',
          avatar: '🔍',
          type: 'review'
        },
        {
          id: '7',
          user: 'Liceo San José',
          action: 'alcanzó meta de',
          item: '90% participación',
          time: 'Ayer',
          avatar: '🎯',
          type: 'milestone'
        },
        {
          id: '8',
          user: 'Colegio Los Pinos',
          action: 'procesó pago de',
          item: '$8,500 - 85 estudiantes',
          time: 'Ayer',
          avatar: '💰',
          type: 'payment'
        }
      ]);
    }, DEMO_DELAY);
  });
}

// Simulated API: Get top schools
export async function getDemoTopSchools(): Promise<DemoSchool[]> {
  const schools = await getDemoSchools();
  return schools.slice(0, 3);
}

interface DemoTopStudent {
  id: string;
  position: number;
  name: string;
  school: string;
  grade: string;
  score: number;
  progress: number;
  medal?: 'gold' | 'silver' | 'bronze';
}

// Simulated API: Get top students
export async function getDemoTopStudents(): Promise<DemoTopStudent[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: '1',
          position: 1,
          name: 'María González',
          school: 'Colegio Emmanuel',
          grade: '3er Año',
          score: 98,
          progress: 98,
          medal: 'gold'
        },
        {
          id: '2',
          position: 2,
          name: 'Carlos Rodríguez',
          school: 'School Bolivariano Andrés Bello',
          grade: '4to Año',
          score: 96,
          progress: 96,
          medal: 'silver'
        },
        {
          id: '3',
          position: 3,
          name: 'Ana Martínez',
          school: 'U.E. Juan XXIII',
          grade: '5to Año',
          score: 94,
          progress: 94,
          medal: 'bronze'
        },
        {
          id: '4',
          position: 4,
          name: 'Luis Fernández',
          school: 'Colegio Emmanuel',
          grade: '2do Año',
          score: 92,
          progress: 92
        },
        {
          id: '5',
          position: 5,
          name: 'Sofía Pérez',
          school: 'School Bolivariano Andrés Bello',
          grade: '3er Año',
          score: 90,
          progress: 90
        },
        {
          id: '6',
          position: 6,
          name: 'Diego Morales',
          school: 'U.E. Juan XXIII',
          grade: '4to Año',
          score: 88,
          progress: 88
        },
        {
          id: '7',
          position: 7,
          name: 'Valentina Herrera',
          school: 'Colegio Emmanuel',
          grade: '1er Año',
          score: 87,
          progress: 87
        },
        {
          id: '8',
          position: 8,
          name: 'Andrés Silva',
          school: 'School Bolivariano Andrés Bello',
          grade: '5to Año',
          score: 86,
          progress: 86
        }
      ]);
    }, DEMO_DELAY);
  });
}

// Simulated API: Get statistics data
export async function getDemoStatistics(): Promise<DemoOlympicStats> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        registeredSchools: 18,
        totalStudents: 1245,
        participatingStudents: 1089,
        totalQuestions: 892,
        averageScore: 76.8,
        performanceByArea: [
          { area: "Vocabulary", percentage: 85, students: 924, color: "#FF0098" },
          { area: "Grammar", percentage: 78, students: 847, color: "#33CC00" },
          { area: "Listening", percentage: 82, students: 889, color: "#f2bf3c" },
          { area: "Writing", percentage: 75, students: 811, color: "#9000d9" },
          { area: "Speaking", percentage: 70, students: 758, color: "#E63946" }
        ],
        performanceByGrade: [
          { grade: "5th Grade", percentage: 79 },
          { grade: "6th Grade", percentage: 77 },
          { grade: "1st Year", percentage: 76 },
          { grade: "2nd Year", percentage: 77 },
          { grade: "3rd Year", percentage: 76 },
          { grade: "4th Year", percentage: 75 },
          { grade: "5th Year", percentage: 78 }
        ],
        topSchools: [
          { name: "School Bolivariano Andrés Bello", students: 118, participation: 94 },
          { name: "Colegio Emmanuel", students: 92, participation: 94 },
          { name: "U.E. Juan XXIII", students: 78, participation: 90 }
        ]
      });
    }, DEMO_DELAY);
  });
}
