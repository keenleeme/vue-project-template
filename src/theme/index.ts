import BlueToken from './blue';
import DarkToken from './dark';
import LightToken from './light';
import RedToken from './red';

export enum ThemeTypes {
  Light = 'light',
  Dark = 'dark'
}

export const themeTokens = {
  blue: BlueToken,
  red: RedToken,
  light: LightToken,
  dark: DarkToken
};
