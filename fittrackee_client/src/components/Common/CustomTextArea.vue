<template>
  <div class="custom-textarea">
    <textarea
      :id="name"
      :name="name"
      :maxLenght="charLimit"
      :disabled="disabled"
      v-model="text"
      @input="updateText"
    />
    <div class="remaining-chars">
      {{ $t('workouts.REMAINING_CHARS') }}: {{ text.length }}/{{ charLimit }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch, withDefaults } from 'vue'

  interface Props {
    name: string
    charLimit?: number
    disabled?: boolean
    input?: string
  }
  const props = withDefaults(defineProps<Props>(), {
    charLimit: 500,
    disabled: false,
    input: '',
  })

  const emit = defineEmits(['updateValue'])

  let text = ref('')

  function updateText(event: Event & { target: HTMLInputElement }) {
    emit('updateValue', event.target.value)
  }

  watch(
    () => props.input,
    (value) => {
      text.value = value
    }
  )
</script>

<style lang="scss" scoped>
  .custom-textarea {
    display: flex;
    flex-direction: column;
    .remaining-chars {
      font-size: 0.8em;
      font-style: italic;
    }
  }
</style>
