<template>
  <div class="nutice_item">
    <div class="item_checkbox" v-if="showStatus == 1">
      <el-checkbox v-model="checkValue" @change="showValue"></el-checkbox>
    </div>
    <div :class="['nutice_main', showStatus == 1 ? 'nutice_change' : '',showStatus!=1?'policyml':'']" @click="toDetail(collectInfo.type)">
      <div>
          <div class="policydetail">
              <div style="display:flex;align-items: center;">
                 <span class="bluecircle"></span>
                    <p class="item_title">{{collectInfo.type | typeFilter}}&nbsp;{{ collectInfo.title }}</p>
              </div>
              <!-- <span class="fail_sty" v-if="collectInfo.deleted == 1||collectInfo.showStatus == 2">已失效</span> -->
              <p class="createtime">{{ collectInfo.policyCreateTime }}</p>
          </div> 
      </div>
  
    </div>
  </div>
</template>

<script>
export default {
  props: ["showStatus", "collectInfo"],
  data() {
    return {
      sort: 1,
      checkValue: false,
    };
  },
  filters: {
    typeFilter(val) {
      switch (val) {
        case 0:
          return "[通知公告]";
        case 1:
          return "[政策汇编]";
        case 2:
          return "[卧涛问答]";
        case 10:
          return "[行业资讯]";
      }
    },
  },
  methods: {
    showValue(val) {
      this.$emit("policy-change", val);
    },
    toDetail(type) {
         if(type == 0){
             const newPath = this.$router.resolve({
              path:
                "/policy/" +
                this.collectInfo.number +
                this.collectInfo.type +
                this.sort,
              query: {
                catch: true,
              },
            });
            window.open(newPath.href, "_self");
         }else if(type ==1){
             const newPath = this.$router.resolve({
              path:
                "/policy/" +
                this.collectInfo.number +
                '1' +
                this.sort,
               query: {
                catch: true,
                skiFrom: true,
                page: 1,
                keyWords: '',
              },
            });
            window.open(newPath.href, "_self");
         }else if(type == 2){
            const newPath = this.$router.resolve({
              path:
                "/policy/" +
                this.collectInfo.number +
                '2' +
                this.sort,
               query: {
                catch: true,
                skiFrom: true,
                page: 1,
                keyWords: '',
              },
            });
            window.open(newPath.href, "_self");
         }else{
            const newPath = this.$router.resolve({
              path:
                "/policy/" +
                this.collectInfo.number +
                '10' +
                this.sort,
              query: {
                catch: true,
                skiFrom: true,
                page: 1,
                keyWords: '',
              },
            });
            window.open(newPath.href, "_self");
         }
       
    },
  },
};
</script>

<style scoped>
.nutice_item >>> .el-checkbox__inner{
    border-radius: 50%;
}
.policyflex{
    display: flex;
}
.policyImg{
    width: 36px;
    height: 36px;
}
.policydetail{
   margin-left: 12px;
   padding-right: 8px;
}
.item_title {
  font-size: 14px;
  color: #333333;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1; 
  max-width: 90%;
}
.createtime{
  color: #999999;
  margin-top: 5px;
  margin-left: 20px;
}
.nutice_item {
  width: 100%;
  height: 2.42666666667rem;
  overflow: hidden;
  border-bottom: 1px solid #e7e6eb;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.nutice_main {
  width: 10rem;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
.policyml{
  margin-left: 0.42666666667rem;
}
.nutice_change {
  align-items: flex-start;
}
.item_title > span:nth-of-type(1) {
  color: #36a6fe;
}
.item_title > span:nth-of-type(2) {
  color: #333;
}
.item_desc {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  color: #999999;
  font-size: 0.29333333333rem;
}
.item_checkbox {
  width: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.fail_sty {
  width: 1.28rem;
  height: 0.48rem;
  background: #999999;
  opacity: 1;
  border-radius: 4px;
  color: #ffffff;
  font-size: 12px;
  padding: 1px 7px;
}
.bluecircle{
    width: 10px;
    height: 10px;
    background: #42abfe;
    border-radius: 50%;
    display: inline-block;
    margin-right: 9px;
}
</style>