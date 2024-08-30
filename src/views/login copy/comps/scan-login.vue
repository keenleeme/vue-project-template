<template>
  <div class="flex justify-center flex-col items-center w-full h-302">
    <a-qrcode value="http://www.antdv.com" :size="195" @refresh="() => console.log('refresh')" />
    <div class="mt-24">
      <img src="~@/assets/images/login/wechat.png" />
      <span>{{ $t('I18N.login.qingShiYongWeiXin') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
