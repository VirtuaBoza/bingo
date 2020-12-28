import { css } from '@emotion/react';
import { useButton } from '@react-aria/button';
import { AriaButtonProps } from '@react-types/button';
import { PressEvent } from '@react-types/shared';
import React, { HTMLProps, useRef } from 'react';
import { useTheme } from '../hooks';

export interface IconButtonProps extends Pick<AriaButtonProps<'button'>, 'onPress'>, Pick<HTMLProps<HTMLButtonElement>, "disabled"> {
  disabled?: boolean;
  onPress: (e: PressEvent) => void;
}

const IconButton: React.FC<IconButtonProps> = ({children, disabled, onPress}) => {
  const {color} = useTheme();
  const ref = useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton({ isDisabled: disabled, onPress }, ref);

  function handleMouseLeave() {
    if (ref.current) {
      ref.current.blur();
    }
  }

  return (<button
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
  {children}
</button>)
}

export default IconButton;
