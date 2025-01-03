import { prisma } from '@documenso/prisma';
import type { User } from '@documenso/prisma/client';

export type UserCanSendDocumentOptions = {
  user: User;
};

export const userCanSendDocument = async ({ user }: UserCanSendDocumentOptions) => {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const endOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  );

  const count = await prisma.document.count({
    where: {
      userId: user.id,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
  });

  return count < 5;
};
