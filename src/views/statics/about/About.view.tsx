import { useTranslation } from 'react-i18next';

import { Divider, ErrorBoundary } from '@/components';
export { ErrorBoundary };
export function Component() {
  const { t } = useTranslation();
  return (
    <div className='py-8 px-4 w-full xl:container xl:px-0 mx-auto'>
      <Divider align='left'>
        <h1 className='text-lg font-semibold uppercase'>{t('About Us')}</h1>
      </Divider>
      <div className='flex flex-col my-8 space-y-2'>
        <p>
          {t(
            'Hi, I`m goker. I`m was a student in Graphic Design Department in Trakya University and this is my graduation project.',
          )}
        </p>
        <p>
          {t(
            'POKKING the game is a very simple 2D video game that is like "Super Mario". I`m still developing the game and the game engine at the same time. So, be patient I`ll fix all bugs.',
          )}
        </p>
        <h2 className='mt-8 text-lg font-semibold'>{t('Story')}</h2>
        <p>
          {t(
            'In the year 2020, Aliens conquered our world and stop energy production for a clean world. But, the consumption society start to die from starving. Finally, real heroes started to fight to take control.',
          )}
        </p>
      </div>
    </div>
  );
}
