import { css } from '@emotion/react';
import React from 'react';
import flamingoSVG from '../assets/flamingo.svg';
import titleSVG from '../assets/title.svg';

const Logo: React.FC = () => {
  return (
    <div
      css={css`
        display: flex;
        justify-content: center;
        position: relative;
        width: 100%;
        height: 100%;
      `}
    >
      <img
        css={css`
          position: absolute;
          width: 100%;
          margin-top: 20%;
        `}
        src={titleSVG}
        alt="Title"
      />
      <img
        css={css`
          width: 75%;
        `}
        src={flamingoSVG}
        alt="Flamingo"
      />
    </div>
  );
};

export default Logo;
