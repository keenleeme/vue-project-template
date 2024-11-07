<script setup>
  import { VTour, VStep } from '@ued-material/vue-tour';

  defineProps({
    name: {
      required: true,
      type: String
    },
    steps: {
      type: Array,
      default: () => []
    },
    callbacks: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {
        return {
          mask: true,
          maskPadding: 0,
          hideCloseBtn: false
        };
      }
    }
  });
</script>

<template>
  <v-tour :name="name" :steps="steps" :callbacks="callbacks" :options="options">
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
          :labels="step.labels || tour.labels"
          :highlight="tour.highlight"
          :enabled-buttons="tour.enabledButtons"
          :mask="tour.mask"
          :mask-padding="tour.maskPadding"
          :hide-close-btn="tour.hideCloseBtn"
          :index="index"
          :length="tour.steps.length"
        >
          <template #actions>
            <div class="buttons">
              <slot name="actions">
                <a-button v-if="!tour.isFirst && tour.enabledButtons.buttonPrevious" @click="tour.previousStep">{{
                  tour.steps[index].labels ? tour.steps[index].labels.buttonPrevious : tour.labels.buttonPrevious
                }}</a-button>
                <a-button v-if="!tour.isLast && tour.enabledButtons.buttonNext" type="primary" @click="tour.nextStep">{{
                  tour.steps[index].labels ? tour.steps[index].labels.buttonNext : tour.labels.buttonNext
                }}</a-button>
                <a-button v-if="tour.isLast && tour.enabledButtons.buttonStop" type="primary" @click="tour.finish">{{
                  tour.steps[index].labels ? tour.steps[index].labels.buttonStop : tour.labels.buttonStop
                }}</a-button>
              </slot>
            </div>
          </template>
        </v-step>
      </transition>
    </template>
  </v-tour>
</template>

<style scoped lang="less">
  :deep(.buttons) {
    button + button {
      margin-left: 6px;
    }
  }
</style>
