<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>

    <reportList/>
  </div>
</template>

<script>
import { reportList } from "~/components/marketing-reports"
export default {
  components: { reportList },
  data() {
    return {
      title: "Laporan Marketing"
    }
  }
}
</script>

<style scoped>
</style>
