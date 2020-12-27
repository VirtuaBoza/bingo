import { ThemeProvider } from '@emotion/react';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import theme from './constants/theme';

const RootProvider: React.FC = ({ children }) => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <BrowserRouter>{children}</BrowserRouter>
      </ThemeProvider>
    </>
  );
};

export default RootProvider;
