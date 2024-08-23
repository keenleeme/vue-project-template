<script setup lang="ts">
  const tours = ref(null);
  const toursInstance = ref({ start: () => {} });
  onMounted(() => {
    const ctx = getCurrentInstance();
    toursInstance.value = ctx?.appContext.config.globalProperties.$tours.myTour;
    console.log(toursInstance.value, ctx?.appContext.config.globalProperties.$tours);
    toursInstance.value.start();
  });
  const steps = [
    {
      target: '#v-step-0', // We're using document.querySelector() under the hood
      header: {
        title: 'Get Started'
      },
      params: { mask: true, maskPadding: 8 },
      content: `Discover <strong>Vue Tour</strong>!`
    },
    {
      target: '.v-step-1',
      content: 'An awesome plugin made with Vue.js!'
    },
    {
      target: '[data-v-step="2"]',
      content:
        "Try it, you'll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.",
      params: {
        placement: 'top' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
      }
    },
    {
      target: '.menu-icon-cog',
      content:
        "Try it, you'll love it!<br>You can put HTML in the steps and completely customize the DOM to suit your needs.",
      params: {
        placement: 'top' // Any valid Popper.js placement. See https://popper.js.org/popper-documentation.html#Popper.placements
      }
    }
  ];

  // function nextStep() {
  //   $tours.value.myTour.nextStep();
  // }

  // function showLastStep() {
  //   $tours.value.myTour.currentStep = steps.value.length - 1;
  // }

  function myCustomPreviousStepCallback(currentStep = 1) {
    console.log(`[Vue Tour] A custom previousStep callback has been called on step ${currentStep + 1}`);
  }

  function myCustomNextStepCallback(currentStep = 1) {
    console.log(`[Vue Tour] A custom nextStep callback has been called on step ${currentStep + 1}`);
    console.log(currentStep);
    if (currentStep === 1) {
      console.log('[Vue Tour] A custom nextStep callback has been called from step 2 to step 3');
    }
  }

  function muCustomFinishCallback() {
    document.documentElement.scrollTop = 0;
    console.log('>>finish>>>');
  }
  const callbacks = ref({
    onPreviousStep: myCustomPreviousStepCallback,
    onNextStep: myCustomNextStepCallback,
    onFinish: muCustomFinishCallback
  });
</script>

<template>
  <h1>example</h1>
  <RouterLink to="/example/add">{{ $t('I18N.example.qianWangXinZengYe') }}</RouterLink>
  <div>
    <div id="v-step-0">
      A DOM element on your page. The first step will pop on this element because its ID is 'v-step-0'.
    </div>
    <div class="v-step-1">
      A DOM element on your page. The second step will pop on this element because its ID is 'v-step-1'.
    </div>
    <div data-v-step="2">
      A DOM element on your page. The third and final step will pop on this element because its ID is 'v-step-2'.
    </div>
    <v-tour
      ref="tours"
      name="myTour"
      :steps="steps"
      :callbacks="callbacks"
      :options="{ mask: true, maskPadding: 0, hideCloseBtn: false }"
    >
    </v-tour>
  </div>
</template>
