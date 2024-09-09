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
            <div class="uploader">
              <a-image
                :width="142"
                :height="100"
                :src="loginConfig.bgImage"
                fallback="data:image/png;base64,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"
              />
              <div>
                <a-upload
                  :file-list="[loginConfig.bgImage]"
                  name="file"
                  action=""
                  :max-count="1"
                  :accept="format.join(',')"
                  :show-upload-list="false"
                  :before-upload="(v: UploadFile) => beforeUpload(v, 'bgImage')"
                  :custom-request="customRequest"
                >
                  <a-button type="text">上传</a-button>
                </a-upload>
                <a-button type="text">恢复出厂图片</a-button>
              </div>
              <p>只能上传{{ format.join('/').replace(/\./g, '') }}文件，且不超过{{ bgSizeText }}，建议图片比例16:9</p>
            </div>
          </a-form-item>
          <a-form-item label="登录页LOGO">
            <a-radio-group v-model:value="loginConfig.logoMode">
              <a-radio :value="LogoModeEnums.IMAGE">图片</a-radio>
              <a-radio :value="LogoModeEnums.TEXT">文字</a-radio>
              <a-radio :value="LogoModeEnums.IMAGE_TEXT">图片+文字</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="LOGO名称">
            <a-input v-model:value="loginConfig.logoName" placeholder="请输入LOGO名称" />
            <a-form-item style="margin-top: 24px">
              <div class="uploader">
                <a-image
                  :width="80"
                  :height="80"
                  :src="loginConfig.logoUrl"
                  fallback="data:image/png;base64,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"
                />
                <div>
                  <a-upload
                    :file-list="[loginConfig.logoUrl]"
                    name="file"
                    action=""
                    :max-count="1"
                    :accept="format.join(',')"
                    :show-upload-list="false"
                    :before-upload="beforeUpload"
                    :custom-request="customRequest"
                  >
                    <a-button type="text">上传</a-button>
                  </a-upload>
                  <a-button type="text">恢复出厂图片</a-button>
                </div>
                <p>
                  只能上传{{ format.join('/').replace(/\./g, '') }}文件，且不超过{{
                    logoSizeText
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
      <div class="preview">
        <ued-login-layout :forms="forms" :theme="loginConfig.mode" :style="background">
          <ued-logo slot="logo" :src="loginConfig.logoUrl || '/logo.png'" width="180" height="100"></ued-logo>
          <ued-select
            v-if="loginConfig.showLanguage"
            slot="language"
            :clearable="false"
            :options="languages"
          ></ued-select>
          <div slot="copyright">
            <div>{{ loginConfig.slogan }}</div>
            <div>{{ loginConfig.copyright }}</div>
            <div>
              <a style="color: #333; margin-top: 6px" target="_blank" :src="loginConfig.filingUrl || 'javascript:;'">{{
                loginConfig.filing
              }}</a>
            </div>
            <div>
              <a style="color: #333; margin-top: 6px" target="_blank" :src="loginConfig.icpUrl || 'javascript:;'">{{
                loginConfig.icp
              }}</a>
            </div>
          </div>
        </ued-login-layout>
        <div class="preview-control">
          <a-button>刷新</a-button>
          <a-button>全屏</a-button>
        </div>
      </div>
    </div>
    <div class="page-footer">
      <a-button @click="handleFormSet('reset')">恢复出厂设置</a-button>
      <a-button type="primary" @click="handleFormSet('apply')">应用当前设置</a-button>
    </div>

    <a-modal v-model:open="dialogVisiable" :title="dialogTitle" centered="true" :closable="false">
      <div class="content">新主题风格将覆盖所有账号自定义风格，确定保存新主题风格并应用到所有账号系统吗？</div>
      <template #footer>
        <a-button key="back" @click="dialogVisiable = false">取消</a-button>
        <a-button key="submit" type="primary" @click="handleSubmit">确定</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import type { FormDto } from '@ued-material/ued-wbc/dist/types/types';
  import { UploadFile, message } from 'ant-design-vue';
  import { storeToRefs } from 'pinia';
  import { useAppStore } from '@/store';
  import { LoginConfigDTO, LogoModeEnums } from '@/store/modules/login/types';

  const appStore = useAppStore();
  const { appConfig } = storeToRefs(appStore);

  const format = ['.jpg', '.png'];
  const [bgSize, bgSizeText] = [1024 * 1024 * 1, '1MB']; // 1MB
  const [logoSize, logoSizeText] = [1024 * 500, '500KB']; // 500KB
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
  const languages = [
    { label: '中文', value: 'zh' },
    { label: '英文', value: 'en' }
  ];
  const loginConfig = ref<LoginConfigDTO>(new LoginConfigDTO());
  const dialogVisiable = ref(false);
  const dialogTitle = ref('');

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
  const background = computed(() => {
    return {
      'background-image': `url(${loginConfig.value.bgImage || appConfig.value?.loginBg})`,
      'background-size': 'cover',
      'background-repeat': 'no-repeat'
    };
  });

  // 上传前校验
  const beforeUpload = (file: UploadFile, key: 'bgImage' | 'logoUrl') => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(`文件格式不为${format.join('/').replace(/\./g, '')}`);
    }
    const limit = (file.size || 0) < (key === 'bgImage' ? bgSize : logoSize);
    if (!limit) {
      message.error(`文件大小超过${bgSizeText}`);
    }
    return isJpgOrPng && limit;
  };

  // 自定义上传
  const customRequest = () => {
    console.log('customRequest');
  };

  // 按钮处理
  const handleFormSet = (name: 'reset' | 'apply') => {
    if (name === 'reset') {
      dialogTitle.value = '恢复出厂设置';
      dialogVisiable.value = true;
    } else if (name === 'apply') {
      dialogTitle.value = '应用当前设置';
      dialogVisiable.value = true;
    }
  };

  // 提交
  const handleSubmit = () => {
    if (dialogTitle.value === '恢复出厂设置') {
      loginConfig.value = new LoginConfigDTO();
    } else {
      // submit
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
      background-color: #f7f8fc;
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
        background-color: #fff;
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
            &:hover {
              color: var(--um-primary-color-hover);
              background-color: transparent;
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
        padding: 100px 21px 0 21px;
        ued-login-layout {
          --ued-login-primary-color: var(--um-primary-color-normal);
          --ued-login-form-width: 400px;
          --ued-login-form-height-min: 400px;
          --ued-login-form-right: 0;
          --ued-logo-top: 0;
          --ued-logo-left: 0;
          --ued-language-top: 0;
          --ued-language-right: 0;
          position: relative;
          width: 100%;
          height: 400px;
          :deep(.ued-login) {
            position: absolute;
          }
          :deep(.login-form-box) {
            transform: scale(0.5);
          }
          :deep(ued-logo img) {
            transform: scale(0.5);
          }
          :deep(.ued-login-language) {
            --ued-control-bg: transparent;
            --ued-control-border-width: 0;
            --ued-control-inner-width: 100px;
            transform: scale(0.6);
            input {
              text-align: right;
            }
            .ued-form-control,
            .ued-form-control:hover {
              box-shadow: none !important;
            }
            .ued-popover {
              top: 41px !important;
              left: 50px !important;
              right: 0 !important;
            }
          }
        }
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
      border-top: 1px solid #e9eaf0;
      background-color: #fff;
      button {
        margin-left: 8px;
      }
    }
  }
</style>
