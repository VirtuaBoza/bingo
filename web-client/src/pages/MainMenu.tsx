import { css } from '@emotion/react';
import React from 'react';

const MainMenu: React.FC = () => {
  return (
    <React.Fragment>
      <span
        css={css`
          color: red;
        `}
      >
        test
      </span>
    </React.Fragment>
  );
};

export default MainMenu;
