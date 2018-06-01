<template>
  <div>
    <v-card>
      <div id="location"
           style="width: 100%; height: 60vh;">
        <gmap-map :center="location"
                  :zoom="12"
                  style="width: 100%; height: 60vh;">
          <gmap-marker :position="location"
                       :clickable="true"
                       :draggable="true"
                       @click="center=location"
                       @place_changed="setPlace"
                       @position_changed="markerDrag($event)"/>
        </gmap-map>
      </div>
      <v-card-actions>
        <gmap-autocomplete class="form-control" @place_changed="setPlace"/>
        <v-btn flat color="primary" @click="setLocation"><v-icon>save</v-icon></v-btn>
      </v-card-actions>
    </v-card>
    <Noty :snackbar="showNoty" :text="notyText" :color="notyColor" @onClose="showNoty = false"/>    
  </div>
</template>

<script>
import _ from "lodash"
import { global } from "~/mixins"
import { UNIVERSITY_URL } from "~/utils/apis"
import axios from "axios"
export default {
  mixins: [global],
  data: () => ({
    location: {
      lat: -6.17511,
      lng: 106.865039
    },
    markers: [
      {
        position: {
          lat: -6.17511,
          lng: 106.865039
        }
      }
    ],
    formData: {}
  }),
  mounted() {
    this.setInitLoc()
  },
  methods: {
    setPlace(place) {
      this.location.lat = place.geometry.location.lat()
      this.location.lng = place.geometry.location.lng()
    },
    markerDrag: _.debounce(function(position) {
      this.location.lat = position.lat()
      this.location.lng = position.lng()
    }, 500),
    async setLocation() {
      try {
        if (this.currentEdit) {
          for (var key in this.currentEdit) {
            if (this.currentEdit.hasOwnProperty(key)) {
              this.formData[key] = this.currentEdit[key]
            }
          }
          this.formData.lat = this.location.lat
          this.formData.lng = this.location.lng
          const resp = await axios
            .put(UNIVERSITY_URL + "/" + this.currentEdit.id, this.formData)
            .then(res => res.data)
          this.$store.commit("currentEdit", resp.data)
          this.showNoty = true
          this.notyText = "Map Saved"
        }
      } catch (e) {
        console.log(e)
      }
    },
    setInitLoc() {
      if (this.currentEdit) {
        this.location.lat = this.currentEdit.lat
        this.location.lng = this.currentEdit.lng
      }
    }
  }
}
</script>

<style scoped>
</style>
