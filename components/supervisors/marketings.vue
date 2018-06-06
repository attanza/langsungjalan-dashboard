<template>
  <div class="main-wrapper">
    <v-container fluid grid-list-sm>
      <div class="header-wrapper">
        <div class="header-left">
          <h2 class="primary--text mb-3">Marketings</h2>
        </div>
        <div class="header-right">
          <v-select
            v-if="addMode && comboData"
            :items="comboData"
            v-model="marketings"
            label="Select Marketing to add"
            multiple
            item-text="name"
            item-value="id"
            autocomplete
            cache-items
          />
          <Tbtn v-if="!addMode" :bottom="true" color="primary" icon="add" text="Add Marketing" @onClick="addMode = true"/>      
          <Tbtn v-if="addMode" :bottom="true" color="primary" icon="save" text="Add Marketing" @onClick="saveMarketing"/>          
              
        </div>
      </div>
      
      <v-layout v-if="currentEdit" row wrap >
        <v-flex v-for="m in currentEdit.marketings" :key="m.id" md4 sm6 xs12>
          <v-card dark>
            <v-card-media v-if="m.photo" :src="m.photo" height="200px"/>
            <v-card-media v-else src="/images/user.png" height="200px"/>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">{{ m.name }}</h3>
                <div>{{ m.email }}<br>{{ m.phone }}</div>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import { global } from "~/mixins"
import { ADD_MARKETING_URL } from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"

export default {
  mixins: [global],
  data() {
    return {
      marketings: [],
      addMode: false
    }
  },
  methods: {
    async saveMarketing() {
      try {
        if (this.marketings.length > 0 && this.currentEdit) {
          let data = {
            supervisor_id: this.currentEdit.id,
            marketings: this.marketings
          }
          const resp = await axios
            .post(ADD_MARKETING_URL, data)
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          this.$store.dispatch("populateComboData", "Marketing")
          showNoty("Marketing added.", "success")
          this.addMode = false
        } else {
          this.addMode = false
        }
      } catch (e) {
        catchError(e)
      }
    }
  }
}
</script>

<style scoped>
/* .main-wrapper {
  background-color: #444444;
} */
.header-wrapper {
  min-height: 50px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
}
.header-left {
  display: flex;
  width: 50%;
  justify-content: flex-start;
}
.header-right {
  display: flex;
  width: 50%;
  justify-content: flex-end;
}
</style>
