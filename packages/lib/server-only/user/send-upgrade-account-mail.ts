'use server';

import { prisma } from '@documenso/prisma';
import { SubscriptionStatus } from '@documenso/prisma/client';

export type SendUpgradeAccountMailByUserIdOptions = {
  userId: number;
};

export const sendUpgradeAccountMail = async ({ userId }: SendUpgradeAccountMailByUserIdOptions) => {
  return await prisma.subscription.findMany({
    where: {
      userId,
      status: {
        not: SubscriptionStatus.INACTIVE,
      },
    },
  });
};
