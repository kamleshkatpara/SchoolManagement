export const strict = false

export const state = () => ({
    assessments: [],
    assessment: {},
    schools: [],
    students: [],
    volunteers: [],
    volunteer: {},
    student_assessments: [],
    authTokenId: '',
    authUserId: '',
    authUser: null,
    userStatus: '',
    userinfo: []
});

export const getters = {
    assessments: state => state.assessments,
    assessment: state => state.assessment,
    schools: state => state.schools,
    students: state => state.students,
    volunteers: state => state.volunteers,
    volunteer: state => state.volunteer,
    student_assessments: state => state.student_assessments,
    authTokenId: state => state.authTokenId,
    authUserId: state => state.authUserId,
    userStatus: state => state.userStatus,
    userinfo: state => state.userinfo,
    authUser: state => state.authUser,
}

export const mutations = {
    setAssessments: (state, assessments) => {
        state.assessments = assessments
    },

    setAssessment: (state, assessment) => {
        state.assessment = assessment
    },

    setSchools: (state, schools) => {
        state.schools = schools
    },

    setStudents: (state, students) => {
        state.students = students
    },

    setVolunteers: (state, volunteers) => {
        state.volunteers = volunteers
    },

    setVolunteer: (state, volunteer) => {
        state.volunteer = volunteer
    },

    setStudentAssessments: (state, student_assessments) => {
        state.student_assessments = student_assessments
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
    }
}

export const actions = {
    nuxtServerInit({ commit }, { req }) {

        if (req.session && req.session.authTokenId && req.session.authUserId && req.session.authUser) {
            commit('setTokenId', req.session.authTokenId)
            commit('setUserId', req.session.authUserId)
            commit('setUser', req.session.authUser)
        } else {
            console.log('user not loggedin');
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
        commit('setTokenId', '');
        commit('setUserId', '');
        commit('setUser', null);
    },

    async getUser({ commit }) {
        const data = await this.$axios.$get(`${process.env.baseUrl}/api/users/`)
        commit('setUser', data.user)
    },

    async getSchools({ commit }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Schools`)
        commit('setSchools', data)
    },

    // Student Operations from here

    async addStudent({ commit }, { 
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
        status
     }) {
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
                status
             });
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    },

    async getStudents({ commit }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Students`)
        commit('setStudents', data)
    },

    async getStudent({ commit }, { id }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Students/${id}`)
        commit('setStudent', data)
    },

    async updateStudent({ commit }, { id, name, type, total_score, parent_Student_id, updated_at }) {
        const data = await this.$axios.$put(`${process.env.apiURL}/Students/${id}`, {
            name, type, total_score, parent_Student_id, updated_at
        })
        commit('setStudent', data)
    },

    async removeStudent({ commit }, { id }) {
        const data = await this.$axios.$delete(`${process.env.apiURL}/Students/${id}`)
        console.log(data)
    },

    // Assessment Operations from here

    async addAssessment({ commit }, { name, type, total_score, parent_assessment_id }) {
        try {
            const data = await this.$axios.$post(`${process.env.apiURL}/Assessments`, { name, type, total_score, parent_assessment_id });
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    },

    async getAssessments({ commit }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Assessments`)
        commit('setAssessments', data)
    },

    async getAssessment({ commit }, { id }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Assessments/${id}`)
        commit('setAssessment', data)
    },

    async updateAssessment({ commit }, { id, name, type, total_score, parent_assessment_id, updated_at }) {
        const data = await this.$axios.$put(`${process.env.apiURL}/Assessments/${id}`, {
            name, type, total_score, parent_assessment_id, updated_at
        })
        commit('setAssessment', data)
    },

    async removeAssessment({ commit }, { id }) {
        const data = await this.$axios.$delete(`${process.env.apiURL}/Assessments/${id}`)
        console.log(data)
    },

    //  Volunteer Operations from here

    async addVolunteer({ commit }, { name }) {
        try {
            const data = await this.$axios.$post(`${process.env.apiURL}/Volunteers`, { name });
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    },

    async getVolunteers({ commit }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Volunteers`)
        commit('setVolunteers', data)
    },

    async getVolunteer({ commit }, { id }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Volunteers/${id}`)
        commit('setVolunteer', data)
    },

    async updateVolunteer({ commit }, { id, name, updated_at }) {
        const data = await this.$axios.$put(`${process.env.apiURL}/Volunteers/${id}`, {
            name: name,
            updated_at: updated_at
        })
        commit('setVolunteer', data)
    },

    async removeVolunteer({ commit }, { id }) {
        const data = await this.$axios.$delete(`${process.env.apiURL}/Volunteers/${id}`)
        console.log(data)
    }
}