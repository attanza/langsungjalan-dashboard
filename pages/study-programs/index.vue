<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>
    <studyList/>
  </div>
</template>

<script>
import { studyList } from "~/components/studies"
import { global } from "~/mixins"
export default {
  components: { studyList },
  mixins: [global],

  data() {
    return {
      title: "Studi Program"
    }
  },
  mounted() {
    this.clearStore()
  }
}
</script>

<style scoped>
</style>
