/*
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-08-22 16:50:45
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-09-04 15:53:52
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
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
