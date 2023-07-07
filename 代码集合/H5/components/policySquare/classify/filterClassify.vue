<template>
  <div class="filtrate" ref="wrapper">
    <div class="filtrate-wrapper">
      
      
      自定义筛选项
      <!-- <h3 class="filtrate-title">{{ optionsObj.categoryName }}</h3> -->
      <div class="btn-top-sty">
        <el-radio-group
          text-color="#FFFFFF"
          fill="#36A6FE"
          size="small"
          v-model="industryClassify"
          @change="handleCheckedindustryClassify"
        >
          <el-radio-button
            class="btn-select-radio"
            :border="false"
            :label="null"
            :value="null"
          >
            <span class="span-over-sty">{{ $t("message.all") }}</span>
          </el-radio-button>
          <el-radio-button
            v-for="obj in optionsObj.options"
            :label="obj.id"
            :key="obj.id"
            class="btn-select-radio"
            :border="false"
          >
            <span class="span-over-sty">{{ obj.name }}</span>
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="filtrate-footer">
      <div class="reset" @click="resetChoose">
        <p class="reset-txt" @click="resetChoose">{{ $t("button.reset") }}</p>
      </div>
      <div class="search-btn">
        <div v-if="type == 0" @click="searchGetData">
          {{ $t("button.search") }}{{ $t("message.announcements") }}
        </div>
        <div v-if="type == 1" @click="searchGetData">
          {{ $t("button.search") }}{{ $t("message.policyEdit") }}
        </div>
        <div v-if="type == 2" @click="searchGetData">
          {{ $t("button.search") }}{{ $t("message.questionAnswer") }}
        </div>
        <div v-if="type == 3" @click="searchGetData">
          {{ $t("button.search") }}{{ $t("message.projectApply") }}
        </div>
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
      industryClassify: null,
      expectStatus: 3,
      resultList: [],
      expectValue: []
    };
  },
  methods: {
    searchGetData() {
      this.$emit("search-filter");
    },
    changeSelectOption(val, number, status) {
      this.expectValue = [val[0].id]
      this.expectStatus = status;
      this.industryClassify = val[0].id;
      this.$emit(
        "industry-change",
        val,
        number,
        this.expectStatus
      );
    },
    handleCheckedindustryClassify(val) {
      if(val!==null){
        if(Array.isArray(val) == true){
          this.industryClassify = val.toString();
           if(val[0] == null){
           this.resultList = [null];
           }else{
           this.resultList = [];
           val.forEach((item) => {
           this.optionsObj.options.forEach((it) => {
          if (item == it.id) {
            this.resultList.push(it);
          }
        });
      });
      }
        }else{
          this.resultList = []
           this.optionsObj.options.forEach((it) => {
          if (val == it.id) {
            this.resultList.push(it);
          }
        });
          this.industryClassify = val
        }
      }else{
        this.resultList=[null]
      }
      this.$emit(
        "industry-change",
        this.resultList,
        this.optionsObj.categoryId,
        this.expectStatus
      );
    },
    resetChoose() {
      this.industryClassify = [null];
      this.$emit("reset-change", this.industryClassify);
    },
  },
  mounted() {
     const options = {
      click: true,
      tap: true
    };
    this.scroll = new BScroll(this.$refs.wrapper, options);
  },
};
</script>

<style lang="stylus" scoped>
.filtrate{
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
  min-height: 3rem;
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

.filtrate .reset-txt {
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

.mobileSty {
  color: #409EFF;
  background: rgba(61, 133, 220, 0.16) !important;
}

.btn-select-radio{
  display inline-block
  margin:0.05333333333rem;
  border:0px;
}
.btn-top-sty{
  margin-top:0.32rem;
  margin-bottom:0.26666666667rem;
}
.span-over-sty{
  width:2.1333333333333333rem;
  display:inline-block;
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
<style>
.filtrate-item .el-checkbox__inner {
  display: none !important;
}
.filtrate-item .el-checkbox {
  margin-right: 2% !important;
  text-align: center;
  width: 23% !important;
  background: rgba(241, 241, 241, 1);
  border-radius: 2px;
  line-height: 0.69333333333rem !important;
}
.filtrate-item .el-checkbox:nth-child(4n + 4) {
  margin-right: 0 !important;
}
.filtrate-item .el-checkbox__label {
  padding-left: 0 !important;
  font-size: 0.32rem !important;
}
.filtrate-item .is-checked {
  background: rgba(61, 133, 220, 0.16);
}
.el-radio-button__inner{
  border:none;
  background:#F8F8F7;
  border-radius: 0.1333333333333333rem;
  width: 2.08rem;
  height: 0.9066666666666667rem; 
  margin-right:0.1rem;
  margin-bottom: 0.2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.filtrate .el-radio-button:first-child .el-radio-button__inner{
  border-radius: 0.1333333333333333rem;
}
.filtrate .el-radio-button:last-child .el-radio-button__inner{
  border-radius: 0.1333333333333333rem;
}
.el-radio-button--small .el-radio-button__inner{
  border-radius: 0.1333333333333333rem;
  padding:0.24rem 0.24rem !important;
}
</style>
