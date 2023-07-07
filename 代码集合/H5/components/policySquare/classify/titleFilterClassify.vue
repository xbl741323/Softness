<template>
  <div class="filtrate-search" ref="wrapper">
    <div class="filtrate-wrapper">
      <!-- <h3 class="filtrate-title">{{ optionsObj.categoryName }}</h3> -->
      <div class="filtrate-item">
        <el-checkbox-group v-model="industryClassify" @change="handleCheckedindustryClassify">
          <el-checkbox
            v-for="(obj,index) in arrList"
            :label="obj"
            :key="index"
            class="el-check-btn"
          >
            <span class="over_class">{{ obj }}</span>
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="filtrate-footer">
      <div class="reset" @click="resetChoose">
        <p class="reset-txt" @click="resetChoose">{{ $t('button.reset') }}</p>
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
          v-if="type==10"
          @click="searchGetData"
        >搜索行业资讯</div>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  props: ["optionsObj", "type"],
  data() {
    return {
      industryClassify: ["按标题"],
      arrList: ["按标题", "按内容"],
      expectStatus: 0,
      name: ""
    };
  },
  methods: {
    searchGetData() {
      this.$emit("search-filter");
    },
    getTypeData() {},
    handleCheckedindustryClassify(val) {
      console.log(val);
      this.industryClassify = val;
      if(val[0]==null){
        this.industryClassify = ["按标题"]
      }
      if (val[0] !== null && val.length == 1) {
        if (val == "按标题") {
          this.expectStatus = 0;
        } else {
          this.expectStatus = 1;
        }
      } else if (val[0] !== null && val.length == 2) {
        this.expectStatus = 2;
      }
      console.log(val, "输出按标题相关ccccccccccc");
      this.$emit(
        "industry-change",
        val,
        this.optionsObj.categoryId,
        this.expectStatus
      );
    },
    resetChoose() {
      this.industryClassify = [null];
      this.$emit("reset-change", this.industryClassify);
    }
  },
  watch: {
    industryClassify(val) {
      // console.log(val, "watch-行业分类");
      if (this.industryClassify[0] != null) {
        for (var i = 0; i < this.industryClassify.length; i++) {
          if (this.industryClassify[i] == null) {
            this.industryClassify = [null];
          } else {
          }
        }
      } else if (val.length == 0) {
        this.industryClassify = [null];
      } else {
        for (var i = 0; i < this.industryClassify.length; i++) {
          if (this.industryClassify[i] != null) {
            this.industryClassify = this.industryClassify.splice(i, 1);
          } else {
          }
        }
      }
      deep: true;
    }
  },
  mounted() {
    // this.getTypeData()
     const options = {
      click: true,
      tap: true
    };
    this.scroll = new BScroll(this.$refs.wrapper, options);
  }
};
</script>

<style lang="stylus" scoped>
.filtrate-search{
  height:5rem;
  overflow-y: scroll ; 
  position relative
}
.filtrate-wrapper {
  padding: 0.2rem 0rem 0.2rem 0.45rem;
}

.filtrate-title {
  margin-top: 0.4rem;
  font-weight: bold;
  color: #000000;
  font-size: 16px;
}

.filtrate-item {
  padding-top: 0.4rem;
  width: 100%;
  min-height:2.5rem;
}

.divider {
  width: 100%;
  height: 1px;
  background: rgba(209, 209, 214, 1);
}

.filtrate-footer {
  width 100%
  background #fff
  position fixed
  bottom 0
  padding: 0.3rem 0.4rem 0.3rem 0rem;
  border-top 1px solid rgba(209, 209, 214, 1)
  display: flex;
  align-items: center;
}

.filtrate-footer img {
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

.over_class {
  display: inline-block;
  margin-bottom: 0.21333333333rem !important;
  width: 1.76rem;
  line-height: 0.9066666666666667rem !important; 
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.32rem;
}

.el-check-btn{
  width: 2.08rem;
  height: 0.9066666666666667rem; 
  line-height: 0.9066666666666667rem !important; 
}
</style>
<style>
.filtrate-search .filtrate-item .el-checkbox__inner {
  display: none !important;
}
.filtrate-search .filtrate-item .el-checkbox {
  margin-right: 2% !important;
  text-align: center;
  width: 23% !important;
  background: #F8F8F7;
  border-radius: 5px;
  line-height: 0.9066666666666667rem !important;
}
.filtrate-search .filtrate-item .el-checkbox:nth-child(4n + 4) {
  margin-right: 0 !important;
}
.filtrate-item .el-checkbox__label {
  padding-left: 0 !important;
  font-size: 0.32rem !important;
}
.filtrate-search .el-radio-button__inner{
  border:none;
  background:#F8F8F7;
  border-radius: 0.1333333333333333rem;
  width: 2.08rem;
  height: 0.9066666666666667rem; 
  line-height: 0.9066666666666667rem !important;
  margin-right:0.1rem;
  margin-bottom: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.filtrate-search .el-radio-button:first-child .el-radio-button__inner{
  border: none;
}
.filtrate-search .el-radio-button--small .el-radio-button__inner{
  border-radius: 0.1333333333333333rem;
}
.filtrate-search .el-checkbox__input.is-checked+.el-checkbox__label{
  color: #FFFFFF;
}
.filtrate-search .filtrate-item .is-checked{
 background: #36A6FE;
}
</style>
