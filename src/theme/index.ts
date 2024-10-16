import DarkToken from './dark';
import LightToken from './light';

export enum ThemeTypes {
  Light = 'light',
  Dark = 'dark'
}

export const themeTokens = {
  light: LightToken,
  dark: DarkToken
};
