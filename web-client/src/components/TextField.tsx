import { css } from '@emotion/react';
import React from 'react';
import { useTheme } from '../hooks';

export interface TextFieldProps
  extends Pick<
    React.HTMLProps<HTMLInputElement>,
    'onChange' | 'placeholder' | 'value'
  > {
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  value: string;
}

const TextField: React.FC<TextFieldProps> = ({ label, onChange, value }) => {
  const { color } = useTheme();

  return (
    <label
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <span
        css={css`
          color: ${color.primary[500]};
        `}
      >
        {label}
      </span>
      <input
        css={() => css`
          border-radius: 50px;
        `}
        onChange={onChange}
        value={value}
      />
    </label>
  );
};

export default TextField;
