import { msg } from '@lingui/macro';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { Body, Container, Head, Html, Img, Preview, Section } from '../components';
import { TemplateFooter } from '../template-components/template-footer';

export const UpgradeAccountTemplate = ({
  userId,
  userEmail,
  assetBaseUrl = 'http://localhost:3002',
}: {
  userId: number;
  userEmail: string;
  assetBaseUrl?: string;
}) => {
  const { _ } = useLingui();

  const previewText = msg`Account upgrade requested by ${userEmail}`;

  const getAssetUrl = (path: string) => {
    return new URL(path, assetBaseUrl).toString();
  };

  return (
    <Html>
      <Head />
      <Preview>{_(previewText)}</Preview>
      <Body className="mx-auto my-auto bg-white font-sans">
        <Section>
          <Container className="mx-auto mb-2 mt-8 max-w-xl rounded-lg border border-solid border-slate-200 p-4 backdrop-blur-sm">
            <Section>
              <Img
                src={getAssetUrl('/static/logo.png')}
                alt="Documenso Logo"
                className="mb-4 h-6"
              />

              <Trans>
                User with (userId: {userId}, email: {userEmail}) requested upgrade
              </Trans>
            </Section>
          </Container>
          <div className="mx-auto mt-12 max-w-xl" />

          <Container className="mx-auto max-w-xl">
            <TemplateFooter isDocument={false} />
          </Container>
        </Section>
      </Body>
    </Html>
  );
};

export default UpgradeAccountTemplate;
