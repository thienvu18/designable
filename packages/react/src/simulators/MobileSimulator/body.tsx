import { observer } from '@formily/reactive-react'
import React from 'react'
import { usePrefix, useScreen, useTheme } from '../../hooks'

const localMockup =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="946" height="946"%3E%3Crect width="946" height="946" rx="60" fill="%23f5f5f5"/%3E%3C/svg%3E'

const MockupImages = {
  dark: [localMockup, localMockup],
  light: [localMockup, localMockup],
}

export const MobileBody: React.FC<React.PropsWithChildren> = observer(
  (props) => {
    const screen = useScreen()
    const theme = useTheme()
    const prefix = usePrefix('mobile-simulator-body')
    const getContentStyles = (): React.CSSProperties => {
      if (screen.flip) {
        return {
          position: 'absolute',
          width: 736,
          height: 414,
          top: 43.3333,
          left: 106.667,
          overflow: 'hidden',
        }
      }
      return {
        position: 'absolute',
        width: 414,
        height: 736,
        top: 126.667,
        left: 23.3333,
        overflow: 'hidden',
      }
    }

    return (
      <div
        className={prefix}
        style={{
          alignItems: screen.flip ? 'center' : '',
          minWidth: screen.flip ? 1000 : 0,
        }}
      >
        <div
          className={prefix + '-wrapper'}
          style={{
            position: 'relative',
            minHeight: screen.flip ? 0 : 1000,
          }}
        >
          <img
            alt=""
            src={screen.flip ? MockupImages[theme][0] : MockupImages[theme][1]}
            style={{
              display: 'block',
              margin: '20px 0',
              width: screen.flip ? 946.667 : 460,
              height: screen.flip ? 460 : 946.667,
              boxShadow: '0 0 20px #0000004d',
              borderRadius: 60,
              backfaceVisibility: 'hidden',
            }}
          />
          <div className={prefix + '-content'} style={getContentStyles()}>
            {props.children}
          </div>
        </div>
      </div>
    )
  }
)
