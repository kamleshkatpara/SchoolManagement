<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Student Reports</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-card>
      <v-card-title>
        <v-text-field v-model="search" append-icon="search" label="Search" single-line hide-details></v-text-field>
        <v-btn fab dark small color="green" title="refresh data" @click="refreshData">
          <v-icon dark>refresh</v-icon>
        </v-btn>
      </v-card-title>
            {{ subjects }}

      <v-data-table
        :headers="headers"
        :search="search"
        hide-actions
        :pagination.sync="pagination"
        :items="studentreports"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td>{{ props.item.student }}</td>
          <td>{{ props.item.volunteer }}</td>
          <td>{{ props.item.total }}</td>
        </template>
      </v-data-table>
    </v-card>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
  </div>
</template>

<script>
import uniqBy from 'lodash/uniqBy'

export default {
  async fetch({ store }) {
    await store.dispatch('getStudentReports')
  },
  middleware: 'auth',
  data: () => ({
    pagination: {},
    search: '',
    headers:  [
          {
            text: 'Student', value: 'student'
          },
          { text: 'Volunteer', value: 'volunteer' },

          { text: 'Total Score', value: 'total' }
        ]
  }),
  computed: {
    studentreports() {
      return this.$store.state.studentreports
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
  methods: {
    refreshData() {
      this.$store.dispatch('getStudentReports')
    }
  }
}
</script>