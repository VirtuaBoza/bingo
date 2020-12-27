import { useTheme as useEmotionTheme } from '@emotion/react';
import { Theme } from '../interfaces';

export default function useTheme() {
  return useEmotionTheme() as Theme;
}
