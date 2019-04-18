<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Student Assessments</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>

      <v-dialog v-model="addDialog" lazy origin persistent max-width="500px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on">New Item</v-btn>
        </template>
        <v-card>
          <v-form novalidate="novalidate" class="form" @submit.prevent="save">
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
                          :return-value.sync="assessmentdate"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="assessmentdate"
                              label="Picker in menu"
                              prepend-icon="event"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="assessmentdate"
                            no-title
                            scrollable
                          >
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="menu = false"
                              >Cancel</v-btn
                            >
                            <v-btn
                              flat
                              color="primary"
                              @click="$refs.menu.save(assessmentdate)"
                              >OK</v-btn
                            >
                          </v-date-picker>
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
                <span class="headline">Edit Student Assessment</span>
              </v-card-title>
              <v-container>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12>
                    <v-autocomplete
                      v-model="studentassessment.student"
                      :items="studentnames"
                      :filter="customFilter"
                      color="blue"
                      item-text="name"
                      label="Student"
                    ></v-autocomplete>

                    <v-autocomplete
                      v-model="studentassessment.assessment"
                      :items="assessnames"
                      :filter="customFilter"
                      color="blue"
                      item-text="name"
                      label="Assessment"
                    ></v-autocomplete>

                    <v-autocomplete
                      v-model="studentassessment.volunteer"
                      :items="volnames"
                      :filter="customFilter"
                      color="blue"
                      item-text="name"
                      label="Volunteer"
                    ></v-autocomplete>

                    <v-layout wrap>
                      <v-flex xs12 sm6 md6>
                        <v-text-field
                          v-model="studentassessment.score"
                          :error-messages="scoreErrors"
                          placeholder="Please enter score"
                        ></v-text-field>
                      </v-flex>

                      <v-flex xs12 sm6 md6>
                        <v-menu
                          ref="menu1"
                          v-model="menu1"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          :return-value.sync="studentassessment_assessment_date"
                          lazy
                          transition="scale-transition"
                          offset-y
                          full-width
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on }">
                            <v-text-field
                              v-model="studentassessment_assessment_date"
                              label="Picker in menu"
                              prepend-icon="event"
                              readonly
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="studentassessment_assessment_date"
                            no-title
                            scrollable
                          >
                            <v-spacer></v-spacer>
                            <v-btn flat color="primary" @click="menu1 = false"
                              >Cancel</v-btn
                            >
                            <v-btn
                              flat
                              color="primary"
                              @click="
                                $refs.menu1.save(
                                  studentassessment_assessment_date
                                )
                              "
                              >OK</v-btn
                            >
                          </v-date-picker>
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
        :items="studentassessments"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.student }}</td>
          <td>{{ props.item.assessment }}</td>
          <td>{{ props.item.volunteer }}</td>
          <td>{{ props.item.score }}</td>
          <td>{{ props.item.assessment_date | moment('DD / MM / YYYY') }}</td>
          <td>{{ props.item.created_at | moment('DD / MM / YYYY') }}</td>
          <td v-if="props.item.updated_at == null"></td>
          <td v-if="props.item.updated_at != null">
            {{ props.item.updated_at | moment('DD / MM / YYYY') }}
          </td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item)"
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
import { required, helpers } from 'vuelidate/lib/validators'

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
    pagination: {},
    search: '',
    student: null,
    searchStudent: null,
    assessment: null,
    searchAssessment: null,
    volunteer: null,
    score: '',
    assessmentdate: null,
    menu: false,
    menu1: false,
    searchVolunteer: null,
    addDialog: false,
    editDialog: false,
    loader: null,
    loading: false,
    studentassessment_assessment_date: null,
    headers: [
      { text: 'Student Name', value: 'studentname' },
      { text: 'Assessment', value: 'assessmentname' },
      { text: 'Volunteer Name', value: 'volunteername' },
      { text: 'Score', value: 'score' },
      { text: 'Assessment Date', value: 'assessment_date' },
      { text: 'Created', value: 'created_at' },
      { text: 'Updated', value: 'updated_at' },
      { text: 'Actions', align: 'center', value: 'id', sortable: false }
    ]
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
    assessmentId() {
      return this.$store.state.assessmentid
    },
    volunteeritems() {
      return this.volnames.map(entry => {
        const Volunteername = entry.name
        return Object.assign({}, entry, { Volunteername })
      })
    },
    volnames() {
      return this.$store.state.volunteernames
    },
    volunteerId() {
      return this.$store.state.volunteerid
    },
    studentassessments() {
      return this.$store.state.student_assessments
    },
    studentassessment() {
      return this.$store.state.student_assessment
    },
    studentId() {
      return this.$store.state.studentid
    },
    pages() {
      if (
        this.pagination.rowsPerPage == null ||
        this.pagination.totalItems == null
      )
        return 0

      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
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
    }
  },
  asyncData() {
    return {
      name: process.static ? 'static' : process.server ? 'server' : 'client'
    }
  },
  async fetch({ store }) {
    await store.dispatch('getStudentAssessments')
  },
  middleware: 'auth',
  methods: {
    save() {
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
    formatDate(date) {
      const d = new Date(date)
      let month = '' + (d.getMonth() + 1)
      let day = '' + d.getDate()
      const year = d.getFullYear()

      if (month.length < 2) month = '0' + month
      if (day.length < 2) day = '0' + day

      return [year, month, day].join('-')
    },
    editItem(item) {
      this.$store.dispatch('getStudentAssessment', {
        id: item.id
      })
      this.editDialog = true
      this.$store.dispatch('getStudentIDByName', {
        name: item.student
      })

      this.$store.dispatch('getAssessmentIDByName', {
        name: item.assessment
      })

      this.$store.dispatch('getVolunteerIDByName', {
        name: item.volunteer
      })

      this.studentassessment_assessment_date = this.formatDate(
        new Date(item.assessment_date)
      )
      this.$store.dispatch('getStudentNames')
      this.$store.dispatch('getAssessmentNames')
      this.$store.dispatch('getVolunteerNames')
    },
    update() {
      this.$store.dispatch('getStudentIDByName', {
        name: this.studentassessment.student
      })

      this.$store.dispatch('getAssessmentIDByName', {
        name: this.studentassessment.assessment
      })

      this.$store.dispatch('getVolunteerIDByName', {
        name: this.studentassessment.volunteer
      })

      if (this.studentassessment.score > this.assessmentId[0].total_score) {
        this.snackbar = true
        this.color = 'red darken-4'
        window.navigator.vibrate(200)
        this.status = 'Entered score is greater than Assessment Score !'
      }

      setTimeout(() => {
        this.$store.dispatch('updateStudentAssessment', {
          id: this.studentassessment.id,
          student_id: this.studentId[0].id,
          assessment_id: this.assessmentId[0].id,
          volunteer_id: this.volunteerId[0].id,
          score: this.studentassessment.score,
          assessment_date: this.studentassessment_assessment_date
        })
        this.editDialog = false
      }, 700)

      setTimeout(() => {
        this.$store.dispatch('getStudentAssessments')
      }, 900)
    },
    deleteItem(item) {
      if(confirm('Are you sure you want to delete this item?')) {
        this.$store.dispatch('removeStudentAssessment', {
          id: item
        })
        setTimeout(() => {
          this.$store.dispatch('getStudentAssessments')
        }, 700)
      }
    },
    customFilter(item, queryText, itemText) {
      const textOne = item.name.toLowerCase()
      const searchText = queryText.toLowerCase()
      return textOne.indexOf(searchText) > -1
    },
    refreshData() {
      this.$store.dispatch('getStudentAssessments')
    }
  }
}
</script>
