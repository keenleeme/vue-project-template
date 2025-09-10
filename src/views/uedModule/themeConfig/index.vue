<template>
  <div class="setting-wrapper">
    <div class="page-content">
      <BlockCard
        :title="$t('I18N.layout.duoYuYanSheZhi')"
        class="block-area"
        id="language"
        :two-columns="true"
        :title-border="true"
        :content-padding="24"
      >
        <!-- <div class="page-item-title">{{ $t('I18N.layout.duoYuYanSheZhi') }}</div> -->
        <div style="display: flex; gap: 16px; width: 100%">
          <div style="flex: 1">
            <div class="page-item-title">{{ $t('I18N.layout.yuYan') }}</div>
            <a-select v-model:value="config.lang" @change="handleLocaleChangeA">
              <template #suffixIcon><i class="zq-icon zq-icon-chevron-down ant-select-suffix-new"></i></template>
              <a-select-option value="zh">简体中文</a-select-option>
              <a-select-option value="en">English</a-select-option>
            </a-select>
          </div>

          <div style="flex: 1">
            <div class="page-item-title">字号设置</div>
            <a-select v-model:value="config.fontSize" @change="handleFontSizeChange">
              <template #suffixIcon><i class="zq-icon zq-icon-chevron-down ant-select-suffix-new"></i></template>
              <a-select-option value="12px">12px</a-select-option>
              <a-select-option value="14px">14px</a-select-option>
            </a-select>
            <!-- <div style="margin-top: 8px; font-size: var(--font-size-base); color: var(--color-text-secondary);">
              当前字号: {{ config.fontSize }}
            </div>
            <div style="margin-top: 16px;">
              <div style="margin-bottom: 8px; font-size: var(--font-size-base);">Ant Design 组件测试：</div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <a-button type="primary">主要按钮</a-button>
                <a-button>默认按钮</a-button>
                <a-input placeholder="输入框测试" style="width: 120px;" />
                <a-select placeholder="选择器" style="width: 100px;">
                  <a-select-option value="1">选项1</a-select-option>
                  <a-select-option value="2">选项2</a-select-option>
                </a-select>
              </div>
            </div> -->
          </div>
        </div>
      </BlockCard>
      <!-- <h1>主题配置页themeConfig</h1> -->
      <BlockCard
        :title="$t('I18N.layout.zhuTiFengGe')"
        class="block-area"
        id="theme"
        :two-columns="true"
        :title-border="true"
        :content-padding="24"
      >
        <ThemePanelItem
          type="mode"
          :title="$t('I18N.layout.moRenZhuTi')"
          :mode="config.mode"
          :dark="config.mode === 'dark'"
          @update:mode="(value: string) => changeConfig('mode', value)"
        />
        <!-- @update:mode="changeMode"  -->

        <ThemePanelItem
          type="primaryColor"
          :title="$t('I18N.layout.moRenZhuTiSe')"
          :mode="config.mode"
          :primary-color="config.primaryColor"
          :dark="config.mode === 'dark'"
          @update:primary-color="(value: string) => changeConfig('primaryColor', value)"
          @reset-primary-color="resetPrimaryColor"
        />
        <!-- @update:primary-color="changePrimaryColor" -->
      </BlockCard>

      <BlockCard
        :title="$t('I18N.layout.daoHangSheZhi')"
        class="block-area"
        id="nav"
        :two-columns="true"
        :title-border="true"
        :content-padding="24"
      >
        <ThemePanelItem
          type="layout"
          :title="$t('I18N.layout.daoHangBuJu')"
          :dark="config.mode === 'dark'"
          :mode="config.mode"
          :layout="config.layout"
          :breadcrumb="config.breadcrumb"
          :map-menu="config.mapMenu"
          :accordion="config.accordion"
          :top-style="config.topStyle"
          :side-style="config.sideStyle"
          :header="config.header"
          @update:top-style="(value: string) => changeConfig('topStyle', value)"
          @update:side-style="(value: string) => changeConfig('sideStyle', value)"
          @update:header="(value: string) => changeConfig('header', value)"
          @update:layout="(value: string) => changeConfig('layout', value)"
          @update:breadcrumb="(value: boolean) => changeConfig('breadcrumb', value)"
          @update:map-menu="(value: boolean) => changeConfig('mapMenu', value)"
          @update:accordion="(value: boolean) => changeConfig('accordion', value)"
        />
        <!-- @update:layout="changeLayout" -->

        <ThemePanelItem
          type="others"
          :title="$t('I18N.layout.qiTaSheZhi')"
          :dark="config.mode === 'dark'"
          :light-dark-switch="config.lightDarkSwitch"
          :language-switch="config.languageSwitch"
          :help-center="config.helpCenter"
          @update:light-dark-switch="(value: boolean) => changeConfig('lightDarkSwitch', value)"
          @update:language-switch="(value: boolean) => changeConfig('languageSwitch', value)"
          @update:help-center="(value: boolean) => changeConfig('helpCenter', value)"
        />
      </BlockCard>
    </div>
    <div class="page-footer">
      <a-button @click="resetTheme">{{ $t('I18N.layout.huiFuChuChangSheZhi') }}</a-button>
      <a-button @click="dialogVisiable = true">{{ $t('I18N.layout.shengChengYeMianQianTaoCanShu') }}</a-button>
      <a-button type="primary" @click="useTheme">{{ $t('I18N.layout.yingYongDangQianZhuTi') }}</a-button>
    </div>

    <a-modal
      v-model:open="dialogVisiable"
      :title="$t('I18N.layout.shengChengYeMianQianTaoCanShu')"
      @ok="copyParams"
      @cancel="dialogVisiable = false"
    >
      <div>
        <p>{{ $t('I18N.layout.shengChengYeMianQianTaoCanShuTanChuangWenAn') }}</p>
        <div class="params-content">
          <span class="params-label">{{ $t('I18N.layout.caiDanXianYinCanShu2') }}：</span>
          <span class="params-value">
            iFrameWeb=ewogICJ0aGVtZSI6ImRhcmsiLAogICJpc0VuYWJsZWQiOnRydWUsCiAgInNpZGUiOiB0cnVlLAogICJ0b3AiOiB0cnVlCn0=
          </span>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { changeLocale } from '@international/vue3-i18n';
  import { ThemePanelItem } from '@ued-material/menu';
  import { Modal, message } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import BlockCard from '@/components/uedModule/blockCard/index.vue';
  import { useLoginStore, useThemeStore } from '@/store';

  const themeStore = useThemeStore();
  const loginStore = useLoginStore();

  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });

  watchEffect(() => {
    config.value = { ...themeConfig.value };
  });

  const changeConfig = (key: string, newConfig: any) => {
    // 配置页修改，不影响全局，应用后同步到全局
    themeConfig.value = { ...themeConfig.value, [key]: newConfig };
  };

  // const changeMode = (modeValue: string) => {
  //   console.log(1, modeValue);
  //   // themeStore.themeConfig.mode = modeValue;
  //   // themeConfig.value.mode = modeValue;
  //   changeConfig('mode', modeValue);
  // };

  // const changeLayout = (layout: string) => {
  //   console.log(layout);
  //   themeConfig.value.layout = layout;
  // };

  // const changePrimaryColor = (primaryColor: string) => {
  //   // themeStore.themeConfig.primaryColor = primaryColor;
  //   themeConfig.value.primaryColor = primaryColor;
  // };

  // 重置主题色
  const resetPrimaryColor = () => {
    // config.value.primaryColor = '#134BEA';
    themeStore.resetThemePrimaryColor();
  };

  const resetTheme = () => {
    themeStore.reset();
  };

  const dialogVisiable = ref<boolean>(false);

  const useTheme = () => {
    Modal.confirm({
      title: I18N.layout.yingYongDangQianZhuTi,
      // icon: createVNode(ExclamationCircleOutlined),
      icon: h(''),
      centered: true,
      content: I18N.layout.xinZhuTiFengGeTiShi,
      okText: I18N.layout.queRen,
      okType: 'danger',
      cancelText: I18N.common.cancel,
      onCancel(...args) {
        console.log('onCancel', ...args);
      },
      onOk() {
        themeConfig.value = { ...themeConfig.value, ...config.value };
      }
    });
  };

  const copyParams = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        'iFrameWeb=ewogICJ0aGVtZSI6ImRhcmsiLAogICJpc0VuYWJsZWQiOnRydWUsCiAgInNpZGUiOiB0cnVlLAogICJ0b3AiOiB0cnVlCn0='
      );
    }
    message.success(I18N.layout.fuZhiChengGongWenAn);
    dialogVisiable.value = false;
  };

  const handleLocaleChangeA = (key: any) => {
    if (typeof key === 'string') {
      changeConfig('lang', key);
      changeLocale(key);
      loginStore.set({ language: key });
      window.location.reload();
    }
  };

  const handleFontSizeChange = (fontSize: any) => {
    if (typeof fontSize === 'string') {
      changeConfig('fontSize', fontSize);
    }
  };
</script>

<style lang="less" scoped>
  .setting-wrapper {
    // background-color: #fff;
    background-color: var(--color-bg-container);
    height: 100%;
    display: flex;
    flex-direction: column;

    .page-content {
      flex-grow: 1;
      // background-color: #f7f8fc;
      background-color: var(--color-bg-page);
      padding: 16px;
      height: 0;
      overflow-x: hidden;
      // color: #1e2435;
      color: var(--color-text-primarys);
      :deep(.page-item-title) {
        font-size: var(--font-size-large);
      }
      .page-item-title {
        font-size: var(--font-size-base);
        font-weight: 600;
        margin-bottom: 12px;
      }

      .block-area {
        .theme-panel-item {
          width: 50%;
          &-title {
            color: #1e2435;
            font-weight: 600;
            line-height: 22px;
          }

          .theme-panel-common-item > span {
            width: 98px;
            text-align: right;
          }
        }
        margin-bottom: 16px;
      }
    }

    .page-footer {
      padding: 16px;
      text-align: right;
      // border-top: 1px solid #e9eaf0;
      border-top: 1px solid var(--color-component-stroke);
      button {
        margin-left: 8px;
        // color: var(--color-text-primarys);
      }
    }
  }
  .dark {
    .setting-wrapper {
      .page-footer {
        button {
          // border-color: #4d576e;
          // background-color: #0d172a;
          // outline: none;
        }
        // .ant-btn-primary {
        //   background-color: #3461dd;
        // }
      }
    }
  }
</style>
