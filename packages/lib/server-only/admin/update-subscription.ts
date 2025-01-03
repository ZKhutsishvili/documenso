import { prisma } from '@documenso/prisma';
import type { SubscriptionStatus, SubscriptionType } from '@documenso/prisma/client';

export type UpdateSubscriptionOptions = {
  id: number;
  status: SubscriptionStatus | undefined;
  type: SubscriptionType | undefined;
};

export const updateSubscription = async ({ id, type, status }: UpdateSubscriptionOptions) => {
  await prisma.subscription.findFirstOrThrow({
    where: {
      id,
    },
  });

  return await prisma.subscription.update({
    where: {
      id,
    },
    data: {
      status,
      type,
    },
  });
};
