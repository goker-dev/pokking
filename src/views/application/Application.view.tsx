import { Trans, useTranslation } from 'react-i18next';

import { ErrorBoundary } from '@/components';
import { useEffect, useRef } from 'react';
import { Game } from './Game.class.ts';
export { ErrorBoundary };

const game = new Game();
export function Component() {
  const { t } = useTranslation();
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    game.init(
      container.current,
      container.current?.clientWidth || innerWidth,
      container.current?.clientHeight || innerHeight,
    );
    game.loop(0);
    // Animator(24, function () {
    //   console.log('x');
    //   return game?.update();
    // });
    return () => {
      game.uninstall();
    };
  }, []);

  return (
    <div className='w-full flex flex-col items-stretch'>
      <div className='grow-0 bg-gray-200 dark:bg-zinc-800/50  px-4 text-sm'>
        <span className='text-gray-400 mr-4'>{t('TOOL BOX:')}</span>
        {/*<object id='#board' type='image/svg+xml' data='/images/board.svg' height='30' />*/}
      </div>
      <div
        ref={container}
        className='relative grow p-4 w-full flex items-center justify-center overflow-hidden'
      >
        <div className='absolute w-[200px] top-4 right-0 font-display space-y-2 '>
          <div className='space-x-2'>
            <span>
              <Trans
                i18nKey='ALIENS: <s> 5678 </s>'
                components={{
                  s: <span id='aliens' />,
                }}
              />
            </span>
            <span>
              <Trans
                i18nKey='EGGS: <s> 0 </s>'
                components={{
                  s: <span id='eggs' />,
                }}
              />
            </span>
          </div>
          <div className='space-x-2'>
            <span>
              <Trans
                i18nKey='HUMANS: <s> 7600000000 </s>'
                components={{
                  s: <span id='humans' />,
                }}
              />
            </span>
            <span>
              <Trans
                i18nKey='JOURNEY: <s> 1234 </s>'
                components={{
                  s: <span id='journey' />,
                }}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
Component.displayName = 'Application.view';
