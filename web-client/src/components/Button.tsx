import React, { useRef } from "react";
import { useButton } from "@react-aria/button";
import { css } from "@emotion/react";

export interface ButtonProps {
  label: string;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({label, ...props}) => {
  const ref = useRef<HTMLButtonElement>(null)
  const { buttonProps } = useButton(props, ref);
  return <button css={
    css`
    font-family: 'Fugaz One';
    font-size: 1.1em;
    `
  } {...buttonProps} ref={ref} >{label}</button>
}

export default Button;
