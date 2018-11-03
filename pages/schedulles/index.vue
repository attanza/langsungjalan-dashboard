<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>
    <schedulleList/>
  </div>
</template>

<script>
import { schedulleList } from "~/components/schedulles"
export default {
  components: { schedulleList },
  data() {
    return {
      title: "Jadwal"
    }
  }
}
</script>

<style scoped>
</style>
