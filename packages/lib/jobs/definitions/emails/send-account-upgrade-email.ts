import { createElement } from 'react';

import { z } from 'zod';

import { mailer } from '@documenso/email/mailer';
import UpgradeAccountTemplate from '@documenso/email/templates/upgrade-account';
import { prisma } from '@documenso/prisma';

import { renderCustomEmailTemplate } from '../../../utils/render-custom-email-template';
import { renderEmailWithI18N } from '../../../utils/render-email-with-i18n';
import type { JobDefinition } from '../../client/_internal/job';

const SEND_ACCOUNT_UPGRADE_EMAIL_JOB_DEFINITION_ID = 'send.account.uppgrade.email';

const SEND_ACCOUNT_UPGRADE_EMAIL_JOB_DEFINITION_SCHEMA = z.object({
  userId: z.number(),
});

export const SEND_ACCOUNT_UPGRADE_EMAIL_JOB_DEFINITION = {
  id: SEND_ACCOUNT_UPGRADE_EMAIL_JOB_DEFINITION_ID,
  name: 'Send Account Upgrade Email',
  version: '1.0.0',
  trigger: {
    name: SEND_ACCOUNT_UPGRADE_EMAIL_JOB_DEFINITION_ID,
    schema: SEND_ACCOUNT_UPGRADE_EMAIL_JOB_DEFINITION_SCHEMA,
  },

  handler: async ({ payload, io }) => {
    const { userId } = payload;
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
    });

    const template = createElement(UpgradeAccountTemplate, {
      userId: user.id,
      userEmail: user.email,
    });

    await io.runTask('send-signing-email', async () => {
      const [html, text] = await Promise.all([
        renderEmailWithI18N(template, { lang: 'en' }),
        renderEmailWithI18N(template, {
          lang: 'en',
          plainText: true,
        }),
      ]);
      await mailer.sendMail({
        to: {
          name: 'Team',
          address: 'info@signdoc.com',
        },
        from: {
          name: 'Team',
          address: 'info@signdoc.com',
        },
        subject: renderCustomEmailTemplate(`Upgrade account ${user.email}`, {}),
        html,
        text,
      });
    });
  },
} as const satisfies JobDefinition<
  typeof SEND_ACCOUNT_UPGRADE_EMAIL_JOB_DEFINITION_ID,
  z.infer<typeof SEND_ACCOUNT_UPGRADE_EMAIL_JOB_DEFINITION_SCHEMA>
>;
