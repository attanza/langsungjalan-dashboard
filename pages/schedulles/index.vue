<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>
    <schedulleList/>
  </div>
</template>

<script>
import { schedulleList } from "~/components/schedulles"
import { global } from "~/mixins"
export default {
  components: { schedulleList },
  mixins: [global],

  data() {
    return {
      title: "Jadwal"
    }
  },
  mounted() {
    this.clearStore()
  }
}
</script>

<style scoped>
</style>
