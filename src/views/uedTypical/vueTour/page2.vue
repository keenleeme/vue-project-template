<script lang="ts" setup>
  import VueTour from '@/components/uedModule/vueTour/index.vue';

  const route = useRoute();
  const steps = ref([
    {
      target: '#v-step-00',
      title: I18N.layout.keNengXuYaoFanHuiShangYiCi,
      params: {},
      popover: {
        placement: 'bottom-start'
      },
      labels: {
        // 按钮文字支持配置
        buttonPrevious: I18N.layout.shangYiBuHaHa,
        buttonNext: I18N.layout.xiaYiBu
      }
    },
    {
      target: '#v-step-10',
      title: I18N.layout.wanCheng,
      params: {},
      popover: {
        placement: 'left-start'
      },
      labels: {
        // 按钮文字支持配置
        buttonPrevious: I18N.layout.shangYiBu,
        buttonStop: I18N.layout.wanCheng
      }
    }
  ]);
  const myCustomPreviousStepCallback = (currentStep) => {
    console.log(`[Vue Tour] A custom previousStep callback has been called on step ${currentStep + 1}`);
  };
  const myCustomNextStepCallback = (currentStep: number) => {
    console.log(currentStep);
    if (currentStep === 1) {
      console.log('[Vue Tour] A custom nextStep callback has been called from step 2 to step 3');
    }
  };
  const callbacks = ref({
    onNextStep: myCustomNextStepCallback,
    onPreviousStep: myCustomPreviousStepCallback
  });

  const router = useRouter();
  function toFromPage() {
    router.push({ path: route.query.fromPath, query: { step: route.query.stepLen } });
  }

  const instance = getCurrentInstance();
  const myTour = ref({});
  onMounted(() => {
    nextTick(() => {
      myTour.value = instance?.proxy?.$tours.myTour;
      myTour.value.start();
      console.log(instance?.proxy?.$tours);
    });
  });
</script>

<template>
  <span id="v-step-00" class="logo">{{ $t('I18N.layout.lingYiGeYeMianYinDao') }}1</span>
  <span id="v-step-10" class="title">{{ $t('I18N.layout.lingYiGeYeMianYinDao') }}2</span>
  <vue-tour name="myTour" :steps="steps" :callbacks="callbacks">
    <template v-if="myTour.currentStep === 0" #actions>
      <div class="v-step_footer">
        <a-button @click="toFromPage">{{ $t('I18N.layout.shangYiBu') }}</a-button>
        <a-button type="primary" @click="myTour.nextStep()">{{ $t('I18N.layout.xiaYiBu') }}</a-button>
      </div>
    </template>
  </vue-tour>
</template>

<style lang="less" scoped>
  .logo,
  .title {
    font-size: var(--font-size-xl);
    line-height: 120px;
    margin: 50px;
  }
</style>
