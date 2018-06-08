<template>
  <div class="main-wrapper">
    <v-container fluid grid-list-sm>
      <v-layout row class="mb-2">
        <v-flex sm4 xs12>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Search"
            single-line
            hide-details
          />
        </v-flex>
        <v-flex sm4 xs12>
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
        </v-flex>  
        <v-flex sm4 xs12 class="header-right">
          <Tbtn v-if="!addMode" bottom icon-mode color="primary" icon="add" text="Add Marketing" @onClick="addMode = true"/>      
          <Tbtn v-if="addMode" bottom icon-mode color="primary" icon="save" text="Save Marketing" @onClick="saveMarketing"/> 
        </v-flex>             
      </v-layout>
      
      <v-layout v-if="currentEdit && search == ''" row wrap >
        <v-flex v-for="m in currentEdit.marketings" :key="m.id" md4 sm6 xs12>
          <v-card dark>
            <v-card-media v-if="m.photo" :src="m.photo" height="200px"/>
            <v-card-media v-else src="/images/user.png" height="200px"/>
            <v-card-title primary-title>
              <v-layout row wrap>
                <v-flex xs10>
                  <h3 class="headline mb-0">{{ m.name }}</h3>
                  <div>{{ m.email }}<br>{{ m.phone }}</div>
                </v-flex>
                <v-flex xs2>
                  <Tbtn color="primary" icon-mode icon="delete" text="Detach Marketing" @onClick="confirmDelete(m.id)"/>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout v-if="currentEdit && search != ''" row wrap >
        <v-flex v-for="m in results" :key="m.id" md4 sm6 xs12>
          <v-card dark>
            <v-card-media v-if="m.photo" :src="m.photo" height="200px"/>
            <v-card-media v-else src="/images/user.png" height="200px"/>
            <v-card-title primary-title>
              <v-layout row wrap>
                <v-flex xs10>
                  <h3 class="headline mb-0">{{ m.name }}</h3>
                  <div>{{ m.email }}<br>{{ m.phone }}</div>
                </v-flex>
                <v-flex xs2>
                  <Tbtn color="primary" icon-mode icon="delete" text="Detach Marketing" @onClick="confirmDelete(m)"/>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
      <Dialog :showDialog="showDialog" text="Are you sure want to detach ?" @onClose="showDialog = false" @onConfirmed="detachMarketing"/>
      
    </v-container>
  </div>
</template>

<script>
import { global } from "~/mixins"
import {
  ADD_MARKETING_URL,
  SEARCH_MARKETING_URL,
  DETACH_MARKETING_URL
} from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"
import _ from "lodash"
import Dialog from "~/components/Dialog"

export default {
  components: { Dialog },
  mixins: [global],

  data() {
    return {
      marketings: [],
      addMode: false,
      search: "",
      results: [],
      showDialog: false
    }
  },
  watch: {
    search() {
      if (this.search != "") {
        this.searchMarketings()
      }
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
    },
    searchMarketings: _.debounce(function() {
      this.results = []
      if (this.currentEdit) {
        this.findMarketings(this.currentEdit.id)
      }
    }, 500),
    async findMarketings(id) {
      const resp = await axios
        .get(
          `${SEARCH_MARKETING_URL}?supervisor_id=${id}&search=${this.search}`
        )
        .then(res => res.data)
      this.results = resp
    },
    confirmDelete(id) {
      this.showDialog = true
      this.marketings = []
      this.marketings.push(id)
    },
    async detachMarketing() {
      try {
        if (this.marketings.length > 0 && this.currentEdit) {
          let data = {
            supervisor_id: this.currentEdit.id,
            marketings: this.marketings
          }
          const resp = await axios
            .post(DETACH_MARKETING_URL, data)
            .then(res => res.data)
          this.showDialog = false

          this.$store.commit("currentEdit", resp.data)
          this.$store.dispatch("populateComboData", "Marketing")
          showNoty("Marketing Detached.", "success")
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
