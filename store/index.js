export const strict = false

export const state = () => ({
    assessments: [],
    assessment: {},
    assessmentnames: [],
    schools: [],
    school: {},
    students: [],
    student: {},
    studentnames: [],
    volunteers: [],
    volunteernames: [],
    volunteer: {},
    student_assessments: [],
    student_assessment: {},
    authTokenId: '',
    authUserId: '',
    authUser: null,
    userStatus: '',
    userinfo: []
});

export const getters = {
    assessments: state => state.assessments,
    assessment: state => state.assessment,
    assessmentnames: state => state.assessmentnames,
    schools: state => state.schools,
    school: state => state.school,
    students: state => state.students,
    student: state => state.student,
    studentnames: state => state.studentnames,
    volunteers: state => state.volunteers,
    volunteer: state => state.volunteer,
    volunteernames: state => state.volunteernames,
    student_assessments: state => state.student_assessments,
    student_assessment: state => state.student_assessment,
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

    setStudentNames: (state, studentnames) => {
        state.studentnames = studentnames
    },

    setVolunteers: (state, volunteers) => {
        state.volunteers = volunteers
    },

    setVolunteer: (state, volunteer) => {
        state.volunteer = volunteer
    },

    setVolunteerNames: (state, volunteernames) => {
        state.volunteernames = volunteernames
    },

    setStudentAssessments: (state, student_assessments) => {
        state.student_assessments = student_assessments
    },

    setStudentAssessment: (state, student_assessment) => {
        state.student_assessment = student_assessment
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

    //  School Operations from here

    async addSchool({ commit }, { school_name }) {
        try {
            const data = await this.$axios.$post(`${process.env.apiURL}/Schools`, { school_name });
            console.log(data)
        } catch (err) {
            console.log(err)
        }
    },

    async getSchools({ commit }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Schools`)
        commit('setSchools', data)
    },

    async getSchool({ commit }, { id }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Schools/${id}`)
        commit('setSchool', data)
    },

    async updateSchool({ commit }, { id, school_name, updated_at }) {
        const data = await this.$axios.$put(`${process.env.apiURL}/Schools/${id}`, {
            school_name: school_name,
            updated_at: updated_at
        })
        commit('setSchool', data)
    },

    async removeSchool({ commit }, { id }) {
        const data = await this.$axios.$delete(`${process.env.apiURL}/Schools/${id}`)
        console.log(data)
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
        const data = await this.$axios.$get(`${process.env.apiURL}/Students?filter[where][status]=active`)
        commit('setStudents', data)
    },

    async getStudent({ commit }, { id }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Students/${id}?filter[where][status]=active`)
        commit('setStudent', data)
    },

    async getStudentNames({ commit }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Students?filter[fields][id]=true&filter[fields][name]=true`)
        commit('setStudentNames', data)
    },

    async updateStudent({ commit }, { 
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
        updated_at }) {
        const data = await this.$axios.$put(`${process.env.apiURL}/Students/${id}`, {
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
            updated_at
        })
        commit('setStudent', data)
    },

    async removeStudent({ commit }, { 
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
        deleted_at
    }) {
        const data = await this.$axios.$put(`${process.env.apiURL}/Students/${id}`, {
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
            deleted_at
        })
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

    async getAssessmentNames({ commit }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Assessments?filter[fields][id]=true&filter[fields][name]=true&filter[fields][total_score]=true`)
        commit('setAssessmentNames', data)
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

    async getVolunteerNames({ commit }) {
        const data = await this.$axios.$get(`${process.env.apiURL}/Volunteers?filter[fields][id]=true&filter[fields][name]=true`)
        commit('setVolunteerNames', data)
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
    },

        // StudentAssessments Operations from here

        async addStudentAssessment({ commit }, { student_id, assessment_id, volunteer_id, score, assessment_date }) {
            try {
                const data = await this.$axios.$post(`${process.env.apiURL}/StudentAssessments`, { student_id, assessment_id, volunteer_id, score, assessment_date });
                console.log(data)
            } catch (err) {
                console.log(err)
            }
        },
    
        async getStudentAssessments({ commit }) {
            const data = await this.$axios.$get(`${process.env.apiURL}/StudentAssessments`)
            commit('setStudentAssessments', data)
        },
    
        async getStudentAssessment({ commit }, { id }) {
            const data = await this.$axios.$get(`${process.env.apiURL}/StudentAssessments/${id}`)
            commit('setStudentAssessment', data)
        },
    
        async updateStudentAssessment({ commit }, { id, student_id, assessment_id, volunteer_id, score, assessment_date, updated_at }) {
            const data = await this.$axios.$put(`${process.env.apiURL}/StudentAssessments/${id}`, {
                student_id, assessment_id, volunteer_id, score, assessment_date, updated_at
            })
            commit('setStudentAssessment', data)
        },
    
        async removeStudentAssessment({ commit }, { id }) {
            const data = await this.$axios.$delete(`${process.env.apiURL}/StudentAssessments/${id}`)
            console.log(data)
        }    
}