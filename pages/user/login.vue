<template>
  <v-row class="align-center justify-center">
    <v-col xs="12" sm="8" md="6" lg="4" xl="4">
      <v-card class="elevation-12">
        <v-toolbar dark color="primary">
          <v-toolbar-title>登录 OJ</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-form ref="form" v-model="valid" @keyup.enter.native="login">
            <v-text-field
              v-model="username"
              :rules="username_rules"
              :messages="username_message"
              prepend-icon="mdi-account"
              label="用户名"
              type="text"
              required
              clearable
            ></v-text-field>
            <v-text-field
              v-model="password"
              :rules="password_rules"
              :messages="password_message"
              prepend-icon="mdi-lock"
              label="密码"
              type="password"
              required
              clearable
            ></v-text-field>
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
                登录
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
      username_rules: [value => !!value || '用户名未输入'],
      username_message: undefined,
      password_rules: [value => !!value || '密码未输入'],
      password_message: undefined,
      login_loading: false
    }
  },
  methods: {
    login() {
      this.$refs.form.validate()
      if (!this.valid) return
      const payload = {
        username: this.username,
        password: this.password
      }
      this.login_loading = true
      this.username_message = this.password_message = undefined
      this.$axios
        .post('/user/login/', payload)
        .then(res => {
          return this.$store.dispatch('login', {
            token: res.token,
            user: res.user
          })
        })
        .then(() => {
          const next = this.$route.query.next
          if (next) this.$router.replace(String(next))
          else this.$router.replace('/')
        })
        .catch(err => {
          if (typeof err === 'string') this.$swal('登录失败', err, 'error')
          else {
            this.username_message = err.username
            this.password_message = err.password
          }
        })
        .finally(() => {
          this.login_loading = false
        })
    }
  }
}
</script>

<style scoped></style>
