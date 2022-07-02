<template>
  <v-row class="align-center justify-center">
    <v-col xs="12" sm="8" md="6" lg="4" xl="4">
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title v-text="$t('login.loginToOJ')" />
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" @keyup.enter.native="login">
            <v-text-field
              v-model="username"
              :rules="username_rules"
              prepend-icon="mdi-account"
              :label="$t('login.username')"
              type="text"
              required
              clearable
            />
            <v-text-field
              v-model="password"
              :rules="password_rules"
              prepend-icon="mdi-lock"
              :label="$t('login.password')"
              type="password"
              required
              clearable
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-row justify="center" class="mb-1">
            <v-col class="text-center pt-0" cols="5">
              <v-btn
                large
                block
                color="primary"
                :disabled="!valid"
                :loading="login_loading"
                @click="login"
              >
                {{ $t('login.login') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'UserLogin',
  data() {
    return {
      username: '',
      password: '',
      valid: false,
      username_rules: [value => !!value || this.$t('login.usernameNotSet')],
      password_rules: [value => !!value || this.$t('login.passwordNotSet')],
      login_loading: false
    }
  },
  methods: {
    login() {
      this.$refs.form.validate()
      if (!this.valid) return
      this.login_loading = true
      this.$axios
        .post('/user/login/', {
          username: this.username,
          password: this.password
        })
        .then(res => {
          this.$store.commit('updateUser', res.data)
        })
        .catch(err => {
          this.$swal(this.$t('login.loginFailed'), err, 'error')
        })
        .finally(() => {
          this.login_loading = false
        })
    }
  }
}
</script>

<style scoped></style>
