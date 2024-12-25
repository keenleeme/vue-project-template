<template>
  <div class="base-config-wrap">
    <div v-if="showTabs" class="tabs">
      <a-tabs v-model:active-key="activeKey">
        <a-tab-pane key="1" :tab="$t('I18N.layout.moRenXuanXiang1')"></a-tab-pane>
        <a-tab-pane key="2" :tab="$t('I18N.layout.moRenXuanXiang2')"></a-tab-pane>
        <a-tab-pane key="3" :tab="$t('I18N.layout.moRenXuanXiang3')" disabled></a-tab-pane>
      </a-tabs>
    </div>
    <div class="base-config-content">
      <BlockArea :title="$t('I18N.layout.miMaAnQuanSheZhi')" class="block-area">
        <template #description>
          <span class="head-description">（{{ $t('I18N.layout.peiZhiMiMaAnQuanYaoQiu') }}）</span>
        </template>
        <div class="content">
          <div class="content-row">
            <span>{{ $t('I18N.layout.zuiXiaoMiMaChangDu') }}</span>
            <a-input-number v-model:value="minPasswordLen" :min="1" :max="80" />
            <span>{{ $t('I18N.layout.wei') }}，{{ $t('I18N.layout.zuiDaMiMaChangDu') }}</span>
            <a-input-number v-model:value="maxPasswordLen" :min="1" :max="80" />
            <span>{{ $t('I18N.layout.wei') }}</span>
          </div>
          <div class="content-row">
            <span>{{ $t('I18N.layout.zuiXiaoMiMaChangDu') }}</span>
            <a-checkbox-group v-model:value="state.checkedList" :options="plainOptions" />
          </div>
          <div class="content-row">
            <span>{{ $t('I18N.layout.jianYiSheZhi') }}</span>
            <a-input-number v-model:value="timeCount" :min="1" />
            <span>{{ $t('I18N.layout.tianGengHuanYiCiMiMa') }}</span>
            <a-popover :title="$t('I18N.layout.tiShi')">
              <template #content>
                <p>{{ $t('I18N.layout.jianYiMei3GeYueGengXinYiCi') }}</p>
              </template>
              <InfoCircleOutlined />
            </a-popover>
          </div>
        </div>
      </BlockArea>

      <BlockArea :title="$t('I18N.layout.dengLuAnQuanSheZhi')" class="block-area">
        <template #description>
          <span class="head-description">（{{ $t('I18N.layout.xianZhiYongHuDengLuFangShi') }}）</span>
        </template>
        <div class="content">
          <div class="content-row">
            <a-input-number v-model:value="loginSafeConfig.limitTime" :min="1" />
            <span>{{ $t('I18N.layout.miaoZhiNei') }}</span>
            <a-input-number v-model:value="loginSafeConfig.lockCount" :min="1" />
            <span>{{ $t('I18N.layout.ciSuoDing') }}</span>
            <a-radio-group v-model:value="loginSafeConfig.lockContent" name="radioGroup">
              <a-radio value="1">{{ $t('I18N.layout.zhangHu') }}</a-radio>
              <a-radio value="2">IP</a-radio>
            </a-radio-group>
          </div>
        </div>
      </BlockArea>

      <div class="area-head">{{ $t('I18N.layout.suoDingZhangHu') }}/IP</div>
      <BlockArea :title="$t('I18N.layout.chaoShiSheZhi')" class="block-area">
        <template #description>
          <span class="head-description">（{{ $t('I18N.layout.baoHuYongHuShuJuAnQuan') }}）</span>
        </template>
        <div class="content">
          <div class="content-row">
            <a-input-number v-model:value="overTimeConfig" :min="1" />
            <span>{{ $t('I18N.layout.fenZhongZhiNeiYongHuWuCaoZuo') }}</span>
            <a-popover :title="$t('I18N.layout.tiShi')">
              <template #content>
                <p>{{ $t('I18N.layout.jianYi') }}...</p>
              </template>
              <InfoCircleOutlined />
            </a-popover>
          </div>
        </div>
      </BlockArea>

      <BlockArea :title="$t('I18N.layout.ciPanChuCunSheZhi')" class="block-area">
        <template #description>
          <span class="head-description">（{{ $t('I18N.layout.ziDongQingLiCiPan') }}）</span>
        </template>
        <div class="content">
          <div class="content-row">
            <span>{{ $t('I18N.layout.dangCiPanKongJianChaoGuo') }}</span>
            <a-input-number v-model:value="diskStorageConfig" :min="1" />
            <span>%，{{ $t('I18N.layout.shuJuJiangZiDongXunHuanFuGai') }}</span>
          </div>
        </div>
      </BlockArea>
    </div>
    <div class="page-footer">
      <a-button @click="cancel">{{ $t('I18N.common.cancel') }}</a-button>
      <a-button type="primary" @click="save">{{ $t('I18N.common.save') }}</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { InfoCircleOutlined } from '@ant-design/icons-vue';
  import BlockArea from '@/components/uedModule/blockArea/index.vue';

  const showTabs = ref(true);
  const activeKey = ref('1');
  const minPasswordLen = ref<number>(8);
  const maxPasswordLen = ref<number>(20);
  const plainOptions = [I18N.layout.shuZi, I18N.layout.ziMuDaXiaoXie, I18N.layout.teShuZiFu];
  const state = reactive({
    indeterminate: true,
    checkAll: false,
    checkedList: [I18N.layout.shuZi, I18N.layout.ziMuDaXiaoXie, I18N.layout.teShuZiFu]
  });
  watch(
    () => state.checkedList,
    (val) => {
      console.log(state.checkedList);
      // state.indeterminate = !!val.length && val.length < plainOptions.length;
      // state.checkAll = val.length === plainOptions.length;
    }
  );

  const timeCount = ref<number>(20);

  // 登录安全设置
  const loginSafeConfig = reactive({
    lockContent: '1', // 1-账户 2-IP
    limitTime: 30, // 限制时间（秒）
    lockCount: 6 // 登录失败次数
  });

  // 超时设置
  const overTimeConfig = ref<number>(30); // 超时时间（分钟）

  // 磁盘存储设置
  const diskStorageConfig = ref<number>(30); // 磁盘存储空间百分比

  // 保存配置信息
  const save = () => {
    console.log('保存配置信息');
  };

  // 取消配置信息
  const cancel = () => {
    console.log('取消配置信息');
  };
</script>

<style lang="less" scoped>
  .base-config-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    .tabs {
      background-color: var(--color-bg-container);
      :deep(.ant-tabs) {
        .ant-tabs-nav {
          margin-bottom: 0;
          padding: 0 16px;
        }
      }
    }
    .base-config-content {
      padding: 16px;
      flex-grow: 1;
      padding: 16px;
      height: 0;
      overflow-x: hidden;

      .head-description {
        font-size: var(--font-size-base);
        color: var(--color-text-placeholder);
        letter-spacing: 0;
        line-height: 20px;
        font-weight: 400;
      }

      .content {
        &-row {
          font-size: var(--font-size-base);
          letter-spacing: 0;
          line-height: 20px;
          font-weight: 400;
          display: flex;
          align-items: center;
          margin-bottom: 30px;
          &:last-child {
            margin-bottom: 0;
          }
          span:not(:first-child) {
            margin: 0 8px;
          }
          span:first-child {
            margin-right: 8px;
          }
          .ant-radio-wrapper,
          :deep(.ant-checkbox-wrapper) {
            font-size: 12px !important;
          }
        }
      }

      .area-head {
        font-size: var(--font-size-base);
        // color: #FFFFFF;
        color: var(--color-text-primarys);
        letter-spacing: 0;
        line-height: 20px;
        font-weight: 400;
        margin-bottom: 8px;
      }
    }

    .page-footer {
      padding: 16px;
      text-align: right;
      border-top: 1px solid var(--color-component-stroke);
      background-color: var(--color-bg-container);
      button {
        margin-left: 8px;
      }
    }
  }
</style>
