<template>
  <div class="setting-wrapper">
    <div class="page-content">
      <div class="setting">
        <a-form :colon="false" label-align="right" v-bind="formItemLayout">
          <a-form-item label="主题风格">
            <a-radio-group v-model:value="loginConfig.mode">
              <a-radio value="dark">深色</a-radio>
              <a-radio value="light">浅色</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="登录页背景">
            <a-radio-group v-model:value="loginConfig.bgMode">
              <a-radio value="image">图片</a-radio>
              <a-radio value="video">视频</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-if="loginConfig.bgMode === 'image'" label="图片">
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
                  <a-button type="text">上传</a-button>
                </a-upload>
                <a-button type="text" @click="handleReset('bgImage')">恢复出厂图片</a-button>
              </div>
              <p>
                只能上传{{ config.format.join('/').replace(/\./g, '') }}文件，且不超过{{
                  config.bgSizeText
                }}，建议图片比例16:9
              </p>
            </div>
          </a-form-item>
          <template v-else>
            <a-form-item label="封面">
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
                    <a-button type="text">上传</a-button>
                  </a-upload>
                  <a-button type="text" @click="handleReset('bgPoster')">恢复出厂图片</a-button>
                </div>
                <p>
                  只能上传{{ config.format.join('/').replace(/\./g, '') }}文件，且不超过{{
                    config.bgSizeText
                  }}，视频和图片尺寸保持一致，建议比例16:9
                </p>
              </div>
            </a-form-item>
            <a-form-item label="视频">
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
                    <a-button type="text">上传</a-button>
                  </a-upload>
                  <a-button type="text" @click="handleReset('bgVideo')">恢复出厂视频</a-button>
                </div>
                <p>
                  只能上传{{ config.videoFormat.join('/').replace(/\./g, '') }}文件，且不超过{{
                    config.videoSizeText
                  }}，视频和图片尺寸保持一致，建议比例16:9
                </p>
              </div>
            </a-form-item>
          </template>
          <a-form-item label="产品LOGO">
            <a-radio-group v-model:value="loginConfig.logoMode">
              <a-radio :value="LogoModeEnums.IMAGE">图片</a-radio>
              <a-radio :value="LogoModeEnums.TEXT">文字</a-radio>
              <a-radio :value="LogoModeEnums.IMAGE_TEXT">图片+文字</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="产品名称">
            <a-input
              v-model:value="loginConfig.logoName"
              :disabled="[LogoModeEnums.IMAGE].includes(loginConfig.logoMode!)"
              placeholder="请输入LOGO名称"
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
                      >上传</a-button
                    >
                  </a-upload>
                  <a-button
                    type="text"
                    :disabled="[LogoModeEnums.TEXT].includes(loginConfig.logoMode!)"
                    @click="handleReset('logoUrl')"
                    >恢复出厂图片</a-button
                  >
                </div>
                <p>
                  只能上传{{ config.format.join('/').replace(/\./g, '') }}文件，且不超过{{
                    config.logoSizeText
                  }}，深色背景建议使用白色logo
                </p>
              </div>
            </a-form-item>
          </a-form-item>
          <a-form-item label="显示多语言切换">
            <a-switch v-model:checked="loginConfig.showLanguage"></a-switch>
          </a-form-item>
          <a-form-item label="宣传标语">
            <a-input v-model:value="loginConfig.slogan" placeholder="请输入宣传标语"></a-input>
          </a-form-item>
          <a-form-item label="公司名称">
            <a-input v-model:value="loginConfig.companyName" placeholder="请输入公司名称"></a-input>
          </a-form-item>
          <a-form-item label="平台版权信息">
            <a-input v-model:value="loginConfig.copyright" placeholder="请输入平台版权信息"></a-input>
          </a-form-item>
          <a-form-item label="公安机关备案信息">
            <a-input v-model:value="loginConfig.filing" placeholder="请输入公安机关备案信息"></a-input>
          </a-form-item>
          <a-form-item label="公安机关备案信息超链地址">
            <a-input v-model:value="loginConfig.filingUrl" placeholder="请输入公安机关备案信息超链地址"></a-input>
          </a-form-item>
          <a-form-item label="ICP备案信息">
            <a-input v-model:value="loginConfig.icp" placeholder="请输入ICP备案信息"></a-input>
          </a-form-item>
          <a-form-item label="ICP备案超链地址">
            <a-input v-model:value="loginConfig.icpUrl" placeholder="请输入ICP备案超链地址"></a-input>
          </a-form-item>
        </a-form>
      </div>
      <!--  -->
      <!-- preview -->
      <div :key="previewKey" class="preview">
        <LoginDemo :forms="forms" :login-config="loginConfig"></LoginDemo>
        <div class="preview-control">
          <a-button @click="handlePreviewControl('reload')">刷新</a-button>
          <a-button @click="handlePreviewControl('fullscreen')">全屏</a-button>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <a-button @click="handleFormSet('reset')">恢复出厂设置</a-button>
      <a-button type="primary" @click="handleFormSet('apply')">应用当前设置</a-button>
    </div>

    <a-modal v-model:open="dialogVisible" :title="dialogTitle" :centered="true" :closable="false">
      <div class="content">新主题风格将覆盖所有账号自定义风格，确定保存新主题风格并应用到所有账号系统吗？</div>
      <template #footer>
        <a-button key="back" @click="dialogVisible = false">取消</a-button>
        <a-button key="submit" type="primary" @click="handleSubmit">确定</a-button>
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
        <a-button class="close" @click="fullscreen = false">关闭</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import type { FormDto } from '@ued-material/ued-wbc/dist/types/types';
  import { UploadFile, message } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import { useAppStore } from '@/store';
  import { defaultConfig } from '@/store/modules/app/defaultConfig';
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
      btnText: '登录',
      items: [
        { type: 'ued-input', label: '用户名', field: 'username', placeholder: '请输入用户名', icon: 'user' },
        { type: 'ued-password', label: '密码', field: 'username', placeholder: '请输入密码', icon: 'password' },
        { type: 'ued-touch-bar', label: '验证', field: 'valide', icon: 'touch' }
      ]
    }
  ]);

  // 上传前校验
  const beforeUpload = (file: UploadFile, key: FormUploadType) => {
    const isJpgOrPng = config.formatValidFull[key].includes(file.type!);
    const limit = (file.size || 0) < config.limitValid[key];
    if (!isJpgOrPng) {
      message.error(`文件格式不为${config.formatValid[key].join('/').replace(/\./g, '')}`);
    }
    if (!limit) {
      message.error(`文件大小超过${config.limitText[key]}`);
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
      dialogTitle.value = '恢复出厂设置';
      dialogVisible.value = true;
    } else if (name === 'apply') {
      dialogTitle.value = '应用当前设置';
      dialogVisible.value = true;
    }
  };

  // 提交
  const handleSubmit = () => {
    if (dialogTitle.value === '恢复出厂设置') {
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
