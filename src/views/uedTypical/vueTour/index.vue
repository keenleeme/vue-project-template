<script setup lang="ts">
  const router = useRouter();
  const route = useRoute();
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
      labels: {
        // 按钮文字支持配置
        buttonNext: '自定义下一步文字'
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
      content: '另一个页面引导',
      popover: {
        placement: 'top'
      },
      labels: {
        // 按钮文字支持配置
        buttonPrevious: '上一步哈哈',
        buttonStop: '去另一个页面'
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
    <span id="v-step-0" class="logo">welcome！,快来跟我一起快速上手吧</span>
    <span id="v-step-1" class="title">这只是粗略的demo</span>
    <span id="v-step-2" class="logo">后续我会完善的</span>
    <span id="v-step-3" class="title">伙伴们敬请谅解～</span>
    <vue-tour name="myTour" :steps="steps" :callbacks="callbacks"></vue-tour>
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
