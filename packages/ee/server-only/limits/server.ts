import { DateTime } from 'luxon';

import { prisma } from '@documenso/prisma';
import { DocumentSource, SubscriptionStatus, SubscriptionType } from '@documenso/prisma/client';

import {
  BASIC_PLAN_LIMITS,
  FREE_PLAN_LIMITS,
  PROFESSIONAL_PLAN_LIMITS,
  SELFHOSTED_PLAN_LIMITS,
  TEAM_PLAN_LIMITS,
} from './constants';
import { ERROR_CODES } from './errors';
import type { TLimitsResponseSchema } from './schema';

export type GetServerLimitsOptions = {
  email?: string | null;
  teamId?: number | null;
};

export const getServerLimits = async ({
  email,
  teamId,
}: GetServerLimitsOptions): Promise<TLimitsResponseSchema> => {
  // if (!IS_BILLING_ENABLED()) {
  //   return {
  //     quota: SELFHOSTED_PLAN_LIMITS,
  //     remaining: SELFHOSTED_PLAN_LIMITS,
  //   };
  // }

  if (!email) {
    throw new Error(ERROR_CODES.UNAUTHORIZED);
  }

  return teamId ? handleTeamLimits({ email, teamId }) : handleUserLimits({ email });
};

type HandleUserLimitsOptions = {
  email: string;
};

const handleUserLimits = async ({ email }: HandleUserLimitsOptions) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    include: {
      Subscription: true,
    },
  });

  if (!user) {
    throw new Error(ERROR_CODES.USER_FETCH_FAILED);
  }

  let quota = structuredClone(FREE_PLAN_LIMITS);
  let remaining = structuredClone(FREE_PLAN_LIMITS);

  const activeSubscriptions = user.Subscription.filter(
    ({ status }) => status === SubscriptionStatus.ACTIVE,
  );

  if (activeSubscriptions.length > 0) {
    // const documentPlanPrices = await getDocumentRelatedPrices();
    const subscription = activeSubscriptions[0];
    // for (const subscription of activeSubscriptions) {
    // const price = documentPlanPrices.find((price) => price.id === subscription.priceId);

    // if (!price || typeof price.product === 'string' || price.product.deleted) {
    //   continue;
    // }

    // const currentQuota = ZLimitsSchema.parse(
    //   'metadata' in price.product ? price.product.metadata : {},
    // );

    // Use the subscription with the highest quota.
    // if (currentQuota.documents > quota.documents && currentQuota.recipients > quota.recipients) {
    if (subscription.type === SubscriptionType.ENTERPRISE) {
      quota = structuredClone(SELFHOSTED_PLAN_LIMITS);
      remaining = structuredClone(SELFHOSTED_PLAN_LIMITS);
      // return {
      //   quota,
      //   remaining,
      // };
    }
    if (subscription.type === SubscriptionType.BASIC) {
      quota = structuredClone(BASIC_PLAN_LIMITS);
      remaining = structuredClone(BASIC_PLAN_LIMITS);
      // return {
      //   quota,
      //   remaining,
      // };
    }
    if (subscription.type === SubscriptionType.PROFESSIONAL) {
      quota = structuredClone(PROFESSIONAL_PLAN_LIMITS);
      remaining = structuredClone(PROFESSIONAL_PLAN_LIMITS);
      // return {
      //   quota,
      //   remaining,
      // };
    }

    // }

    // Assume all active subscriptions provide unlimited direct templates.
  } else {
    return {
      quota: {
        documents: 0,
        recipients: 0,
        directTemplates: 0,
      },
      remaining: {
        documents: 0,
        recipients: 0,
        directTemplates: 0,
      },
    };
  }

  const [documents, directTemplates] = await Promise.all([
    prisma.document.count({
      where: {
        userId: user.id,
        teamId: null,
        createdAt: {
          gte: DateTime.utc().startOf('month').toJSDate(),
        },
        source: {
          not: DocumentSource.TEMPLATE_DIRECT_LINK,
        },
      },
    }),
    prisma.template.count({
      where: {
        userId: user.id,
      },
    }),
  ]);

  remaining.documents = Math.max(remaining.documents - documents, 0);
  remaining.directTemplates = Math.max(remaining.directTemplates - directTemplates, 0);

  return {
    quota,
    remaining,
  };
};

type HandleTeamLimitsOptions = {
  email: string;
  teamId: number;
};

const handleTeamLimits = async ({ email, teamId }: HandleTeamLimitsOptions) => {
  const team = await prisma.team.findFirst({
    where: {
      id: teamId,
      members: {
        some: {
          user: {
            email,
          },
        },
      },
    },
    include: {
      subscription: true,
    },
  });

  if (!team) {
    throw new Error('Team not found');
  }

  const { subscription } = team;

  if (subscription && subscription.status === SubscriptionStatus.INACTIVE) {
    return {
      quota: {
        documents: 0,
        recipients: 0,
        directTemplates: 0,
      },
      remaining: {
        documents: 0,
        recipients: 0,
        directTemplates: 0,
      },
    };
  }

  return {
    quota: structuredClone(TEAM_PLAN_LIMITS),
    remaining: structuredClone(TEAM_PLAN_LIMITS),
  };
};
