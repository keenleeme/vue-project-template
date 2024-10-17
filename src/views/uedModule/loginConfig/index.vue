<template>
  <div class="setting-wrapper">
    <div class="page-content">
      <div class="setting">
        <a-form :colon="false" label-align="right" v-bind="formItemLayout" :label-col="{style:{'width': '33.3%', 'white-space':'normal'}}">
          <a-form-item :label="$t('I18N.layout.zhuTiFengGe')">
            <a-radio-group v-model:value="loginConfig.mode">
              <a-radio value="dark">{{ $t('I18N.layout.shenSe') }}</a-radio>
              <a-radio value="light">{{ $t('I18N.layout.qianSe') }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('I18N.layout.dengLuYeBeiJing')">
            <a-radio-group v-model:value="loginConfig.bgMode">
              <a-radio value="image">{{ $t('I18N.layout.tuPian') }}</a-radio>
              <a-radio value="video">{{ $t('I18N.layout.shiPin') }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-if="loginConfig.bgMode === 'image'" :label="$t('I18N.layout.tuPian')">
            <div class="uploader">
              <a-image
                :src="loginConfig.bgImage"
                :preview="false"
                :fallback="config.fallbackImg"
                style="width: 142px; height: 100px"
              />
              <div>
                <a-upload
                  name="bgImage"
                  :max-count="1"
                  :accept="config.format.join(',')"
                  :show-upload-list="false"
                  :before-upload="(v: UploadFile) => beforeUpload(v, 'bgImage')"
                  :custom-request="(v) => customRequest(v, 'bgImage')"
                >
                  <a-button type="text">{{ $t('I18N.layout.shangChuan') }}</a-button>
                </a-upload>
                <a-button type="text" @click="handleReset('bgImage')">{{ $t('I18N.layout.huiFuChuChangTuPian') }}</a-button>
              </div>
              <p>
                {{ $t('I18N.layout.zhiNengShangChuan') }}{{ config.format.join('/').replace(/\./g, '') }}{{ $t('I18N.layout.wenJian') }}，{{ $t('I18N.layout.qieBuChaoGuo') }}{{
                  config.bgSizeText
                }}，{{ $t('I18N.layout.jianYiTuPianBiLi') }}16:9
              </p>
            </div>
          </a-form-item>
          <template v-else>
            <a-form-item :label="$t('I18N.layout.fengMian')">
              <div class="uploader">
                <a-image
                  :src="loginConfig.bgPoster"
                  :preview="false"
                  :fallback="config.fallbackImg"
                  style="width: 142px; height: 100px"
                />
                <div>
                  <a-upload
                    name="bgPoster"
                    action=""
                    :max-count="1"
                    :accept="config.format.join(',')"
                    :show-upload-list="false"
                    :before-upload="(v: UploadFile) => beforeUpload(v, 'bgPoster')"
                    :custom-request="(v) => customRequest(v, 'bgPoster')"
                  >
                    <a-button type="text">{{ $t('I18N.layout.shangChuan') }}</a-button>
                  </a-upload>
                  <a-button type="text" @click="handleReset('bgPoster')">{{ $t('I18N.layout.huiFuChuChangTuPian') }}</a-button>
                </div>
                <p>
                  {{ $t('I18N.layout.zhiNengShangChuan') }}{{ config.format.join('/').replace(/\./g, '') }}{{ $t('I18N.layout.wenJian') }}，{{ $t('I18N.layout.qieBuChaoGuo') }}{{
                    config.bgSizeText
                  }}，{{ $t('I18N.layout.shiPinHeTuPianYiZhi') }}，{{ $t('I18N.layout.jianYiBiLi') }}16:9
                </p>
              </div>
            </a-form-item>
            <a-form-item :label="$t('I18N.layout.shiPin')">
              <div class="uploader">
                <video v-if="loginConfig.bgVideo" width="142">
                  <source :src="loginConfig.bgVideo" />
                </video>
                <a-image
                  v-else
                  :preview="false"
                  src=""
                  :fallback="config.fallbackImg"
                  style="width: 142px; height: 100px"
                />
                <div>
                  <a-upload
                    name="bgVideo"
                    action=""
                    :max-count="1"
                    :accept="config.videoFormat.join(',')"
                    :show-upload-list="false"
                    :before-upload="(v: UploadFile) => beforeUpload(v, 'bgVideo')"
                    :custom-request="(v) => customRequest(v, 'bgVideo')"
                  >
                    <a-button type="text">{{ $t('I18N.layout.shangChuan') }}</a-button>
                  </a-upload>
                  <a-button type="text" @click="handleReset('bgVideo')">{{ $t('I18N.layout.huiFuChuChangShiPin') }}</a-button>
                </div>
                <p>
                  {{ $t('I18N.layout.zhiNengShangChuan') }}{{ config.videoFormat.join('/').replace(/\./g, '') }}{{ $t('I18N.layout.wenJian') }}，{{ $t('I18N.layout.qieBuChaoGuo') }}{{
                    config.videoSizeText
                  }}，{{ $t('I18N.layout.shiPinHeTuPianYiZhi') }}，{{ $t('I18N.layout.jianYiBiLi') }}16:9
                </p>
              </div>
            </a-form-item>
          </template>
          <a-form-item :label="$t('I18N.layout.chanPin')+'LOGO'">
            <a-radio-group v-model:value="loginConfig.logoMode">
              <a-radio :value="LogoModeEnums.IMAGE">{{ $t('I18N.layout.tuPian') }}</a-radio>
              <a-radio :value="LogoModeEnums.TEXT">{{ $t('I18N.layout.wenzi') }}</a-radio>
              <a-radio :value="LogoModeEnums.IMAGE_TEXT">{{ $t('I18N.layout.tuPian') }}+{{ $t('I18N.layout.wenzi') }}</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item :label="$t('I18N.layout.chanPin')+$t('I18N.base_form.name')">
            <a-input
              v-model:value="loginConfig.logoName"
              :disabled="[LogoModeEnums.IMAGE].includes(loginConfig.logoMode!)"
              :placeholder="$t('I18N.base_form.pleaseEnter')+'LOGO'+$t('I18N.base_form.name')"
            />
            <a-form-item style="margin-top: 24px">
              <div class="uploader">
                <a-image
                  :src="loginConfig.logoUrl"
                  :preview="false"
                  :fallback="config.fallbackImg"
                  style="width: 80px; height: 80px"
                />
                <div>
                  <a-upload
                    name="logoUrl"
                    action=""
                    :disabled="[LogoModeEnums.TEXT].includes(loginConfig.logoMode!)"
                    :max-count="1"
                    :accept="config.format.join(',')"
                    :show-upload-list="false"
                    :before-upload="(v: UploadFile) => beforeUpload(v, 'logoUrl')"
                    :custom-request="(v) => customRequest(v, 'logoUrl')"
                  >
                    <a-button type="text" :disabled="[LogoModeEnums.TEXT].includes(loginConfig.logoMode!)"
                      >{{ $t('I18N.layout.shangChuan') }}</a-button
                    >
                  </a-upload>
                  <a-button
                    type="text"
                    :disabled="[LogoModeEnums.TEXT].includes(loginConfig.logoMode!)"
                    @click="handleReset('logoUrl')"
                    >{{ $t('I18N.layout.huiFuChuChangTuPian') }}</a-button
                  >
                </div>
                <p>
                  {{ $t('I18N.layout.zhiNengShangChuan') }}{{ config.format.join('/').replace(/\./g, '') }}{{ $t('I18N.layout.wenJian') }}，{{ $t('I18N.layout.qieBuChaoGuo') }}{{
                    config.logoSizeText
                  }}，{{ $t('I18N.layout.shenSeBeiJingJianYiShiYong') }}
                </p>
              </div>
            </a-form-item>
          </a-form-item>
          <a-form-item :label="$t('I18N.layout.xianShiDuoYuYanQieHuan')">
            <a-switch v-model:checked="loginConfig.showLanguage"></a-switch>
          </a-form-item>
          <a-form-item :label="$t('I18N.layout.xuanChuanBiaoYu')">
            <a-input v-model:value="loginConfig.slogan" :placeholder="$t('I18N.base_form.pleaseEnter')+$t('I18N.layout.xuanChuanBiaoYu')"></a-input>
          </a-form-item>
          <a-form-item :label="$t('I18N.layout.gongSiMingCheng')">
            <a-input v-model:value="loginConfig.companyName" :placeholder="$t('I18N.base_form.pleaseEnter')+$t('I18N.layout.gongSiMingCheng')"></a-input>
          </a-form-item>
          <a-form-item :label="$t('I18N.layout.pingTaiBanQuanXinXi')">
            <a-input v-model:value="loginConfig.copyright" :placeholder="$t('I18N.base_form.pleaseEnter')+$t('I18N.layout.pingTaiBanQuanXinXi')"></a-input>
          </a-form-item>
          <a-form-item :label="$t('I18N.layout.gongAnJiGuanBeiAnXinXi')">
            <a-input v-model:value="loginConfig.filing" :placeholder="$t('I18N.base_form.pleaseEnter')+$t('I18N.layout.gongAnJiGuanBeiAnXinXi')"></a-input>
          </a-form-item>
          <a-form-item :label="$t('I18N.layout.gongAnJiGuanBeiAnChaoLianDiZhi')">
            <a-input v-model:value="loginConfig.filingUrl" :placeholder="$t('I18N.base_form.pleaseEnter')+$t('I18N.layout.gongAnJiGuanBeiAnChaoLianDiZhi')"></a-input>
          </a-form-item>
          <a-form-item :label="$t('I18N.layout.ICPbeiAnXinXi')">
            <a-input v-model:value="loginConfig.icp" :placeholder="$t('I18N.base_form.pleaseEnter')+$t('I18N.layout.ICPbeiAnXinXi')"></a-input>
          </a-form-item>
          <a-form-item :label="$t('I18N.layout.ICPbeiAnChaoLianDiZhi')">
            <a-input v-model:value="loginConfig.icpUrl" :placeholder="$t('I18N.base_form.pleaseEnter')+$t('I18N.layout.ICPbeiAnChaoLianDiZhi')"></a-input>
          </a-form-item>
        </a-form>
      </div>
      <!--  -->
      <!-- preview -->
      <div :key="previewKey" class="preview">
        <LoginDemo :forms="forms" :login-config="loginConfig"></LoginDemo>
        <div class="preview-control">
          <a-button @click="handlePreviewControl('reload')">{{ $t('I18N.layout.shuaXin') }}</a-button>
          <a-button @click="handlePreviewControl('fullscreen')">{{ $t('I18N.layout.quanPing') }}</a-button>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <a-button @click="handleFormSet('reset')">{{ $t('I18N.layout.huiFuChuChangSheZhi') }}</a-button>
      <a-button type="primary" @click="handleFormSet('apply')">{{ $t('I18N.layout.yingYongDangQianSheZhi') }}</a-button>
    </div>

    <a-modal v-model:open="dialogVisible" :title="dialogTitle" :centered="true" :closable="false">
      <div class="content">{{ $t('I18N.layout.xinZhuTiFengGeTiShi') }}</div>
      <template #footer>
        <a-button key="back" @click="dialogVisible = false">{{ $t('I18N.common.cancel') }}</a-button>
        <a-button key="submit" type="primary" @click="handleSubmit">{{ $t('I18N.common.confirm') }}</a-button>
      </template>
    </a-modal>

    <a-modal
      v-model:open="fullscreen"
      title=""
      width="100%"
      wrap-class-name="full-modal"
      :closable="false"
    >
      <LoginDemo :key="previewKey" fullscreen :forms="forms" :login-config="loginConfig"></LoginDemo>

      <template #footer>
        <a-button class="close" @click="fullscreen = false">{{ $t('I18N.common.close') }}</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import type { FormDto } from '@ued-material/ued-wbc/dist/types/types';
  import { UploadFile, message } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import { useAppStore } from '@/store';
  import { defaultConfig } from '@/store/uedModule/app/defaultConfig';
  import { LoginConfigDTO, LogoModeEnums } from '@/views/uedModule/login/types';
  import * as config from './index';
  import type { FormUploadType } from './index';
  import LoginDemo from './login-demo.vue';

  const appStore = useAppStore();
  const { appConfig } = storeToRefs(appStore);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 }
    }
  };

  const loginConfig = ref<LoginConfigDTO>(new LoginConfigDTO(appConfig.value?.loginConfig));
  const dialogVisible = ref(false);
  const dialogTitle = ref('');
  const previewKey = ref(0);
  const fullscreen = ref(false);

  const forms = reactive<FormDto[]>([
    {
      type: 'login-password',
      btnText: I18N.common.login,
      items: [
        { type: 'ued-input', label: I18N.common.username, field: 'username', placeholder: I18N.login.qingShuRuYongHu, icon: 'user' },
        { type: 'ued-password', label: I18N.common.password, field: 'username', placeholder: I18N.login.qingShuRuMiMa, icon: 'password' },
        { type: 'ued-touch-bar', label: I18N.layout.yanZheng, field: 'valide', icon: 'touch' }
      ]
    }
  ]);

  // 上传前校验
  const beforeUpload = (file: UploadFile, key: FormUploadType) => {
    const isJpgOrPng = config.formatValidFull[key].includes(file.type!);
    const limit = (file.size || 0) < config.limitValid[key];
    if (!isJpgOrPng) {
      message.error(`${I18N.layout.wenJianGeShiBuWei}${config.formatValid[key].join('/').replace(/\./g, '')}`);
    }
    if (!limit) {
      message.error(`${I18N.layout.wenJianDaXiaoChaoGuo}${config.limitText[key]}`);
    }
    return isJpgOrPng && limit;
  };

  const customRequest = (v: any, key: FormUploadType) => {
    const urlData = URL.createObjectURL(v.file);
    loginConfig.value[key] = urlData;
    v.onSuccess();
  };

  const handleReset = (key: FormUploadType) => {
    loginConfig.value[key] = defaultConfig.loginConfig[key];
  };

  // 预览侧 按钮处理
  const handlePreviewControl = (name: 'reload' | 'fullscreen') => {
    if (name === 'reload') {
      previewKey.value += 1;
    } else {
      fullscreen.value = true;
    }
  };

  // 按钮处理
  const handleFormSet = (name: 'reset' | 'apply') => {
    if (name === 'reset') {
      dialogTitle.value = I18N.layout.huiFuChuChangSheZhi;
      dialogVisible.value = true;
    } else if (name === 'apply') {
      dialogTitle.value = I18N.layout.yingYongDangQianSheZhi;
      dialogVisible.value = true;
    }
  };

  // 提交
  const handleSubmit = () => {
    if (dialogTitle.value === I18N.layout.yingYongDangQianSheZhi) {
      loginConfig.value = new LoginConfigDTO(appConfig.value?.loginConfig);
      dialogVisible.value = false;
    } else {
      appStore.setLoginConfig(loginConfig.value);
      dialogVisible.value = false;
    }
  };
</script>

<style lang="less" scoped>
  .setting-wrapper {
    position: relative;
    height: 100%;
    .page-content {
      display: flex;
      height: calc(100% - 65px);
      background-color: var(--color-page-bg);
      padding: 16px;
      color: #1e2435;

      .setting,
      .preview {
        width: 50%;
        display: flex;
        flex-direction: column;
        // align-items: center;
        overflow-x: hidden;
      }
      .setting {
        background-color: var(--primary-bg);
        padding: 31px 31px 31px 20px;
        .ant-form {
          --primaryColor: var(--um-primary-color-normal);
          width: 100%;
        }
        .uploader {
          display: flex;
          flex-direction: column;
          > div {
            display: inline-flex;
            align-items: center;
            margin: 12px 0 4px;
          }
          > p {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #adb1bc;
            line-height: 20px;
          }
          .ant-btn {
            padding: 0;
            color: #1f5aff;
            margin-right: 8px;
            border: none;
            &:hover {
              color: var(--um-primary-color-hover);
              background-color: transparent;
            }
            &:disabled {
              background: transparent !important;
              border: none !important;
              color: #adb1bc !important;
            }
          }
          .ant-upload-wrapper {
            :deep(.ant-upload) {
              background-color: transparent;
              border: none;
              &:hover {
                background-color: transparent !important;
                border: none !important;
              }
            }
          }
        }
      }
      .preview {
        background: #adb1bc;
        padding: 0 21px;
        justify-content: center;
        .preview-control {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 12px;
          .ant-btn {
            flex-grow: 1;
            box-shadow: none;
            & + .ant-btn {
              margin-left: 16px;
            }
          }
        }
      }
    }
    .page-footer {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 16px;
      text-align: right;
      border-top: 1px solid var(--primary-divider);
      background-color: var(--primary-bg);
      button {
        margin-left: 8px;
      }
    }
  }
</style>

<style lang="less">
  .full-modal {
    .ant-modal {
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    }
    .ant-modal-content {
      display: flex;
      flex-direction: column;
      width: 100vw;
      height: 100vh;
      max-width: 100vw;
      max-height: 100vh;
      padding: 0;
    }
    .ant-modal-body {
      flex: 1;
    }
  }
  .full-modal {
    .close {
      transform: translate(70%, 50%);
      transition: all 0.3s 0.1s ease;
      &:hover {
        transform: translate(0, 0);
      }
    }
  }
</style>
