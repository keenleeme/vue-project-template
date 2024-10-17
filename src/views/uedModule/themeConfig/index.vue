<template>
  <div class="setting-wrapper">
    <div class="page-content">
      <!-- <h1>主题配置页themeConfig</h1> -->
      <BlockArea :title="$t('I18N.layout.zhuTiFengGe')" class="block-area">
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
      </BlockArea>

      <BlockArea :title="$t('I18N.layout.daoHangSheZhi')" class="block-area">
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
      </BlockArea>
    </div>
    <div class="page-footer">
      <a-button @click="resetTheme">{{ $t('I18N.layout.huiFuChuChangSheZhi') }}</a-button>
      <a-button @click="dialogVisiable = true">{{ $t('I18N.layout.shengChengYeMianQianTaoCanShu') }}</a-button>
      <a-button type="primary" @click="useTheme">{{ $t('I18N.layout.yingYongDangQianZhuTi') }}</a-button>
    </div>

    <a-modal v-model:open="dialogVisiable" :title="$t('I18N.layout.shengChengYeMianQianTaoCanShu')" centered="true" :closable="false">
      <div>
        <p>{{ $t('I18N.layout.shengChengYeMianQianTaoCanShuTanChuangWenAn') }}</p>
        <div class="params-content">
          <span class="params-label">{{ $t('I18N.layout.caiDanXianYinCanShu2') }}：</span>
          <span class="params-value">
            iFrameWeb=ewogICJ0aGVtZSI6ImRhcmsiLAogICJpc0VuYWJsZWQiOnRydWUsCiAgInNpZGUiOiB0cnVlLAogICJ0b3AiOiB0cnVlCn0=
          </span>
        </div>
      </div>
      <template #footer>
        <a-button key="back" @click="dialogVisiable = false">{{ $t('I18N.common.cancel') }}</a-button>
        <a-button key="submit" type="primary" @click="copyParams">{{ $t('I18N.layout.fuZhiCanShu') }}</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watchEffect } from 'vue';
  import { ThemePanelItem } from '@ued-material/menu';
  import { Modal, message } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store';
  import BlockArea from '../../../components/uedModule/blockArea/index.vue';

  const themeStore = useThemeStore();

  const { themeConfig } = storeToRefs(themeStore);
  const config = ref({
    ...themeConfig.value
  });

  watchEffect(() => {
    console.log('themeConfig changed', themeConfig.value);
    config.value = { ...themeConfig.value };
  });

  const changeConfig = (key: string, newConfig: any) => {
    // config.value = { ...newConfig };
    console.log('changeConfig', key, newConfig);
    // 配置页修改，不影响全局，应用后同步到全局
    // Todo config.mode 值变成 dark后，配置页的样式也发生了变化
    // config.value = { ...config.value, [key]: newConfig };
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
</script>

<style lang="less" scoped>
  .setting-wrapper {
    // background-color: #fff;
    background-color: var(--primary-bg);
    height: 100%;
    display: flex;
    flex-direction: column;

    .page-content {
      flex-grow: 1;
      // background-color: #f7f8fc;
      background-color: var(--color-page-bg);
      padding: 16px;
      height: 0;
      overflow-x: hidden;
      // color: #1e2435;
      color: var(--color-text-content);
      :deep(.page-item-title) {
        font-size: 16px;
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
      }
    }

    .page-footer {
      padding: 16px;
      text-align: right;
      // border-top: 1px solid #e9eaf0;
      border-top: 1px solid var(--primary-divider);
      button {
        margin-left: 8px;
        // color: var(--color-text-content);
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
