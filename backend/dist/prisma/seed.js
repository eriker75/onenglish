"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const faker_1 = require("@faker-js/faker");
faker_1.faker.seed(123);
async function main() {
    console.log('🌱 Starting seed with Faker.js...');
    console.log('📝 Generating realistic test data...\n');
    console.log('🧹 Cleaning existing data...');
    await cleanDatabase();
    await seedPostgreSQL();
    console.log('\n✅ Seed completed successfully!');
}
async function cleanDatabase() {
    await prisma.questionSchoolStats.deleteMany();
    await prisma.studentAnswer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.studentChallenge.deleteMany();
    await prisma.schoolChallenge.deleteMany();
    await prisma.challenge.deleteMany();
    await prisma.school.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    await prisma.coordinator.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.userActivity.deleteMany();
    await prisma.userSetting.deleteMany();
    await prisma.userPermission.deleteMany();
    await prisma.rolePermission.deleteMany();
    await prisma.userRole.deleteMany();
    await prisma.permission.deleteMany();
    await prisma.role.deleteMany();
    await prisma.errorLog.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Database cleaned');
}
async function seedPostgreSQL() {
    console.log('📊 Seeding PostgreSQL...');
    const permissions = await Promise.all([
        prisma.permission.create({
            data: {
                name: 'create:user',
                resource: 'user',
                action: 'create',
                description: 'Create new users',
            },
        }),
        prisma.permission.create({
            data: {
                name: 'read:user',
                resource: 'user',
                action: 'read',
                description: 'View user information',
            },
        }),
        prisma.permission.create({
            data: {
                name: 'update:user',
                resource: 'user',
                action: 'update',
                description: 'Update user information',
            },
        }),
        prisma.permission.create({
            data: {
                name: 'delete:user',
                resource: 'user',
                action: 'delete',
                description: 'Delete users',
            },
        }),
        prisma.permission.create({
            data: {
                name: 'manage:challenge',
                resource: 'challenge',
                action: 'manage',
                description: 'Full access to challenges',
            },
        }),
    ]);
    console.log(`✅ Created ${permissions.length} permissions`);
    const adminRole = await prisma.role.create({
        data: {
            name: 'admin',
            description: 'System Administrator',
            isActive: true,
        },
    });
    const coordinatorRole = await prisma.role.create({
        data: {
            name: 'coordinator',
            description: 'Academic Coordinator',
            isActive: true,
        },
    });
    const teacherRole = await prisma.role.create({
        data: {
            name: 'teacher',
            description: 'Teacher',
            isActive: true,
        },
    });
    const studentRole = await prisma.role.create({
        data: {
            name: 'student',
            description: 'Student',
            isActive: true,
        },
    });
    console.log('✅ Created 4 roles (admin, coordinator, teacher, student)');
    await Promise.all([
        ...permissions.map((permission) => prisma.rolePermission.create({
            data: {
                roleId: adminRole.id,
                permissionId: permission.id,
            },
        })),
        prisma.rolePermission.create({
            data: {
                roleId: coordinatorRole.id,
                permissionId: permissions.find((p) => p.name === 'manage:challenge')
                    .id,
            },
        }),
        prisma.rolePermission.create({
            data: {
                roleId: coordinatorRole.id,
                permissionId: permissions.find((p) => p.name === 'read:user').id,
            },
        }),
        prisma.rolePermission.create({
            data: {
                roleId: teacherRole.id,
                permissionId: permissions.find((p) => p.name === 'manage:challenge')
                    .id,
            },
        }),
        prisma.rolePermission.create({
            data: {
                roleId: teacherRole.id,
                permissionId: permissions.find((p) => p.name === 'read:user').id,
            },
        }),
    ]);
    console.log('✅ Assigned permissions to roles');
    const schoolLincoln = await prisma.school.create({
        data: {
            name: 'Lincoln High School',
            code: 'LHS001',
            type: 'public',
            address: faker_1.faker.location.streetAddress(),
            city: 'New York',
            state: 'NY',
            country: faker_1.faker.location.country(),
            postalCode: faker_1.faker.location.zipCode(),
            phone: faker_1.faker.phone.number(),
            email: faker_1.faker.internet.email({ provider: 'lincolnhs.edu' }).toLowerCase(),
            website: 'https://www.lincolnhs.edu',
            description: faker_1.faker.company.catchPhrase() + ' - Premier English learning institution',
            isActive: true,
        },
    });
    const schoolJefferson = await prisma.school.create({
        data: {
            name: 'Jefferson Academy',
            code: 'JA001',
            type: 'private',
            address: faker_1.faker.location.streetAddress(),
            city: 'Boston',
            state: 'MA',
            country: faker_1.faker.location.country(),
            postalCode: faker_1.faker.location.zipCode(),
            phone: faker_1.faker.phone.number(),
            email: faker_1.faker.internet
                .email({ provider: 'jeffersonacademy.edu' })
                .toLowerCase(),
            website: 'https://www.jeffersonacademy.edu',
            description: faker_1.faker.company.catchPhrase() + ' - Excellence in English education',
            isActive: true,
        },
    });
    const schoolWashington = await prisma.school.create({
        data: {
            name: 'Washington Institute',
            code: 'WI001',
            type: 'public',
            address: faker_1.faker.location.streetAddress(),
            city: 'Chicago',
            state: 'IL',
            country: faker_1.faker.location.country(),
            postalCode: faker_1.faker.location.zipCode(),
            phone: faker_1.faker.phone.number(),
            email: faker_1.faker.internet
                .email({ provider: 'washingtoninstitute.edu' })
                .toLowerCase(),
            website: 'https://www.washingtoninstitute.edu',
            description: faker_1.faker.company.catchPhrase(),
            isActive: true,
        },
    });
    console.log('✅ Created 3 schools (Lincoln, Jefferson, Washington)');
    const hashedPassword = await bcrypt.hash('password123', 10);
    const adminUser1 = await prisma.user.create({
        data: {
            email: 'admin@onenglish.com',
            username: 'admin',
            password: hashedPassword,
            firstName: 'Super',
            lastName: 'Admin',
            isVerified: true,
            isActive: true,
        },
    });
    const adminUser2 = await prisma.user.create({
        data: {
            email: 'admin2@onenglish.com',
            username: 'admin2',
            password: hashedPassword,
            firstName: 'Secondary',
            lastName: 'Admin',
            isVerified: true,
            isActive: true,
        },
    });
    const coordinatorUser1 = await prisma.user.create({
        data: {
            email: 'maria.rodriguez@lincolnhs.edu',
            username: 'mariarodriguez',
            password: hashedPassword,
            firstName: 'Maria',
            lastName: 'Rodriguez',
            isVerified: true,
            isActive: true,
        },
    });
    const coordinatorUser2 = await prisma.user.create({
        data: {
            email: 'john.wilson@jeffersonacademy.edu',
            username: 'johnwilson',
            password: hashedPassword,
            firstName: 'John',
            lastName: 'Wilson',
            isVerified: true,
            isActive: true,
        },
    });
    const coordinatorUser3 = await prisma.user.create({
        data: {
            email: 'susan.chen@washingtoninstitute.edu',
            username: 'susanchen',
            password: hashedPassword,
            firstName: 'Susan',
            lastName: 'Chen',
            isVerified: true,
            isActive: true,
        },
    });
    const teacherUser1 = await prisma.user.create({
        data: {
            email: 'jane.smith@lincolnhs.edu',
            username: 'janesmith',
            password: hashedPassword,
            firstName: 'Jane',
            lastName: 'Smith',
            isVerified: true,
            isActive: true,
        },
    });
    const teacherUser2 = await prisma.user.create({
        data: {
            email: 'robert.brown@lincolnhs.edu',
            username: 'robertbrown',
            password: hashedPassword,
            firstName: 'Robert',
            lastName: 'Brown',
            isVerified: true,
            isActive: true,
        },
    });
    const teacherUser3 = await prisma.user.create({
        data: {
            email: 'emily.davis@jeffersonacademy.edu',
            username: 'emilydavis',
            password: hashedPassword,
            firstName: 'Emily',
            lastName: 'Davis',
            isVerified: true,
            isActive: true,
        },
    });
    const studentUser1 = await prisma.user.create({
        data: {
            email: 'john.doe@lincolnhs.edu',
            username: 'johndoe',
            password: hashedPassword,
            firstName: 'John',
            lastName: 'Doe',
            isVerified: true,
            isActive: true,
        },
    });
    const studentUser2 = await prisma.user.create({
        data: {
            email: 'sarah.williams@lincolnhs.edu',
            username: 'sarahwilliams',
            password: hashedPassword,
            firstName: 'Sarah',
            lastName: 'Williams',
            isVerified: true,
            isActive: true,
        },
    });
    const studentUser3 = await prisma.user.create({
        data: {
            email: 'michael.johnson@jeffersonacademy.edu',
            username: 'michaeljohnson',
            password: hashedPassword,
            firstName: 'Michael',
            lastName: 'Johnson',
            isVerified: true,
            isActive: true,
        },
    });
    const studentUser4 = await prisma.user.create({
        data: {
            email: 'lisa.garcia@washingtoninstitute.edu',
            username: 'lisagarcia',
            password: hashedPassword,
            firstName: 'Lisa',
            lastName: 'Garcia',
            isVerified: true,
            isActive: true,
        },
    });
    console.log('✅ Created 11 users (2 admins, 3 coordinators, 3 teachers, 4 students)');
    await Promise.all([
        prisma.userRole.create({
            data: { userId: adminUser1.id, roleId: adminRole.id },
        }),
        prisma.userRole.create({
            data: { userId: adminUser2.id, roleId: adminRole.id },
        }),
        prisma.userRole.create({
            data: { userId: coordinatorUser1.id, roleId: coordinatorRole.id },
        }),
        prisma.userRole.create({
            data: { userId: coordinatorUser2.id, roleId: coordinatorRole.id },
        }),
        prisma.userRole.create({
            data: { userId: coordinatorUser3.id, roleId: coordinatorRole.id },
        }),
        prisma.userRole.create({
            data: { userId: teacherUser1.id, roleId: teacherRole.id },
        }),
        prisma.userRole.create({
            data: { userId: teacherUser2.id, roleId: teacherRole.id },
        }),
        prisma.userRole.create({
            data: { userId: teacherUser3.id, roleId: teacherRole.id },
        }),
        prisma.userRole.create({
            data: { userId: studentUser1.id, roleId: studentRole.id },
        }),
        prisma.userRole.create({
            data: { userId: studentUser2.id, roleId: studentRole.id },
        }),
        prisma.userRole.create({
            data: { userId: studentUser3.id, roleId: studentRole.id },
        }),
        prisma.userRole.create({
            data: { userId: studentUser4.id, roleId: studentRole.id },
        }),
    ]);
    console.log('✅ Assigned roles to users');
    await Promise.all([
        prisma.userSetting.create({
            data: { userId: adminUser1.id, theme: 'dark', language: 'en' },
        }),
        prisma.userSetting.create({
            data: { userId: adminUser2.id, theme: 'light', language: 'en' },
        }),
        prisma.userSetting.create({
            data: { userId: coordinatorUser1.id, theme: 'light', language: 'es' },
        }),
        prisma.userSetting.create({
            data: { userId: coordinatorUser2.id, theme: 'dark', language: 'en' },
        }),
        prisma.userSetting.create({
            data: { userId: coordinatorUser3.id, theme: 'light', language: 'en' },
        }),
        prisma.userSetting.create({
            data: { userId: teacherUser1.id, theme: 'light', language: 'en' },
        }),
        prisma.userSetting.create({
            data: { userId: teacherUser2.id, theme: 'light', language: 'en' },
        }),
        prisma.userSetting.create({
            data: { userId: teacherUser3.id, theme: 'dark', language: 'en' },
        }),
        prisma.userSetting.create({
            data: { userId: studentUser1.id, theme: 'light', language: 'es' },
        }),
        prisma.userSetting.create({
            data: { userId: studentUser2.id, theme: 'dark', language: 'en' },
        }),
        prisma.userSetting.create({
            data: { userId: studentUser3.id, theme: 'light', language: 'es' },
        }),
        prisma.userSetting.create({
            data: { userId: studentUser4.id, theme: 'light', language: 'en' },
        }),
    ]);
    console.log('✅ Created user settings for all users');
    console.log('\n📦 Generating additional random data with Faker...');
    const additionalSchools = await Promise.all([
        prisma.school.create({
            data: {
                name: faker_1.faker.company.name() + ' Language Academy',
                code: faker_1.faker.string.alphanumeric({ length: 6, casing: 'upper' }),
                type: faker_1.faker.helpers.arrayElement(['public', 'private', 'charter']),
                address: faker_1.faker.location.streetAddress(),
                city: faker_1.faker.location.city(),
                state: faker_1.faker.location.state({ abbreviated: true }),
                country: 'United States',
                postalCode: faker_1.faker.location.zipCode(),
                phone: faker_1.faker.phone.number(),
                email: faker_1.faker.internet.email({ provider: 'academy.edu' }).toLowerCase(),
                website: `https://www.${faker_1.faker.internet.domainWord()}.edu`,
                description: faker_1.faker.company.catchPhrase(),
                isActive: faker_1.faker.datatype.boolean({ probability: 0.9 }),
            },
        }),
        prisma.school.create({
            data: {
                name: faker_1.faker.location.city() + ' English Institute',
                code: faker_1.faker.string.alphanumeric({ length: 6, casing: 'upper' }),
                type: faker_1.faker.helpers.arrayElement(['public', 'private', 'charter']),
                address: faker_1.faker.location.streetAddress(),
                city: faker_1.faker.location.city(),
                state: faker_1.faker.location.state({ abbreviated: true }),
                country: 'United States',
                postalCode: faker_1.faker.location.zipCode(),
                phone: faker_1.faker.phone.number(),
                email: faker_1.faker.internet
                    .email({ provider: 'institute.edu' })
                    .toLowerCase(),
                description: faker_1.faker.company.catchPhrase() + ' - Dedicated to English excellence',
                isActive: true,
            },
        }),
    ]);
    console.log(`✅ Created 2 additional random schools`);
    const adminProfile1 = await prisma.admin.create({
        data: {
            id: adminUser1.id,
            userId: adminUser1.id,
            firstName: adminUser1.firstName,
            lastName: adminUser1.lastName,
            email: adminUser1.email,
            phone: faker_1.faker.phone.number(),
            avatar: faker_1.faker.image.avatar(),
            bio: faker_1.faker.person.bio() +
                ' - Super administrator of the OneEnglish platform',
            isActive: true,
        },
    });
    const adminProfile2 = await prisma.admin.create({
        data: {
            id: adminUser2.id,
            userId: adminUser2.id,
            firstName: adminUser2.firstName,
            lastName: adminUser2.lastName,
            email: adminUser2.email,
            phone: faker_1.faker.phone.number(),
            avatar: faker_1.faker.image.avatar(),
            bio: faker_1.faker.person.bio(),
            isActive: true,
        },
    });
    console.log('✅ Created 2 admin profiles with realistic data');
    const coordinatorProfile1 = await prisma.coordinator.create({
        data: {
            id: coordinatorUser1.id,
            userId: coordinatorUser1.id,
            firstName: coordinatorUser1.firstName,
            lastName: coordinatorUser1.lastName,
            email: coordinatorUser1.email,
            phone: faker_1.faker.phone.number(),
            avatar: faker_1.faker.image.avatar(),
            bio: `Academic coordinator with ${faker_1.faker.number.int({ min: 5, max: 20 })} years of experience in educational leadership and English language programs`,
            schoolId: schoolLincoln.id,
            isActive: true,
        },
    });
    const coordinatorProfile2 = await prisma.coordinator.create({
        data: {
            id: coordinatorUser2.id,
            userId: coordinatorUser2.id,
            firstName: coordinatorUser2.firstName,
            lastName: coordinatorUser2.lastName,
            email: coordinatorUser2.email,
            phone: faker_1.faker.phone.number(),
            avatar: faker_1.faker.image.avatar(),
            bio: `${faker_1.faker.person.jobTitle()} at Jefferson Academy with expertise in curriculum development`,
            schoolId: schoolJefferson.id,
            isActive: true,
        },
    });
    const coordinatorProfile3 = await prisma.coordinator.create({
        data: {
            id: coordinatorUser3.id,
            userId: coordinatorUser3.id,
            firstName: coordinatorUser3.firstName,
            lastName: coordinatorUser3.lastName,
            email: coordinatorUser3.email,
            phone: faker_1.faker.phone.number(),
            avatar: faker_1.faker.image.avatar(),
            bio: `${faker_1.faker.person.jobTitle()} specializing in English language education and student development`,
            schoolId: schoolWashington.id,
            isActive: true,
        },
    });
    console.log('✅ Created 3 coordinator profiles (one per school)');
    const teacherSpecializations = [
        'TOEFL preparation',
        'IELTS certification',
        'Cambridge English',
        'Business English',
        'Academic Writing',
        'Conversation and Pronunciation',
    ];
    const teacherProfile1 = await prisma.teacher.create({
        data: {
            id: teacherUser1.id,
            userId: teacherUser1.id,
            firstName: teacherUser1.firstName,
            lastName: teacherUser1.lastName,
            email: teacherUser1.email,
            phone: faker_1.faker.phone.number(),
            avatar: faker_1.faker.image.avatar(),
            bio: `${faker_1.faker.person.jobTitle()} with ${faker_1.faker.number.int({ min: 3, max: 15 })} years of experience. Specialized in ${faker_1.faker.helpers.arrayElement(teacherSpecializations)}`,
            schoolId: schoolLincoln.id,
            isActive: true,
        },
    });
    const teacherProfile2 = await prisma.teacher.create({
        data: {
            id: teacherUser2.id,
            userId: teacherUser2.id,
            firstName: teacherUser2.firstName,
            lastName: teacherUser2.lastName,
            email: teacherUser2.email,
            phone: faker_1.faker.phone.number(),
            avatar: faker_1.faker.image.avatar(),
            bio: `ESL instructor certified in ${faker_1.faker.helpers.arrayElement(teacherSpecializations)}. ${faker_1.faker.lorem.sentence()}`,
            schoolId: schoolLincoln.id,
            isActive: true,
        },
    });
    const teacherProfile3 = await prisma.teacher.create({
        data: {
            id: teacherUser3.id,
            userId: teacherUser3.id,
            firstName: teacherUser3.firstName,
            lastName: teacherUser3.lastName,
            email: teacherUser3.email,
            phone: faker_1.faker.phone.number(),
            avatar: faker_1.faker.image.avatar(),
            bio: `Expert in ${faker_1.faker.helpers.arrayElement(teacherSpecializations)} with international teaching experience`,
            schoolId: schoolJefferson.id,
            isActive: true,
        },
    });
    console.log('✅ Created 3 teacher profiles (2 Lincoln, 1 Jefferson)');
    const englishLevels = ['-A1', 'A1', 'A1+', 'A2', 'A2+', 'B1', 'B1+', 'C1'];
    const learningGoals = [
        'university admission',
        'career advancement',
        'travel and communication',
        'academic research',
        'professional certification',
        'personal development',
    ];
    const studentProfile1 = await prisma.student.create({
        data: {
            id: studentUser1.id,
            userId: studentUser1.id,
            firstName: studentUser1.firstName,
            lastName: studentUser1.lastName,
            email: studentUser1.email,
            phone: faker_1.faker.phone.number(),
            avatar: faker_1.faker.image.avatar(),
            bio: `English learner at ${faker_1.faker.helpers.arrayElement(englishLevels)} level. Goal: ${faker_1.faker.helpers.arrayElement(learningGoals)}. ${faker_1.faker.lorem.sentence()}`,
            schoolId: schoolLincoln.id,
            isActive: true,
        },
    });
    const studentProfile2 = await prisma.student.create({
        data: {
            id: studentUser2.id,
            userId: studentUser2.id,
            firstName: studentUser2.firstName,
            lastName: studentUser2.lastName,
            email: studentUser2.email,
            phone: faker_1.faker.phone.number(),
            avatar: faker_1.faker.image.avatar(),
            bio: `Currently at ${faker_1.faker.helpers.arrayElement(englishLevels)} level, focusing on ${faker_1.faker.helpers.arrayElement(['grammar', 'vocabulary', 'pronunciation', 'writing', 'listening'])} improvement`,
            schoolId: schoolLincoln.id,
            isActive: true,
        },
    });
    const studentProfile3 = await prisma.student.create({
        data: {
            id: studentUser3.id,
            userId: studentUser3.id,
            firstName: studentUser3.firstName,
            lastName: studentUser3.lastName,
            email: studentUser3.email,
            phone: faker_1.faker.phone.number(),
            avatar: faker_1.faker.image.avatar(),
            bio: `Advanced learner preparing for ${faker_1.faker.helpers.arrayElement(['TOEFL', 'IELTS', 'Cambridge FCE', 'TOEIC'])}. Current level: ${faker_1.faker.helpers.arrayElement(['B1+', 'C1'])}`,
            schoolId: schoolJefferson.id,
            isActive: true,
        },
    });
    const studentProfile4 = await prisma.student.create({
        data: {
            id: studentUser4.id,
            userId: studentUser4.id,
            firstName: studentUser4.firstName,
            lastName: studentUser4.lastName,
            email: studentUser4.email,
            phone: faker_1.faker.phone.number(),
            avatar: faker_1.faker.image.avatar(),
            bio: `Beginner student starting from ${faker_1.faker.helpers.arrayElement(['-A1', 'A1', 'A1+'])} level. Interested in ${faker_1.faker.helpers.arrayElement(learningGoals)}`,
            schoolId: schoolWashington.id,
            isActive: true,
        },
    });
    console.log('✅ Created 4 student profiles (2 Lincoln, 1 Jefferson, 1 Washington)');
    const beginnerChallenge = await prisma.challenge.create({
        data: {
            name: 'English Olympic Challenge - 5th Grade',
            grade: '5th_grade',
            type: 'regular',
            isDemo: true,
            year: 2024,
            exactDate: new Date('2024-05-15'),
            stage: 'Regional',
            isActive: true,
        },
    });
    const intermediateChallenge = await prisma.challenge.create({
        data: {
            name: 'English Olympic Challenge - 1st Year',
            grade: '1st_year',
            type: 'bilingual',
            isDemo: true,
            year: 2024,
            exactDate: new Date('2024-06-20'),
            stage: 'State',
            isActive: true,
        },
    });
    const advancedChallenge = await prisma.challenge.create({
        data: {
            name: 'English Olympic Challenge - 3rd Year',
            grade: '3rd_year',
            type: 'bilingual',
            isDemo: true,
            year: 2024,
            exactDate: new Date('2024-07-10'),
            stage: 'National',
            isActive: true,
        },
    });
    console.log('✅ Created 3 challenges (Beginner, Intermediate, Advanced)');
    await Promise.all([
        prisma.schoolChallenge.create({
            data: {
                schoolId: schoolLincoln.id,
                challengeId: beginnerChallenge.id,
                isActive: true,
            },
        }),
        prisma.schoolChallenge.create({
            data: {
                schoolId: schoolLincoln.id,
                challengeId: intermediateChallenge.id,
                isActive: true,
            },
        }),
        prisma.schoolChallenge.create({
            data: {
                schoolId: schoolJefferson.id,
                challengeId: beginnerChallenge.id,
                isActive: true,
            },
        }),
        prisma.schoolChallenge.create({
            data: {
                schoolId: schoolJefferson.id,
                challengeId: advancedChallenge.id,
                isActive: true,
            },
        }),
        prisma.schoolChallenge.create({
            data: {
                schoolId: schoolWashington.id,
                challengeId: beginnerChallenge.id,
                isActive: true,
            },
        }),
    ]);
    console.log('✅ Created school challenges');
    await Promise.all([
        prisma.studentChallenge.create({
            data: {
                studentId: studentProfile1.id,
                challengeId: beginnerChallenge.id,
                currentPhase: faker_1.faker.number.int({ min: 1, max: 3 }),
                totalScore: faker_1.faker.number.int({ min: 50, max: 300 }),
                totalTimeSpent: faker_1.faker.number.int({ min: 1800, max: 7200 }),
                isCompleted: false,
                assignedAt: faker_1.faker.date.past({ years: 0.5 }),
                dueDate: faker_1.faker.date.future({ years: 0.2 }),
                startedAt: faker_1.faker.date.recent({ days: 30 }),
                lastActivityAt: faker_1.faker.date.recent({ days: 2 }),
                notes: faker_1.faker.lorem.sentence(),
            },
        }),
        prisma.studentChallenge.create({
            data: {
                studentId: studentProfile2.id,
                challengeId: intermediateChallenge.id,
                currentPhase: faker_1.faker.number.int({ min: 2, max: 4 }),
                totalScore: faker_1.faker.number.int({ min: 300, max: 700 }),
                totalTimeSpent: faker_1.faker.number.int({ min: 5400, max: 14400 }),
                isCompleted: false,
                assignedAt: faker_1.faker.date.past({ years: 0.3 }),
                dueDate: faker_1.faker.date.future({ years: 0.1 }),
                startedAt: faker_1.faker.date.recent({ days: 60 }),
                lastActivityAt: faker_1.faker.date.recent({ days: 1 }),
                notes: 'Making good progress. ' + faker_1.faker.lorem.sentence(),
            },
        }),
        prisma.studentChallenge.create({
            data: {
                studentId: studentProfile3.id,
                challengeId: advancedChallenge.id,
                currentPhase: faker_1.faker.number.int({ min: 1, max: 2 }),
                totalScore: faker_1.faker.number.int({ min: 100, max: 400 }),
                totalTimeSpent: faker_1.faker.number.int({ min: 3600, max: 10800 }),
                isCompleted: false,
                assignedAt: faker_1.faker.date.past({ years: 0.2 }),
                dueDate: faker_1.faker.date.future({ years: 0.3 }),
                startedAt: faker_1.faker.date.recent({ days: 45 }),
                lastActivityAt: faker_1.faker.date.recent({ days: 3 }),
                notes: faker_1.faker.lorem.sentence(),
            },
        }),
        prisma.studentChallenge.create({
            data: {
                studentId: studentProfile4.id,
                challengeId: beginnerChallenge.id,
                currentPhase: 1,
                totalScore: faker_1.faker.number.int({ min: 0, max: 50 }),
                totalTimeSpent: faker_1.faker.number.int({ min: 0, max: 1800 }),
                isCompleted: false,
                assignedAt: faker_1.faker.date.recent({ days: 7 }),
                dueDate: faker_1.faker.date.future({ years: 0.5 }),
                startedAt: faker_1.faker.date.recent({ days: 5 }),
                lastActivityAt: faker_1.faker.date.recent({ days: 1 }),
                notes: 'Just started. ' + faker_1.faker.lorem.sentence(),
            },
        }),
    ]);
    console.log('✅ Created 4 student challenges with realistic progress data');
    const activityActions = [
        'login',
        'logout',
        'start_challenge',
        'complete_phase',
        'update_profile',
    ];
    const userActivities = [];
    const allUsers = [
        adminUser1,
        adminUser2,
        coordinatorUser1,
        coordinatorUser2,
        coordinatorUser3,
        teacherUser1,
        teacherUser2,
        teacherUser3,
        studentUser1,
        studentUser2,
        studentUser3,
        studentUser4,
    ];
    for (const user of allUsers) {
        const numActivities = faker_1.faker.number.int({ min: 2, max: 5 });
        for (let i = 0; i < numActivities; i++) {
            userActivities.push(prisma.userActivity.create({
                data: {
                    userId: user.id,
                    action: faker_1.faker.helpers.arrayElement(activityActions),
                    resource: faker_1.faker.helpers.arrayElement([
                        'challenge',
                        'phase',
                        'question',
                        null,
                    ]),
                    resourceId: faker_1.faker.helpers.maybe(() => faker_1.faker.string.uuid(), {
                        probability: 0.5,
                    }),
                    ipAddress: faker_1.faker.internet.ipv4(),
                    userAgent: faker_1.faker.internet.userAgent(),
                    metadata: {
                        device: faker_1.faker.helpers.arrayElement([
                            'desktop',
                            'mobile',
                            'tablet',
                        ]),
                        browser: faker_1.faker.helpers.arrayElement([
                            'Chrome',
                            'Firefox',
                            'Safari',
                            'Edge',
                        ]),
                    },
                    timestamp: faker_1.faker.date.recent({ days: 30 }),
                },
            }));
        }
    }
    await Promise.all(userActivities);
    console.log(`✅ Created ${userActivities.length} user activities with realistic data`);
    console.log('\n📝 Creating questions for challenges...');
    const allQuestions = [];
    const questionTypes = {
        VOCABULARY: ['image_to_multiple_choices', 'wordbox', 'spelling', 'word_associations'],
        GRAMMAR: ['unscramble', 'tenses', 'tag_it', 'report_it', 'read_it'],
        LISTENING: ['word_match', 'gossip', 'topic_based_audio', 'lyrics_training'],
        WRITING: ['sentence_maker', 'fast_test', 'tales'],
        SPEAKING: ['superbrain', 'tell_me_about_it', 'debate'],
    };
    for (let i = 0; i < 30; i++) {
        const stage = 'VOCABULARY';
        const type = faker_1.faker.helpers.arrayElement(questionTypes.VOCABULARY);
        const challengeId = faker_1.faker.helpers.arrayElement([
            beginnerChallenge.id,
            intermediateChallenge.id,
            advancedChallenge.id,
        ]);
        let content;
        let options = null;
        let answer = null;
        let configuration = null;
        if (type === 'image_to_multiple_choices') {
            content = { type: 'image', id: faker_1.faker.string.uuid() };
            options = [faker_1.faker.lorem.word(), faker_1.faker.lorem.word(), faker_1.faker.lorem.word(), faker_1.faker.lorem.word()];
            answer = options[0];
        }
        else if (type === 'wordbox') {
            content = [
                [faker_1.faker.string.alpha({ length: 1, casing: 'upper' }), faker_1.faker.string.alpha({ length: 1, casing: 'upper' }), faker_1.faker.string.alpha({ length: 1, casing: 'upper' })],
                [faker_1.faker.string.alpha({ length: 1, casing: 'upper' }), faker_1.faker.string.alpha({ length: 1, casing: 'upper' }), faker_1.faker.string.alpha({ length: 1, casing: 'upper' })],
                [faker_1.faker.string.alpha({ length: 1, casing: 'upper' }), faker_1.faker.string.alpha({ length: 1, casing: 'upper' }), faker_1.faker.string.alpha({ length: 1, casing: 'upper' })],
            ];
            configuration = { gridWidth: 3, gridHeight: 3 };
        }
        else if (type === 'spelling') {
            content = { type: 'image', id: faker_1.faker.string.uuid() };
            answer = faker_1.faker.lorem.word();
        }
        else if (type === 'word_associations') {
            content = faker_1.faker.lorem.word();
            configuration = { totalAssociations: faker_1.faker.number.int({ min: 15, max: 25 }) };
        }
        allQuestions.push(prisma.question.create({
            data: {
                challengeId,
                stage,
                phase: `phase_1_${faker_1.faker.number.int({ min: 1, max: 5 })}`,
                position: i + 1,
                type,
                points: faker_1.faker.number.int({ min: 8, max: 15 }),
                timeLimit: faker_1.faker.number.int({ min: 30, max: 120 }),
                maxAttempts: faker_1.faker.number.int({ min: 2, max: 4 }),
                text: faker_1.faker.lorem.sentence(),
                instructions: faker_1.faker.lorem.sentence(),
                validationMethod: faker_1.faker.helpers.arrayElement(['AUTO', 'IA']),
                content,
                options,
                answer,
                configurations: configuration,
            },
        }));
    }
    for (let i = 0; i < 25; i++) {
        const stage = 'GRAMMAR';
        const type = faker_1.faker.helpers.arrayElement(questionTypes.GRAMMAR);
        const challengeId = faker_1.faker.helpers.arrayElement([
            beginnerChallenge.id,
            intermediateChallenge.id,
            advancedChallenge.id,
        ]);
        let content;
        let options = null;
        let answer = null;
        if (type === 'unscramble') {
            const words = [faker_1.faker.lorem.word(), faker_1.faker.lorem.word(), faker_1.faker.lorem.word(), faker_1.faker.lorem.word()];
            content = faker_1.faker.helpers.shuffle(words);
            answer = words;
        }
        else if (type === 'tenses') {
            content = faker_1.faker.lorem.sentence();
            options = ['present_simple', 'past_simple', 'present_continuous', 'past_continuous'];
            answer = options[0];
        }
        else if (type === 'tag_it') {
            content = [faker_1.faker.lorem.sentence(), '?'];
            answer = ["isn't it?", 'is not it?'];
        }
        else if (type === 'report_it') {
            content = `"${faker_1.faker.lorem.sentence()}" ${faker_1.faker.person.firstName()} said.`;
        }
        else if (type === 'read_it') {
            content = [{ text: faker_1.faker.lorem.paragraph() }];
        }
        allQuestions.push(prisma.question.create({
            data: {
                challengeId,
                stage,
                phase: `phase_2_${faker_1.faker.number.int({ min: 1, max: 5 })}`,
                position: i + 1,
                type,
                points: faker_1.faker.number.int({ min: 10, max: 18 }),
                timeLimit: faker_1.faker.number.int({ min: 45, max: 150 }),
                maxAttempts: faker_1.faker.number.int({ min: 2, max: 3 }),
                text: faker_1.faker.lorem.sentence(),
                instructions: faker_1.faker.lorem.sentence(),
                validationMethod: faker_1.faker.helpers.arrayElement(['AUTO', 'IA']),
                content,
                options,
                answer,
            },
        }));
    }
    for (let i = 0; i < 20; i++) {
        const stage = 'LISTENING';
        const type = faker_1.faker.helpers.arrayElement(questionTypes.LISTENING);
        const challengeId = faker_1.faker.helpers.arrayElement([
            beginnerChallenge.id,
            intermediateChallenge.id,
            advancedChallenge.id,
        ]);
        let content;
        let options = null;
        let answer = null;
        if (type === 'word_match') {
            content = [{ type: 'audio', id: faker_1.faker.string.uuid() }];
            options = [faker_1.faker.lorem.word(), faker_1.faker.lorem.word(), faker_1.faker.lorem.word(), faker_1.faker.lorem.word()];
            answer = options[0];
        }
        else if (type === 'gossip') {
            content = { type: 'audio', id: faker_1.faker.string.uuid() };
            answer = faker_1.faker.lorem.sentence();
        }
        else if (type === 'topic_based_audio') {
            content = { type: 'audio', id: faker_1.faker.string.uuid() };
        }
        else if (type === 'lyrics_training') {
            content = { type: 'video', id: faker_1.faker.string.uuid() };
            options = [faker_1.faker.lorem.word(), faker_1.faker.lorem.word(), faker_1.faker.lorem.word(), faker_1.faker.lorem.word()];
            answer = options[0];
        }
        allQuestions.push(prisma.question.create({
            data: {
                challengeId,
                stage,
                phase: `phase_3_${faker_1.faker.number.int({ min: 1, max: 4 })}`,
                position: i + 1,
                type,
                points: faker_1.faker.number.int({ min: 12, max: 20 }),
                timeLimit: faker_1.faker.number.int({ min: 60, max: 180 }),
                maxAttempts: faker_1.faker.number.int({ min: 2, max: 3 }),
                text: faker_1.faker.lorem.sentence(),
                instructions: faker_1.faker.lorem.sentence(),
                validationMethod: faker_1.faker.helpers.arrayElement(['AUTO', 'IA']),
                content,
                options,
                answer,
            },
        }));
    }
    for (let i = 0; i < 15; i++) {
        const stage = 'WRITING';
        const type = faker_1.faker.helpers.arrayElement(questionTypes.WRITING);
        const challengeId = faker_1.faker.helpers.arrayElement([
            beginnerChallenge.id,
            intermediateChallenge.id,
            advancedChallenge.id,
        ]);
        let content;
        let options = null;
        let answer = null;
        if (type === 'sentence_maker') {
            content = [
                { type: 'image', id: faker_1.faker.string.uuid() },
                { type: 'image', id: faker_1.faker.string.uuid() },
            ];
        }
        else if (type === 'fast_test') {
            content = [faker_1.faker.lorem.word(), faker_1.faker.lorem.word()];
            options = [faker_1.faker.lorem.word(), faker_1.faker.lorem.word(), faker_1.faker.lorem.word(), faker_1.faker.lorem.word()];
            answer = options[0];
        }
        else if (type === 'tales') {
            content = [{ type: 'image', id: faker_1.faker.string.uuid() }];
        }
        allQuestions.push(prisma.question.create({
            data: {
                challengeId,
                stage,
                phase: `phase_4_${faker_1.faker.number.int({ min: 1, max: 3 })}`,
                position: i + 1,
                type,
                points: faker_1.faker.number.int({ min: 15, max: 25 }),
                timeLimit: faker_1.faker.number.int({ min: 120, max: 300 }),
                maxAttempts: faker_1.faker.number.int({ min: 1, max: 2 }),
                text: faker_1.faker.lorem.sentence(),
                instructions: faker_1.faker.lorem.sentence(),
                validationMethod: 'IA',
                content,
                options,
                answer,
            },
        }));
    }
    for (let i = 0; i < 15; i++) {
        const stage = 'SPEAKING';
        const type = faker_1.faker.helpers.arrayElement(questionTypes.SPEAKING);
        const challengeId = faker_1.faker.helpers.arrayElement([
            beginnerChallenge.id,
            intermediateChallenge.id,
            advancedChallenge.id,
        ]);
        let content;
        let configuration = null;
        if (type === 'superbrain') {
            content = faker_1.faker.lorem.sentence() + '?';
        }
        else if (type === 'tell_me_about_it') {
            content = faker_1.faker.lorem.words(3);
        }
        else if (type === 'debate') {
            content = faker_1.faker.lorem.words(2);
            configuration = { stanceOptions: ['support', 'oppose'] };
        }
        allQuestions.push(prisma.question.create({
            data: {
                challengeId,
                stage,
                phase: `phase_5_${faker_1.faker.number.int({ min: 1, max: 3 })}`,
                position: i + 1,
                type,
                points: faker_1.faker.number.int({ min: 18, max: 25 }),
                timeLimit: faker_1.faker.number.int({ min: 180, max: 360 }),
                maxAttempts: faker_1.faker.number.int({ min: 1, max: 2 }),
                text: faker_1.faker.lorem.sentence(),
                instructions: faker_1.faker.lorem.sentence(),
                validationMethod: 'IA',
                content,
                configurations: configuration,
            },
        }));
    }
    const createdQuestions = await Promise.all(allQuestions);
    console.log(`✅ Created ${createdQuestions.length} questions across all stages`);
    console.log('\n📊 Creating student answers...');
    const studentAnswers = [];
    const allStudents = [
        studentProfile1,
        studentProfile2,
        studentProfile3,
        studentProfile4,
    ];
    for (const student of allStudents) {
        const questionsToAnswer = faker_1.faker.helpers.arrayElements(createdQuestions, faker_1.faker.number.int({ min: 100, max: 150 }));
        for (const question of questionsToAnswer) {
            const attemptCount = faker_1.faker.number.int({ min: 1, max: 3 });
            for (let attempt = 1; attempt <= attemptCount; attempt++) {
                const isCorrect = faker_1.faker.datatype.boolean({ probability: attempt === attemptCount ? 0.65 : 0.35 });
                const timeSpent = faker_1.faker.number.int({ min: 15, max: question.timeLimit || 120 });
                const pointsEarned = isCorrect ? question.points : 0;
                let userAnswer;
                if (question.options) {
                    userAnswer = faker_1.faker.helpers.arrayElement(question.options);
                }
                else {
                    userAnswer = faker_1.faker.lorem.sentence();
                }
                const hasFeedback = faker_1.faker.datatype.boolean({ probability: 0.3 });
                studentAnswers.push(prisma.studentAnswer.create({
                    data: {
                        studentId: student.id,
                        questionId: question.id,
                        challengeId: question.challengeId,
                        userAnswer,
                        isCorrect,
                        attemptNumber: attempt,
                        timeSpent,
                        pointsEarned,
                        feedbackEnglish: hasFeedback ? faker_1.faker.lorem.sentence() : null,
                        feedbackSpanish: hasFeedback ? faker_1.faker.lorem.sentence() : null,
                        audioUrl: question.stage === 'SPEAKING' ? faker_1.faker.internet.url() : null,
                        answeredAt: faker_1.faker.date.recent({ days: 60 }),
                    },
                }));
            }
        }
    }
    const createdAnswers = await Promise.all(studentAnswers);
    console.log(`✅ Created ${createdAnswers.length} student answers`);
    console.log('\n📈 Creating question-school stats entries...');
    const questionSchoolStatsSet = new Set();
    const questionSchoolStats = [];
    for (const answer of createdAnswers) {
        const question = createdQuestions.find((q) => q.id === answer.questionId);
        if (!question)
            continue;
        const student = allStudents.find((s) => s.id === answer.studentId);
        if (!student || !student.schoolId)
            continue;
        const key = `${question.id}-${student.schoolId}`;
        if (!questionSchoolStatsSet.has(key)) {
            questionSchoolStatsSet.add(key);
            questionSchoolStats.push(prisma.questionSchoolStats.create({
                data: {
                    questionId: question.id,
                    schoolId: student.schoolId,
                },
            }));
        }
    }
    const createdStats = await Promise.all(questionSchoolStats);
    console.log(`✅ Created ${createdStats.length} question-school stats entries`);
    console.log('\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 SEED SUMMARY - OneEnglish Database');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🏫 SCHOOLS:          5 total');
    console.log('   ├─ Lincoln High School (New York)');
    console.log('   ├─ Jefferson Academy (Boston)');
    console.log('   ├─ Washington Institute (Chicago)');
    console.log('   └─ + 2 randomly generated schools');
    console.log('');
    console.log('👥 USERS & PROFILES:');
    console.log('   ├─ Admins:        2 profiles (global access)');
    console.log('   ├─ Coordinators:  3 profiles (1 per main school)');
    console.log('   ├─ Teachers:      3 profiles (2 Lincoln, 1 Jefferson)');
    console.log('   └─ Students:      4 profiles (distributed across schools)');
    console.log('   📊 Total Users:   12 (all with settings & activities)');
    console.log('');
    console.log('🎯 CHALLENGES:       3 (Beginner, Intermediate, Advanced)');
    console.log('   └─ Assigned to schools & students with progress tracking');
    console.log('');
    console.log('❓ QUESTIONS:        ' + createdQuestions.length + ' questions');
    console.log('   ├─ VOCABULARY:     30 questions');
    console.log('   ├─ GRAMMAR:        25 questions');
    console.log('   ├─ LISTENING:      20 questions');
    console.log('   ├─ WRITING:        15 questions');
    console.log('   └─ SPEAKING:       15 questions');
    console.log('');
    console.log('✅ STUDENT ANSWERS:  ' + createdAnswers.length + ' answers');
    console.log('   └─ Distributed across ' + allStudents.length + ' students with varied attempts');
    console.log('');
    console.log('📊 SCHOOL STATS:     ' + createdStats.length + ' question-school stat entries');
    console.log('');
    console.log('🔐 ROLES:            4 (admin, coordinator, teacher, student)');
    console.log('📋 PERMISSIONS:      5 with role assignments');
    console.log(`📱 ACTIVITIES:       ${userActivities.length} user activities generated`);
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔑 TEST CREDENTIALS (password: password123)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('👑 ADMINS (Global Access):');
    console.log('   ├─ admin@onenglish.com          / admin');
    console.log('   └─ admin2@onenglish.com         / admin2');
    console.log('');
    console.log('🎓 COORDINATORS (School Management):');
    console.log('   ├─ maria.rodriguez@lincolnhs.edu        / mariarodriguez  (Lincoln)');
    console.log('   ├─ john.wilson@jeffersonacademy.edu     / johnwilson      (Jefferson)');
    console.log('   └─ susan.chen@washingtoninstitute.edu   / susanchen       (Washington)');
    console.log('');
    console.log('👨‍🏫 TEACHERS (School-Restricted):');
    console.log('   ├─ jane.smith@lincolnhs.edu             / janesmith       (Lincoln)');
    console.log('   ├─ robert.brown@lincolnhs.edu           / robertbrown     (Lincoln)');
    console.log('   └─ emily.davis@jeffersonacademy.edu     / emilydavis      (Jefferson)');
    console.log('');
    console.log('🎒 STUDENTS (Learners):');
    console.log('   ├─ john.doe@lincolnhs.edu               / johndoe         (Lincoln)');
    console.log('   ├─ sarah.williams@lincolnhs.edu         / sarahwilliams   (Lincoln)');
    console.log('   ├─ michael.johnson@jeffersonacademy.edu / michaeljohnson  (Jefferson)');
    console.log('   └─ lisa.garcia@washingtoninstitute.edu  / lisagarcia      (Washington)');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('💡 TIP: Use these credentials to test different permission levels');
    console.log('📚 See docs/TEST_CREDENTIALS.md for detailed testing guide');
    console.log('🚀 API available at: http://localhost:3000');
    console.log('📖 Swagger docs at: http://localhost:3000/api');
    console.log('');
    return {
        schools: [
            schoolLincoln,
            schoolJefferson,
            schoolWashington,
            ...additionalSchools,
        ],
        admins: [adminProfile1, adminProfile2],
        coordinators: [
            coordinatorProfile1,
            coordinatorProfile2,
            coordinatorProfile3,
        ],
        teachers: [teacherProfile1, teacherProfile2, teacherProfile3],
        students: [
            studentProfile1,
            studentProfile2,
            studentProfile3,
            studentProfile4,
        ],
        challenges: [beginnerChallenge, intermediateChallenge, advancedChallenge],
        totalActivities: userActivities.length,
        questions: createdQuestions,
        totalQuestions: createdQuestions.length,
        answers: createdAnswers,
        totalAnswers: createdAnswers.length,
        questionSchoolStats: createdStats,
        totalQuestionSchoolStats: createdStats.length,
    };
}
main()
    .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map