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
      // eslint-disable-next-line @typescript-eslint/no-empty-function
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
            <slot name="actions"></slot>
          </template>
        </v-step>
      </transition>
    </template>
  </v-tour>
</template>

<style scoped lang="scss"></style>
