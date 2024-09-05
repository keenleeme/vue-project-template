<template>
  <div>
    <a-form :model="formState" autocomplete="off" @finish="onFinish" @finish-failed="onFinishFailed">
      <a-form-item name="username" :rules="[{ required: true, message: $t('I18N.login.biTianXiang') }]">
        <a-input v-model:value="formState.username" :placeholder="$t('I18N.login.qingShuRuYongHu')" allow-clear>
          <template #prefix>
            <img src="~@/assets/images/login/user.png" />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item name="password" :rules="[{ required: true, message: $t('I18N.login.biTianXiang') }]">
        <a-input-password v-model:value="formState.password" :placeholder="$t('I18N.login.qingShuRuMiMa')" allow-clear>
          <template #prefix>
            <img src="~@/assets/images/login/password.png" />
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item name="code" :rules="[{ required: true, message: $t('I18N.login.biTianXiang') }]">
        <a-input v-model:value="formState.code" :placeholder="$t('I18N.login.qingShuRuYanZheng')" allow-clear>
          <template #prefix>
            <img src="~@/assets/images/login/code.png" />
          </template>
          <template #suffix>
            <a class="cursor-pointer" href="javascript;" @click="handleRefreshCode">{{
              $t('I18N.login.huoQuYanZhengMa')
            }}</a>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <div class="flex justify-between">
          <a-checkbox v-model:checked="formState.autoLogin">{{ $t('I18N.login.tianNeiZiDongDeng') }}</a-checkbox>
          <div class="cursor-pointer" @click="handleForgetPassword">{{ $t('I18N.login.wangJiMiMa') }}</div>
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" class="w-full" html-type="submit">{{ $t('I18N.common.login') }}</a-button>
      </a-form-item>
      <div>
        <a-checkbox v-model:checked="formState.autoLogin">
          {{ $t('I18N.login.tongYi') }}<a>{{ $t('I18N.login.yinSiZhengCe') }}</a
          >{{ $t('I18N.login.he') }}<a>{{ $t('I18N.login.diSanFangXinXi') }}</a>
        </a-checkbox>
      </div>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { useAppStore } from '@/store';

  interface FormState {
    username: string;
    password: string;
    code: string;
    autoLogin: boolean;
  }
  const appStore = useAppStore();
  const router = useRouter();
  const formState = reactive<FormState>({
    username: '',
    password: '',
    code: '',
    autoLogin: true
  });

  const onFinish = () => {
    appStore.setToken('dsadsadsada');
    router.replace('/');
  };
  const onFinishFailed = () => {};
  const handleRefreshCode = () => {};
  const handleForgetPassword = () => {};
</script>
