<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>

    <list />
  </div>
</template>

<script>
import { list } from "~/components/targets"

export default {
  components: { list },
  data() {
    return {
      title: "Target Marketing "
    }
  }
}
</script>

<style scoped>
</style>
