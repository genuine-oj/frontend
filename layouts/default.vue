<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :expand-on-hover="$vuetify.breakpoint.mdAndUp"
      :mini-variant.sync="mini"
      clipped
      fixed
      app
    >
      <v-list>
        <v-img
          v-if="$vuetify.breakpoint.smAndDown"
          class="ma-4"
          :src="require('~/assets/img/logo-banner.png')"
          height="60"
          contain
        />
        <v-list-item
          v-for="(item, index) in navItems"
          :key="index"
          :to="item.to"
          exact
        >
          <v-list-item-action>
            <v-icon v-text="item.icon" />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar clipped-left dense fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title>Genuine OJ</v-app-bar-title>
      <v-spacer />
      <v-menu transition="slide-y-transition" offset-y open-on-hover bottom>
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" icon v-on="on">
            <v-icon> mdi-translate</v-icon>
          </v-btn>
        </template>
        <v-list nav dense>
          <v-list-item
            v-for="locale in $i18n.locales"
            :key="locale.code"
            @click="$i18n.setLocale(locale.code)"
          >
            <v-list-item-title v-text="locale.name" />
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn
        v-if="!isAuthenticated"
        :title="$t('login.login')"
        icon
        :to="{ name: 'user-login' }"
      >
        <v-icon> mdi-login-variant</v-icon>
      </v-btn>
      <v-menu
        v-else
        transition="slide-y-transition"
        offset-y
        open-on-hover
        bottom
      >
        <template #activator="{ on, attrs }">
          <v-btn v-bind="attrs" text v-on="on">
            <v-avatar class="mr-1" size="28" left>
              <v-img :src="$utils.misc.avatar.get(user.email)" />
            </v-avatar>
            {{ user.username }}
            <v-icon right> mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>User Center</v-list-item-title>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt v-if="isRouterAlive" />
        <v-overlay :value="loading" opacity="0.5" color="white">
          <v-progress-circular indeterminate color="primary" size="64" />
        </v-overlay>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'DefaultLayout',
  data() {
    return {
      drawer: this.$vuetify.breakpoint.mdAndUp,
      mini: this.$vuetify.breakpoint.mdAndUp,
      isRouterAlive: true
    }
  },
  head() {
    return this.$nuxtI18nHead({ addSeoAttributes: true })
  },
  computed: {
    navItems() {
      return [
        {
          icon: 'mdi-home-outline',
          title: this.$t('pages.home'),
          to: { name: 'index' }
        },
        {
          icon: 'mdi-trophy-outline',
          title: this.$t('pages.contests'),
          to: { name: 'contest' }
        },
        {
          icon: 'mdi-format-list-text',
          title: this.$t('pages.problems'),
          to: { name: 'problem' }
        },
        {
          icon: 'mdi-timer-sand',
          title: this.$t('pages.submissions'),
          to: { name: 'submission' }
        }
      ]
    },
    ...mapGetters(['isAuthenticated']),
    ...mapState(['user', 'loading'])
  },
  watch: {
    '$i18n.locale': {
      immediate: true,
      handler(value) {
        this.$store.commit('updateLocale', value)
      }
    }
  },
  methods: {
    async logout() {
      await this.$axios.get('/user/logout/')
      this.$store.commit('updateUser', undefined)
    }
  }
}
</script>

<style lang="scss"></style>
