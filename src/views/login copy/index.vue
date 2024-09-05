<template>
  <div class="h-full w-full flex flex justify-end items-center pr-320" :style="background">
    <BrandLogo></BrandLogo>
    <div class="w-440 p48px backdrop-filter backdrop-blur-4 border border-white border-solid rd-10">
      <a-tabs centered>
        <a-tab-pane key="account">
          <template #tab>
            <span class="font-size-24">{{ $t('I18N.login.zhangHaoDengLu') }}</span>
          </template>
          <AccountForm></AccountForm>
        </a-tab-pane>
        <a-tab-pane key="scan">
          <template #tab>
            <span class="font-size-24">{{ $t('I18N.login.saoMaDengLu') }}</span>
          </template>
          <ScanLogin></ScanLogin>
        </a-tab-pane>
      </a-tabs>
      <a-divider dashed class="border-color-#A2A8E4">
        <span class="font-size-16 color-#181818">{{ $t('I18N.login.qiTaDengLuFang') }}</span>
      </a-divider>
      <div class="flex justify-between">
        <OtherLogin :icon="dingding" :text="$t('I18N.login.anHengNeiBuYan')"></OtherLogin>
        <OtherLogin :icon="phone" :text="$t('I18N.login.youKeZhangHaoDeng')"></OtherLogin>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import dingding from '@/assets/images/login/dingding.png';
  import phone from '@/assets/images/login/phone.png';
  import { useAppStore } from '@/store';
  import AccountForm from './comps/account-form.vue';
  import BrandLogo from './comps/brand-logo.vue';
  import OtherLogin from './comps/other-login.vue';
  import ScanLogin from './comps/scan-login.vue';

  const appStore = useAppStore();
  const { appConfig } = storeToRefs(appStore);
  const background = computed(() => {
    return {
      'background-image': `url(${appConfig.value?.loginBg})`,
      'background-size': 'cover',
      'background-repeat': 'no-repeat'
    };
  });
</script>
