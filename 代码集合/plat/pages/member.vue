<template>
  <div class="member_center">
    <member-head @member-center="toMember"></member-head>
    <member-tab ref="tab"></member-tab>
  </div>
</template>

<script>
import memberHead from "~/components/member/head";
import memberTab from "~/components/member/tab";
export default {
  components: {
    memberHead,
    memberTab,
  },
  data() {
    return {};
  },
  methods: {
    toMember() {
      this.$refs.tab.showIndex = 2;
    },
    
  },
  mounted(){
    
  }
};
</script>

<style scoped>
.member_center {
  background: #eff2f3;
}
</style>