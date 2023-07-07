<template>
  <div class="filtrate">
    <div class="filtrate-wrapper-sort">
      <div class="filtrate-item-sort">
        <div class="rank-item"
            :class="item.value==active?'chooseRank':''"
            v-for="(item,index) in rankData"
            :key="index"
            @click="toggleRank(item)">
          {{item.name}}
        </div>
      </div>
    </div>
    <div class="filtrate-footer-sort" >
      <div class="reset" @click="resetChoose">
        <p class="reset-txt">{{ $t('button.reset') }}</p>
      </div>
      <div class="search-btn">
        <div @click="searchGetData">{{ $t('button.search') }}卧涛文档</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["active"],
  data(){
    return {
      rankData: [
        {
          name: '发布时间',
          value: 'latest'
        },{
          name: '综合排序',
          value: 'hottest'
        },
      ]
    }
  },
  methods: {
    searchGetData() {
      this.$nextTick(()=>{
        this.rankData.map((item,index) => {
          if(item.value == this.active){
            this.$emit("search-filter", this.rankData[index])
          }
        })
      })
    },
    resetChoose() {
      this.$emit("search-filter", this.rankData[0])
    },
    toggleRank(obj) {
      this.$emit("search-filter", obj);
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
