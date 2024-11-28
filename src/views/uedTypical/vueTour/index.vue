<script setup lang="ts">
  import VueTour from '@/components/uedModule/vueTour/index.vue';

  const router = useRouter();
  const route = useRoute();

  const steps = ref([
    {
      target: '#v-step-0',
      title: I18N.layout.dianJiDaoXiaYiBu,
      params: {
        // enabledButtons: {
        //   buttonPrevious: false,
        //   buttonNext: false,
        //   buttonStop: false,
        // },
        maskPadding: 8,
        hideCloseBtn: true
      },
      labels: {
        // 按钮文字支持配置
        buttonNext: I18N.layout.ziDingYiXiaYiBuWenZi
      },
      popover: {
        placement: 'bottom-start',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [-8, 20]
            }
          }
        ]
      }
    },
    {
      target: '#v-step-1',
      title: I18N.layout.ziDingYiXiaYiBuWenZi,
      content: I18N.layout.moRenWeiBangDingYuanSuQuYu,
      params: {
        maskPadding: 8
      },
      labels: {
        // 按钮文字支持配置
        buttonPrevious: I18N.layout.shangYiBu,
        buttonNext: I18N.layout.xiaYiBu
      },
      popover: {
        placement: 'bottom-end',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [8, 20]
            }
          }
        ]
      }
    },
    {
      target: '#v-step-2',
      title: I18N.layout.zheZhaoCengZhiChiGuanBi,
      params: {
        mask: false
      },
      labels: {
        // 按钮文字支持配置
        buttonPrevious: I18N.layout.shangYiBu,
        buttonNext: I18N.layout.xiaYiBu
      }
    },
    {
      target: '#v-step-3',
      title: I18N.layout.gongXiNiWanChengYinDao,
      content: I18N.layout.lingYiGeYeMianYinDao,
      popover: {
        placement: 'top'
      },
      labels: {
        // 按钮文字支持配置
        buttonPrevious: I18N.layout.shangYiBuHaHa,
        buttonStop: I18N.layout.quLingYiGeYeMian
      }
    }
  ]);

  const myCustomPreviousStepCallback = (currentStep) => {
    console.log(`[Vue Tour] A custom previousStep callback has been called on step ${currentStep + 1}`);
  };

  const myCustomNextStepCallback = (currentStep: number) => {
    console.log(`[Vue Tour] A custom nextStep callback has been called on step ${currentStep + 1}`);

    if (currentStep === 1) {
      console.log('[Vue Tour] A custom nextStep callback has been called from step 2 to step 3');
    }
  };

  const muCustomFinishCallback = (val) => {
    document.documentElement.scrollTop = 0;
    console.log('>>finish>>>', val);
    router.push(`/vueTour-page2?fromPath=${route.path}&stepLen=${steps.value.length - 1}`);
  };

  const callbacks = ref({
    onPreviousStep: myCustomPreviousStepCallback,
    onNextStep: myCustomNextStepCallback,
    onFinish: muCustomFinishCallback
  });

  const instance = getCurrentInstance();
  onMounted(() => {
    nextTick(() => {
      console.log('>>instance>>>', instance.proxy.$tours, route.params);
      instance.proxy.$tours.myTour.start(route.query.step || 0);
    });
  });
</script>

<template>
  <div>
    <span id="v-step-0" class="logo">{{ $t('I18N.layout.yiQiShangShou') }}</span>
    <span id="v-step-1" class="title">{{ $t('I18N.layout.cuiLueDedemo') }}</span>
    <span id="v-step-2" class="logo">{{ $t('I18N.layout.huiXuHuiWanShan') }}</span>
    <span id="v-step-3" class="title">{{ $t('I18N.layout.jingQingQiDai') }}</span>
    <vue-tour name="myTour" :steps="steps" :callbacks="callbacks" class="step_relative"></vue-tour>
  </div>
</template>

<style lang="less" scoped>
  .logo,
  .title {
    font-size: 20px;
    line-height: 120px;
    margin: 50px;
  }
</style>
