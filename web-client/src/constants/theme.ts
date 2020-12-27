import Theme from '../interfaces/Theme';

const theme: Theme = {
  color: {
    primary: {
      '100': '#FFEEEE',
      '200': '#F7BDC9',
      '500': '#F38BA6',
      '600': '#EA577D',
    },
    neutral: {
      '100': '#FFFFFF',
      '200': '#C3C3C3',
      '500': '#646464',
    },
  },
  spacing: {},
  fontStyle: {
    title: 'Fugaz One',
    paragraph: 'Work Sans',
  },
  fontSize: {
    h1: '1.8em',
    h2: '1.6em',
    h3: '1.4em',
    h4: '1.2em',
    h5: '1.1em',
    paragraph: '1em',
    helper: '0.8em',
    copyright: '0.7',
  },
};

export default theme;
