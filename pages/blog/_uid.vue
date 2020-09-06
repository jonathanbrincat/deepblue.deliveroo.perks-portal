<template lang="pug">
  div
    .outer-container
      .back
        nuxt-link(to="../") back to list

      //- Template for page title
      h1.blog-title {{ $prismic.asText(document.title) }}

      //- Template for published date
      p.blog-post-meta
        span.created-at {{ formattedDate }}

    //- Slice Block Componenet tag
    SlicesBlock(:slices="slices")

</template>

<script>
//Importing all the slices components
import SlicesBlock from '~/components/SlicesBlock.vue'

export default {
  head () {
    return {
      title: 'Prismic Nuxt.js Blog'
    }
  },

  name: 'post',

  components: {
    SlicesBlock
  },

  async asyncData({ $prismic, params, error }) {
  // async created() {
    try{
      // Query to get post content
      const post = (await $prismic.api.getByUID('post', params.uid)).data

      // Returns data to be used in template
      return {
        document: post,
        slices: post.body,
        formattedDate: Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(post.date)),
      }
    }catch(event) {
      // Returns error page
      console.log({ statusCode: 404, message: 'Page not found' })
    }
  },
}
</script>
