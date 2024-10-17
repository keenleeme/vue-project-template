export {};
declare module '@international/vue3-i18n';
declare module 'vue' {
  interface ComponentCustomProperties {
    $t: any;
  }
}
declare global {
  const I18N: any;
}
