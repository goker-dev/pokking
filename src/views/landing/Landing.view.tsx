import { useTranslation } from 'react-i18next';
import { ErrorBoundary } from '@/components';
import { Link } from 'react-router-dom';
export { ErrorBoundary };
import image from './pokking-save-the-world.svg';
export function Component() {
  const { t } = useTranslation();
  return (
    <div className='p-4 w-full xl:container xl:px-0 mx-auto flex lg:flex-row flex-col items-stretch'>
      <div className='grow flex items-center justify-center'>
        <img src={image} alt='pokking save the world' className='w-full' />
      </div>
      {/*<h1 className='font-bold text-[11.9vw] leading-[.92em] dark:text-amber-50'>{t('POKKING')}</h1>*/}
      <div className='flex items-center lg:ml-8 w-[300px] min-w-[300px]'>
        <div className='lg:mt-0 mt-4'>
          <h2 className='font-semibold text-xl mb-4'>{t('POKKING')}</h2>
          <div className='font-light text-lg'>
            <p>POKKING is an HTML5 Canvas Game</p>
            <p className='font-semibold italic'>Real heros never dies!</p>
          </div>
          <div className='mt-8 lg:text-left text-center'>
            <Link to='/app' className='button button-red w-full'>
              {t('PLAY')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
Component.displayName = 'Landing.view';
