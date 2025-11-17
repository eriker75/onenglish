import { Test, TestingModule } from '@nestjs/testing';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../auth/guards/role.guard';

describe('ChallengesController', () => {
  let controller: ChallengesController;

  const mockChallengesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [NestjsFormDataModule.config({ isGlobal: true })],
      controllers: [ChallengesController],
      providers: [
        {
          provide: ChallengesService,
          useValue: mockChallengesService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(UserRoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ChallengesController>(ChallengesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
