// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import Logo from './Logo';

export default {
  title: 'Etc/Logo',
  component: Logo,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta;

export const Primary = () => <Logo />;
export const Wrapped = () => (
  <div style={{ width: '300px' }}>
    <Logo />
  </div>
);
