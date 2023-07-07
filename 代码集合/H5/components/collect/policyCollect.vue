<template>
  <div class="policy_collect">
    <div style="border:1px solid #cccccc0a"></div>
    <div class="content_null" v-if="total == 0">暂无数据</div>
    <div v-else>
      <div class="collect_content">
        <div
          class="content_policy"
          v-for="(item, index) in collectList"
          :key="index"
        >
          <policy-item
            ref="policy"
            @policy-change="projectChange"
            :showStatus="multiStatus"
            :collectInfo="item"
          ></policy-item>
        </div>
      </div>
      <div class="page_limit">
        <el-pagination
          :page-size="pageSize"
          @current-change="handleChange"
          :current-page="currentPage"
          background
          :pager-count="5"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import policyItem from "@/components/collect/policyItem"
import { getCollectList } from "@/api/user"
export default {
  props: ["showStatus"],
  components: {
    policyItem,
  },
  data() {
    return {
      accountId:null,
      chanpingstatus:'产品状态',
      searchKey: "",
      userObj: {},
      multiStatus: 0,
      pageSize: 30,
      currentPage: 1,
      total: 0,
      collectList: []
    };
  },
  watch:{
     showStatus:{
         handler(newVal,oldVal){
            this.getList()
         },
         deep:true
     }
  },
  methods: {
    getList() {
        if(localStorage.getItem('userInfo')){
          var userInfo = JSON.parse(localStorage.getItem('userInfo'));
          this.accountId = userInfo.userId
        }else{
          this.accountId = null
        }
      let params = {
        accountId:this.accountId,
        size: this.pageSize,
        page: this.currentPage,
        deletedList: Number(this.showStatus),
        listType: 2,
        searchKey: this.searchKey,
      };
      getCollectList(params).then((res) => {
        let reaObj = res.data;
        this.collectList = reaObj.collList.records;
        this.total = reaObj.collList.total;
        this.$emit("policy-total",this.total)
      });
    },
    projectChange() {
      this.$emit("project-change");
    },
    handleChange(val) {
      this.currentPage = val;
      this.getList();
      this.$emit('change-page')
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped>
.bbbbbb{
 font-size: 12px;
 color: #36a6fe;
}
.act{
  color: #36a6fe;
}
/*遮罩层*/
.mask {
  position: fixed;
  z-index: 998;
  top: 2.56rem;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
}
.collect_content {
  background: #ffffff;
}
.page_limit {
  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 35px;
  margin-bottom: 2rem;
}
.content_null {
  padding-top: 50px;
  background: #ffffff;
  color: #aaaaaa;
  font-size: 0.426666666667rem;
  width: 100%;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>