import { css } from '@emotion/react';
import { useButton } from '@react-aria/button';
import { AriaButtonProps } from '@react-types/button';
import { PressEvent } from '@react-types/shared';
import React, { ReactNode, useRef } from 'react';
import { useTheme } from '../hooks';

export interface ButtonProps
  extends Pick<AriaButtonProps<'button'>, 'isDisabled' | 'onPress'> {
  isDisabled?: boolean;
  label: ReactNode;
  onPress: (e: PressEvent) => void;
  type?: 'primary' | 'secondary' | 'icon';
}

const Button: React.FC<ButtonProps> = ({
  isDisabled,
  label,
  type = 'primary',
  onPress,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton({ isDisabled, onPress }, ref);
  const { color, fontStyle, fontSize } = useTheme();

  function handleMouseLeave() {
    if (ref.current) {
      ref.current.blur();
    }
  }

  return (
    <>
      {type === 'primary' && (
        <button
          css={css`
            font-family: ${fontStyle.title};
            font-size: ${fontSize.h5};
            background-color: ${color.primary[500]};
            color: ${color.primary[100]};
            border: none;
            border-radius: 50px;
            height: 48px;
            width: 274px;
            &:hover:not(:disabled),
            &:focus:not(:disabled) {
              margin-top: -4px;
              filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
              outline: none;
            }
            &:active {
              margin-top: 0px;
              filter: none;
              box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
            }
            &:disabled {
              background-color: ${color.primary[200]};
            }
          `}
          onMouseLeave={handleMouseLeave}
          {...buttonProps}
          ref={ref}
        >
          {label}
        </button>
      )}
      {type === 'secondary' && (
        <button
          css={css`
            font-family: ${fontStyle.title};
            font-size: ${fontSize.h5};
            border: none;
            color: ${color.primary[500]};
            background-color: transparent;
            &:hover:not(:disabled),
            &:focus:not(:disabled),
            &:active {
              color: ${color.primary[600]};
              outline: none;
            }
            &:disabled {
              color: ${color.primary[200]};
            }
          `}
          onMouseLeave={handleMouseLeave}
          {...buttonProps}
          ref={ref}
        >
          {label}
        </button>
      )}
      {type === 'icon' && (
        <button
          css={css`
            border-radius: 50%;
            border: 5px solid ${color.primary[500]};
            background-color: ${color.primary[100]};
            height: 48px;
            width: 48px;
            &:hover:not(:disabled),
            &:focus:not(:disabled),
            &:active {
              border-color: ${color.primary[600]};
              outline: none;
            }
            &:disabled {
              border-color: ${color.primary[200]};
            }
          `}
          onMouseLeave={handleMouseLeave}
          {...buttonProps}
          ref={ref}
        >
          {label}
        </button>
      )}
    </>
  );
};

export default Button;
