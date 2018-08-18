<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card dark>
        <v-container grid-list-md style="margin-top: 0px;">
          <v-card-title>
            <span class="headline primary--text">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <form>
              <v-layout wrap>
                <v-flex sm6 xs12>
                  <v-autocomplete
                    v-model="searchKey"
                    :items="searchKeys"
                    label="Select Search Key"
                    single-line
                    item-text="name"
                    item-value="id"
                  />
                </v-flex>
                <v-flex sm6 xs12>
                  <v-autocomplete
                    v-if="searchValCombo"
                    :items="searchValCombo"
                    v-model="searchVal"
                    label="Select Search Value"
                    single-line
                    item-text="name"
                    item-value="id"
                  />
                </v-flex>

                <v-flex sm6 xs12>
                  <label>Start Date</label>                
                  <v-menu
                    ref="menu"
                    :close-on-content-click="false"
                    v-model="menu"
                    :nudge-right="40"
                    :return-value.sync="start_date"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="start_date"
                      label="Pick a Start Date"
                      readonly
                    />
                    <v-date-picker v-model="start_date" @input="$refs.menu.save(start_date)"/>

                  </v-menu>
                </v-flex>

                <v-flex sm6 xs12>
                  <label>Start Time</label>                
                  <v-menu
                    ref="menuTime"
                    :close-on-content-click="false"
                    v-model="menuTime"
                    :nudge-right="40"
                    :return-value.sync="start_time"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="start_time"
                      label="Pick a Start Time"
                      readonly
                    />
                    <v-time-picker
                      v-if="menuTime"
                      v-model="start_time"
                      @change="$refs.menuTime.save(start_time)"
                    />
                  </v-menu>
                </v-flex>

                <v-flex sm6 xs12>
                  <label>End Date</label>                
                  <v-menu
                    ref="menu2"
                    :close-on-content-click="false"
                    v-model="menu2"
                    :nudge-right="40"
                    :return-value.sync="end_date"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="end_date"
                      label="Pick a Start Date"
                      readonly
                    />
                    <v-date-picker v-model="end_date" @input="$refs.menu2.save(end_date)"/>

                  </v-menu>
                </v-flex>

                <v-flex sm6 xs12>
                  <label>End Time</label>                
                  <v-menu
                    ref="menuTime2"
                    :close-on-content-click="false"
                    v-model="menuTime2"
                    :nudge-right="40"
                    :return-value.sync="end_time"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="end_time"
                      label="Pick a Start Time"
                      readonly
                    />
                    <v-time-picker
                      v-if="menuTime2"
                      v-model="end_time"
                      @change="$refs.menuTime2.save(end_time)"
                    />
                  </v-menu>
                </v-flex>
                <v-flex xs12>
                  <Tbtn :bottom="true" :tooltip-text="'Clear Dates'" color="primary" text="Clear Dates" @onClick="clearDates"/>

                </v-flex>
              </v-layout>
            </form>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary" flat @click.native="onClose">Close</v-btn>
            <v-btn color="primary" flat @click.native="submit">Search</v-btn>
          </v-card-actions>
        </v-container>
      </v-card>
    </v-dialog>
  </v-layout>
</template>
<script>
import { global } from "~/mixins"
export default {
  mixins: [global],
  props: {
    showSearch: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      dialog: false,
      formTitle: "Search for Schedulles",
      searchKeys: [
        { id: "clear", name: "Clear Search" },
        { id: "marketing_id", name: "Marketing Name" },
        { id: "marketing_action_id", name: "Marketing Action" },
        { id: "study_id", name: "Study Program" }
      ],
      searchKey: "",
      searchValCombo: null,
      searchVal: "",
      menu: false,
      menu2: false,
      menuTime: false,
      menuTime2: false,
      start_date: null,
      end_date: null,
      start_time: null,
      end_time: null
    }
  },
  watch: {
    showSearch() {
      this.dialog = this.showSearch
    },
    searchKey() {
      this.loadingCombo = true
      this.searchValCombo = null
      switch (this.searchKey) {
        case "marketing_id":
          if (this.comboData) this.searchValCombo = this.comboData
          break
        case "marketing_action_id":
          if (this.comboData3) this.searchValCombo = this.comboData3
          break
        case "study_id":
          if (this.comboData2) this.searchValCombo = this.comboData2
          break
        default:
          this.clearSearch()
          break
      }
    }
  },
  methods: {
    onClose() {
      this.clearSearch()
      this.$emit("onClose")
    },
    clearSearch() {
      this.searchKey = ""
      this.searchVal = ""
      this.searchValCombo = null
    },
    submit() {
      if (
        (this.searchKey !== "" && this.searchVal !== "") ||
        (this.start_date != null && this.end_date != null)
      ) {
        let data = {
          search_by: this.searchKey,
          search_query: this.searchVal,
          start_date: this.start_date + " " + this.start_time,
          end_date: this.end_date + " " + this.end_time
        }
        this.clearSearch()
        this.$emit("onSearch", data)
      }
    },
    clearDates() {
      this.start_date = null
      this.end_date = null
      this.start_time = null
      this.end_time = null
    }
  }
}
</script>
