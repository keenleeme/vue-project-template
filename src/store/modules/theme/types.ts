/*
 * @Author: xzj 13819929694@163.com
 * @Date: 2024-08-28 19:20:06
 * @LastEditors: xzj 13819929694@163.com
 * @LastEditTime: 2024-08-29 09:32:52
 * @Description:
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
export interface ThemeConfigType {
  // type: string; // 配置项类型 'mode'/'primaryColor'/'layout'/'others'
  // title: string;
  // dark: boolean; // 暗黑模式
  mode: string; // 模式 	'light'/'dark'
  lang: string; // 语言 	'zh'/'en'
  lightDarkSwitch: boolean; // 亮暗切换
  primaryColor: string; // 主题色
  layout: string; // 布局方式 'top'/'side'/'mix'
  topStyle: string; // 顶部样式 	'dark'/'light'
  sideStyle: string; // 侧边栏样式 'dark'/'light'
  header: boolean; //  显示顶栏（leyout = side 时生效）
  breadcrumb: boolean; // 显示面包屑
  mapMenu: boolean; // 地图菜单
  accordion: boolean; // 侧边导航手风琴模式
  languageSwitch: boolean; // 语言切换
  helpCenter: boolean; // 帮助中心
}
