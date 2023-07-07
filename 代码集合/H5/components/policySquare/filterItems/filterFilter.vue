<template>
  <div class="filtrate">
    <div class="filtrate-wrapper-sort">
      <div class="filtrate-item-sort">
        <div class="rank-item"
            :class="item.no==active?'chooseRank':''"
            v-for="(item,index) in rankData"
            :key="index"
            @click="toggleRank(item.no)">
          {{item.name}}
        </div>
      </div>
    </div>
    <div class="filtrate-footer-sort" >
      <div class="reset" @click="resetChoose">
        <p class="reset-txt">{{ $t('button.reset') }}</p>
      </div>
      <div class="search-btn">
        <div
          v-if="type==0"
          @click="searchGetData"
        >{{ $t('button.search') }}{{ $t('message.announcements') }}</div>
        <div
          v-if="type==1"
          @click="searchGetData"
        >{{ $t('button.search') }}{{ $t('message.policyEdit') }}</div>
        <div
          v-if="type==2"
          @click="searchGetData"
        >{{ $t('button.search') }}{{ $t('message.questionAnswer') }}</div>
        <div
          v-if="type==3"
          @click="searchGetData"
        >{{ $t('button.search') }}{{ $t('message.projectApply') }}</div>
        <div
          v-if="type==5"
          @click="searchGetData"
        >{{ $t('button.search') }}技术成果</div>
        <div
          v-if="type==6"
          @click="searchGetData"
        >{{ $t('button.search') }}技术需求</div>
          <div
          v-if="type==10"
          @click="searchGetData"
        >搜索行业资讯</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["type","active","rankData","showIndex"],
  watch: {
    "$store.state.Set_LocationNo":{
      deep:true,
      handler:function(newVal,oldVal){
        let data = JSON.parse(sessionStorage.getItem("district"))
        if(this.showIndex==1){
          this.active = newVal.split(',')[1]
          data.forEach(item=>{
            item.children.forEach(citem =>{
              if(citem.no == this.active){
                this.rankData = [citem].concat(citem.children)
              }
            })
          })
        }
        this.resetChoose()
      }
    },
  },
  methods: {
    searchGetData() {
      let obj = {}
      if(this.showIndex == 1){
        obj = this.rankData.find(item=>item.no == this.active)
      }else{
        obj = this.rankData.find(item=>item.no == this.active)
      }
      this.$emit("search-filter", obj);
    },
    resetChoose() {
      let obj = {}
      if(this.showIndex == 1&&this.$route.path=='/policy/industryinfo'){
        obj = this.rankData.find(item=>item.no == 0)
        this.$emit("search-filter", obj);
        return false
      }
      if(this.showIndex == 1){
        this.active = sessionStorage.getItem("localAreaNo").split(',')[1]
        obj = this.rankData.find(item=>item.no == this.active)
      }else{
        this.active = 0		
        obj = this.rankData.find(item=>item.no == this.active)
      }
      this.$emit("search-filter", obj);
    },
    toggleRank(val) {
      this.active = val;
      this.searchGetData()
    }
  },
};
</script>

<style lang="stylus" scoped>
.filtrate-wrapper-sort {
  padding: 0.4rem 0.4rem;
  padding-bottom 0.46rem
  overflow-y: scroll;
  height: 4.5rem
}
 
.filtrate-title {
  margin-top: 0.4rem;
  font-weight: bold;
  color: #000000;
  font-size: 16px;
}

.filtrate-item-sort {
  padding: 0.02rem 0.2rem 0.2rem 0.10rem;
  width: 100%;
  // min-height:3rem;
}
.filtrate-item-sort{
  width: 100%;
  display flex
  flex-direction row
  flex-wrap: wrap
  // min-height:3rem;
}
.rank-item {
  width: 2rem;
  height: 0.8rem;
  background: #F8F8F7;
  opacity: 1;
  border-radius: 5px
  text-align center
  font-size: 12px;
  font-weight: 400;
  line-height: 0.8rem;
  color: #333333;
  opacity: 1;
  margin-right 0.2rem
  margin-top 0.2rem
}

.chooseRank {
  color: #FFFFFF;
  background #36A6FE
}

.divider {
  width: 100%;
  height: 1px;
  background: rgba(209, 209, 214, 1);
}

.filtrate-footer-sort {
  width 100%
  background #fff
  position fixed
  bottom 0
  padding: 0.3rem 0.4rem 0.3rem 0rem;
  border-top 1px solid rgba(209, 209, 214, 1)
  display: flex;
  align-items: center;
}

.filtrate-footer-sort img {
  width: 0.53333333333rem;
  height: 0.53333333333rem;
}

.search-btn {
  flex: 1;
}

.reset {
  border: 1px solid #999999;
  height: 34px;
  line-height 34px
  font-size 14px
  font-weight 400
  flex 1
  display flex
  margin-right: 3%;
  justify-content center
  align-items center 
  margin-left: 0.34rem;
  border-radius 34px
  color #333333
}

.reset-txt {
  font-size: 0.37333333333rem;
  color: #333333;
}

.search-btn div {
  text-align: center;
  width: 100%;
  font-size: 0.37333333333rem;
  line-height: 0.96rem;
  background: #36A6FE;
  color: #FFFFFF;
  border-radius: 34px;
}
</style>
<style>
.filtrate-item-sort .el-checkbox__inner {
  display: none !important;
}
.filtrate-item-sort .el-checkbox {
  margin-right: 2% !important;
  text-align: center;
  width: 23% !important;
  background: rgba(241, 241, 241, 1);
  border-radius: 2px;
  line-height: 26px !important;
}
.filtrate-item-sort .el-checkbox:nth-child(4n + 4) {
  margin-right: 0 !important;
}
.filtrate-item-sort .el-checkbox__label {
  padding-left: 0 !important;
  font-size: 0.32rem !important;
}
.filtrate-item-sort .is-checked {
  background: rgba(61, 133, 220, 0.16);
}
</style>
