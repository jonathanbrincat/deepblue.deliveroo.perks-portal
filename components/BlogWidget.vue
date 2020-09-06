<template lang='pug'>
  nuxt-link(:to="link")
    article.perk
      h2 {{ $prismic.asText(post.data.title) }}
      p.blog-post-meta
        span.created-at {{ formattedDate }}
      p {{getFirstParagraph(post)}}
</template>

<script>
import LinkResolver from "~/plugins/link-resolver.js";

export default {
  name: 'blog-widget',

  props: ['post'],

  data: function() {
    return {
      link: '',
      formattedDate: '',
    }
  },

  created() {
    this.link = LinkResolver(this.post),
    this.formattedDate = Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(this.post.data.date))
  },

  methods: {
    // Function to get the first paragraph of text in a blog post and limit the displayed text at 300 characters
    getFirstParagraph(post) {
      const textLimit = 300;
      const slices = post.data.body;
      let firstParagraph = '';
      let haveFirstParagraph = false;

      slices.map(function(slice) {
        if (!haveFirstParagraph && slice.slice_type == "text") {
          slice.primary.text.forEach(function(block){
            if (block.type == "paragraph" && !haveFirstParagraph) {
              firstParagraph += block.text;
              haveFirstParagraph = true;
            }
          });
        }
      });

      const limitedText = firstParagraph.substr(0, textLimit)

      if(firstParagraph.length > textLimit) {
        return limitedText.substr(0, limitedText.lastIndexOf(' ')) + '...';
      }
      else {
        return firstParagraph;
      }
    }
  }
}
</script>

<style lang="scss">
.perk {
  color: #353535;
  padding: 20px;
  background-color: whitesmoke;
  // border-radius: 4px;
  box-shadow: 10px 10px 50px 0px rgba(0,0,0,0.2);
}

h2 {
  margin: 0;
}
</style>
