<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>

    <reportList/>
  </div>
</template>

<script>
import { reportList } from "~/components/marketing-reports"
import { global } from "~/mixins"

export default {
  components: { reportList },
  mixins: [global],

  data() {
    return {
      title: "Laporan Marketing"
    }
  },
  mounted() {
    this.clearStore()
  }
}
</script>

<style scoped>
</style>
