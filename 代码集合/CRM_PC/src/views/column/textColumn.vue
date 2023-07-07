<template>
  <div class="column">
    <div class="column_left">
      <div class="left_title">关于卧涛</div>
      <ul style="margin-top:6px;">
        <li
          v-for="(item,index) in siderList"
          :class="[currentIndex == index?'li_style':'']"
          :key="index"
          @click="toggle(index)"
        >
        <span>{{ item.name }}</span>
        <span v-if="item.type==1" class="text-type-sty">列表</span>
        </li>
      </ul>
    </div>
    <div class="column_right">
      <div v-for="(item,index) in siderList" :key="index">
        <column-content v-if="currentIndex==index" :id="item.id" :name="item.name" :type="item.type"></column-content>
      </div>
    </div>
  </div>
</template>

<script>
import { getSiderList } from "@/api/siteSettings/column";
import columnContent from "@/components/column/columnContent";
export default {
  components: {
    columnContent
  },
  data() {
    return {
      currentIndex: 0,
      tabPosition: "left",
      arr: ["", "", "", "", ""],
      siderList: []
    };
  },
  methods: {
    getList() {
      getSiderList().then(res => {
        this.siderList = res.data.data;
      });
    },
    toggle(index) {
      this.currentIndex = index;
      sessionStorage.setItem(`column-textColumn-index`,index)
    }
  },
  created(){
    if(sessionStorage.getItem(`column-textColumn-index`)){
      this.currentIndex = sessionStorage.getItem(`column-textColumn-index`)
    }
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped>
.column {
  background: #fff;
  margin-left: 10px;
  display: flex;
}
.column_left {
  width: 170px;
  margin-top: 30px;
  border: 1px solid #ebeef5;
  margin-left: 10px;
  padding-bottom: 30px;
}
.left_title {
  width: 100%;
  text-align: center;
  font-size: 14px;
  height: 40px;
  background: black;
  line-height: 40px;
  color: #fff;
}
.column_left li {
  width: 150px;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  cursor: pointer;
  position: relative;
}
ul,
li {
  list-style: none;
}
.li_style {
  color: #108ee9;
}
.text-type-sty{
  width: 35px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  font-size: 8px;
  background: #108ee9;
  color: #fff;
  position: absolute;
  border-radius: 5px;
  top: 2px;
}

</style>