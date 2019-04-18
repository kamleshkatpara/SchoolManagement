<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>Student Reports</v-toolbar-title>
      <v-divider class="mx-2" inset vertical></v-divider>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="search"
          label="Search"
          single-line
          hide-details
          >s
        </v-text-field>
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
        :headers="myheader"
        :search="search"
        hide-actions
        :pagination.sync="pagination"
        :items="studentreports"
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td v-for="(header, key) in myheader" :key="key">
            {{ props.item[header.value] }}
          </td>
        </template>
      </v-data-table>
    </v-card>
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pages"></v-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    pagination: {},
    search: ''
  }),
  computed: {
    studentreports() {
      return this.$store.state.studentreports
    },
    myheader() {
      const headers = this.studentreports.map((item, i) => {
        return Object.keys(item)
      })

      function flatten(input) {
        const stack = [...input]
        const res = []
        while (stack.length) {
          // pop value from stack
          const next = stack.pop()
          if (Array.isArray(next)) {
            // push back array items, won't modify the original input
            stack.push(...next)
          } else {
            res.push(next)
          }
        }
        // reverse to restore input order
        return res.reverse()
      }
      const flatHeader = flatten(headers)
      const uniqueHeaders = flatHeader.filter(
        (x, index) => index === flatHeader.indexOf(x)
      )

      const x = uniqueHeaders.map(x => {
        return { text: x, value: x }
      })

      return x
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
  async fetch({ store }) {
    await store.dispatch('getStudentReports')
  },
  middleware: 'auth',
  methods: {
    refreshData() {
      this.$store.dispatch('getStudentReports')
    }
  }
}
</script>
