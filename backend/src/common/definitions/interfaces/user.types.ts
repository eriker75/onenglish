import { Prisma } from '@prisma/client';

export type User = {
  id: string;
  email: string;
  username: string | null;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isVerified: boolean;
  roles: string;
};

export type UserWithRoles = Prisma.UserGetPayload<{
  include: {
    roles: {
      include: {
        role: true;
      };
    };
  };
}>;


