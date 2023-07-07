<template>
  <div class="site_box">
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tab_sty">
      <el-tab-pane label="分站站点" name="first"></el-tab-pane>
      <el-tab-pane label="全国站点" name="second"></el-tab-pane>
    </el-tabs>
    <div class="pad_sty" v-if="isShow">
      <el-form style="padding-left: 8px" :model="siteForm" ref="siteForm" inline label-width="90"
        @keyup.enter.native="getAllList()">
        <div>
          <el-form-item label="站点名称：" prop="keyWords">
            <el-input placeholder="请输入站点名称" class="contract-keyword" v-model.trim="siteForm.keyWords"></el-input>
          </el-form-item>
          <!-- 创建时间 -->
          <el-form-item :label="$t('label.createTime')" prop="createTime" width="50px">
            <el-date-picker style="width: 340px" v-model="siteForm.createTime" type="datetimerange" range-separator="~"
              format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']"
              start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </el-form-item>
          <el-button size="small" type="primary" @click="getAllList()">搜索</el-button>
          <el-button size="small" type="warning" @click="resetList()">重置</el-button>
        </div>
      </el-form>
      <avue-crud ref="crud" :data="dataList" :option="tableOption" @sort-change="changeSort" @size-change="sizeChange"
        @current-change="currentChange" :page.sync="page" v-loading="tableLoading">
        <template slot-scope="scope" slot="substationRealmName">
          <a :href="scope.row.substationRealmName" target="_blank">{{
            scope.row.substationRealmName
          }}</a>
        </template>
        <template v-slot:canCopyHeader>
          <span>允许复制</span>
          <el-tooltip class="item" effect="dark" content="开启后，可复制文章详情" placement="top">
            <div class="prompt_sty">?</div>
          </el-tooltip>
        </template>
        <template slot-scope="scope" slot="canCopy">
          <el-switch @change="changeCanCopyFn(scope.row)"
            :disabled="filterSwitchLoading(scope.row.id) ? true : switchLoading" v-model="scope.row.canCopy"
            active-color="#0082fc" :active-value="1" :inactive-value="0">
          </el-switch>
        </template>
        <template slot-scope="scope" slot="menu">
          <el-button type="text" icon="el-icon-edit" @click="permissions.sys_substation_detail
                ? handleEdit(scope.row)
                : $notAuthorized('没有查看权限！')
              ">编辑</el-button>
        </template>
      </avue-crud>
    </div>
    <el-tabs v-model="navName" type="card" @tab-click="navClick" class="tab_sty" v-show="!isShow">
      <el-tab-pane label="导航列表" name="navList"></el-tab-pane>
      <el-tab-pane label="导航设置" name="navSetting"></el-tab-pane>
      <el-tab-pane label="banner管理" name="navBanner"></el-tab-pane>
      <el-tab-pane label="友情链接" v-if="!filterSwitchLoading(substationId)" name="friendlyLink"></el-tab-pane>
    </el-tabs>
    <el-button type="primary" icon="el-icon-back" class="back" v-if="!isShow" @click="backToList">返回站点列表</el-button>
    <div v-if="!isShow">
      <div class="pad_sty">
        <nation-list @changeTab="getVal" :substationName="substationName" :substationId="substationId"
          v-if="navName == 'navList'"></nation-list>
        <nation-setting :substationName="substationName" :substationId="substationId"
          v-if="navName == 'navSetting'"></nation-setting>
        <nation-banner :substationName="substationName" :substationId="substationId"
          v-if="navName == 'navBanner'"></nation-banner>
        <friendly-link :substationName="substationName" :substationId="substationId"
          v-if="navName == 'friendlyLink'"></friendly-link>
      </div>
    </div>
  </div>
</template>
<script>
import * as CodeMsg from "@/api/common/CodeChange";
import { getSubstationList, updateCanCopy } from "@/api/substation/index";
import { tableOption } from "@/const/crud/substation/index";
import nationList from "@/components/nationalSite/nav/list";
import nationSetting from "@/components/nationalSite/nav/setting";
import nationBanner from "@/components/nationalSite/nav/banner";
import friendlyLink from "@/components/nationalSite/friendlyLink";
import { mapGetters } from "vuex";
export default {
  components: {
    nationList,
    nationSetting,
    nationBanner,
    friendlyLink
  },
  data() {
    return {
      switchLoading: false,
      activeName: "first",
      navName: "navList",
      isShow: true,
      siteForm: {
        keyWords: "",
        createTime: [],
      },
      showStatus: 0,
      page: {
        total: 0,
        pageSize: 20,
        currentPage: 1,
        pages: [5, 10, 20, 50],
      },
      tableLoading: true,
      dataList: [],
      tableOption: tableOption,
      sortField: "",
      sortType: "",
      substationId: null, //站点id
      substationName: "", //站点名称
      obj: {},
    };
  },
  computed: {
    ...mapGetters(["permissions"]),
  },
  watch: {
    isShow: {
      handler(newVal, oldVal) {
        sessionStorage.setItem('newValIsShow', newVal)
      },
      immediate: true,
    },
  },
  created() {
    if (sessionStorage.getItem(`${this.$route.path}`)) {
      let keepParams = JSON.parse(sessionStorage.getItem(`${this.$route.path}`));
      if (keepParams.detail.path !== "") {
        this.$router.push({
          path: keepParams.detail.path,
          query: keepParams.detail.query,
        });
        return;
      }
      this.siteForm.keyWords = keepParams.params.keyWords;
      this.siteForm.createTime = keepParams.params.createTime;
      if (keepParams.params.activeName) {
        this.activeName = keepParams.params.activeName;
      } else {
        this.activeName = "first";
      }
    }
    if (sessionStorage.getItem("sitelist") && !sessionStorage.getItem("isList")) {
      let data = JSON.parse(sessionStorage.getItem("sitelist"));
      this.navName = data.navName;
      this.isShow = data.isShow;
      this.activeName = data.activeName;
      this.substationId = data.substationId;
      this.substationName = data.substationName;
    } else {
      this.navName = "navList";
    }
    if (sessionStorage.getItem("addEassay") && sessionStorage.getItem("sitelist")) {
      let data = JSON.parse(sessionStorage.getItem("sitelist"));
      this.navName = "navList";
      this.isShow = data.isShow;
      this.activeName = data.activeName;
      this.substationId = data.substationId;
      this.substationName = data.substationName;
    }
  },

  mounted() {
    this.getAllList();
  },

  methods: {
    // 根据分站id 判断是否可以复制
    filterSwitchLoading(id) {
      if(!id)return true
      /* excludeIds 分站id
        3 : 成都2站
        4 : 商标站
        5 : 江苏站
       12 : 湖北1站
       20 : 湖南站
       */
      const excludeIds = [3, 4, 5, 12, 20]
      return !excludeIds.includes(id)
    },
    async changeCanCopyFn(row) {
      this.switchLoading = true;
      let data = {
        id: row.id,
        canCopy: row.canCopy,
      };
      let res = await updateCanCopy(data);
      if (res.data.code == CodeMsg.CODE_0) {
        this.$message({
          type: "success",
          message: "修改成功",
        });
        await this.getAllList();
      }
      this.switchLoading = false;
    },
    // 获取子组件传值
    getVal(e) {
      if (e) {
        this.navName = "navSetting";
      }
    },
    // 排序
    changeSort(e) {
      this.sortType = e.order == "ascending" ? "asc" : "desc";
      this.sortField = e.prop;
      this.getAllList();
    },
    // tab切换
    handleClick(val) {
      if (!this.isShow) {
        this.isShow = true;
      }
      this.resetList()
      this.getAllList();
    },
    navClick(val) {
      this.showStatus = val.index;
    },
    // 获取列表
    getList() {
      let params = {
        keyWord: this.siteForm.keyWords, //关键字
        substationType: this.activeName == "first" ? 1 : 0, //站点类型
        sortField: this.sortField, //排序字段
        sortType: this.sortType, // 排序方式
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      if (this.siteForm.createTime) {
        params.startTime = this.siteForm.createTime[0];
        params.endTime = this.siteForm.createTime[1];
      }
      // 需要缓存的参数
      let keepParams = {
        params: {
          keyWord: this.siteForm.keyWords,
          activeName: this.activeName,
          createTime: this.siteForm.createTime,
        },
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getSubstationList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.tableLoading = false;
          this.dataList = res.data.data.records;
          this.page.total = res.data.data.total;
        }
      });
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    // 编辑
    handleEdit(row) {
      this.isShow = false;
      this.navName = "navList";
      this.substationId = row.id;
      this.substationName = row.substationName;
      let obj = {
        substationId: this.substationId,
        substationName: this.substationName,
        navName: this.navName,
        isShow: this.isShow,
        activeName: this.activeName,
      };
      sessionStorage.setItem("sitelist", JSON.stringify(obj));
      sessionStorage.setItem("isList", false);
    },
    // 返回站点列表
    backToList() {
      this.isShow = true;
      sessionStorage.removeItem("addEassay");
      sessionStorage.removeItem("sitelist");
      sessionStorage.removeItem("isList");
    },
    // 重置
    resetList() {
      this.siteForm = {
        keyWords: "",
        createTime: [],
      };
      this.getAllList();
    },
    // 获取列表
    getList() {
      let params = {
        keyWord: this.siteForm.keyWords, //关键字
        substationType: this.activeName == "first" ? 1 : 0, //站点类型
        sortField: this.sortField, //排序字段
        sortType: this.sortType, // 排序方式
        pageNo: this.page.currentPage,
        pageSize: this.page.pageSize,
      };
      if (this.siteForm.createTime) {
        params.startTime = this.siteForm.createTime[0];
        params.endTime = this.siteForm.createTime[1];
      }
      // 需要缓存的参数
      let keepParams = {
        params: {
          keyWord: this.siteForm.keyWords,
          activeName: this.activeName,
          createTime: this.siteForm.createTime,
        },
        detail: { path: "", query: {} },
      };
      sessionStorage.setItem(`${this.$route.path}`, JSON.stringify(keepParams));
      getSubstationList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.tableLoading = false;
          this.dataList = res.data.data.records;
          this.page.total = res.data.data.total;
        }
      });
    },
    sizeChange(val) {
      this.page.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
  },
};
</script>

<style scoped>
.site_box {
  background: #ffffff;
  height: 100%;
  position: relative;
}

.tab_sty {
  padding-left: 30px;
}

.pad_sty {
  padding: 5px 20px 20px 15px;
  height: 100%;
  background-color: #ffffff;
}

.back {
  position: absolute;
  top: 56px;
  right: 10px;
  z-index: 1000;
}

.prompt_sty {
  margin-left: 10px;
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  color: #fff;
  background-color: rgb(216, 233, 120);
  line-height: 14px;
  text-align: center;
}
</style>
