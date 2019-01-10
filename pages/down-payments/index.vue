<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>

    <dpList/>
  </div>
</template>

<script>
import { dpList } from "~/components/down-payments"
import { global } from "~/mixins"

export default {
  components: { dpList },
  mixins: [global],
  data() {
    return {
      title: "Down Payment"
    }
  },
  mounted() {
    this.clearStore()
  }
}
</script>

<style scoped>
</style>
