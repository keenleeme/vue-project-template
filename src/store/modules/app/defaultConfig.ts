import loginBg from '@/assets/images/login/defalut-login-bg.jpg';
import { AppConfigType } from './types';

export const defaultConfig: AppConfigType = {
  title: '智启vue3孵化器系统',
  subtitle: 'webpack',
  logo: '/logo.png',
  // 登录配置
  loginBg,
  scanCode: true, // 扫码登录
  refreshScanCode: 20, // 二维码刷新时间，单位秒
  verificationCode: false, // 图片验证码
  phoneCode: true, // 手机验证码
  login2FA: false, // 双因子登录
  loginProtocol: 'https://www.dbappsecurity.com.cn/', // 协议
  register: false, // 注册
  forgotPassword: false // 忘记密码
};
