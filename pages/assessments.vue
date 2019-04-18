<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Assessments</v-toolbar-title>
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
                <span class="headline">Add Assessment</span>
              </v-card-title>
              <v-container>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="assessmentname"
                      :error-messages="assessmentNameErrors"
                      name="assessmentname"
                      color="orange"
                      browser-autocomplete="off"
                      placeholder="Assessment Name"
                    ></v-text-field>

                    <v-select
                      v-model="assessmenttype"
                      :items="assessmentTypes"
                      :error-messages="assessmentTypeErrors"
                      placeholder="Select Type"
                      name="assessmenttype"
                    ></v-select>

                    <v-text-field
                      v-model="total_score"
                      :error-messages="totalScoreErrors"
                      name="totalscore"
                      color="orange"
                      browser-autocomplete="off"
                      placeholder="Total Score"
                    ></v-text-field>

                    <v-text-field
                      v-model="parent_assessment_id"
                      name="parent_assessment_id"
                      color="orange"
                      browser-autocomplete="off"
                      placeholder="Parent Assessment ID"
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
                <v-btn
                  color="blue darken-1"
                  flat
                  @click="addDialog = !addDialog"
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
                <span class="headline">Edit Assessment</span>
              </v-card-title>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      v-model="assessment.name"
                      :error-messages="assessmentNameErrors"
                      name="assessmentname"
                      color="orange"
                      browser-autocomplete="off"
                      placeholder="Assessment Name"
                    ></v-text-field>

                    <v-select
                      v-model="assessment.type"
                      :items="assessmentTypes"
                      :error-messages="assessmentTypeErrors"
                      placeholder="Select Type"
                      name="assessmenttype"
                    ></v-select>

                    <v-text-field
                      v-model="assessment.total_score"
                      :error-messages="totalScoreErrors"
                      name="totalscore"
                      color="orange"
                      browser-autocomplete="off"
                      placeholder="Total Score"
                    ></v-text-field>

                    <v-text-field
                      v-model="assessment.parent_assessment_id"
                      name="parent_assessment_id"
                      color="orange"
                      browser-autocomplete="off"
                      placeholder="Parent Assessment ID"
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
                <v-btn
                  color="blue darken-1"
                  flat
                  @click="editDialog = !editDialog"
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
        :search="search"
        hide-actions
        :pagination.sync="pagination"
        :items="assessments"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.type }}</td>
          <td>{{ props.item.total_score }}</td>
          <td>{{ props.item.parent_assessment_id }}</td>
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
    </v-card>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
    <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" top>
      {{ status }}
      <v-icon dark size="10" @click="snackbar = false"
        >fas fa-times fa-xs</v-icon
      >
    </v-snackbar>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength,
  minValue,
  numeric,
  helpers
} from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    assessmentname: {
      required,
      minLength: minLength(2)
    },
    assessmenttype: {
      required
    },
    total_score: {
      required,
      minValue: minValue(10),
      numeric
    }
  },
  data: () => ({
    addDialog: false,
    editDialog: false,
    pagination: {},
    search: '',
    loader: null,
    loading: false,
    snackbar: false,
    status: '',
    color: '',
    timeout: 2000,
    assessmentname: '',
    assessmentTypes: ['baseline', 'midline', 'endline'],
    assessmenttype: '',
    total_score: '',
    parent_assessment_id: '',
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Type', value: 'type' },
      { text: 'Score', value: 'total_score' },
      { text: 'ParentID', value: 'parent_assessment_id' },
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
    assessmentNameErrors() {
      const errors = []
      if (!this.$v.assessmentname.$dirty) return errors
      !this.$v.assessmentname.minLength &&
        errors.push('Name seems to be very short')
      !this.$v.assessmentname.required &&
        errors.push('Please enter assessment name')
      return errors
    },
    assessmentTypeErrors() {
      const errors = []
      if (!this.$v.assessmenttype.$dirty) return errors
      !this.$v.assessmenttype.required &&
        errors.push('Please select assessment type')
      return errors
    },
    totalScoreErrors() {
      const errors = []
      if (!this.$v.total_score.$dirty) return errors
      !this.$v.total_score.numeric &&
        errors.push('Score needs to be in numbers')
      !this.$v.total_score.required && errors.push('Please enter total score')
      !this.$v.total_score.minValue && errors.push('It should be minimum 10')
      return errors
    },
    assessments() {
      return this.$store.state.assessments
    },
    assessment() {
      return this.$store.state.assessment
    }
  },
  async fetch({ store }) {
    await store.dispatch('getAssessments')
  },
  middleware: 'auth',
  methods: {
    save() {
      if (
        !this.$v.assessmentname.$invalid &&
        !this.$v.assessmenttype.$invalid &&
        !this.$v.total_score.$invalid
      ) {
        this.$store.dispatch('addAssessment', {
          name: this.assessmentname,
          type: this.assessmenttype,
          total_score: this.total_score,
          parent_assessment_id: this.parent_assessment_id,
          created_at: new Date()
        })

        this.addDialog = false

        this.assessmentname = ''
        ;(this.assessmenttype = ''),
          (this.total_score = ''),
          (this.parent_assessment_id = '')

        setTimeout(() => {
          this.$store.dispatch('getAssessments')
        }, 700)
      } else if (
        (this.$v.assessmentname.$invalid &&
          this.$v.assessmenttype.$invalid &&
          this.$v.total_score.$invalid,
        (this.addDialog = true))
      ) {
        this.$v.$touch()
      }
    },

    editItem(item) {
      this.$store.dispatch('getAssessment', {
        id: item
      })
      this.editDialog = true
    },

    update() {
      if (this.assessment.name !== '' && this.assessment.total_score !== '') {
        this.$store.dispatch('updateAssessment', {
          id: this.assessment.id,
          name: this.assessment.name,
          type: this.assessment.type,
          total_score: this.assessment.total_score,
          parent_assessment_id: this.assessment.parent_assessment_id,
          created_at: this.assessment.created_at,
          updated_at: new Date()
        })

        this.editDialog = false

        setTimeout(() => {
          this.$store.dispatch('getAssessments')
        }, 700)
      } else if(this.assessment.name === '') {
          this.snackbar = true
          this.color = 'red darken-4'
          window.navigator.vibrate(200)
          this.status = 'Please enter assessment name !'
        }
       else if(this.assessment.total_score === '') {
          this.snackbar = true
          this.color = 'red darken-4'
          window.navigator.vibrate(200)
          this.status = 'Please enter total score !'
        }
    },
    deleteItem(item) {
      if(confirm('Are you sure you want to delete this item?')) {
        this.$store.dispatch('removeAssessment', {
          id: item
        })

        this.snackbar = true
        this.color = 'success darken-4'
        window.navigator.vibrate(200)
        this.status = 'Item deleted successfully'

        setTimeout(() => {
          this.$store.dispatch('getAssessments')
        }, 700)
      }
    },
    refreshData() {
      this.$store.dispatch('getAssessments')
    }
  }
}
</script>
