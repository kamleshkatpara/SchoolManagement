<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Volunteers</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>

      <v-dialog v-model="addDialog" lazy origin persistent max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on" @click="$v.$reset"
            >New Item</v-btn
          >
        </template>
        <v-card>
          <v-form novalidate="novalidate" class="form" @submit.prevent="save">
            <v-card-text>
              <v-card-title>
                <span class="headline">Add Volunteer</span>
              </v-card-title>
              <v-container>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="volunteername"
                      :error-messages="volunteerNameErrors"
                      name="volunteername"
                      color="orange"
                      browser-autocomplete="off"
                      placeholder="Volunteer Name"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :loading="loading"
                  :disabled="loading"
                  color="blue darken-1"
                  flat
                  type="submit"
                  @click.native="loader = 'loading'"
                  >Save</v-btn
                >
                <v-btn color="blue darken-1" flat @click="addClose"
                  >Cancel</v-btn
                >
              </v-card-actions>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editDialog" lazy origin persistent max-width="500px">
        <v-card>
          <v-form novalidate="novalidate" class="form" @submit.prevent="update">
            <v-card-text>
              <v-card-title>
                <span class="headline">Edit Volunteer</span>
              </v-card-title>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="volunteer.name"
                      :error-messages="volunteerNameErrors"
                      name="volunteername"
                      color="orange"
                      browser-autocomplete="off"
                      placeholder="Volunteer Name"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  :loading="loading"
                  :disabled="loading"
                  color="blue darken-1"
                  flat
                  type="submit"
                  @click.native="loader = 'loading'"
                  >Update</v-btn
                >
                <v-btn color="blue darken-1" flat @click="editClose"
                  >Cancel</v-btn
                >
              </v-card-actions>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-btn
          fab
          dark
          small
          color="green"
          title="refresh data"
          @click="refreshData"
        >
          <v-icon dark>refresh</v-icon>
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="volunteers"
        :search="search"
        hide-actions
        :pagination.sync="pagination"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.created_at | moment('DD / MM / YYYY') }}</td>
          <td v-if="props.item.updated_at == null"></td>
          <td v-if="props.item.updated_at != null">
            {{ props.item.updated_at | moment('DD / MM / YYYY') }}
          </td>
          <td class="justify-center layout px-0">
            <v-icon
              small
              class="mr-2"
              @click="editItem(props.item.id) && $v.$reset"
              >edit</v-icon
            >
            <v-icon small @click="deleteItem(props.item.id)">delete</v-icon>
          </td>
        </template>
      </v-data-table>

      <div class="text-xs-center pt-2">
        <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
      </div>
      <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" top>
        {{ status }}
        <v-icon dark size="10" @click="snackbar = false"
          >fas fa-times fa-xs</v-icon
        >
      </v-snackbar>
    </v-card>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, helpers } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    volunteername: {
      required,
      minLength: minLength(2)
    }
  },
  data: () => ({
    addDialog: false,
    editDialog: false,
    loader: null,
    loading: false,
    pagination: {},
    search: '',
    snackbar: false,
    status: '',
    color: '',
    timeout: 2000,
    volunteername: '',
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Created', value: 'created_at' },
      { text: 'Updated', value: 'updated_at' },
      { text: 'Actions', align: 'center', value: 'id', sortable: false }
    ]
  }),
  computed: {
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    },
    volunteerNameErrors() {
      const errors = []
      if (!this.$v.volunteername.$dirty) return errors
      !this.$v.volunteername.minLength &&
        errors.push('Name seems to be very short')
      !this.$v.volunteername.required &&
        errors.push('Please enter volunteer name')
      return errors
    },
    volunteers() {
      return this.$store.state.volunteers
    },
    volunteer() {
      return this.$store.state.volunteer
    }
  },
  asyncData() {
    return {
      name: process.static ? 'static' : process.server ? 'server' : 'client'
    }
  },
  async fetch({ store }) {
    await store.dispatch('getVolunteers')
  },
  middleware: 'auth',
  methods: {
    addClose() {
      this.addDialog = false
      this.volunteername = ''
      this.$v.$reset()
    },
    editClose() {
      this.editDialog = false
      this.volunteername = ''
      this.$v.$reset()
    },
    save() {
      if (!this.$v.volunteername.$invalid) {
        this.$store.dispatch('addVolunteer', {
          name: this.volunteername,
          created_at: new Date()
        })

        this.addDialog = false

        this.volunteername = ''

        setTimeout(() => {
          this.$store.dispatch('getVolunteers')
        }, 700)
      } else if (this.$v.volunteername.$invalid) {
        ;(this.addDialog = true), this.$v.$touch()
      }
    },

    editItem(item) {
      this.$store.dispatch('getVolunteer', {
        id: item
      })
      this.editDialog = true
    },

    update() {
      if (this.volunteer.name !== '') {
        this.$store.dispatch('updateVolunteer', {
          id: this.volunteer.id,
          name: this.volunteer.name,
          created_at: this.volunteer.created_at,
          updated_at: new Date()
        })

        this.editDialog = false

        setTimeout(() => {
          this.$store.dispatch('getVolunteers')
        }, 700)
      } else if (this.volunteer.name === '')  {
        this.snackbar = true
        this.color = 'red darken-4'
        window.navigator.vibrate(200)
        this.status = 'Please enter volunteer name !'
      }
    },

    deleteItem(item) {
      if(confirm('Are you sure you want to delete this item?')) {
        this.$store.dispatch('removeVolunteer', {
          id: item
        })

        this.snackbar = true
        this.color = 'success darken-4'
        window.navigator.vibrate(200)
        this.status = 'Item deleted successfully'

        setTimeout(() => {
          this.$store.dispatch('getVolunteers')
        }, 700)
      }
    },
    refreshData() {
      this.$store.dispatch('getVolunteers')
    }
  }
}
</script>
