<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>

    <list/>
  </div>
</template>

<script>
import { list } from "~/components/targets"
import { global } from "~/mixins"

export default {
  components: { list },
  mixins: [global],
  data() {
    return {
      title: "Target Marketing "
    }
  },
  mounted() {
    this.clearStore()
  }
}
</script>

<style scoped>
</style>
