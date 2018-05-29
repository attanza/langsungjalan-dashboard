<template>
  <div>
    <h2 class="mb-3">Universities</h2>
    <v-card dark>
      <v-card-title>
        <v-btn color="primary" dark>Add</v-btn>
        <v-spacer/>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        :loading="loading"
        :pagination.sync="pagination"
        :total-items="totalItems"
        class="elevation-1"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td class="text-xs-left">{{ props.item.address }}</td>
          <td class="text-xs-left">{{ props.item.contact_person }}</td>
          <td class="text-xs-left">{{ props.item.phone }}</td>
          <td class="text-xs-left">{{ props.item.email }}</td>
          <td class="text-xs-left">{{ props.item.city }}</td>
          <td class="justify-center layout px-0">
            <v-btn icon class="mx-0">
              <v-icon color="white">remove_red_eye</v-icon>
            </v-btn>
            <v-btn icon class="mx-0">
              <v-icon color="white">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0">
              <v-icon color="primary">delete</v-icon>
            </v-btn>
          </td>
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="pupulateTable">Reset</v-btn>
        </template>
      </v-data-table>
    <!-- <UserForm 
      :dialog="showForm" 
      @close="close()" 
      :is-edit="isEdit"
      :item="itemEdit" 
      @addUser="addUser"
      @updateUser="updateUser"      
    />
    <ConfirmDialog :dialog="showConfirm" @close="closeDeleteConfirm" @confirm="deleteUser" :text="confirmMessage"/> -->
    </v-card>
  </div>
</template>
<script>
// import UserForm from "../components/forms/UserForm"
// import ConfirmDialog from "../components/ConfirmDialog"
import _ from "lodash"
import { universityList } from "~/utils/apis/universityApi"

// import RestoApi from "../utils/apis/RestoApi.js"
// const restoApi = new RestoApi()
export default {
  middleware: "auth",
  data: () => ({
    loading: false,
    showForm: false,
    isEdit: false,
    totalItems: 0,
    search: "",
    pagination: {
      sortBy: "",
      descending: false,
      page: 1,
      rowsPerPage: 10
    },
    headers: [
      { text: "Name", align: "left", value: "name" },
      { text: "Address", value: "address", align: "left" },
      { text: "Contact Person", value: "contact_person", align: "left" },
      { text: "Phone", value: "phone", align: "left" },
      { text: "Email", value: "email", align: "left" },
      { text: "City", value: "city", align: "left" },
      { text: "Actions", value: "name", sortable: false }
    ],
    items: [],
    itemEdit: {},
    userIdDelete: "",
    confirmMessage: "Are you sure want to delete this ?",
    showConfirm: false
  }),

  watch: {
    pagination: {
      handler() {
        this.pupulateTable()
      },
      deep: true
    },
    search() {
      if (this.search != "") {
        this.searchQuery()
      }
    }
  },

  mounted() {
    this.pupulateTable()
  },

  methods: {
    searchQuery: _.debounce(function() {
      this.pupulateTable()
    }, 500),
    async pupulateTable() {
      this.loading = true
      const { page, rowsPerPage, descending, sortBy } = this.pagination
      const res = await universityList(page, rowsPerPage, this.search)
      this.items = res.data
      this.totalItems = res.meta.total
      if (this.pagination.sortBy) {
        this.items = this.items.sort((a, b) => {
          const sortA = a[sortBy]
          const sortB = b[sortBy]

          if (descending) {
            if (sortA < sortB) return 1
            if (sortA > sortB) return -1
            return 0
          } else {
            if (sortA < sortB) return -1
            if (sortA > sortB) return 1
            return 0
          }
        })
      }
      this.loading = false
    }
    // editResto(item) {
    //   this.isEdit = true
    //   this.itemEdit = item
    //   this.showForm = true
    // },
    // close() {
    //   this.isEdit = false
    //   this.showForm = false
    //   this.itemEdit = {}
    // },
    // addUser(user) {
    //   this.items.push(user)
    // },
    // updateUser(user) {
    //   let index = _.findIndex(this.items, item => {
    //     return item.id == user.id
    //   })
    //   this.items.splice(index, 1, user)
    // },
    // showDeleteConfirm(id) {
    //   this.userIdDelete = id
    //   this.showConfirm = true
    // },
    // closeDeleteConfirm() {
    //   this.userIdDelete = ""
    //   this.showConfirm = false
    // },
    // deleteUser() {
    //   restoApi
    //     .deleteUser(this.userIdDelete)
    //     .then(res => {
    //       if (res.status === 200) {
    //         let index = _.findIndex(this.items, item => {
    //           return item.id == this.userIdDelete
    //         })
    //         this.items.splice(index, 1)
    //       }
    //     })
    //     .catch(e => console.log(e))
    //   this.showConfirm = false
    // }
  }
}
</script>
