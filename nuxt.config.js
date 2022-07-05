export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - Genuine OJ',
    title: 'Genuine OJ',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@mdi/font/css/materialdesignicons.min.css',
    '@sweetalert2/theme-material-ui'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    '~/plugins/codemirror.client.js',
    '~/plugins/axios.js',
    '~/plugins/route.js',
    '~/plugins/vuex-persist.js',
    '~/plugins/dayjs.js',
    '~/plugins/utils.js'
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/eslint
    '@nuxtjs/eslint-module',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
    // https://github.com/nuxt-community/dayjs-module
    '@nuxtjs/dayjs',
    // https://github.com/harlan-zw/nuxt-webpack-optimisations
    'nuxt-webpack-optimisations'
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/proxy',
    '@nuxtjs/pwa',
    '@nuxtjs/i18n',
    'vue-sweetalert2/nuxt/no-css',
    'cookie-universal-nuxt'
  ],

  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      pathRewrite: {
        '^/api': '',
        changeOrigin: true
      }
    }
  },

  // PWA module configuration: https://go.nuxtjs.dev/pwa
  pwa: {
    manifest: {
      name: 'Genuine OJ',
      short_name: 'Genuine',
      lang: 'en'
    },
    icon: {
      fileName: 'logo.png'
    }
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    treeShake: true,
    customVariables: ['~/assets/css/variables.scss'],
    optionsPath: '~/vuetify.options.js',
    defaultAssets: false
  },

  axios: {
    prefix: process.env.API_PREFIX || '/api',
    proxy: process.env.NODE_ENV === 'development',
    credentials: true
  },

  i18n: {
    locales: [
      { name: 'English', code: 'en-US', iso: 'en-US', file: 'en-US.js' },
      { name: '简体中文', code: 'zh-CN', iso: 'zh-CN', file: 'zh-CN.js' }
    ],
    strategy: 'no_prefix',
    langDir: '~/i18n/',
    defaultLocale: 'en-US',
    vueI18n: {
      fallbackLocale: 'en-US'
    }
  },

  dayjs: {
    locales: ['en', 'zh-cn'],
    defaultLocale: 'en',
    defaultTimeZone: 'Asia/Shanghai',
    plugins: ['utc', 'timezone']
  },

  loading: {
    color: '#03A9F4'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    optimization: {
      splitChunks: {
        minSize: 10000,
        maxSize: 250000
      }
    },
    extend(config) {
      config.module.rules.push({
        test: /.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      })
    }
  }
}
