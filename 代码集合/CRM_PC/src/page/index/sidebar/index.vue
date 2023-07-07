<template>
  <div class="avue-sidebar">
    <logo/>
    <el-scrollbar style="height:100%">
      <div
        v-if="validatenull(menu)"
        class="avue-sidebar--tip">没有发现菜单</div>
      <el-menu
        :default-active="nowTagValue"
        :show-timeout="200"
        :collapse="keyCollapse"
        unique-opened
        mode="vertical">
        <sidebar-item
          ref="child"
          :menu="menu"
          :screen="screen"
          :props="website.menu.props"
          :collapse="keyCollapse"
          first/>
      </el-menu>
    </el-scrollbar>
    <!-- <div v-if="entry" class="entry-box"> -->
      <el-dialog :visible.sync="entry" title="录入合同" :modal-append-to-body="false" @close="close" width="400px">
        <el-form :model="entryForm">
          <p class="entry-title">请选择合同来源</p>
          <el-form-item>
            <el-radio v-model="isOnline" :label="1">线上订单(用户在线交易)</el-radio>
            <el-radio v-model="isOnline" :label="0">线下订单</el-radio>
          </el-form-item>
        </el-form>
        <div class="entry-btn">
          <div class="entry-confirm" @click="entryContract()">确定</div>
          <div class="entry-confirm entry-cancel" @click="$store.state.common.entry = false;">取消</div>
        </div>
      </el-dialog>
    <!-- </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import logo from '../logo'
import sidebarItem from './sidebarItem'
import { getUUID } from '@/api/personal/mycontracts'
export default {
  name: 'Sidebar',
  inject: ["Index"],
  components: { sidebarItem, logo },
  data(){
    return {
      isOnline: 0,
      entryForm: {}
    }
  },
  created() {
    this.Index.openMenu(this.menuId);
  },
  mounted(){
    this.refreshDemo();
  },
  computed: {
    ...mapGetters(['website', 'menu', 'tag', 'keyCollapse', 'screen','entry','clueId']),
    nowTagValue: function() {
      return this.$router.$avueRouter.getValue(this.$route)
    },
  },
  methods:{
    close(){
      this.$store.state.common.entry = false;
    },
    refreshDemo(){
      if(this.$refs.child&&this.$refs.child.getCount){
        this.$refs.child.getCount();
      }
    },
    entryContract(){
      getUUID().then(res=>{
        this.$store.state.common.entry = false;
        if(this.isOnline){//线上订单录入合同
          this.$router.push({
            path: '/online-entering-contract',
            query:{
              uuid: res.data.data,
              source: this.$store.state.common.source
            }
          });
        }else{//线下
          this.$router.push({
            path: '/entering-contract',
            query:{
              clueId: this.$store.state.common.clueId,
              uuid: res.data.data,
              source: this.$store.state.common.source
            }
          });
          this.$store.state.common.clueId = null;
        };
      }).catch(()=>{
        return false;
      });
    },
  }
}
</script>

<style>
.entry-box{
  position: fixed;
  margin: 0 auto;
  z-index: 9999;
}
.entry-box >>> .el-dialog__header{
  background: #eeeeee;
}
.entry-btn{
  margin-top: 30px;
  display: flex;
  text-align: center;
}
.entry-title{
  margin-top: -10px;
  font-size: 14px;
  font-weight: 550;
}
.entry-confirm{
  width: 120px;
  height: 38px;
  background: #36A6FE;
  color: #FFFFFF;
  font-size: 16px;
  line-height: 38px;
  border-radius: 5px;
  margin:0 30px;
  cursor: pointer;
}
.entry-cancel{
  background: #FFFFFF;
  color: #333333;
  border: 1px solid #DCDCDC;
}
</style>


