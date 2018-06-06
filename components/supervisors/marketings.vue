<template>
  <div class="main-wrapper">
    <v-container fluid grid-list-sm>
      <div class="header-wrapper">
        <div class="header-left">
          <h2 class="primary--text mb-3">Marketings</h2>
        </div>
        <div class="header-right">
          <v-btn color="primary" dark><v-icon>add</v-icon></v-btn>
        </div>
      </div>
      
      <v-layout row wrap>
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

export default {
  mixins: [global]
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
