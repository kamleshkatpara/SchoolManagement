<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Schools</v-toolbar-title>
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
                <span class="headline">Add School</span>
              </v-card-title>
              <v-container>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      :error-messages="schoolNameErrors"
                      name="school_name"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="school_name"
                      placeholder="School Name"
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
                <v-btn color="blue darken-1" flat @click="addClose">Cancel</v-btn>
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
                <span class="headline">Edit School</span>
              </v-card-title>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      :error-messages="schoolNameErrors"
                      name="school_name"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="school.school_name"
                      placeholder="School Name"
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
                <v-btn color="blue darken-1" flat @click="editClose">Cancel</v-btn>
              </v-card-actions>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
    </v-toolbar>

    <v-data-table :headers="headers" :items="schools" class="elevation-1">
      <template v-slot:items="props">
        <td>{{ props.item.school_name }}</td>
        <td>{{ props.item.created_at | moment("DD / MM / YYYY") }}</td>
        <td v-if="props.item.updated_at == null"></td>
        <td v-if="props.item.updated_at != null">{{ props.item.updated_at | moment("DD / MM / YYYY") }}</td>
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
    school_name: {
      required,
      minLength: minLength(2)
    }
  },
  async fetch({ store }) {
    await store.dispatch('getSchools')
  },
  asyncData() {
    return {
      name: process.static ? 'static' : process.server ? 'server' : 'client'
    }
  },
  middleware: 'auth',
  data: () => ({
    addDialog: false,
    editDialog: false,
    loader: null,
    loading: false,
    school_name: '',
    headers: [
      { text: 'Name', value: 'school_name' },
      { text: 'Created', value: 'created_at' },
      { text: 'Updated', value: 'updated_at' },
      { text: 'Actions', align: 'center', value: 'id', sortable: false }
    ]
  }),

  computed: {
    schoolNameErrors() {
      const errors = []
      if (!this.$v.school_name.$dirty) return errors
      !this.$v.school_name.minLength &&
        errors.push('Name seems to be very short')
      !this.$v.school_name.required &&
        errors.push('Please enter school name')
      return errors
    },
    schools() {
      return this.$store.state.schools
    },
    school() {
      return this.$store.state.school
    }
  },
  methods: {
    save() {
      if (!this.$v.school_name.$invalid) {
        this.$store.dispatch('addSchool', {
          school_name: this.school_name
        })

        this.addDialog = false

        this.school_name = ''

        setTimeout(() => {
          this.$store.dispatch('getSchools')
        }, 700)
      } else if ((this.$v.school_name.$invalid, (this.addDialog = true))) {
        this.$v.$touch()
      }
    },
    addClose() {
      this.addDialog = false
      this.$v.$reset()
    },
    editClose() {
      this.editDialog = false,
      this.$v.$reset()
    },
    editItem(item) {
      this.$store.dispatch('getSchool', {
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

      this.$store.dispatch('updateSchool', {
        id: this.school.id,
        school_name: this.school.school_name,
        updated_at: today
      })

      this.editDialog = false

      setTimeout(() => {
        this.$store.dispatch('getSchools')
      }, 700)
    },

    deleteItem(item) {
      confirm('Are you sure you want to delete this item?') &&
        this.$store.dispatch('removeSchool', {
          id: item
        })
      setTimeout(() => {
        this.$store.dispatch('getSchools')
      }, 700)
    }
  }
}
</script>