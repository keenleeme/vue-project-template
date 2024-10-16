<template lang="">
  <div class="help-document">
    <h1>{{ $t('I18N.layout.bangZhuWenDangBiaoTi') }}</h1>
    <p>
      {{ $t('I18N.layout.bangZhuWenDangWenAn1') }}
    </p>
    <ul>
      <li><strong>{{ $t('I18N.layout.bangZhuWenDangWenAnBiaoTi1') }}</strong>{{ $t('I18N.layout.bangZhuWenDangWenAnNeiNong1') }}</li>
      <li><strong>{{ $t('I18N.layout.bangZhuWenDangWenAnBiaoTi2') }}</strong>{{ $t('I18N.layout.bangZhuWenDangWenAnNeiNong2') }}</li>
      <li><strong>{{ $t('I18N.layout.bangZhuWenDangWenAnBiaoTi3') }}</strong>{{ $t('I18N.layout.bangZhuWenDangWenAnNeiNong3') }}</li>
      <li><strong>{{ $t('I18N.layout.bangZhuWenDangWenAnBiaoTi4') }}</strong>{{ $t('I18N.layout.bangZhuWenDangWenAnNeiNong4') }}</li>
      <li><strong>{{ $t('I18N.layout.bangZhuWenDangWenAnBiaoTi5') }}</strong>{{ $t('I18N.layout.bangZhuWenDangWenAnNeiNong5') }}</li>
      <li><strong>{{ $t('I18N.layout.bangZhuWenDangWenAnBiaoTi6') }}</strong>{{ $t('I18N.layout.bangZhuWenDangWenAnNeiNong6') }}</li>
      <li>
        <strong>{{ $t('I18N.layout.bangZhuWenDangWenAnBiaoTi7') }}</strong>{{ $t('I18N.layout.bangZhuWenDangWenAnNeiNong7') }}
      </li>
      <li><strong>{{ $t('I18N.layout.bangZhuWenDangWenAnBiaoTi8') }}</strong>{{ $t('I18N.layout.bangZhuWenDangWenAnNeiNong8') }}</li>
      <li><strong>{{ $t('I18N.layout.bangZhuWenDangWenAnBiaoTi9') }}</strong>{{ $t('I18N.layout.bangZhuWenDangWenAnNeiNong9') }}</li>
      <li>
        <strong>{{ $t('I18N.layout.bangZhuWenDangWenAnBiaoTi10') }}</strong>{{ $t('I18N.layout.bangZhuWenDangWenAnNeiNong10') }}
      </li>
    </ul>
    <p>{{ $t('I18N.layout.bangZhuWenDangJieWei') }}</p>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
  .help-document {
    font-family: Arial, sans-serif;
    line-height: 1.6;
    // margin: 20px;
  }
  h1 {
    color: #333;
    text-align: center;
    color: var(--color-text-sub-title);
  }

  ul {
    list-style-type: disc;
    color: var(--color-text-sub-title);
  }

  p {
    text-align: justify;
    color: var(--color-text-sub-title);
  }
</style>
