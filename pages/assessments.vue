<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Assessments</v-toolbar-title>
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
                <span class="headline">Add Assessment</span>
              </v-card-title>
              <v-container>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>

                    <v-text-field
                      :error-messages="assessmentNameErrors"
                      name="assessmentname"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="assessmentname"
                      placeholder="Assessment Name"
                    ></v-text-field>

                    <v-select :items="assessmentTypes" v-model="assessmenttype"
                    :error-messages="assessmentTypeErrors" placeholder="Select Type" 
                    name="assessmenttype"
                    ></v-select>

                    <v-text-field
                      :error-messages="totalScoreErrors"
                      name="totalscore"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="total_score"
                      placeholder="Total Score"
                    ></v-text-field>

                    <v-text-field
                      name="parent_assessment_id"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="parent_assessment_id"
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
                <span class="headline">Edit Assessment</span>
              </v-card-title>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-text-field
                      :error-messages="assessmentNameErrors"
                      name="assessmentname"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="assessment.name"
                      placeholder="Assessment Name"
                    ></v-text-field>

                    <v-select :items="assessmentTypes" v-model="assessment.type"
                    :error-messages="assessmentTypeErrors" placeholder="Select Type" 
                    name="assessmenttype"
                    ></v-select>

                    <v-text-field
                      :error-messages="totalScoreErrors"
                      name="totalscore"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="assessment.total_score"
                      placeholder="Total Score"
                    ></v-text-field>

                    <v-text-field
                      name="parent_assessment_id"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="assessment.parent_assessment_id"
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
                >Update</v-btn>
                <v-btn color="blue darken-1" flat @click="editDialog = !editDialog">Cancel</v-btn>
              </v-card-actions>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      
    </v-toolbar>

    <v-data-table :headers="headers" :items="assessments" class="elevation-1">
      <template v-slot:items="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.type }}</td>
        <td>{{ props.item.total_score }}</td>
        <td>{{ props.item.parent_assessment_id }}</td>
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
import { required, minLength, minValue, numeric, helpers } from 'vuelidate/lib/validators'

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
  async fetch({ store }) {
    await store.dispatch('getAssessments')
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
    assessmentname: '',
    assessmentTypes: ["baseline","midline","endline"],
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
      !this.$v.total_score.required &&
        errors.push('Please enter total score')
      !this.$v.total_score.minValue &&
        errors.push('It should be minimum 10')
      return errors
    },
    assessments() {
      return this.$store.state.assessments
    },
    assessment() {
      return this.$store.state.assessment
    }
  },
  methods: {
    save() {
      if (!this.$v.assessmentname.$invalid &&
        !this.$v.assessmenttype.$invalid &&
        !this.$v.total_score.$invalid) {
        this.$store.dispatch('addAssessment', {
          name: this.assessmentname,
          type: this.assessmenttype,
          total_score: this.total_score,
          parent_assessment_id: this.parent_assessment_id
        })

        this.addDialog = false

        this.assessmentname = ''
        this.assessmenttype = '',
        this.total_score = '',
        this.parent_assessment_id = ''

        setTimeout(() => {
          this.$store.dispatch('getAssessments')
        }, 700)
      } else if ((this.$v.assessmentname.$invalid && 
      this.$v.assessmenttype.$invalid && this.$v.total_score.$invalid
      , (this.addDialog = true))) {
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

      this.$store.dispatch('updateAssessment', {
        id: this.assessment.id,
        name: this.assessment.name,
        type: this.assessment.type,
        total_score: this.assessment.total_score,
        parent_assessment_id: this.assessment.parent_assessment_id,
        updated_at: today
      })

      this.editDialog = false

      setTimeout(() => {
        this.$store.dispatch('getAssessments')
      }, 700)
    },

    deleteItem(item) {
      confirm('Are you sure you want to delete this item?') &&
        this.$store.dispatch('removeAssessment', {
          id: item
        })
      setTimeout(() => {
        this.$store.dispatch('getAssessments')
      }, 700)
    }
  }
}
</script>