<template>
  <div class="nav_search">
    <input @keyup.enter="search" v-model.trim="keyWords" type="text" placeholder="请输入关键词进行搜索" />
    <span @click="search">搜索</span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyWords:""
    };
  },
  methods:{
    search(){
      this.$emit('search')
    }
  }
};
</script>

<style scoped>
.nav_search {
  width: 668px;
  height: 50px;
  background: #ffffff;
  border: 1px solid #93B874;
  opacity: 1;
  border-radius: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nav_search input {
  width: 460px;
  margin-left: 40px;
  height: 100%;
}
.nav_search span {
  width: 150px;
  height: 50px;
  background: #93B874;
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  font-size: 18px;
  cursor: pointer;
}
</style>