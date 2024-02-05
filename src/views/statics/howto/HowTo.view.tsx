import { useTranslation } from 'react-i18next';

import { Divider, ErrorBoundary } from '@/components';
export { ErrorBoundary };
export function Component() {
  const { t } = useTranslation();

  return (
    <div className='py-8 px-4 w-full xl:container xl:px-0 mx-auto'>
      <Divider align='left'>
        <h1 className='text-lg font-semibold uppercase'>{t('How To?')}</h1>
      </Divider>
      <div className='flex items-center justify-center my-8 pb-8'>
        <iframe
          width='560'
          height='315'
          src='https://www.youtube.com/embed/C0X046jEIuI?si=h8Y7HVjmg1Iq1lsq'
          title='YouTube video player'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
          allowFullScreen
        />
      </div>
    </div>
  );
}
