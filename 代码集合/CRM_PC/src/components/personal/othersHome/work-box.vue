<!-- 排查完成 -->
<template>
  <div class="quick-tool">
    <div class="tool-left">
      <div class="tool-title">
        <span>快捷工具</span>
      </div>
      <div class="tool-list" v-if="imgList.length > 0">
        <div :class="[item.status == true ? 'tool-list-item' : '']" @click="toolClick(item)" v-for="(item, index) in imgList" :key="index">
          <img :src="item.imgUrl" alt="" v-if="item.status" />
          <p>{{item.title}}</p>
        </div>
      </div>
      <img v-if="imgList.length == 0" class="nodata" :src="require('@/assets/images/my-home/nodata.svg')" alt="">
    </div>
    
    <div class="tool-right">
      <div class="tool-title">
        <span>我的数据</span>
      </div>
      <div class="myData" v-if="menuList.length != 0">
        <div class="more">
          <img class="bigMoreicon" :src="require('@/assets/images/my-home/moreleft.png')" alt="更多" @click="getMenuList(-1)" v-if="num >= 1">
        </div>
        <div class="menu-list" v-if="menuList.length > 0">
          <div :class="[item.status == true ? 'tool-list-item tool-right-item' : '']" @click="routeLink(item.path)" v-for="(item, index) in menuList" :key="index">
            <img :src="item.imgUrl" alt="" v-if="item.status" />
            <p>{{item.title}}</p>
            <img class="moreicon imgMyData" :src="require('@/assets/images/my-home/more@2x.png')" alt="更多">
          </div>
        </div>
        <div class="more">
          <img class="bigMoreicon" :src="require('@/assets/images/my-home/more@2x.png')" alt="更多" @click="getMenuList(1)" v-if="num < numPage">
        </div>
      </div>
      
      <img v-if="menuList.length == 0" class="nodata" :src="require('@/assets/images/my-home/nodata.svg')" alt="">
    </div>
    <client-search @close="close" v-if="quickStatus"></client-search>
    <!-- 创建线索dialog -->
    <el-dialog :visible.sync="addClueDialog" title="创建线索" width="690px" :close-on-click-modal="false" top="5vh">
      <operate-clue @close-clue="addClueDialog = false" :createType="1" @closeClueOperate="addClueDialog = false"></operate-clue>
    </el-dialog>
    <!-- 查询订单dialog -->
    <order-search @close="closeOrderDialog" v-if="orderSearchDialog"></order-search>
    <!-- 填写日志dialog -->
    <el-dialog :title="logTitle" :visible.sync="logDialog" :close-on-click-modal="false">
      <operate-log :operateStatus='operateStatus' :source="source" v-if="logDialog" ref="workLog" @close-log='closeLog()'></operate-log>
    </el-dialog>
  </div>
</template>

<script>
import clientSearch from "@/components/personal/my-home/client-search";
import operateClue from "@/components/new-client/common/operate-clue";
import orderSearch from "@/components/order/order-search";
import operateLog from "@/components/staff/work-log/operate-log";
import { getStateList } from "@/api/work-log/index";
import * as homeData from './worktable'
import { mapGetters } from "vuex";
import { filterPer } from '@/util/filtration_permission.js'
export default {
  components: {
    clientSearch,
    operateClue,
    orderSearch,
    operateLog
  },
  data() {
    return {
      addClueDialog: false,
      quickStatus: false,
      orderSearchDialog: false,
      imgList:homeData.imgList,
      menuList: homeData.menuList,
      menuList1: homeData.menuList,
      num: 0,
      numPage: 0,
      source: true,
      operateStatus: null,
      logTitle: "",
      logDialog: false,
      jourStateList: []
    };
  },
  computed: {
    ...mapGetters(["permissions","userInfo"]),
  },
  mounted(){
    this.imgList=filterPer( this.imgList)
    this.getMenuList(0)
  },
  methods: {
    getMenuList(num) {
      this.num += num
      let menu = JSON.parse(JSON.stringify(filterPer(this.menuList1)))
      this.numPage = Math.floor(menu.length / 6)
      this.menuList = menu.slice(this.num * 6, 6 * (this.num + 1))
    },
    closeClueOperateDialog(val) {
      this.addClueDialog = val;
    },
    close() {
      this.quickStatus = false;
    },
    toolClick(e) {
      switch (e.showNum) {
        case 0:
        this.createClue();
          // this.permissions.sys_my_clue_account_detail ? this.quickStatus = true : this.$notAuthorized();
          break;
      }
    },
    entranceClick(item){
      this.$router.push({ path:item.path });
    },
    orderSearch() {
      this.orderSearchDialog = true
    },
    closeOrderDialog() {
      this.orderSearchDialog = false
    },
    inputContract() {
        this.$router.push({
          path: "/entering-contract",
          query: {
            source: 'personal',
          },
        });
    },
    createClue() {
      this.addClueDialog = true;
    },
    writeLog() { 
      let params = {
        time: this.$moment(new Date()).format("YYYY-MM"),
      };
      getStateList(params).then((res) => {
        if (res.data.code == CodeMsg.CODE_0) {
          this.jourStateList = res.data.data;
          let tDate = this.jourStateList[this.jourStateList.length-1]
          if (tDate.content) {
            if (tDate.isEdit == 1) {
              this.source = false;
              this.comOperate("查看日志", 0, tDate, true, false);
            } else {
              this.source = true;
              this.comOperate("查看日志", 0, tDate, true, false);
            }
            
          } else {
            // this.comOperate("工作日志", 2, {}, false, false);
            this.source = true;
            this.logTitle = "工作日志";
            this.logDialog = true;
            this.operateStatus = 2;
            this.$nextTick(() => {
              if (this.$refs.workLog) {
                this.$refs.workLog.disabled = false;
                this.$refs.workLog.logInfo.textarea = `今日工作：\n\n\n\n明日计划：\n\n\n\n心得体会：`;
                this.$refs.workLog.logInfo.journalTime = this.$moment(
                  new Date()
                ).format("YYYY-MM-DD");
              }
            });
          }
        }
      });
      
    },
    closeLog() {
      this.logDialog = false;
      this.currentDate = new Date()
    },
    comOperate(title, status, row, disabled, isContent) {
      this.logTitle = title;
      this.logDialog = true;
      this.operateStatus = status;
      this.$nextTick(() => {
        if (this.$refs.workLog) {
          this.$refs.workLog.logInfo.id = row.id;
          this.$refs.workLog.logInfo.textarea = isContent == true? `今日工作：\n\n\n\n明日计划：\n\n\n\n心得体会：` : row.content == null?`今日工作：\n\n\n\n明日计划：\n\n\n\n心得体会：`:row.content;
          this.$refs.workLog.logInfo.journalTime = row.journalTime;
          this.$refs.workLog.logInfo.isEffective = row.isEffective;
          this.$refs.workLog.$refs.upload.imgList = [];
          this.$refs.workLog.disabled = disabled;
          if (row.pictures != null && row.pictures[0] != "") {
            row.pictures.forEach((item) => {
              if (item !== "") {
                this.$refs.workLog.$refs.upload.imgList.push({
                  response: { data: item.trim() },
                });
              }
            });
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.quick-tool {
  background: #f4f7fc;
  flex: 3.5;
  border-radius: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
}
.tool-left{
  width: 49.6%;
  height: 200px;
  background: #fff;
  padding: 10px 0;
  border-radius: 10px;
}
.tool-right{
  width: 49.6%;
  height: 200px;
  background: #fff;
  padding: 10px 0;
  border-radius: 10px;
}
.tool-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tool-title span {
  color: #333333;
  font-size: 20px;
  font-weight: 550;
  margin-left: 17px;
}
.tool-title p {
  cursor: pointer;
  text-align: right;
  color: #409eff;
  margin-right: 20px;
  align-items: center;
  font-size: 12px;
  text-decoration: underline;
}
.menu-list{
  margin: 9px 17px 0 17px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  flex: 1;
}
.tool-list {
  margin: 9px 17px 0 17px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  justify-content: flex-start;
  align-items: center;
}
.tool-list-item {
  max-width: 140px;
  height: 71px;
  border-radius: 6px;
  background: #FAFCFF;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.tool-right-item {
  margin-right: 10px;
}
.tool-list-item:last-of-type {
  margin-right: 0;
}
.tool-list-item img {
  padding-left: 14px;
  width: 40px;
  height: 41px;
}
.tool-list-item p {
  margin-left: 10px;
  font-size: 14px;
  font-weight: bold;
  color: #333333;
}
.moreicon{
  margin: 0 !important;
  width: 12px !important;
  height: 12px !important;
}
.myData{
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bigMoreicon{
  margin: 0 !important;
  width: 30px !important;
  height: 30px !important;
}
.more{
  width: 72px;
  text-align: center;
}
.nodata{
  display: block;
  width: 100px;
  height: 120px;
  margin: 0 auto;
}
.imgMyData{
  padding-left: 8px !important;
}
</style>