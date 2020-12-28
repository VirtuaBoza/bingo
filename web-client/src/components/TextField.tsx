import { css } from '@emotion/react';
import React from 'react';
import { useTheme } from '../hooks';

export interface TextFieldProps
  extends Pick<
    React.HTMLProps<HTMLInputElement>,
    'disabled' | 'onChange' | 'placeholder' | 'value'
  > {
  disabled?: boolean;
  label: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  placeholder: string;
  value: string;
}

const TextField: React.FC<TextFieldProps> = ({
  disabled,
  label,
  onChange,
  placeholder,
  value,
}) => {
  const { color, fontSize, fontStyle } = useTheme();

  return (
    <label
      css={css`
        display: flex;
        flex-direction: column;
      `}
    >
      <span
        css={[
          css`
            color: ${color.primary[500]};
            font-size: ${fontSize.h5};
            font-family: ${fontStyle.title};
            margin-left: 25px;
          `,
          disabled &&
            css`
              color: ${color.primary[200]};
            `,
        ]}
      >
        {label}
      </span>
      <input
        css={() => css`
          background-color: ${color.neutral[100]};
          border-radius: 50px;
          height: 46px;
          border: 1px solid ${color.primary[500]};
          padding: 0px 20px;
          font-family: ${fontStyle.paragraph};
          font-size: ${fontSize.paragraph};
          color: ${color.neutral[500]};
          ::placeholder {
            color: ${color.neutral[200]};
          }
          &:focus {
            margin-top: -1px;
            border-width: 2px;
            outline: none;
          }
          &:disabled {
            color: ${color.neutral[200]};
            border-color: ${color.primary[200]};
          }
        `}
        disabled={disabled}
        onChange={onChange}
        placeholder={placeholder}
        value={value}
      />
    </label>
  );
};

export default TextField;
