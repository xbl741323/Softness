<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        Sorry,get error
      </h1>
     
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  head () {
    return {
      title: "Error Info",
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  }
}
</script>