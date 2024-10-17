import { LoginConfigDTO } from '@/views/uedModule/login/types';

export interface User {
  name: string;
  age: number;
  iphone: string;
  email: string;
  gender: string;
}

export interface AppConfigType {
  title: string;
  subtitle: string;
  loginConfig: LoginConfigDTO;
  // logo: string;
  // 登录配置
  // loginBg: string;
  // loginVideo: string;
  // scanCode: boolean; // 扫码登录
  // refreshScanCode: number; // 二维码刷新时间，单位秒
  // verificationCode: boolean; // 图片验证码
  // phoneCode: boolean; // 手机验证码
  // login2FA: boolean; // 双因子登录
  // loginProtocol: string; // 协议
  // register: boolean; // 注册
  // forgotPassword: boolean; // 忘记密码
}
