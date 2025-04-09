import type { Metadata } from 'next';

import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { setupI18nSSR } from '@documenso/lib/client-only/providers/i18n.server';
import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-component-session';

import { SettingsHeader } from '~/components/(dashboard)/settings/layout/header';

import { UpgradeAccountButton } from './uppgrade-account-button';

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
    <div className="flex flex-col gap-5">
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
      <div className="flex justify-between">
        <div className="w-full">
          <SettingsHeader title={_(msg`Payment`)} subtitle={_(msg`Bank accounts.`)} />
          {subscription && (
            <>
              <p className="my-3 text-lg">{_(msg`Bank Accounts`)}</p>
              <p>TBC: TB1292802374023409234</p>
              <p>BOG: GE1292802374023409234</p>
            </>
          )}
        </div>

        <div className="w-full">
          <SettingsHeader
            title={_(msg`Available plans`)}
            subtitle={_(msg`Here you can see plans and prices.`)}
          />
          {subscription && (
            <>
              <p className="my-3 text-lg">{_(msg`Prices`)}</p>
              <p>{_(msg`Free: £0/month`)}</p>
              <p>{_(msg`Basic: £49/month`)}</p>
              <p>{_(msg`Professional: £119/month`)}</p>
              <p>{_(msg`Enterprise: £799/month`)}</p>
            </>
          )}
        </div>
      </div>
      <p>
        {_(msg`For more information go to`)}{' '}
        <a
          target="_blank"
          href="https://signdoc.com/plans"
          className="text-blue-800 hover:underline"
        >
          the link
        </a>
      </p>
      <hr className="my-4" />

      <UpgradeAccountButton />
    </div>
  );
}
