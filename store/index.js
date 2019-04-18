export const strict = false

export const state = () => ({
  assessments: [],
  assessment: {},
  assessmentid: {},
  assessmentnames: [],
  schools: [],
  school: {},
  students: [],
  student: {},
  studentid: {},
  studentnames: [],
  volunteers: [],
  volunteernames: [],
  volunteer: {},
  volunteerid: {},
  studentAssessments: [],
  studentAssessment: {},
  authTokenId: '',
  authUserId: '',
  authUser: null,
  userStatus: '',
  userinfo: [],
  studentreports: [],
  errorMessage: ''
})

export const getters = {
  assessments: state => state.assessments,
  assessment: state => state.assessment,
  assessmentid: state => state.assessmentid,
  assessmentnames: state => state.assessmentnames,
  schools: state => state.schools,
  school: state => state.school,
  students: state => state.students,
  student: state => state.student,
  studentid: state => state.studentid,
  studentnames: state => state.studentnames,
  volunteers: state => state.volunteers,
  volunteer: state => state.volunteer,
  volunteerid: state => state.volunteerid,
  volunteernames: state => state.volunteernames,
  studentAssessments: state => state.studentAssessments,
  studentAssessment: state => state.studentAssessment,
  authTokenId: state => state.authTokenId,
  authUserId: state => state.authUserId,
  userStatus: state => state.userStatus,
  userinfo: state => state.userinfo,
  authUser: state => state.authUser,
  studentreports: state => state.studentreports,
  errorMessage: state => state.errorMessage
}

export const mutations = {
  setAssessments: (state, assessments) => {
    state.assessments = assessments
  },

  setAssessment: (state, assessment) => {
    state.assessment = assessment
  },

  setAssessmentID: (state, assessmentid) => {
    state.assessmentid = assessmentid
  },

  setAssessmentNames: (state, assessmentnames) => {
    state.assessmentnames = assessmentnames
  },

  setSchools: (state, schools) => {
    state.schools = schools
  },

  setSchool: (state, school) => {
    state.school = school
  },

  setStudents: (state, students) => {
    state.students = students
  },

  setStudent: (state, student) => {
    state.student = student
  },

  setStudentID: (state, studentid) => {
    state.studentid = studentid
  },

  setStudentNames: (state, studentnames) => {
    state.studentnames = studentnames
  },

  setVolunteers: (state, volunteers) => {
    state.volunteers = volunteers
  },

  setVolunteer: (state, volunteer) => {
    state.volunteer = volunteer
  },

  setVolunteerID: (state, volunteerid) => {
    state.volunteerid = volunteerid
  },

  setVolunteerNames: (state, volunteernames) => {
    state.volunteernames = volunteernames
  },

  setStudentAssessments: (state, studentAssessments) => {
    state.studentAssessments = studentAssessments
  },

  setStudentAssessment: (state, studentAssessment) => {
    state.studentAssessment = studentAssessment
  },

  setUserForm: (state, userform) => {
    state.userform = userform
  },

  setTokenId: (state, authTokenId) => {
    state.authTokenId = authTokenId
  },

  setUserId: (state, authUserId) => {
    state.authUserId = authUserId
  },

  setUser: (state, authUser) => {
    state.authUser = authUser
  },

  setUserInfo: (state, userinfo) => {
    state.userinfo = userinfo
  },

  setUserStatus: (state, userstatus) => {
    state.userStatus = userstatus
  },

  setStudentReports: (state, studentreports) => {
    state.studentreports = studentreports
  },

  setError: (state, errorMessage) => {
    state.errorMessage = errorMessage
  }
}

export const actions = {
  nuxtServerInit({ commit }, { req }) {
    if (
      req.session &&
      req.session.authTokenId &&
      req.session.authUserId &&
      req.session.authUser
    ) {
      commit('setTokenId', req.session.authTokenId)
      commit('setUserId', req.session.authUserId)
      commit('setUser', req.session.authUser)
    } else {
      console.log('user not loggedin')
    }
  },

  async login({ commit }, { username, password }) {
    try {
      const data = await this.$axios.$post(`${process.env.baseUrl}/api/login`, {
        username,
        password
      })

      commit('setTokenId', data.tokenid)
      commit('setUserId', data.userid)
      commit('setUser', data)
    } catch (error) {
      commit('setUserStatus', error.response.data.code)
    }
  },

  async logout({ commit }, token) {
    await this.$axios.$post(`${process.env.baseUrl}/api/logout`, {
      token: [token]
    })
    commit('setTokenId', '')
    commit('setUserId', '')
    commit('setUser', null)
  },

  async getUser({ commit }) {
    const data = await this.$axios.$get(`${process.env.baseUrl}/api/users/`)
    commit('setUser', data.user)
  },

  //  School Operations from here

  async addSchool({ commit }, { name, created_at }) {
    try {
      const data = await this.$axios.$post(`${process.env.apiURL}/Schools`, {
        name,
        created_at
      })
    } catch (err) {
     commit('setError', err)
    }
  },

  async getSchools({ commit }) {
    try {
      const data = await this.$axios.$get(`${process.env.apiURL}/Schools`)
      commit('setSchools', data)
    } catch (err) {
     commit('setError', err)
    }
  },

  async getSchool({ commit }, { id }) {
    try {
      const data = await this.$axios.$get(`${process.env.apiURL}/Schools/${id}`)
      commit('setSchool', data)
    } catch (err) {
     commit('setError', err)
    }
  },

  async updateSchool({ commit }, { id, name, created_at, updated_at }) {
    try {
      const data = await this.$axios.$put(
        `${process.env.apiURL}/Schools/${id}`,
        {
          name: name,
          created_at: created_at,
          updated_at: updated_at
        }
      )
      commit('setSchool', data)
    } catch (err) {
     commit('setError', err)
    }
  },

  async removeSchool({ commit }, { id }) {
    try {
      const data = await this.$axios.$delete(
        `${process.env.apiURL}/Schools/${id}`
      )
    } catch (err) {
     commit('setError', err)
    }
  },

  // Student Operations from here

  async addStudent(
    { commit },
    {
      name,
      batch_no,
      role_no,
      date_of_joining,
      gender,
      medium,
      father_name,
      father_occupation,
      father_phone_number,
      mother_name,
      mother_occupation,
      mother_phone_number,
      address,
      locality,
      area,
      city,
      no_of_siblings,
      shoe_size,
      shirt_size,
      status,
      created_at
    }
  ) {
    try {
      const data = await this.$axios.$post(`${process.env.apiURL}/Students`, {
        name,
        batch_no,
        role_no,
        date_of_joining,
        gender,
        medium,
        father_name,
        father_occupation,
        father_phone_number,
        mother_name,
        mother_occupation,
        mother_phone_number,
        address,
        locality,
        area,
        city,
        no_of_siblings,
        shoe_size,
        shirt_size,
        status,
        created_at
      })
    } catch (err) {
     commit('setError', err)
    }
  },

  async getStudents({ commit }) {
    const data = await this.$axios.$get(
      `${process.env.apiURL}/Students?filter[where][status]=active`
    )
    commit('setStudents', data)
  },

  async getStudent({ commit }, { id }) {
    const data = await this.$axios.$get(
      `${process.env.apiURL}/Students/${id}?filter[where][status]=active`
    )
    commit('setStudent', data)
  },

  async getStudentIDByName({ commit }, { name }) {
    const data = await this.$axios.$get(
      `${
        process.env.apiURL
      }/Students?filter[where][name]=${name}&filter[fields][id]=true`
    )
    commit('setStudentID', data)
  },

  async getStudentNames({ commit }) {
    const data = await this.$axios.$get(
      `${
        process.env.apiURL
      }/Students?filter[fields][id]=true&filter[fields][name]=true`
    )
    commit('setStudentNames', data)
  },

  async updateStudent(
    { commit },
    {
      id,
      name,
      batch_no,
      role_no,
      date_of_joining,
      gender,
      medium,
      father_name,
      father_occupation,
      father_phone_number,
      mother_name,
      mother_occupation,
      mother_phone_number,
      address,
      locality,
      area,
      city,
      no_of_siblings,
      shoe_size,
      shirt_size,
      status,
      created_at,
      updated_at
    }
  ) {
    const data = await this.$axios.$put(
      `${process.env.apiURL}/Students/${id}`,
      {
        name,
        batch_no,
        role_no,
        date_of_joining,
        gender,
        medium,
        father_name,
        father_occupation,
        father_phone_number,
        mother_name,
        mother_occupation,
        mother_phone_number,
        address,
        locality,
        area,
        city,
        no_of_siblings,
        shoe_size,
        shirt_size,
        status,
        created_at,
        updated_at
      }
    )
    commit('setStudent', data)
  },

  async removeStudent(
    { commit },
    {
      id,
      name,
      batch_no,
      role_no,
      date_of_joining,
      gender,
      medium,
      father_name,
      father_occupation,
      father_phone_number,
      mother_name,
      mother_occupation,
      mother_phone_number,
      address,
      locality,
      area,
      city,
      no_of_siblings,
      shoe_size,
      shirt_size,
      status,
      created_at,
      updated_at,
      deleted_at
    }
  ) {
    const data = await this.$axios.$put(
      `${process.env.apiURL}/Students/${id}`,
      {
        name,
        batch_no,
        role_no,
        date_of_joining,
        gender,
        medium,
        father_name,
        father_occupation,
        father_phone_number,
        mother_name,
        mother_occupation,
        mother_phone_number,
        address,
        locality,
        area,
        city,
        no_of_siblings,
        shoe_size,
        shirt_size,
        status,
        created_at,
        updated_at,
        deleted_at
      }
    )
  },

  // Assessment Operations from here

  async addAssessment(
    { commit },
    { name, type, total_score, parent_assessment_id, created_at }
  ) {
    try {
      const data = await this.$axios.$post(
        `${process.env.apiURL}/Assessments`,
        {
          name,
          type,
          total_score,
          parent_assessment_id,
          created_at
        }
      )
    } catch (err) {
     commit('setError', err)
    }
  },

  async getAssessments({ commit }) {
    const data = await this.$axios.$get(`${process.env.apiURL}/Assessments`)
    commit('setAssessments', data)
  },

  async getAssessment({ commit }, { id }) {
    const data = await this.$axios.$get(
      `${process.env.apiURL}/Assessments/${id}`
    )
    commit('setAssessment', data)
  },

  async getAssessmentNames({ commit }) {
    const data = await this.$axios.$get(
      `${
        process.env.apiURL
      }/Assessments?filter[fields][id]=true&filter[fields][name]=true&filter[fields][total_score]=true`
    )
    commit('setAssessmentNames', data)
  },

  async getAssessmentIDByName({ commit }, { name }) {
    const data = await this.$axios.$get(
      `${process.env.apiURL}/Assessments?filter[where][name]=${name}`
    )
    commit('setAssessmentID', data)
  },

  async updateAssessment(
    { commit },
    {
      id,
      name,
      type,
      total_score,
      parent_assessment_id,
      created_at,
      updated_at
    }
  ) {
    const data = await this.$axios.$put(
      `${process.env.apiURL}/Assessments/${id}`,
      {
        name,
        type,
        total_score,
        parent_assessment_id,
        created_at,
        updated_at
      }
    )
    commit('setAssessment', data)
  },

  async removeAssessment({ commit }, { id }) {
    const data = await this.$axios.$delete(
      `${process.env.apiURL}/Assessments/${id}`
    )
  },

  //  Volunteer Operations from here

  async addVolunteer({ commit }, { name, created_at }) {
    try {
      const data = await this.$axios.$post(`${process.env.apiURL}/Volunteers`, {
        name,
        created_at
      })
    } catch (err) {
     commit('setError', err)
    }
  },

  async getVolunteers({ commit }) {
    const data = await this.$axios.$get(`${process.env.apiURL}/Volunteers`)
    commit('setVolunteers', data)
  },

  async getVolunteer({ commit }, { id }) {
    const data = await this.$axios.$get(
      `${process.env.apiURL}/Volunteers/${id}`
    )
    commit('setVolunteer', data)
  },

  async getVolunteerIDByName({ commit }, { name }) {
    const data = await this.$axios.$get(
      `${
        process.env.apiURL
      }/Volunteers?filter[where][name]=${name}&filter[fields][id]=true`
    )
    commit('setVolunteerID', data)
  },

  async getVolunteerNames({ commit }) {
    const data = await this.$axios.$get(
      `${
        process.env.apiURL
      }/Volunteers?filter[fields][id]=true&filter[fields][name]=true`
    )
    commit('setVolunteerNames', data)
  },

  async updateVolunteer({ commit }, { id, name, created_at, updated_at }) {
    const data = await this.$axios.$put(
      `${process.env.apiURL}/Volunteers/${id}`,
      {
        name: name,
        created_at: created_at,
        updated_at: updated_at
      }
    )
    commit('setVolunteer', data)
  },

  async removeVolunteer({ commit }, { id }) {
    const data = await this.$axios.$delete(
      `${process.env.apiURL}/Volunteers/${id}`
    )
  },

  // StudentAssessments Operations from here

  async addStudentAssessment(
    { commit },
    {
      student_id,
      assessment_id,
      volunteer_id,
      score,
      assessment_date,
      created_at
    }
  ) {
    try {
      const data = await this.$axios.$post(
        `${process.env.apiURL}/Student_Assessments`,
        {
          student_id,
          assessment_id,
          volunteer_id,
          score,
          assessment_date,
          created_at
        }
      )
    } catch (err) {
     commit('setError', err)
    }
  },

  async getStudentAssessments({ commit }) {
    const data = await this.$axios.$get(
      `${process.env.apiURL}/studentassessmentsviews/`
    )
    commit('setStudentAssessments', data)
  },

  async getStudentAssessment({ commit }, { id }) {
    const data = await this.$axios.$get(
      `${process.env.apiURL}/studentassessmentsviews/${id}`
    )
    commit('setStudentAssessment', data)
  },

  async updateStudentAssessment(
    { commit },
    {
      id,
      student_id,
      assessment_id,
      volunteer_id,
      score,
      assessment_date,
      created_at,
      updated_at
    }
  ) {
    const data = await this.$axios.$put(
      `${process.env.apiURL}/Student_Assessments/${id}`,
      {
        student_id,
        assessment_id,
        volunteer_id,
        score,
        assessment_date,
        created_at,
        updated_at
      }
    )
    commit('setStudentAssessment', data)
  },

  async removeStudentAssessment({ commit }, { id }) {
    const data = await this.$axios.$delete(
      `${process.env.apiURL}/Student_Assessments/${id}`
    )
  },

  async getStudentReports({ commit }) {
    const data = await this.$axios.get(
      `${process.env.apiURL}/studentAssessments/getStudentAssessments`
    )
    commit('setStudentReports', data.data)
  }
}
