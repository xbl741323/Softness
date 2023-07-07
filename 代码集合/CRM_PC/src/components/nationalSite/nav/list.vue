<template>
  <div class="columns_index">
    <div class="columns_index_left">
      <el-button type="primary" class="add_sty" @click="addNav()">添加导航</el-button>
      <div class="left_title">{{ substationName }}导航</div>
      <el-tree ref="refTree" :data="siderList" :props="{
          children: 'childrenColumnVoList',
          label: 'name'
        }" highlight-current :current-node-key="columnInfo.id" node-key="id" style="margin-top: 6px">
        <template slot-scope="{ data }">
          <div @click="toggle(data)" style="width: 100%;">
            <span :class="columnInfo.name == data.name ? 'blue_light' : ''">{{ data.name }}</span>
            <img :src="data.src" alt="" v-if="data.isTwo != 1" class="icon-sty">
          </div>
        </template>
      </el-tree>
    </div>
    <div class="columns_index_right">
      <column-List :columnInfo="columnInfo" :key="key" :substationId="substationId"></column-List>
    </div>

    <el-dialog title="添加栏目" :visible.sync="dialogVisible" @close="closeForm" :close-on-click-modal='false' width="1120px"
      center>
      <columns-form v-if="dialogVisible" @closeForm="closeForm" @changeNav="changeNav" :columnId="columnId"
        :substationId="substationId"></columns-form>
    </el-dialog>
  </div>
</template>

<script>
import { getNavBar } from "@/api/js-wotao-b/columns-list"
import columnList from "@/components/nationalSite/columns/column-list";
import columnsForm from "@/components/nationalSite/columns";
export default {
  props: {
    substationName: {
      type: String,
      required: true
    },
    substationId: {
      required: true
    }
  },
  components: {
    columnList,
    columnsForm
  },
  data() {
    return {
      tabPosition: "left",
      arr: ["", "", "", "", ""],
      siderList: [],
      columnInfo: {},
      key: 0,
      columnId: null,
      dialogVisible: false
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
    // 添加导航
    addNav() {
      this.dialogVisible = true
    },
    closeForm() {
      this.columnId = null;
      this.dialogVisible = false;
    },
    changeNav(e) {
      if (e) {
        this.$emit("changeTab", true)
      }
    },
    getNav() {
      getNavBar(this.substationId).then((res) => {
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
          if (item.type == 0) {
            item.src = require('@/assets/images/icons/icon_tuwen@2x.png')
          } else if (item.type == 1) {
            item.src = require('@/assets/images/icons/icon_wenzhang@2x.png')
          } else if (item.type == 2) {
            item.src = require('@/assets/images/icons/icon_tuwenliebiao@2x.png')
          } else {
            item.src = require('@/assets/images/icons/icon_tupian@2x.png')
          }
          if (item.childrenColumnVoList.length > 0) {
            item.childrenColumnVoList.forEach(cItem => {
              if (cItem.type == 0) {
                cItem.src = require('@/assets/images/icons/icon_tuwen@2x.png')
              } else if (cItem.type == 1) {
                cItem.src = require('@/assets/images/icons/icon_wenzhang@2x.png')
              } else if (cItem.type == 2) {
                cItem.src = require('@/assets/images/icons/icon_tuwenliebiao@2x.png')
              } else {
                cItem.src = require('@/assets/images/icons/icon_tupian@2x.png')
              }
            })
          }
        });
        this.$nextTick(() => {
          this.key++
          if (!sessionStorage.getItem("nationalSite")) {
            this.columnInfo = this.siderList[0].isTwo == 1 ? this.siderList[0].childrenColumnVoList
            [0] : this.siderList[0]
          } else {
            this.columnInfo = JSON.parse(sessionStorage.getItem("nationalSite"))
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
      sessionStorage.setItem("nationalSite", JSON.stringify(this.columnInfo))
    },
    getNavData() {
      if (sessionStorage.getItem("nationalSite")) {
        this.columnInfo = JSON.parse(sessionStorage.getItem("nationalSite"))
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
  min-height: 720px;
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

:deep(.el-tree-node) {
  margin-top: 6px
}

.blue_light {
  color: #409eff;
}

.icon-sty {
  width: 14px;
  height: 14px;
  margin-left: 5px;
}

.add_sty {
  width: 188px;
  margin-bottom: 10px;
}</style>
