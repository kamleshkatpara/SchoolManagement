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
                      :search-input.sync="searchVolunteer"
                      hide-no-data
                      hide-selected
                      item-text="Volunteername"
                      placeholder="Please select volunteer"
                      return-object
                    ></v-autocomplete>

                    <v-layout wrap>
                      <v-flex xs12 sm6 md6>
                        <v-text-field v-model="score" placeholder="Please enter score"></v-text-field>
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
                                v-model="date"
                                placeholder="Assessment date"
                                prepend-icon="event"
                                readonly
                                v-on="on"
                              ></v-text-field>
                            </template>
                            <v-date-picker
                              ref="picker"
                              v-model="date"
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
  </div>
</template>


<script>
export default {
  data: () => ({
    student: null,
    searchStudent: null,
    assessment: null,
    searchAssessment: null,
    volunteer: null,
    score: '',
    date: null,
    menu: false,
    searchVolunteer: null,
    addDialog: false,
    editDialog: false,
    loader: null,
    loading: false
  }),

  computed: {
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
      console.log('student id => ' + this.student.id)
      console.log('assessment id => ' + this.assessment.id)
      console.log('assessment total_score => ' + this.assessment.total_score)
      console.log('volunteer id => ' + this.volunteer.id)
      console.log('volunteer id => ' + this.date)
    },
    save (date) {
      this.$refs.menu.save(date)
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
    menu (val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  }
}
</script>