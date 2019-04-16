<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Students</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>

      <v-dialog lazy origin persistent v-model="addDialog" max-width="700px">
        <template v-slot:activator="{ on }">
          <v-btn color="primary" dark class="mb-2" v-on="on" @click="$v.$reset">New Item</v-btn>
        </template>
        <v-card>
          <v-form novalidate="novalidate" class="form" @submit.prevent="save">
            <v-card-text>
              <v-card-title>
                <span class="headline">Add Student</span>
              </v-card-title>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="student_name"
                      :error-messages="studentNameErrors"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="student_name"
                      placeholder="Student Name"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="batch_no"
                      :error-messages="batchNoErrors"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="batch_no"
                      placeholder="Batch Number"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="role_no"
                      :error-messages="roleNoErrors"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="role_no"
                      placeholder="Roll Number"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
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
                          v-model="date_of_joining"
                          :error-messages="dojErrors"
                          placeholder="Assessment date"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        ref="picker"
                        v-model="date_of_joining"
                        :max="new Date().toISOString().substr(0, 10)"
                        min="1950-01-01"
                        @change="savedate"
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-select
                      :items="genders"
                      v-model="gender"
                      placeholder="Select Gender"
                      name="gender"
                      :error-messages="genderErrors"
                    ></v-select>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="medium"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="medium"
                      :error-messages="mediumErrors"
                      placeholder="Medium"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="father_name"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="father_name"
                      :error-messages="fatherNameErrors"
                      placeholder="Father's Name"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="father_occupation"
                      color="orange"
                      :error-messages="fatherOccupationErrors"
                      browser-autocomplete="off"
                      v-model="father_occupation"
                      placeholder="Father's Occupation"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="father_phone_number"
                      color="orange"
                      :error-messages="fatherPhoneNumberErrors"
                      browser-autocomplete="off"
                      v-model="father_phone_number"
                      placeholder="Father's Phone Number"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="mother_name"
                      color="orange"
                      :error-messages="motherNameErrors"
                      browser-autocomplete="off"
                      v-model="mother_name"
                      placeholder="Mother's Name"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="mother_occupation"
                      color="orange"
                      :error-messages="motherOccupationErrors"
                      browser-autocomplete="off"
                      v-model="mother_occupation"
                      placeholder="Mother's Occupation"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="mother_phone_number"
                      color="orange"
                      :error-messages="motherPhoneNumberErrors"
                      browser-autocomplete="off"
                      v-model="mother_phone_number"
                      placeholder="Mother's Phone Number"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <v-textarea
                      name="student_address"
                      placeholder="Address"
                      color="orange"
                      :error-messages="studentAddressErrors"
                      browser-autocomplete="off"
                      v-model="student_address"
                    ></v-textarea>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="student_locality"
                      color="orange"
                      browser-autocomplete="off"
                      :error-messages="studentLocalityErrors"
                      v-model="student_locality"
                      placeholder="Locality"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="student_area"
                      color="orange"
                      :error-messages="studentAreaErrors"
                      browser-autocomplete="off"
                      v-model="student_area"
                      placeholder="Area"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="student_city"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="student_city"
                      :error-messages="studentCityErrors"
                      placeholder="City"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="no_of_siblings"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="no_of_siblings"
                      :error-messages="noOfSiblingsErrors"
                      placeholder="No. of Siblings"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="student_shoe_size"
                      color="orange"
                      :error-messages="shoeSizeErrors"
                      browser-autocomplete="off"
                      v-model="student_shoe_size"
                      placeholder="Shoe Size"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="student_shirt_size"
                      color="orange"
                      :error-messages="shirtSizeErrors"
                      browser-autocomplete="off"
                      v-model="student_shirt_size"
                      placeholder="Shirt Size"
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

      <v-dialog lazy origin persistent v-model="editDialog" max-width="700px">
        <v-card>
          <v-form novalidate="novalidate" class="form" @submit.prevent="update">
            <v-card-text>
              <v-card-title>
                <span class="headline">Edit Student</span>
              </v-card-title>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="student_name"
                      :error-messages="studentNameErrors"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="student.name"
                      placeholder="Student Name"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="batch_no"
                      :error-messages="batchNoErrors"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="student.batch_no"
                      placeholder="Batch Number"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="role_no"
                      :error-messages="roleNoErrors"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="student.role_no"
                      placeholder="Roll Number"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-menu
                      ref="menu"
                      v-model="menu2"
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
                          v-model="date_of_joining"
                          :error-messages="dojErrors"
                          placeholder="Date Of Joining"
                          prepend-icon="event"
                          readonly
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        ref="picker"
                        v-model="date_of_joining"
                        :max="new Date().toISOString().substr(0, 10)"
                        min="1950-01-01"
                        @change="saveupdatedate"
                      ></v-date-picker>
                    </v-menu>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-select
                      :items="genders"
                      v-model="student.gender"
                      placeholder="Select Gender"
                      name="gender"
                      :error-messages="genderErrors"
                    ></v-select>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="medium"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="student.medium"
                      :error-messages="mediumErrors"
                      placeholder="Medium"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="father_name"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="student.father_name"
                      :error-messages="fatherNameErrors"
                      placeholder="Father's Name"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="father_occupation"
                      color="orange"
                      :error-messages="fatherOccupationErrors"
                      browser-autocomplete="off"
                      v-model="student.father_occupation"
                      placeholder="Father's Occupation"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="father_phone_number"
                      color="orange"
                      :error-messages="fatherPhoneNumberErrors"
                      browser-autocomplete="off"
                      v-model="student.father_phone_number"
                      placeholder="Father's Phone Number"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="mother_name"
                      color="orange"
                      :error-messages="motherNameErrors"
                      browser-autocomplete="off"
                      v-model="student.mother_name"
                      placeholder="Mother's Name"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="mother_occupation"
                      color="orange"
                      :error-messages="motherOccupationErrors"
                      browser-autocomplete="off"
                      v-model="student.mother_occupation"
                      placeholder="Mother's Occupation"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="mother_phone_number"
                      color="orange"
                      :error-messages="motherPhoneNumberErrors"
                      browser-autocomplete="off"
                      v-model="student.mother_phone_number"
                      placeholder="Mother's Phone Number"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm12 md12>
                    <v-textarea
                      name="student_address"
                      placeholder="Address"
                      color="orange"
                      :error-messages="studentAddressErrors"
                      browser-autocomplete="off"
                      v-model="student.address"
                    ></v-textarea>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="student_locality"
                      color="orange"
                      browser-autocomplete="off"
                      :error-messages="studentLocalityErrors"
                      v-model="student.locality"
                      placeholder="Locality"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="student_area"
                      color="orange"
                      :error-messages="studentAreaErrors"
                      browser-autocomplete="off"
                      v-model="student.area"
                      placeholder="Area"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="student_city"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="student.city"
                      :error-messages="studentCityErrors"
                      placeholder="City"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="no_of_siblings"
                      color="orange"
                      browser-autocomplete="off"
                      v-model="student.no_of_siblings"
                      :error-messages="noOfSiblingsErrors"
                      placeholder="No. of Siblings"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="student_shoe_size"
                      color="orange"
                      :error-messages="shoeSizeErrors"
                      browser-autocomplete="off"
                      v-model="student.shoe_size"
                      placeholder="Shoe Size"
                    ></v-text-field>
                  </v-flex>

                  <v-flex xs12 sm6 md4>
                    <v-text-field
                      name="student_shirt_size"
                      color="orange"
                      :error-messages="shirtSizeErrors"
                      browser-autocomplete="off"
                      v-model="student.shirt_size"
                      placeholder="Shirt Size"
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

    <v-card>
      <v-card-title>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <v-btn fab dark small color="green" title="refresh data" @click="refreshData">
          <v-icon dark>refresh</v-icon>
        </v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :search="search"
        hide-actions
        :pagination.sync="pagination"
        :items="students"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.batch_no }}</td>
          <td>{{ props.item.role_no }}</td>
          <td>{{ props.item.medium }}</td>
          <td>{{ props.item.created_at | moment("DD / MM / YYYY") }}</td>
          <td v-if="props.item.updated_at == null"></td>
          <td
            v-if="props.item.updated_at != null"
          >{{ props.item.updated_at | moment("DD / MM / YYYY") }}</td>
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item.id) && $v.$reset">edit</v-icon>
            <v-icon small @click="deleteItem(props.item)">delete</v-icon>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
    <v-snackbar v-model="snackbar" :color="color" :timeout="timeout" top>
      {{ this.status
      }}
      <v-icon dark size="10" @click="snackbar = false">fas fa-times fa-xs</v-icon>
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
  alpha,
  alphaNum,
  helpers
} from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],
  validations: {
    student_name: {
      required,
      minLength: minLength(2)
    },
    batch_no: {
      required,
      minLength: minLength(1),
      alphaNum
    },
    role_no: {
      required,
      minLength: minLength(1),
      alphaNum
    },
    date_of_joining: {
      required
    },
    gender: {
      required
    },
    medium: {
      required,
      minLength: minLength(2),
      alpha
    },
    father_name: {
      required,
      minLength: minLength(3)
    },
    father_occupation: {
      required,
      minLength: minLength(4)
    },
    father_phone_number: {
      required,
      numeric,
      minLength: minLength(10)
    },
    mother_name: {
      required,
      minLength: minLength(3)
    },
    mother_occupation: {
      required,
      minLength: minLength(4)
    },
    mother_phone_number: {
      required,
      numeric,
      minLength: minLength(10)
    },
    student_address: {
      required,
      minLength: minLength(10)
    },
    student_locality: {
      required,
      minLength: minLength(3)
    },
    student_area: {
      required,
      minLength: minLength(3)
    },
    student_city: {
      required,
      minLength: minLength(3)
    },
    no_of_siblings: {
      required,
      numeric,
      minLength: minLength(1)
    },
    student_shoe_size: {
      required,
      numeric,
      minLength: minLength(1)
    },
    student_shirt_size: {
      required,
      numeric,
      minLength: minLength(1)
    }
  },
  async fetch({ store }) {
    await store.dispatch('getStudents')
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
    date_of_joining: '',
    menu: false,
    menu2: false,
    student_name: '',
    batch_no: '',
    role_no: '',
    genders: ['M', 'F'],
    gender: '',
    medium: '',
    father_name: '',
    father_occupation: '',
    father_phone_number: '',
    mother_name: '',
    mother_occupation: '',
    mother_phone_number: '',
    student_address: '',
    student_locality: '',
    student_area: '',
    student_city: '',
    no_of_siblings: '',
    student_shoe_size: '',
    student_shirt_size: '',
    statuses: ['active', 'inactive'],
    status: '',
    headers: [
      { text: 'Name', value: 'name' },
      { text: 'Batch#', value: 'batch_no' },
      { text: 'Role#', value: 'role_no' },
      { text: 'Medium', value: 'medium' },
      { text: 'Created', value: 'created_at' },
      { text: 'Updated', value: 'updated_at' },
      { text: 'Actions', align: 'center', value: 'id', sortable: false }
    ]
  }),
  middleware: 'auth',
  computed: {
    studentNameErrors() {
      const errors = []
      if (!this.$v.student_name.$dirty) return errors
      !this.$v.student_name.minLength &&
        errors.push('Name seems to be very short')
      !this.$v.student_name.required && errors.push('Please enter student name')
      return errors
    },
    batchNoErrors() {
      const errors = []
      if (!this.$v.batch_no.$dirty) return errors
      !this.$v.batch_no.minLength &&
        errors.push('Batch Number seems to be very short')
      !this.$v.batch_no.alphaNum &&
        errors.push('No special characters allowed !')
      !this.$v.batch_no.required && errors.push('Please enter batch number')
      return errors
    },
    roleNoErrors() {
      const errors = []
      if (!this.$v.role_no.$dirty) return errors
      !this.$v.role_no.minLength &&
        errors.push('Role Number seems to be very short')
      !this.$v.role_no.required && errors.push('Please enter role number')
      !this.$v.role_no.alphaNum &&
        errors.push('No special characters allowed !')
      return errors
    },
    dojErrors() {
      const errors = []
      if (!this.$v.date_of_joining.$dirty) return errors
      !this.$v.date_of_joining.required &&
        errors.push('Please enter date of joining')
      return errors
    },
    genderErrors() {
      const errors = []
      if (!this.$v.gender.$dirty) return errors
      !this.$v.gender.required && errors.push('Please enter role number')
      return errors
    },
    mediumErrors() {
      const errors = []
      if (!this.$v.medium.$dirty) return errors
      !this.$v.medium.minLength && errors.push('Medium seems to be very short')
      !this.$v.medium.required && errors.push('Please enter medium')
      !this.$v.medium.alpha && errors.push('No special characters allowed !')
      return errors
    },
    fatherNameErrors() {
      const errors = []
      if (!this.$v.father_name.$dirty) return errors
      !this.$v.father_name.minLength &&
        errors.push('Father Name seems to be very short')
      !this.$v.father_name.required && errors.push('Please enter father name')
      return errors
    },
    fatherOccupationErrors() {
      const errors = []
      if (!this.$v.father_occupation.$dirty) return errors
      !this.$v.father_occupation.minLength &&
        errors.push('Father occupation seems to be very short')
      !this.$v.father_occupation.required &&
        errors.push('Please enter father occupation')
      return errors
    },
    fatherPhoneNumberErrors() {
      const errors = []
      if (!this.$v.father_phone_number.$dirty) return errors
      !this.$v.father_phone_number.minLength &&
        errors.push('Father phone number seems to be very short')
      !this.$v.father_phone_number.required &&
        errors.push('Please enter Father Phone Number')
      !this.$v.father_phone_number.numeric &&
        errors.push('Father phone number needs to be numeric')
      return errors
    },
    motherNameErrors() {
      const errors = []
      if (!this.$v.mother_name.$dirty) return errors
      !this.$v.mother_name.minLength &&
        errors.push('Mother Name seems to be very short')
      !this.$v.mother_name.required && errors.push('Please enter mother name')
      return errors
    },
    motherOccupationErrors() {
      const errors = []
      if (!this.$v.father_occupation.$dirty) return errors
      !this.$v.mother_occupation.minLength &&
        errors.push('Mother occupation seems to be very short')
      !this.$v.mother_occupation.required &&
        errors.push('Please enter mother occupation')
      return errors
    },
    motherPhoneNumberErrors() {
      const errors = []
      if (!this.$v.mother_phone_number.$dirty) return errors
      !this.$v.mother_phone_number.minLength &&
        errors.push('Mother phone number seems to be very short')
      !this.$v.mother_phone_number.required &&
        errors.push('Please enter Mother Phone Number')
      !this.$v.mother_phone_number.numeric &&
        errors.push('Mother phone number needs to be numeric')
      return errors
    },
    studentAddressErrors() {
      const errors = []
      if (!this.$v.student_address.$dirty) return errors
      !this.$v.student_address.minLength &&
        errors.push('Student Address seems to be very short')
      !this.$v.student_address.required &&
        errors.push('Please enter student address')
      return errors
    },
    studentLocalityErrors() {
      const errors = []
      if (!this.$v.student_locality.$dirty) return errors
      !this.$v.student_locality.minLength &&
        errors.push('Student Locality seems to be very short')
      !this.$v.student_locality.required &&
        errors.push('Please enter student locality')
      return errors
    },
    studentAreaErrors() {
      const errors = []
      if (!this.$v.student_area.$dirty) return errors
      !this.$v.student_area.minLength &&
        errors.push('Student area seems to be very short')
      !this.$v.student_area.required && errors.push('Please enter student area')
      return errors
    },
    studentCityErrors() {
      const errors = []
      if (!this.$v.student_city.$dirty) return errors
      !this.$v.student_city.minLength &&
        errors.push('Student City seems to be very short')
      !this.$v.student_city.required && errors.push('Please enter student city')
      return errors
    },
    noOfSiblingsErrors() {
      const errors = []
      if (!this.$v.no_of_siblings.$dirty) return errors
      !this.$v.no_of_siblings.minLength &&
        errors.push('No of siblings seems to be very short')
      !this.$v.no_of_siblings.required &&
        errors.push('Please enter no. of siblings')
      !this.$v.no_of_siblings.numeric &&
        errors.push('No. of siblings needs to be numeric')
      return errors
    },
    shoeSizeErrors() {
      const errors = []
      if (!this.$v.student_shoe_size.$dirty) return errors
      !this.$v.student_shoe_size.minLength &&
        errors.push('Shoe size seems to be very short')
      !this.$v.student_shoe_size.required &&
        errors.push('Please enter shoe size')
      !this.$v.student_shoe_size.numeric &&
        errors.push('Shoe size needs to be numeric')
      return errors
    },
    shirtSizeErrors() {
      const errors = []
      if (!this.$v.student_shirt_size.$dirty) return errors
      !this.$v.student_shirt_size.minLength &&
        errors.push('Shirt size seems to be very short')
      !this.$v.student_shirt_size.required &&
        errors.push('Please enter shirt size')
      !this.$v.student_shirt_size.numeric &&
        errors.push('Shirt Size needs to be numeric')
      return errors
    },
    students() {
      return this.$store.state.students
    },
    student() {
      return this.$store.state.student
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
    menu(val) {
      val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
    }
  },
  methods: {
    save() {
      if (
        !this.$v.student_name.$invalid &&
        !this.$v.batch_no.$invalid &&
        !this.$v.role_no.$invalid &&
        !this.$v.date_of_joining.$invalid &&
        !this.$v.gender.$invalid &&
        !this.$v.medium.$invalid &&
        !this.$v.father_name.$invalid &&
        !this.$v.father_occupation.$invalid &&
        !this.$v.father_phone_number.$invalid &&
        !this.$v.mother_name.$invalid &&
        !this.$v.mother_occupation.$invalid &&
        !this.$v.mother_phone_number.$invalid &&
        !this.$v.student_address.$invalid &&
        !this.$v.student_locality.$invalid &&
        !this.$v.student_area.$invalid &&
        !this.$v.student_city.$invalid &&
        !this.$v.no_of_siblings.$invalid &&
        !this.$v.student_shoe_size.$invalid &&
        !this.$v.student_shirt_size.$invalid
      ) {
        this.$store.dispatch('addStudent', {
          name: this.student_name,
          batch_no: this.batch_no,
          role_no: this.role_no,
          date_of_joining: this.date_of_joining,
          gender: this.gender,
          medium: this.medium,
          father_name: this.father_name,
          father_occupation: this.father_occupation,
          father_phone_number: this.father_phone_number,
          mother_name: this.mother_name,
          mother_occupation: this.mother_occupation,
          mother_phone_number: this.mother_phone_number,
          address: this.student_address,
          locality: this.student_locality,
          area: this.student_area,
          city: this.student_city,
          no_of_siblings: this.no_of_siblings,
          shoe_size: this.student_shoe_size,
          shirt_size: this.student_shirt_size,
          status: 'active',
          created_at: new Date()
        })

        this.addDialog = false

        this.student_name = ''
        this.batch_no = ''
        this.role_no = ''
        this.date_of_joining
        this.gender = ''
        this.medium = ''
        this.father_name = ''
        this.father_occupation = ''
        this.father_phone_number = ''
        this.mother_name = ''
        this.mother_occupation = ''
        this.mother_phone_number = ''
        this.student_address = ''
        this.student_locality = ''
        this.student_area = ''
        this.student_city = ''
        this.no_of_siblings = ''
        this.student_shoe_size = ''
        this.student_shirt_size = ''

        setTimeout(() => {
          this.$store.dispatch('getStudents')
        }, 700)
      } else if (
        this.$v.student_name.$invalid &&
        this.$v.batch_no.$invalid &&
        this.$v.role_no.$invalid &&
        this.$v.date_of_joining.$invalid &&
        this.$v.gender.$invalid &&
        this.$v.medium.$invalid &&
        this.$v.father_name.$invalid &&
        this.$v.father_occupation.$invalid &&
        this.$v.father_phone_number.$invalid &&
        this.$v.mother_name.$invalid &&
        this.$v.mother_occupation.$invalid &&
        this.$v.mother_phone_number.$invalid &&
        this.$v.student_address.$invalid &&
        this.$v.student_locality.$invalid &&
        this.$v.student_area.$invalid &&
        this.$v.student_city.$invalid &&
        this.$v.no_of_siblings.$invalid &&
        this.$v.student_shoe_size.$invalid &&
        this.$v.student_shirt_size.$invalid
      )
        this.addDialog = true
      {
        this.$v.$touch()
      }
    },

    editItem(item) {
      this.$store.dispatch('getStudent', {
        id: item
      })
      this.editDialog = true
    },

    update() {
      this.$store.dispatch('updateStudent', {
        id: this.student.id,
        name: this.student.name,
        batch_no: this.student.batch_no,
        role_no: this.student.role_no,
        date_of_joining: this.student.date_of_joining,
        gender: this.student.gender,
        medium: this.student.medium,
        father_name: this.student.father_name,
        father_occupation: this.student.father_occupation,
        father_phone_number: this.student.father_phone_number,
        mother_name: this.student.mother_name,
        mother_occupation: this.student.mother_occupation,
        mother_phone_number: this.student.mother_phone_number,
        address: this.student.address,
        locality: this.student.locality,
        area: this.student.area,
        city: this.student.city,
        no_of_siblings: this.no_of_siblings,
        shoe_size: this.student.shoe_size,
        shirt_size: this.student.shirt_size,
        status: this.student.status,
        updated_at: new Date()
      })

      this.editDialog = false

      setTimeout(() => {
        this.$store.dispatch('getStudents')
      }, 700)
    },
    addClose() {
      this.addDialog = false
      this.student_name = ''
      this.batch_no = ''
      this.role_no = ''
      this.date_of_joining = ''
      this.gender = ''
      this.medium = ''
      this.father_name = ''
      this.father_occupation = ''
      this.father_phone_number = ''
      this.mother_name = ''
      this.mother_occupation = ''
      this.mother_phone_number = ''
      this.student_address = ''
      this.student_locality = ''
      this.student_area = ''
      this.student_city = ''
      this.no_of_siblings = ''
      this.student_shoe_size = ''
      this.student_shirt_size = ''
      this.$v.$reset()
    },
    editClose() {
      this.editDialog = false
      this.student_name = ''
      this.batch_no = ''
      this.role_no = ''
      this.date_of_joining = ''
      this.gender = ''
      this.medium = ''
      this.father_name = ''
      this.father_occupation = ''
      this.father_phone_number = ''
      this.mother_name = ''
      this.mother_occupation = ''
      this.mother_phone_number = ''
      this.student_address = ''
      this.student_locality = ''
      this.student_area = ''
      this.student_city = ''
      this.no_of_siblings = ''
      this.student_shoe_size = ''
      this.student_shirt_size = ''
      this.$v.$reset()
    },
    deleteItem(item) {
      confirm('Are you sure you want to delete this item?') &&
        this.$store.dispatch('removeStudent', {
          id: item.id,
          name: item.name,
          batch_no: item.batch_no,
          role_no: item.role_no,
          date_of_joining: item.date_of_joining,
          gender: item.gender,
          medium: item.medium,
          father_name: item.father_name,
          father_occupation: item.father_occupation,
          father_phone_number: item.father_phone_number,
          mother_name: item.mother_name,
          mother_occupation: item.mother_occupation,
          mother_phone_number: item.mother_phone_number,
          address: item.address,
          locality: item.locality,
          area: item.area,
          city: item.city,
          no_of_siblings: item.no_of_siblings,
          shoe_size: item.shoe_size,
          shirt_size: item.shirt_size,
          status: 'inactive',
          deleted_at: new Date()
        })

      this.snackbar = true
      this.color = 'success darken-4'
      window.navigator.vibrate(200)
      this.status = 'Item deleted successfully'

      setTimeout(() => {
        this.$store.dispatch('getStudents')
      }, 700)
    },
    savedate(date_of_joining) {
      this.$refs.menu.save(date_of_joining)
    },
    saveupdatedate(date_of_joining) {
      this.$refs.menu.save(date_of_joining)
    },
    refreshData() {
      this.$store.dispatch('getStudents')
    }
  }
}
</script>