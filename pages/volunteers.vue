<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Volunteers</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>

      <v-dialog lazy origin persistent v-model="addDialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
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
                      :error-messages="volunteerNameErrors"
                      name="volunteername"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="volunteername"
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
                >Save</v-btn>
                <v-btn color="blue darken-1" flat @click="addDialog = !addDialog">Cancel</v-btn>
              </v-card-actions>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>

      <v-dialog v-model="editDialog" max-width="500px">
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
                      :error-messages="volunteerNameErrors"
                      name="volunteername"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="volunteer.name"
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
                >Update</v-btn>
                <v-btn color="blue darken-1" flat @click="editDialog = !editDialog">Cancel</v-btn>
              </v-card-actions>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table :headers="headers" :items="volunteers" class="elevation-1">
      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.created_at }}</td>
        <td>{{ props.item.updated_at }}</td>
        <td class="justify-center layout px-0">
          <v-icon small class="mr-2" @click="editItem(props.item.id)">edit</v-icon>
          <v-icon small @click="deleteItem(props.item.id)">delete</v-icon>
        </td>
      </template>
    </v-data-table>
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
  async fetch({ store }) {
    await store.dispatch('getVolunteers')
  },
  asyncData() {
    return {
      name: process.static ? 'static' : process.server ? 'server' : 'client'
    }
  },
  data: () => ({
    addDialog: false,
    editDialog: false,
    loader: null,
    loading: false,
    volunteername: '',
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Created', value: 'created_at' },
      { text: 'Updated', value: 'updated_at' },
      { text: 'Actions', align: 'center', value: 'id', sortable: false }
    ]
  }),

  computed: {
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
  methods: {
    save() {
      if (!this.$v.volunteername.$invalid) {
        this.$store.dispatch('addVolunteer', {
          name: this.volunteername
        })

        this.addDialog = false

        this.volunteername = ''

        setTimeout(() => {
          this.$store.dispatch('getVolunteers')
        }, 700)
      } else if ((this.$v.volunteername.$invalid, (this.addDialog = true))) {
        this.$v.$touch()
      }
    },

    editItem(item) {
      this.$store.dispatch('getVolunteer', {
        id: item
      })
      this.editDialog = true
    },

    update() {
      var today = new Date()
      var dd = today.getDate()
      var mm = today.getMonth() + 1 //January is 0!

      var yyyy = today.getFullYear()
      if (dd < 10) {
        dd = '0' + dd
      }
      if (mm < 10) {
        mm = '0' + mm
      }
      var today = dd + '-' + mm + '-' + yyyy

      this.$store.dispatch('updateVolunteer', {
        id: this.volunteer.id,
        name: this.volunteer.name,
        updated_at: today
      })

      this.editDialog = false

      setTimeout(() => {
        this.$store.dispatch('getVolunteers')
      }, 700)
    },

    deleteItem(item) {
      confirm('Are you sure you want to delete this item?') &&
        this.$store.dispatch('removeVolunteer', {
          id: item
        })
      setTimeout(() => {
        this.$store.dispatch('getVolunteers')
      }, 700)
    }
  }
}
</script>