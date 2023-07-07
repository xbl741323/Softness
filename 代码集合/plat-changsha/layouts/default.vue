<template>
  <div id="main-sty">
    <index v-if="$route.path != '/404'" />
    <Nuxt />
    <foot v-if="$route.path != '/404'" />
  </div>
</template>

<script>
import index from "./head/index.vue";
import foot from "./foot/index.vue";
export default {
  components: {
    index,
    foot,
  },
  data() {
    return {};
  },
  mounted(){
    
  }
};
</script>
<style>
#main-sty{
  width: 100%;
}
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

li {
  list-style: none;
}

input {
  outline-color: invert;
  outline-style: none;
  outline-width: 0px;
  border: none;
  border-style: none;
  text-shadow: none;
  -webkit-appearance: none;
  outline-color: transparent;
  box-shadow: none;
}
</style>
