<template>
  <div class="member_center">
    <member></member>
  </div>
</template>

<script>
import member from "~/components/member/components/member";
export default {
  components: {
    member,
  },
  data() {
    return {};
  },
  destroyed(){
    window.removeEventListener('popstate', this.goBack, false);
  },
  mounted(){
    if(window.history && window.history.pushState){
      history.pushState(null, null, document.URL);
      window.addEventListener('popstate', this.goBack, false);
    }
  },
  methods:{
    goBack(){
      history.pushState(null, null, document.URL);
      this.$router.push('/');
    },
  }
};
</script>

<style scoped>
.member_center {
  background: #eff2f3;
}
</style>
