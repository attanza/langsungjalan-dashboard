<template>
  <div>
    <v-tooltip top>
      <v-btn slot="activator" :color="color" :flat="flat" @click="onClick">
        <v-icon>{{ icon }}</v-icon>
      </v-btn>
      <span>{{ text }}</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    flat: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    onClick() {
      this.$emit("onClick")
    }
  }
}
</script>

<style scoped>
</style>
