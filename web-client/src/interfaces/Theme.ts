import { Theme as EmotionTheme } from '@emotion/react';

export default interface Theme extends EmotionTheme {
  color: {
    primary: {
      '100': string;
      '200': string;
      '500': string;
      '600': string;
    };
    neutral: {
      '100': string;
      '200': string;
      '500': string;
    };
  };
  spacing: {
    small: string;
  };
  fontStyle: {
    title: string;
    paragraph: string;
  };
  fontSize: {
    h1: string;
    h2: string;
    h3: string;
    h4: string;
    h5: string;
    paragraph: string;
    helper: string;
    copyright: string;
  };
}
