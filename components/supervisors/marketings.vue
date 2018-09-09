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
              class="mt-2"
            />
            <v-autocomplete
              v-if="addMode && comboData"
              :items="comboData"
              v-model="marketingsToAdd"
              label="Select Marketing to add"
              multiple
              item-text="name"
              item-value="id"
              autocomplete
              cache-items
              class="ml-1 mt-2"
            />
          </v-toolbar-items>
          <v-spacer/>
          <Tbtn color="primary" icon="chevron_left" icon-mode tooltip-text="Back to List" @onClick="toHome"/>
          <Tbtn v-if="!addMode" color="primary" icon="add" icon-mode tooltip-text="Add Marketing" @onClick="addMode = true"/>  
          <Tbtn v-if="addMode" color="primary" icon="save" icon-mode tooltip-text="Save" @onClick="addMarketing"/>      
          <Tbtn color="primary" icon="refresh" icon-mode tooltip-text="refresh" @onClick="repopulateData"/>              

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
                <v-btn icon @click="prepareForDelete(marketing.id)">
                  <v-icon>delete</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
    <Dialog :showDialog="showDialog" text="Are you sure want to delete ?" @onClose="clear" @onConfirmed="detachMarketing"/>
    <Loader :loading="loading"/>

  </div>
</template>

<script>
import { global } from "~/mixins"
import {
  MARKETING_URL,
  ADD_MARKETING_URL,
  DETACH_MARKETING_URL,
  COMBO_DATA_URL
} from "~/utils/apis"
import axios from "axios"
import catchError, { showNoty } from "~/utils/catchError"
import debounce from "lodash/debounce"
import Dialog from "~/components/Dialog"
import Loader from "~/components/Loader"

export default {
  components: { Dialog, Loader },
  mixins: [global],
  data() {
    return {
      showDialog: false,
      marketings: [],
      addMode: false,
      marketingsToAdd: [],
      marketingsToDelete: []
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
        this.activateLoader()

        if (this.currentEdit) {
          this.loading = true
          const { page, rowsPerPage } = this.pagination
          const endPoint = `${MARKETING_URL}?page=${page}&limit=${rowsPerPage}&search=${
            this.search
          }&role_id=3&supervisor_id=${this.currentEdit.id}`
          const resp = await axios.get(endPoint).then(res => res.data)
          this.marketings = resp.data
          this.totalItems = resp.meta.total
          this.loading = false
          this.deactivateLoader()
        }
      } catch (error) {
        this.loading = false
        this.deactivateLoader()

        catchError(error)
      }
    },

    searchMarketing: debounce(function() {
      this.getMarketings()
    }, 300),

    addMarketing() {
      this.activateLoader()

      this.loading = true
      if (this.marketingsToAdd.length > 0 && this.currentEdit) {
        let data = {
          supervisor_id: this.currentEdit.id,
          marketings: this.marketingsToAdd
        }
        axios
          .post(ADD_MARKETING_URL, data)
          .then(resp => {
            if (resp.status === 200) {
              showNoty("Marketing added.", "success")
              this.clear()
              this.repopulateData()
            } else this.clear()
          })
          .catch(e => {
            this.clear()
            this.deactivateLoader()
            catchError(e)
          })
      }
      this.deactivateLoader()
    },
    prepareForDelete(id) {
      this.marketingsToDelete.push(id)
      this.showDialog = true
    },
    async detachMarketing() {
      this.activateLoader()
      this.loading = true
      if (this.marketingsToDelete.length > 0 && this.currentEdit) {
        let data = {
          supervisor_id: this.currentEdit.id,
          marketings: this.marketingsToDelete
        }
        axios
          .put(DETACH_MARKETING_URL, data)
          .then(resp => {
            if (resp.status === 200) {
              showNoty("Marketing detached.", "success")
              this.clear()
              this.repopulateData()
            } else this.clear()
          })
          .catch(e => {
            this.clear()
            this.deactivateLoader()

            catchError(e)
          })
        this.deactivateLoader()
      }
    },

    repopulateData() {
      this.getMarketings()
      axios.get(COMBO_DATA_URL + "Marketing").then(resp => {
        if (resp.status === 200) {
          this.$store.commit("comboData", resp.data)
        }
      })
    },

    clear() {
      this.marketingsToAdd = []
      this.marketingsToDelete = []
      this.loading = false
      this.addMode = false
      this.showDialog = false
    }
  }
}
</script>

<style scoped>
</style>
