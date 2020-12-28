import { css } from '@emotion/react';
import { useButton } from '@react-aria/button';
import { AriaButtonProps } from '@react-types/button';
import { PressEvent } from '@react-types/shared';
import React, { HTMLProps, useRef } from 'react';
import { useTheme } from '../hooks';

export interface ButtonProps
  extends Pick<AriaButtonProps<'button'>, 'onPress'>, Pick<HTMLProps<HTMLButtonElement>, "disabled"> {
  disabled?: boolean;
  label: string;
  onPress: (e: PressEvent) => void;
  type?: 'primary' | 'secondary' | 'icon';
}

const Button: React.FC<ButtonProps> = ({
  disabled,
  label,
  type = 'primary',
  onPress,
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton({ isDisabled: disabled, onPress }, ref);
  const { color, fontStyle, fontSize } = useTheme();

  function handleMouseLeave() {
    if (ref.current) {
      ref.current.blur();
    }
  }

  return (
        <button
          css={[css`
          font-family: ${fontStyle.title};
            font-size: ${fontSize.h5};
          `, type === 'primary' && css`
            
            background-color: ${color.primary[500]};
            color: ${color.primary[100]};
            border: none;
            border-radius: 50px;
            height: 48px;
            width: 274px;
            &:hover:not(:disabled):not(:active),
            &:focus:not(:disabled):not(:active) {
              margin-top: -4px;
              filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
              outline: none;
            }
            &:active {
              box-shadow: inset 0px 4px 4px rgba(0, 0, 0, 0.25);
              outline: none;
            }
            &:disabled {
              background-color: ${color.primary[200]};
            }
          `, type === 'secondary' && css`
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
          `]}
          onMouseLeave={handleMouseLeave}
          {...buttonProps}
          ref={ref}
        >
          {label}
        </button>
  );
};

export default Button;
