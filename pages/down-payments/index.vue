<template>
  <div>
    <h2 class="primary--text mb-3">{{ title }}</h2>

    <dpList />  
  </div>
</template>

<script>
import { dpList } from "~/components/down-payments"
export default {
  components: { dpList },
  data() {
    return {
      title: "Down Payment"
    }
  }
}
</script>

<style scoped>
</style>
