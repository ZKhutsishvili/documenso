'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Trans, msg } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';

import { SubscriptionStatus, SubscriptionType } from '@documenso/prisma/client';
import { trpc } from '@documenso/trpc/react';
import { ZAdminUpdateProfileMutationSchema } from '@documenso/trpc/server/admin-router/schema';
import { Button } from '@documenso/ui/primitives/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@documenso/ui/primitives/form/form';
import { Input } from '@documenso/ui/primitives/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@documenso/ui/primitives/select';
import { useToast } from '@documenso/ui/primitives/use-toast';

import { DeleteUserDialog } from './delete-user-dialog';
import { MultiSelectRoleCombobox } from './multiselect-role-combobox';

const ZUserFormSchema = ZAdminUpdateProfileMutationSchema.omit({ id: true });

type TUserFormSchema = z.infer<typeof ZUserFormSchema>;

export default function UserPage({ params }: { params: { id: number } }) {
  const { _ } = useLingui();
  const { toast } = useToast();

  const router = useRouter();

  const { data: user } = trpc.profile.getUser.useQuery(
    {
      id: Number(params.id),
    },
    {
      enabled: !!params.id,
    },
  );

  const roles = user?.roles ?? [];
  const [type, setType] = useState<SubscriptionType | undefined>();
  const [status, setStatus] = useState<SubscriptionStatus | undefined>();

  useEffect(() => {
    if (user?.Subscription[0]) {
      setStatus(user?.Subscription[0] ? user?.Subscription[0].status : SubscriptionStatus.INACTIVE);
      setType(user?.Subscription[0] ? user?.Subscription[0].type : SubscriptionType.FREE);
    }
  }, [user]);

  const types = [SubscriptionType.FREE, SubscriptionType.BASIC, SubscriptionType.ENTERPRISE];
  const statuses = [
    SubscriptionStatus.ACTIVE,
    SubscriptionStatus.INACTIVE,
    SubscriptionStatus.PAST_DUE,
  ];

  const { mutateAsync: updateUserMutation } = trpc.admin.updateUser.useMutation();
  const { mutateAsync: updateSubscriptionMutation } = trpc.admin.updateSubscription.useMutation();

  const form = useForm<TUserFormSchema>({
    resolver: zodResolver(ZUserFormSchema),
    values: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      roles: user?.roles ?? [],
    },
  });

  const onSubmit = async ({ name, email, roles }: TUserFormSchema) => {
    try {
      if (user?.Subscription[0]) {
        await updateSubscriptionMutation({
          id: Number(user?.Subscription[0].id),
          type: type || SubscriptionType.FREE,
          status: status || SubscriptionStatus.INACTIVE,
        });
      }
      await updateUserMutation({
        id: Number(user?.id),
        name,
        email,
        roles,
      });

      router.refresh();

      toast({
        title: _(msg`Profile updated`),
        description: _(msg`Your profile has been updated.`),
        duration: 5000,
      });
    } catch (e) {
      toast({
        title: _(msg`Error`),
        description: _(msg`An error occurred while updating your profile.`),
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-semibold">
        <Trans>Manage {user?.name}'s profile</Trans>
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <fieldset className="mt-6 flex w-full flex-col gap-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    <Trans>Name</Trans>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    <Trans>Email</Trans>
                  </FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="roles"
              render={({ field: { onChange } }) => (
                <FormItem>
                  <fieldset className="flex flex-col gap-2">
                    <FormLabel className="text-muted-foreground">
                      <Trans>Roles</Trans>
                    </FormLabel>
                    <FormControl>
                      <MultiSelectRoleCombobox
                        listValues={roles}
                        onChange={(values: string[]) => onChange(values)}
                      />
                    </FormControl>
                    <FormMessage />
                  </fieldset>
                </FormItem>
              )}
            />
            {type && (
              <>
                <FormLabel className="text-muted-foreground">
                  <Trans>Change Subscription</Trans>
                </FormLabel>
                <Select
                  defaultValue={type}
                  onValueChange={(value: SubscriptionType) => setType(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={_(msg`Select a team`)} />
                  </SelectTrigger>
                  <SelectContent>
                    {types?.map((elem) => (
                      <SelectItem key={elem} value={elem}>
                        <div className="flex items-center gap-4">
                          <span>{elem}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            {status && (
              <>
                <FormLabel className="text-muted-foreground">
                  <Trans>Change Subscription Status</Trans>
                </FormLabel>
                <Select
                  defaultValue={status}
                  onValueChange={(value: SubscriptionStatus) => setStatus(value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={_(msg`Select a team`)} />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses?.map((elem) => (
                      <SelectItem key={elem} value={elem}>
                        <div className="flex items-center gap-4">
                          <span>{elem}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            <div className="mt-4">
              <Button type="submit" loading={form.formState.isSubmitting}>
                <Trans>Update user</Trans>
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>

      <hr className="my-4" />

      {user && <DeleteUserDialog user={user} />}
    </div>
  );
}
