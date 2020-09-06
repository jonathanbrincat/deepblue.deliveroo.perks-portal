<template lang="pug">
div
  header#app__masthead
    .container(style="justify-content: space-between;")
      Logo(style="width: 200px;")
      p(v-if="$store.state.auth")
        button.ui__btn(@click="logout") Sign Out

  template(v-if="$store.state.auth")
    main#app__main
      .container
        div
          //-
            h1.title {{ $prismic.asText(fields.title) }}
            p {{ fields }}

          .blog-avatar(:style="{ backgroundImage: 'url(' + image + ')' }")
          h1.blog-title {{ $prismic.asText(homepageContent.headline) }}
          p.blog-description {{ $prismic.asText(homepageContent.description) }}

          //-
            code: p {{ JSON.stringify(homepageContent) }}
            code: p {{ JSON.stringify(posts) }}

          ul.perk__listing
            template(v-if="posts.length !== 0")
              li.perk__list-item(v-for="post in posts" :key="post.id" :post="post")
                blog-widget(:post="post")

            template(v-else)
              p There are no active offers are promotions available at this time.

  template(v-else)
    main#app__main(style="background-color: #00ccbc;")
      .container
        .ui__dialog
          h2 Log In
          div
            .form__field
              label
                input#email(type="email" value="Joe Bloggs")
            .form__field
              label
                input#password(type="password" value="test")
            .form__field
              button.ui__btn(@click="postLogin") Login

</template>

<script>
import BlogWidget from '~/components/BlogWidget.vue';
const Cookie = process.client ? require('js-cookie') : undefined

export default {

  head () {
    return {
      title: 'Prismic Nuxt.js Blog',
    }
  },

  name: 'Home',

  components: {
    BlogWidget
  },

  data () {
    return {
      documentId: '',
      fields: {
        title: null,
        description: null,
        ctaLink: null,
        ctaText: null,
        icon: null
      },
      posts: [],
      homepageContent: {
        headline: null,
        description: null,
      },
      image: null,
    }
  },

  created () {
    // this.getContent('quickstart');
    this.getBlog();
  },

  methods: {
    async getContent (uid) {
      console.log('CONTENT >> ', (await this.$prismic.api.getByUID ('page', uid)).data );

      this.$prismic.api.getByUID ('page', uid)
        .then((document) => {
          if (document) {
            this.documentId = document.id
            this.fields.title = document.data.title
            this.fields.description = document.data.description
            this.fields.ctaLink = document.data.cta_link
            this.fields.ctaText = document.data.cta_text
            this.fields.icon = document.data.icon
          } else {
            this.$router.push({ name: 'not-found' })
          }
        })
    },

    async getBlog() {
      try{
        // Query to get blog home content
        const homepageContent = (await this.$prismic.api.getSingle('blog_home')).data;
        console.log('BLOG >> ', homepageContent);

        // Query to get posts content to preview
        const blogPosts = await this.$prismic.api.query(
          this.$prismic.predicates.at("document.type", "post"),
          { orderings : '[my.post.date desc]' }
        )

        // Returns data to be used in template
        // return {
        //   homepageContent,
        //   posts: blogPosts.results,
        //   image: homepageContent.image.url,
        // }

        this.homepageContent.headline = homepageContent.headline;
        this.homepageContent.description = homepageContent.description;
        this.image = homepageContent.image.url;
        this.posts = blogPosts.results;
      }catch(error) {
        console.log({ statusCode: 404, message: 'Page not found' })
      }
    },

    postLogin() {
      // DEVNOTE: Adonis.js derived authentication relay and response would go here

      setTimeout(() => { // we simulate the async request with timeout.
        const auth = {
          accessToken: 'someStringGotFromApiServiceWithAjax'
        }
        this.$store.commit('setAuth', auth) // mutating to store for client rendering
        Cookie.set('auth', auth) // saving token in cookie for server rendering
        this.$router.push('/')
      }, 1000)
    },

    logout () {
      Cookie.remove('auth')
      this.$store.commit('setAuth', null)
    }
  },
}
</script>

<style lang="scss" scoped>
html, body {
  font-family: Helvetica Neue, Helvetica, Arial;
}

h1, h2, h3, h4,
p, li {
  margin: 1em 0;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

#app__masthead {
  background-color: #00ccbc;
  padding: 20px 0;

  .container {
    min-height: 0;
    display: flex;
  }
}

.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}

//-

.home {
  max-width: 700px;
  margin: auto;
  text-align: center;

  .blog-avatar {
    height: 140px;
    width: 140px;
    border-radius: 50%;
    background-position: center;
    background-size: cover;
    margin: 1em auto;
  }

  .blog-description {
    font-size: 18px;
    color: #9A9A9A;
    line-height: 30px;
    margin-bottom: 3rem;
    padding-bottom: 3rem;
    font-family: 'Lato', sans-serif;
    border-bottom: 1px solid #DADADA;
  }
}

.perk__listing {
  max-width: 700px;
  margin: auto;
  text-align: left;
  list-style-type: none;
  padding-left: 0;

  &.single img {
    width: 100%;
    height: auto;
  }

  &.single a {
    text-decoration: none;
    background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 0.8) 75%);
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 75%, rgba(0, 0, 0, 0.8) 75%);
    background-repeat: repeat-x;
    background-size: 2px 2px;
    background-position: 0 23px;
  }
}

.perk__list-item {
  margin: 0;
  margin-bottom: 3rem;
}

.ui__dialog {
  color: white;

  input {
    padding: 12px 24px;
    border: 0 none;
    border-radius: 2px;
  }
}

.form__field {
  margin: 10px;
}

.ui__btn {
  background-color: #FFF;
  color: #00ccbc;
  font-weight: 700;
  padding: 12px 24px;
  border: 0 none;
  border-radius: 2px;
}

@media (max-width: 767px) {
  .home {
    padding: 0 20px;
  }
  .perk__listing {
    padding: 0;
    font-size: 18px;
  }
}
</style>
