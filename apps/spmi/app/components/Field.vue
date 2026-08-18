<template>
  <div :class="$props.class">
    <slot name="label" />
    <label
      v-if="!$slots.label"
      class="block text-sm font-medium text-neutral-950 mb-1"
    >
      {{ label }} <span
        v-if="required"
        class="text-danger-400"
      >*</span>
      <br>
      <span class="text-sm font-normal text-neutral-800">
        {{ description }}
      </span>
    </label>
    <slot />
  </div>
</template>

<script lang="ts">
/**
 * Component slots
 * @slot label - The label slot
 * @slot - The default slot
 */

export default {
	name: 'Field',
	props: {
		/**
		 * The custom class of the field
		 */
		class: {
			type: String,
			default: '',
		},
		/**
		 * The label of the field
		 */
		label: {
			type: String,
			default: ' ',
		},
		/**
		 * The description of the field
		 */
		description: {
			type: String,
			default: '',
		},
		/**
		 * The required state of the field
		 */
		required: {
			type: Boolean,
			default: false,
		},
	},
}
</script>
