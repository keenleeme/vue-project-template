import type { ThemeType } from '@ued-material/ued-wbc/dist/types/types';

export enum LogoModeEnums {
  IMAGE = 'image',
  TEXT = 'text',
  IMAGE_TEXT = 'image-text'
}

export interface LanguagesVO {
  label: string;
  value: string;
  [key: string]: string | number | undefined;
}

export class CopyrightVO {
  text: string = ''
  link?: string = ''
  constructor(text: string = '', link?: string) {
    this.text = text
    this.link = link
  }
}

export class LoginConfigDTO {
  mode?: ThemeType = 'light'; // 主题风格

  bgMode?: 'image' | 'video' = 'image'; // 登录页背景模式

  bgImage?: string = ''; // 登录页背景

  bgPoster?: string = ''; // 登录页视频封面

  bgVideo?: string = ''; // 登录页视频

  logoMode?: LogoModeEnums = LogoModeEnums.IMAGE; // 登录页LOGO

  logoName?: string = ''; // logo名称

  logoUrl?: string = ''; // logo图片

  showLanguage?: boolean = true; // 是否显示多语言

  language?: string = 'zh'; // 默认语言

  languages?: LanguagesVO[] = []; // 多语言可选项

  slogan?: string = ''; // 宣传标语

  companyName?: string = ''; // 公司名称

  copyright?: CopyrightVO[] = []; // 版权信息

  constructor(v?: LoginConfigDTO) {
    Object.assign(this, { mode: 'light' }, v);
  }
}
