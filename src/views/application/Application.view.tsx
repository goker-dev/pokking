import { useTranslation } from 'react-i18next';

import { ErrorBoundary } from '@/components';
import { useEffect, useRef } from 'react';
// import { Application } from './Application.lib.ts';
import { Game } from './Game.class.ts';
import { Animator } from './Animator.lib.ts';
export { ErrorBoundary };

const game = new Game();
export function Component() {
  const { t } = useTranslation();
  const container = useRef<HTMLDivElement>(null);
  // const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!container.current) return;
    game.init(
      container.current,
      container.current?.clientWidth || innerWidth,
      container.current?.clientHeight || innerHeight,
    );
    Animator(12, function () {
      game?.update();
    });
  }, []);

  // const handleSave = () => {
  //   setLoading(true);
  //   app?.exportImage(() => setLoading(false));
  // };

  return (
    <div className='w-full flex flex-col items-stretch'>
      <div className='grow-0 bg-gray-200 dark:bg-zinc-800/50  px-4 text-sm'>
        <span className='text-gray-400 mr-4'>{t('TOOL BOX:')}</span>
        {/*<button onClick={handleSave} className={''}>*/}
        {/*  {loading && <i className='icon-spin animate-spin' />}*/}
        {/*  {t('IMAGE EXPORT')}*/}
        {/*</button>*/}
        <object id='#board' type='image/svg+xml' data='/images/board.svg' height='10' />
      </div>
      <div
        ref={container}
        className='grow p-4 w-full flex items-center justify-center overflow-hidden'
      />
    </div>
  );
}
Component.displayName = 'Application.view';
