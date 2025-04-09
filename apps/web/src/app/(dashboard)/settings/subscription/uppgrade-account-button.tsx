'use client';

import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { trpc } from '@documenso/trpc/react';
import { Button } from '@documenso/ui/primitives/button';
import { useToast } from '@documenso/ui/primitives/use-toast';

export const UpgradeAccountButton = () => {
  const { _ } = useLingui();
  const { toast } = useToast();

  const {
    mutateAsync: sendUpgradeAccountMail,
    isLoading,
    isSuccess,
  } = trpc.profile.sendUpgradeAccountMail.useMutation({
    onSuccess: () => {
      toast({
        title: _(msg`Success`),
        description: _(msg`Notification sent successfully`),
        duration: 5000,
      });
    },
    onError: () => {
      toast({
        title: _(msg`Something went wrong`),
        description: _(msg`Unable to send notification time.`),
        variant: 'destructive',
        duration: 10000,
      });
    },
  });

  return (
    <Button
      onClick={async () => sendUpgradeAccountMail()}
      loading={isLoading}
      disabled={isLoading || isSuccess}
      className="self-start"
    >
      <Trans>Notify SignDoc about account upgrade</Trans>
    </Button>
  );
};
