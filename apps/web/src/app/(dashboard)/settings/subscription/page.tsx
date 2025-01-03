import type { Metadata } from 'next';

import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { setupI18nSSR } from '@documenso/lib/client-only/providers/i18n.server';
import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-component-session';

import { SettingsHeader } from '~/components/(dashboard)/settings/layout/header';

export const metadata: Metadata = {
  title: 'Profile',
};

const SubscriptionPlanCard = ({
  type,
  price,
  otherRows,
}: {
  type: string;
  price: string;
  otherRows: string[];
}) => {
  return (
    <div className="flex flex-col rounded-xl border border-solid border-gray-500 px-6 py-3">
      <p></p>
    </div>
  );
};

const SingleCurrentPlanColumn = ({ header, value }: { header?: string; value?: string }) => {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <Trans>{header}</Trans>
      </div>
      <div>
        <Trans>{value}</Trans>
      </div>
    </div>
  );
};

export default async function ProfileSettingsPage() {
  await setupI18nSSR();

  const { _ } = useLingui();
  const { user } = await getRequiredServerComponentSession();

  const subscription = user.Subscription && user.Subscription[0];

  return (
    <div>
      <SettingsHeader
        title={_(msg`Subscription`)}
        subtitle={_(msg`Here you can see subscription details.`)}
      />
      {subscription && (
        <>
          <p className="my-3 text-lg">{_(msg`Current plan: ${_(msg`${subscription.type}`)}`)}</p>
          <div className="flex justify-between rounded-xl border border-solid border-gray-500 px-6 py-3">
            <SingleCurrentPlanColumn header="Status" value={subscription.status} />
            <SingleCurrentPlanColumn
              header="Created At"
              value={subscription.createdAt.toLocaleDateString()}
            />
            <SingleCurrentPlanColumn
              header="Ends On"
              value={subscription.periodEnd?.toLocaleDateString()}
            />
            <SingleCurrentPlanColumn header="Type" value={subscription.type} />
          </div>
        </>
      )}

      <hr className="my-4" />
    </div>
  );
}
