export const strict = false

export const state = () => ({
    assessments: [],
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

    setSchools: (state, schools) => {
        state.schools = schools
    },

    setStudents: (state,students) => {
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

    async getAssessments({ commit }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Assessments`)
        commit('setAssessments', data)
    },

    async getSchools({ commit }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Schools`)
        commit('setSchools', data)
    },

    async getStudents({ commit }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Students`)
        commit('setStudents', data)
    },

    async addVolunteer({ commit }, { name }) {
        try {
            const data = await this.$axios.$post(`${process.env.apiURL}/Volunteers`, { name });
            console.log(data)
        } catch(err) {
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
        const data = await this.$axios.$delete(`${process.env.apiURL}/Volunteers/${id}` )
        console.log(data)
    }
}