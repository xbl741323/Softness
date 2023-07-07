<template>
  <div class="filtrate">
    <div class="filtrate-wrapper-more">
      <h3 class="filtrate-title">{{ optionsObj.categoryName }}</h3>
      <div class="btn-top-sty">
        <el-radio-group
          text-color="#FFFFFF"
          fill="#36A6FE"
          size="small"
          v-model="industryClassify"
          @change="handleCheckedindustryClassify"
        >
          <el-radio-button
            :label="null"
            :value="null"
            :border="false"
            class="btn-select-radio"
          >
          <span class="span-over-sty">{{ $t("message.all") }}</span>
          </el-radio-button>
         <el-radio-button
            v-for="obj in optionsObj.options"
            :label="obj.dropdownKey"
            :key="obj.dropdownKey"
            class="btn-select-radio"
            :border="false"
            >
            <span class="span-over-sty">{{ obj.dropdownValue }}</span>
          </el-radio-button>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["optionsObj", "type"],
  data() {
    return {
      industryClassify: null,
      expectStatus: 3,
      resultList:[]
    };
  },
  methods: {
    handleCheckedindustryClassify(val) {
       console.log(val, this.optionsObj, "输出按标题相关xuanzefefe");
       this.resultList = []
      if(val == null||val == ""){
        this.resultList = []
      }else{
        this.optionsObj.options.forEach(item=>{
          if(val == item.dropdownKey){
            this.resultList.push(item)
          }
        })
      }
      console.log(this.resultList,"输出结果")
        this.$emit("industry-change",
        this.resultList,
        this.optionsObj.id,
        this.expectStatus
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
.filtrate-wrapper-more {
  padding: 0rem 0.4rem 0.05rem 0.4rem;
}

.filtrate-title:nth-of-type(1) {
 margin-top: 0.1rem;
}

.filtrate-title {
  margin-top: 0rem;
  font-weight: bold;
  color: #000000;
  font-size: 16px;
}

.filtrate-item {
  padding-top: 0.4rem;
  width: 100%;
}

.divider {
  width: 100%;
  height: 1px;
  background: rgba(209, 209, 214, 1);
}
.search-btn {
  flex: 1;
}

.reset {
  text-align: center;
  margin-left: 0.34rem;
}

.reset-txt {
  font-size: 0.37333333333rem;
  color: #333333;
}

.search-btn div {
  text-align: center;
  width: 90%;
  margin-left: 8%;
  font-size: 0.37333333333rem;
  line-height: 0.96rem;
  background: rgba(61, 133, 220, 1);
  color: #fff;
  border-radius: 4px;
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
.el-radio-button:first-child .el-radio-button__inner{
  border: none;
}
.el-radio-button--small .el-radio-button__inner{
  border-radius: 0.1333333333333333rem;
  padding:0.24rem 0.24rem !important;
}
</style>
