<script lang="ts" setup>
  const route = useRoute();
  const steps = ref([
    {
      target: '#v-step-00',
      title: '可能需要返回上一次页面引导的情况',
      params: {},
      popover: {
        placement: 'bottom-start'
      },
      labels: {
        // 按钮文字支持配置
        buttonPrevious: '上一步哈哈',
        buttonNext: '下一步'
      }
    },
    {
      target: '#v-step-10',
      title: '完成',
      params: {},
      popover: {
        placement: 'left-start'
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
  <span id="v-step-00" class="logo">另一个页面引导1</span>
  <span id="v-step-10" class="title">另一个页面引导2</span>
  <vue-tour name="myTour" :steps="steps" :callbacks="callbacks">
    <template v-if="myTour.currentStep === 0" #actions>
      <div class="v-step_footer">
        <button class="v-step__button" @click="toFromPage">上一步</button>
        <button class="v-step__button v-step__button-primary" @click="myTour.nextStep()">下一步</button>
      </div>
    </template>
  </vue-tour>
</template>

<style>
  .logo,
  .title {
    font-size: 20px;
    line-height: 120px;
    margin: 50px;
  }
</style>
