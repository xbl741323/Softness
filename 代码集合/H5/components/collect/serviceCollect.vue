<template>
  <div class="project_collect">
    <div class="content_null" v-if="total == 0">暂无数据</div>
    <div v-else>
      <div class="collect_content">
        <div
          class="content_project"
          v-for="(item, index) in collectList"
          :key="index"
        >
          <service-item
            ref="project"
            @project-change="projectChange"
            :showStatus="multiStatus"
            :collectInfo="item"
          ></service-item>
        </div>
      </div>
      <div class="page_limit">
        没有更多了
        <!-- <el-pagination
          :page-size="pageSize"
          @current-change="handleChange"
          :current-page="currentPage"
          background
          :pager-count="5"
          layout="prev, pager, next"
          :total="total"
        ></el-pagination> -->
      </div>
    </div>
  </div>
</template>

<script>
import {  cancelcollect , getcollectList } from '@/api/productdetails'
import serviceItem from "@/components/collect/serviceItem"
import {toWx} from '@/utils/toWx'
export default {
  props: ["showStatus"],
  components: {
    serviceItem
  },
  data() {
    return {
      accountId:null,
      chanpingstatus:'产品状态',
      searchKey: "",
      userObj: {},
      multiStatus: 0,
      pageSize: 15,
      scrollNumber: 1,
      currentPage: 1,
      total: 0,
      collectList: [],
      scrollNumber: 1,
      ok: true,
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
    handleScroll() {
      let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
      // 变量 windowHeight 是可视区的高度
      let windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      // 变量scrollTop为当前页面的滚动条纵坐标位置
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 滚动条到底部得距离 = 滚动条的总高度 - 可视区的高度 - 当前页面的滚动条纵坐标位置
      var scrollBottom = scrollHeight - windowHeight - scrollTop
      if (scrollBottom < 50) {
        if (this.ok) {
          this.ok = false; 
          if (this.currentPage < this.scrollNumber) {
            this.currentPage++
            this.getList()
          }
          setTimeout(() => { 
            this.ok = true;      
          }, 500)
        }
      }
    },
    getList() {
      if(localStorage.getItem('userInfo')){
        let param = {
          pageNo:this.currentPage,
          pageSize:this.pageSize,
          userId:JSON.parse(localStorage.getItem('userInfo')).userId,
          effective: this.showStatus==0?0:this.showStatus==2?1:2,
          spuTitle:this.searchKey
        }
        getcollectList(param).then(res=>{
          let data = res.data
          this.total = data.total
          if (this.total < this.pageSize) {
            this.scrollNumber = 1
          } else if (this.total % this.pageSize == 0) {
            this.scrollNumber = this.total/this.pageSize
          } else if (this.total % this.pageSize !== 0) {
            this.scrollNumber = parseInt(this.total/this.pageSize) + 1
          }
          if (this.currentPage == 1) {
            this.collectList = data.records
          } else {
            this.collectList = this.collectList.concat(data.records)
          }
          this.$emit('project-total',this.total)
        })
      }else{
          // this.$router.push('/login')
          toWx()
      }
    },
    projectChange() {
        this.$emit('project-change')
    },
    handleChange(val) {
      this.currentPage = val;
      this.getList();
      this.$emit('change-page')
    },
  },
  mounted() {
    this.getList();
     window.addEventListener('scroll', this.handleScroll, true)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll, true)
  }
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
  display: flex;
  flex-direction: column;
  align-items: center;
}
.page_limit {
  width: 100%;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 0.3rem;
  margin-bottom: 0.5rem;
  color: #aaaaaa;
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
.content_project {
  width: 90%;
}
</style>