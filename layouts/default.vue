<template>
  <v-app>
    <v-navigation-drawer
      v-if="$store.state.authUser"
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="clipped" fixed app>
      <v-toolbar-side-icon
        v-if="$store.state.authUser"
        @click="drawer = !drawer"
      />
      <v-btn
        v-if="$store.state.authUser"
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon v-if="$store.state.authUser">{{
          `chevron_${miniVariant ? 'right' : 'left'}`
        }}</v-icon>
      </v-btn>
      <v-btn v-if="$store.state.authUser" icon @click.stop="clipped = !clipped">
        <v-icon>web</v-icon>
      </v-btn>
      <v-btn v-if="$store.state.authUser" icon @click.stop="fixed = !fixed">
        <v-icon>remove</v-icon>
      </v-btn>
      <v-spacer />
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-btn title="Log Out" v-if="$store.state.authUser" icon @click.stop="logout()">
        <v-icon>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'school',
          title: 'Schools',
          to: '/schools'
        },
        {
          icon: 'assignment',
          title: 'Assessments',
          to: '/assessments'
        },
        {
          icon: 'face',
          title: 'Students',
          to: '/students'
        },
        {
          icon: 'pan_tool',
          title: 'Volunteers',
          to: '/volunteers'
        },
        {
          icon: 'assignment_ind',
          title: 'Student Assessments',
          to: '/studentassessments'
        },
        {
          icon: 'assignment_ind',
          title: 'Sub Assessments',
          to: '/subassessments'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'School Management'
    }
  },
  methods: {
    logout() {
      localStorage.clear()
      sessionStorage.clear()
      this.$store
        .dispatch('logout', this.$store.state.authTokenId)
        .then(() => this.$router.go({ name: 'login' }))
    }
  }
}
</script>
