import { useTranslation } from 'react-i18next';

import { Divider, ErrorBoundary } from '@/components';
import { Link } from 'react-router-dom';
export { ErrorBoundary };
export function Component() {
  const { t } = useTranslation();

  return (
    <div className='py-8 px-4 w-full xl:container xl:px-0 mx-auto'>
      <Divider align='left'>
        <h1 className='text-lg font-semibold uppercase'>{t('Cookie Policy')}</h1>
      </Divider>
      <div className='flex flex-col my-8 space-y-2'>
        <p>
          {t(
            'We may use your information – collected through cookies and similar technologies - to improve your experience on our site, analyze how you use it and assist in our marketing efforts. We will handle your personal information in line with our',
          )}
          <Link
            to='/privacy'
            aria-label={t('More information about your privacy')}
            className='font-semibold mx-2'
          >
            {t('Privacy Policy')}
          </Link>
        </p>
      </div>
    </div>
  );
}
