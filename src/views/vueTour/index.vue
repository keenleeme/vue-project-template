<script setup>
  import { VTour, VStep } from '@ued-material/vue-tour';

  const steps = ref([
    {
      target: '#v-step-0',
      title: '点击到下一步',
      params: {
        // enabledButtons: {
        //   buttonPrevious: false,
        //   buttonNext: false,
        //   buttonStop: false,
        // },
        maskPadding: 8,
        hideCloseBtn: true
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
      title: '高亮区域可配置',
      content: '默认为绑定元素区域高亮，可以设置padding',
      params: {
        maskPadding: 8
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
      title: '遮罩层支持关闭',
      params: {
        mask: false
      }
    },
    {
      target: '#v-step-3',
      title: '恭喜你，完成demo引导',
      content: '点击完成按钮结束本次引导',
      popover: {
        placement: 'top'
      }
    }
  ]);

  const myCustomPreviousStepCallback = (currentStep) => {
    console.log(`[Vue Tour] A custom previousStep callback has been called on step ${currentStep + 1}`);
  };

  const myCustomNextStepCallback = (currentStep) => {
    console.log(`[Vue Tour] A custom nextStep callback has been called on step ${currentStep + 1}`);

    if (currentStep === 1) {
      console.log('[Vue Tour] A custom nextStep callback has been called from step 2 to step 3');
    }
  };

  const muCustomFinishCallback = (val) => {
    document.documentElement.scrollTop = 0;
    console.log('>>finish>>>', val);
  };

  const callbacks = ref({
    onPreviousStep: myCustomPreviousStepCallback,
    onNextStep: myCustomNextStepCallback,
    onFinish: muCustomFinishCallback
  });
  const instance = getCurrentInstance();
  onMounted(() => {
    nextTick(() => {
      console.log('>>instance>>>', instance.proxy.$tours);
      instance.proxy.$tours.myTour.start();
    });
  });
</script>

<template>
  <div>
    <span id="v-step-0" class="logo">welcome！,快来跟我一起快速上手吧</span>
    <span id="v-step-1" class="title">这只是粗略的demo</span>
    <span id="v-step-2" class="logo">后续我会完善的</span>
    <span id="v-step-3" class="title">伙伴们敬请谅解～</span>
    <v-tour
      name="myTour"
      :steps="steps"
      :callbacks="callbacks"
      :options="{ mask: true, maskPadding: 0, hideCloseBtn: false }"
    >
      <template #default="tour">
        <transition v-for="(step, index) of tour.steps" :key="index" name="fade">
          <v-step
            v-if="tour.currentStep === index"
            :key="index"
            :step="step"
            :previous-step="tour.previousStep"
            :next-step="tour.nextStep"
            :stop="tour.stop"
            :skip="tour.skip"
            :finish="tour.finish"
            :is-first="tour.isFirst"
            :is-last="tour.isLast"
            :labels="tour.labels"
            :highlight="tour.highlight"
            :enabled-buttons="tour.enabledButtons"
            :mask="tour.mask"
            :mask-padding="tour.maskPadding"
            :hide-close-btn="tour.hideCloseBtn"
            :index="index"
            :length="tour.steps.length"
          >
          </v-step>
        </transition>
      </template>
    </v-tour>
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
