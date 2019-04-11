<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex v-if="$store.state.authUser">Hello</v-flex>
        <v-flex xs12 sm8 md4 v-else>
          <v-card class="elevation-12">
            <v-toolbar dark color="primary">
              <v-spacer></v-spacer>
              <v-toolbar-title>Please Login</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-form novalidate="novalidate" class="loginform" @submit.prevent="login">
                <v-text-field
                  prepend-icon="person"
                  name="username"
                  :error-messages="usernameErrors"
                  browser-autocomplete="off"
                  placeholder="Username"
                  v-model="username"
                  type="text"
                  required
                ></v-text-field>

                <v-text-field
                  prepend-icon="lock"
                  v-model="password"
                  :error-messages="passwordErrors"
                  :append-icon="show ? 'visibility_off' : 'visibility'"
                  :type="show ? 'text' : 'password'"
                  tabindex="0"
                  browser-autocomplete="off"
                  name="password"
                  placeholder="Password*"
                  required
                  @click:append="show = !show"
                ></v-text-field>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :loading="loading"
                    :disabled="loading"
                    depressed
                    ripple
                    color="red white--text"
                    type="submit"
                    @click.native="loader = 'loading'"
                  >Log in</v-btn>
                </v-card-actions>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  mixins: [validationMixin],

  validations: {
    username: { required },
    password: { required }
  },

  data: () => ({
    username: '',
    password: '',
    loader: null,
    show: false,
    loading: false
  }),

  computed: {
    usernameErrors() {
      const errors = []
      if (!this.$v.username.$dirty) return errors
      !this.$v.username.required && errors.push('Please enter username')
      return errors
    },
    passwordErrors() {
      const errors = []
      if (!this.$v.password.$dirty) return errors
      !this.$v.password.required && errors.push('Please enter password')
      return errors
    }
  },
  methods: {
   async login() {
      console.log(this.username)
      if (!this.$v.username.$invalid && !this.$v.password.$invalid) {
        this.loading = true
       await this.$store.dispatch('login', {
          username: this.username,
          password: this.password
        })
      } else if (this.$v.username.$invalid && this.$v.password.$invalid) {
        this.loading = false
        this.$v.$touch()
      }
    }
  }
}
</script>