<template>
  <div>
    <v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Please wait ... 
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialog: false
    }
  },
  watch: {
    loading() {
      if (this.loading || !this.loading) {
        this.dialog = this.loading
      }
    }
  }
}
</script>

<style scoped>
</style>
