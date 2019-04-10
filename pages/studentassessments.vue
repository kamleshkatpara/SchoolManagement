<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Student Assessments</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>

      <v-dialog lazy origin persistent v-model="addDialog" max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
        </template>
        <v-card>
          <v-form novalidate="novalidate" class="form" @submit.prevent="send">
            <v-card-text>
              <v-card-title>
                <span class="headline">Add Student Assessment</span>
              </v-card-title>
              <v-container>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-autocomplete
                      v-model="student"
                      :items="studentitems"
                      :error-messages="studentErrors"
                      :search-input.sync="searchStudent"
                      hide-no-data
                      hide-selected
                      item-text="Studentname"
                      placeholder="Please select student"
                      return-object
                    ></v-autocomplete>

                    <v-autocomplete
                      v-model="assessment"
                      :items="assessmentitems"
                      :error-messages="assessmentErrors"
                      :search-input.sync="searchAssessment"
                      hide-no-data
                      hide-selected
                      item-text="Assessmentname"
                      placeholder="Please select assessment"
                      return-object
                    ></v-autocomplete>

                    <v-autocomplete
                      v-model="volunteer"
                      :items="volunteeritems"
                      :error-messages="volunteerErrors"
                      :search-input.sync="searchVolunteer"
                      hide-no-data
                      hide-selected
                      item-text="Volunteername"
                      placeholder="Please select volunteer"
                      return-object
                    ></v-autocomplete>

                    <v-layout wrap>
                      <v-flex xs12 sm6 md6>
                        <v-text-field
                          v-model="score"
                          :error-messages="scoreErrors"
                          placeholder="Please enter score"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm6 md6>
                        <v-menu
                          ref="menu"
                          v-model="menu"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="assessmentdate"
                              :error-messages="assessmentDateErrors"
                              placeholder="Assessment date"
                              prepend-icon="event"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            ref="picker"
                            v-model="assessmentdate"
                            :max="new Date().toISOString().substr(0, 10)"
                            min="1950-01-01"
                            @change="save"
                          ></v-date-picker>
                        </v-menu>
                      </v-flex>
                    </v-layout>
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
    </v-toolbar>
    <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" top>
      {{ this.status
      }}
      <v-icon dark size="15" @click="snackbar = false">fas fa-times fa-xs</v-icon>
    </v-snackbar>
  </div>
</template>


<script>
import { validationMixin } from 'vuelidate'
import { required, minLength, helpers } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    student: {
      required
    },
    assessment: {
      required
    },
    volunteer: {
      required
    },
    score: {
      required
    },
    assessmentdate: {
      required
    }
  },
  data: () => ({
    snackbar: false,
    status: '',
    color: '',
    timeout: 6000,
    student: null,
    searchStudent: null,
    assessment: null,
    searchAssessment: null,
    volunteer: null,
    score: '',
    assessmentdate: null,
    menu: false,
    searchVolunteer: null,
    addDialog: false,
    editDialog: false,
    loader: null,
    loading: false
  }),
  computed: {
    studentErrors() {
      const errors = []
      if (!this.$v.student.$dirty) return errors
      !this.$v.student.required && errors.push('Please select student')
      return errors
    },
    assessmentErrors() {
      const errors = []
      if (!this.$v.assessment.$dirty) return errors
      !this.$v.assessment.required && errors.push('Please select assessment')
      return errors
    },
    volunteerErrors() {
      const errors = []
      if (!this.$v.volunteer.$dirty) return errors
      !this.$v.volunteer.required && errors.push('Please select volunteer')
      return errors
    },
    scoreErrors() {
      const errors = []
      if (!this.$v.score.$dirty) return errors
      !this.$v.score.required && errors.push('Please enter score')
      return errors
    },
    assessmentDateErrors() {
      const errors = []
      if (!this.$v.assessmentdate.$dirty) return errors
      !this.$v.assessmentdate.required &&
        errors.push('Please select assessment date')
      return errors
    },
    studentitems() {
      return this.studentnames.map(entry => {
        const Studentname = entry.name
        return Object.assign({}, entry, { Studentname })
      })
    },
    studentnames() {
      return this.$store.state.studentnames
    },
    assessmentitems() {
      return this.assessnames.map(entry => {
        const Assessmentname = entry.name
        return Object.assign({}, entry, { Assessmentname })
      })
    },
    assessnames() {
      return this.$store.state.assessmentnames
    },
    volunteeritems() {
      return this.volnames.map(entry => {
        const Volunteername = entry.name
        return Object.assign({}, entry, { Volunteername })
      })
    },
    volnames() {
      return this.$store.state.volunteernames
    }
  },
  methods: {
    send() {
      if (
        !this.$v.student.$invalid &&
        !this.$v.assessment.$invalid &&
        !this.$v.volunteer.$invalid &&
        !this.$v.score.$invalid &&
        !this.$v.assessmentdate.$invalid
      ) {
        if (this.score > this.assessment.total_score) {
          this.snackbar = true
          this.color = 'red darken-4'
          window.navigator.vibrate(200)
          this.status = 'Entered score is greater than Assessment Score !'
        } else {
          this.$store.dispatch('addStudentAssessment', {
            student_id: this.student.id,
            assessment_id: this.assessment.id,
            volunteer_id: this.volunteer.id,
            score: this.score,
            assessment_date: this.assessmentdate
          })
          this.addDialog = false
          setTimeout(() => {
            this.$store.dispatch('getStudentAssessments')
          }, 700)
        }
      } else if (
        this.$v.student.$invalid &&
        this.$v.assessment.$invalid &&
        this.$v.volunteer.$invalid &&
        this.$v.score.$invalid &&
        this.$v.assessmentdate.$invalid
      ) {
        this.$v.$touch()
      }
    },
    save(assessmentdate) {
      this.$refs.menu.save(assessmentdate)
    }
  },
  watch: {
    searchStudent(val) {
      if (this.studentitems.length > 0) return
      this.$store.dispatch('getStudentNames')
    },
    searchAssessment(val) {
      if (this.assessmentitems.length > 0) return
      this.$store.dispatch('getAssessmentNames')
    },
    searchVolunteer(val) {
      if (this.volunteeritems.length > 0) return
      this.$store.dispatch('getVolunteerNames')
    },
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  }
}
</script>