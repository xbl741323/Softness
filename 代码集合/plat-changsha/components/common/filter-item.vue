<template>
  <div class="notice_filters">
    <span class="filter_title">{{ filterObj.categoryName }}</span>
    <div class="filter_content">
      <span
        :class="['filter_item', filterIndex == 0 ? 'choose_color' : '']"
        @click="changeFilter(null, 0)">全部</span>
      <span
        @click="changeFilter(item, index + 1)"
        :class="['filter_item', filterIndex == index + 1 ? 'choose_color' : '']"
        v-for="(item, index) in filterObj.options"
        :key="index">{{ item.name }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ["filterObj"],
  data() {
    return {
      filterIndex: 0,
    };
  },
  methods: {
    changeFilter(object, index) {
      this.filterIndex = index;
      this.$emit("changeFilter", object, this.filterObj.id);
    },
    showFilter(){
      if(this.filterObj.id == 3&&this.$route.query.id == 161){
        if(sessionStorage.getItem("trouble-filter")){
        let id = sessionStorage.getItem("trouble-filter")
        if(id == 12){
          this.$emit("changeFilter", {id:id,name:"项目申报"},3);
          this.filterIndex = 1
        }else if(id == 13){
          this.$emit("changeFilter", {id:id,name:"知识产权"},3);
          this.filterIndex = 2
        }
       }else{
         this.$emit("changeFilter", null,3);
       }
     }else {
       this.$emit("changeFilter", null,3);
     }
    }
  },
  mounted(){
    this.showFilter();
  }
};
</script>

<style scoped>
.notice_filters {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 5px;
  background: #ffffff;
  margin-top: 6px;
  font-size: 14px;
}
.filter_content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.filter_title {
  display: inline-block;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #333333;
  font-weight: bold;
  width: 107px;
  height: 100%;
  margin-top: 14px;
}
.filter_item {
  display: inline-block;
  width: 100px;
  height: 50px;
  line-height: 50px;
  color: #656565;
  text-align: center;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.choose_color {
  color: #36a6fe !important;
}
</style>