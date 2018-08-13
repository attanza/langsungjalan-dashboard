<template>
  <div>
    <v-card dark>
      <v-container fluid grid-list-md style="padding-top: 5px;">
        <v-toolbar card color="transparent">
          <v-toolbar-items>
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Search"
              single-line
              hide-details
            />
            <v-autocomplete
              v-if="addMode && comboData"
              :items="comboData"
              v-model="marketings"
              label="Select Marketing to add"
              multiple
              item-text="name"
              item-value="id"
              autocomplete
              cache-items
              class="ml-1"
            />
          </v-toolbar-items>
          <v-spacer/>
          <Tbtn color="primary" icon="chevron_left" icon-mode tooltip-text="Back to List" @onClick="toHome"/>
          <Tbtn v-if="!addMode" color="primary" icon="add" icon-mode tooltip-text="Add Marketing" @onClick="addMode = true"/>  
          <Tbtn v-if="addMode" color="primary" icon="save" icon-mode tooltip-text="Save" @onClick="addMode = false"/>              
        </v-toolbar>
        <v-layout row wrap>
          <v-flex
            v-for="marketing in marketings"
            :key="marketing.id"
            md4 sm6 xs12
          >
            <v-card color="primary">
              <v-card-media
                :src="marketing.photo !== '' ? marketing.photo: '/images/user.png'"
                height="200px"
              >
                <v-container
                  fill-height
                  fluid
                  pa-2
                >
                  <v-layout fill-height>
                    <v-flex xs12 align-end flexbox>
                      <span class="headline primary--text" v-text="marketing.name"/>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-media>

              <v-card-actions>
                <v-spacer/>
                <v-btn icon>
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { global } from "~/mixins"
import { MARKETING_URL, ADD_MARKETING_URL } from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"
import debounce from "lodash/debounce"
export default {
  mixins: [global],
  data() {
    return {
      showForm: false,
      marketings: [],
      addMode: false
    }
  },
  watch: {
    search() {
      if (this.search != "") {
        this.searchMarketing()
      }
    }
  },
  mounted() {
    this.getMarketings()
  },
  methods: {
    toHome() {
      this.$router.push("/supervisors")
    },
    async getMarketings() {
      try {
        if (this.currentEdit) {
          this.loading = true
          const { page, rowsPerPage } = this.pagination
          const endPoint = `${MARKETING_URL}?page=${page}&limit=${rowsPerPage}&search=${
            this.search
          }&role_id=3&supervisor_id=${this.currentEdit.id}`
          const resp = await axios.get(endPoint).then(res => res.data)
          this.marketings = resp.data
          this.totalItems = resp.meta.total
          this.loading = true
        }
      } catch (error) {
        this.loading = false
        catchError(error)
      }
    },

    searchMarketing: debounce(function() {
      this.getMarketings()
    }, 300),

    async addMarketing() {
      try {
        this.loading = true
        if (this.marketings.length > 0 && this.currentEdit) {
          let data = {
            supervisor_id: this.currentEdit.id,
            marketings: this.marketings
          }
          const resp = await axios
            .post(ADD_MARKETING_URL, data)
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          this.getMarketings()
          showNoty("Marketing added.", "success")
          this.addMode = false
        } else {
          this.addMode = false
        }
      } catch (e) {
        this.loading = false
        this.addMode = false
        catchError(e)
      }
    }
  }
}
</script>

<style scoped>
</style>
