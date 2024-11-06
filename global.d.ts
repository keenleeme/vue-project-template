import { ComponentCustomProperties } from 'vue';

declare module '@international/vue3-i18n';
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $oem: any; // 全局变量文字
    $tours: any; //用户引导
    $t: any; //国际化
  }
}
declare global {
  const I18N: any;
  interface Window {
    RobotInit: (config: any) => void;
  }
}
// 必须导出，才能在其他文件中使用
export default ComponentCustomProperties;
