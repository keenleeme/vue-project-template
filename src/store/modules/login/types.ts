import type { ThemeType } from '@ued-material/ued-wbc/dist/types/types';

export enum LogoModeEnums {
  IMAGE = '1',
  TEXT = '2',
  IMAGE_TEXT = '3'
}

export interface LanguagesVO {
  label: string;
  value: string;
  [key: string]: string | number | undefined;
}

export class LoginConfigDTO {
  mode?: ThemeType = 'light'; // 主题风格

  bgImage?: string = ''; // 登录页背景

  logoMode?: LogoModeEnums = LogoModeEnums.IMAGE_TEXT; // 登录页LOGO

  logoName?: string = ''; // logo名称

  logoUrl?: string = ''; // logo图片

  showLanguage?: boolean = true; // 是否显示多语言

  languages?: LanguagesVO[] = []; // 多语言可选项

  slogan?: string = ''; // 宣传标语

  companyName?: string = ''; // 公司名称

  copyright?: string = ''; // 版权信息

  filing?: string = ''; // 备案信息

  filingUrl?: string = ''; // 备案链接

  icp?: string = ''; // ICP备案号

  icpUrl?: string = ''; // ICP备案链接

  constructor(v?: LoginConfigDTO) {
    Object.assign(this, { mode: 'light' }, v);
  }
}
