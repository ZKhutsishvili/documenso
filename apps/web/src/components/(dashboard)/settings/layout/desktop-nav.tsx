'use client';

import type { HTMLAttributes } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Trans } from '@lingui/macro';
import { Braces, CreditCard, Globe2Icon, Lock, User, Users, Webhook } from 'lucide-react';

import { useFeatureFlags } from '@documenso/lib/client-only/providers/feature-flag';
import { cn } from '@documenso/ui/lib/utils';
import { Button } from '@documenso/ui/primitives/button';

export type DesktopNavProps = HTMLAttributes<HTMLDivElement>;

export const DesktopNav = ({ className, ...props }: DesktopNavProps) => {
  const pathname = usePathname();

  const { getFlag } = useFeatureFlags();

  const isBillingEnabled = getFlag('app_billing');
  const isPublicProfileEnabled = getFlag('app_public_profile');

  return (
    <div className={cn('flex flex-col gap-y-2', className)} {...props}>
      <Link href="/settings/profile">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname?.startsWith('/settings/profile') && 'bg-secondary',
          )}
        >
          <User className="mr-2 h-5 w-5" />
          <Trans>Profile</Trans>
        </Button>
      </Link>

      {isPublicProfileEnabled && (
        <Link href="/settings/public-profile">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start',
              pathname?.startsWith('/settings/public-profile') && 'bg-secondary',
            )}
          >
            <Globe2Icon className="mr-2 h-5 w-5" />
            <Trans>Public Profile</Trans>
          </Button>
        </Link>
      )}

      <Link href="/settings/teams">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname?.startsWith('/settings/teams') && 'bg-secondary',
          )}
        >
          <Users className="mr-2 h-5 w-5" />
          <Trans>Teams</Trans>
        </Button>
      </Link>

      <Link href="/settings/security">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname?.startsWith('/settings/security') && 'bg-secondary',
          )}
        >
          <Lock className="mr-2 h-5 w-5" />
          <Trans>Security</Trans>
        </Button>
      </Link>

      <Link href="/settings/tokens">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname?.startsWith('/settings/tokens') && 'bg-secondary',
          )}
        >
          <Braces className="mr-2 h-5 w-5" />
          <Trans>API Tokens</Trans>
        </Button>
      </Link>

      <Link href="/settings/webhooks">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname?.startsWith('/settings/webhooks') && 'bg-secondary',
          )}
        >
          <Webhook className="mr-2 h-5 w-5" />
          <Trans>Webhooks</Trans>
        </Button>
      </Link>

      {isBillingEnabled && (
        <Link href="/settings/billing">
          <Button
            variant="ghost"
            className={cn(
              'w-full justify-start',
              pathname?.startsWith('/settings/billing') && 'bg-secondary',
            )}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            <Trans>Billing</Trans>
          </Button>
        </Link>
      )}

      <Link href="/settings/subscription">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            pathname?.startsWith('/settings/subscription') && 'bg-secondary',
          )}
        >
          <CreditCard className="mr-2 h-5 w-5" />
          <Trans>Subscription</Trans>
        </Button>
      </Link>
    </div>
  );
};
