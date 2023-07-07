<template>
  <div class="columns_index">
    <div class="columns_index_left">
      <div class="left_title">合肥寻鹿站导航</div>
      <el-tree
        ref="refTree"
        :data="siderList"
        :props="{
          children: 'childrenColumnVoList',
          label: 'name'
        }"
        highlight-current
        :current-node-key="columnInfo.id"
        node-key="id" style="margin-top: 6px">
        <template slot-scope="{ data }">
          <div @click="toggle(data)" style="width: 100%;">
            <span :class="columnInfo.name == data.name ? 'blue_light' : ''">{{ data.name }}</span>
            <span class="nav-type-sty" v-if="data.isTwo != 1">
              {{ data.type | navType }}
            </span>
          </div>
        </template>
      </el-tree>
    </div>
    <div class="columns_index_right">
      <column-List :columnInfo="columnInfo" :key="key"></column-List>
    </div>
  </div>
</template>

<script>
import { getNavBar } from "@/api/js-wotao-b/columns-list"
import columnList from "@/components/nationalSite/columns/column-list";
export default {
  components: {
    columnList,
  },
  data() {
    return {
      tabPosition: "left",
      arr: ["", "", "", "", ""],
      siderList: [],
      columnInfo: {},
      key: 0,
    };
  },
  filters: {
    navType(val) {
      switch (val) {
        case 0:
          return "图文内容";
        case 1:
          return "文章列表";
        case 2:
          return "图文列表";
        case 3:
          return "图片列表";
      }
    },
  },
  methods: {
    getNav() {
      getNavBar(1).then((res) => {
        this.siderList = [];
        res.data.data.forEach((item) => {
          if (
            item.type == 0 ||
            item.type == 1 ||
            item.type == 2 ||
            item.type == 3
          ) {
            this.siderList.push(item);
          }
        });
        this.$nextTick(() => {
          this.key++
          if(!sessionStorage.getItem("columnInfo-b")){
            this.columnInfo = this.siderList[0]
          } else {
            this.columnInfo = JSON.parse(sessionStorage.getItem("columnInfo-b"))
          }
          this.$refs.refTree.setCurrentKey(this.columnInfo.id);
        })
      });
    },
    toggle(data) {
      if (data.isTwo == 1) {
          this.columnInfo = data.childrenColumnVoList[0]
      } else {
        this.columnInfo = data
      }
      this.key++
      sessionStorage.setItem("columnInfo-b",JSON.stringify(this.columnInfo))
    },
    getNavData(){
      if(sessionStorage.getItem("columnInfo-b")){
        this.columnInfo = JSON.parse(sessionStorage.getItem("columnInfo-b"))
      }
    }
  },
  mounted() {
    this.getNavData()
    this.getNav();
  },
};
</script>

<style scoped>
.columns_index {
  background: #fff;
  margin-left: 10px;
  min-height: 820px;
  display: flex;
}
.columns_index_left {
  font-size: 14px;
  margin-right: 10px;
  width: 188px;
  height: 100%;
  margin-top: 30px;
  border: 1px solid #ebeef5;
  margin-left: 10px;
  padding-bottom: 30px;
}
.columns_index_right {
  width: 100%;
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
.columns_index_left li {
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
.nav-type-sty {
  display: inline-block;
  width: 58px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  font-size: 8px;
  background: #108ee9;
  color: #fff;
  position: relative;
  border-radius: 5px;
  top: -7px;
}
:deep(.el-tree-node){
  margin-top: 6px
}
.blue_light{
  color: #409eff;
}
</style>