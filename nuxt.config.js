// DEVNOTE: for vanilla vue.js use npm package => prismic-vue
// DEVNOTE: for vue.js nuxt use npm package => prismic-javascript
// NOTE : I have since discovered prismic integration will happily function in the absence of either

// there is also a package called prismic-dom but i haven't been able to locate any info on what this does yet! // it's a HTML serialiser - an extension/helper library that allows you to manipulate and modify HTML content piped through the rich text editor
// IN addition there is something called the javascript-kit(API v1) = https://github.com/prismicio/javascript-kit which I believe has been superseded by
// prismic-javascript and prismic-dom(API v2) https://github.com/prismicio/prismic-javascript

// Yes the docs are crap!

export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  mode: 'spa',
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // modules for full static before `nuxt export` (coming in v2.12)
    // DEVNOTE: IMPORTANT: the docs don't tell you you have to manually obtain these files from repo and copy and paste them in!!
    '@/modules/static',
    '@/modules/crawler',
    // This is where you import the new plugin
    '@nuxtjs/prismic'
  ],
  prismic: {
    endpoint: 'https://prismic-nuxt-foobar.cdn.prismic.io/api/v2',

    // DEVNOTE: IMPORTANT: the docs don't tell you you have to manually obtain these files from repo and copy and paste them in!!
    linkResolver: '@/plugins/link-resolver',
    htmlSerializer: '@/plugins/html-serializer',
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {},
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    extend(config, ctx) {
      config.resolve.alias['vue'] = 'vue/dist/vue.common'
    }
  }
}
