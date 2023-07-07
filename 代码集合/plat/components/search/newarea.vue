<template>
  <div  class="box">
    <div class="province-sty">
      <span class="text-sty">当前城市</span>
      <span class="orange-sty" @click="enterHefei()" >进入合肥</span>
    </div>
    <div class="province-choose">
      <span class="text-sty province-flex">按省份选择</span>
      <el-cascader ref="cascader" v-model="ruleForm.area" :props="{ value: 'no', label: 'name'}" :options="options" clearable :placeholder="placeholder"
      @change="handleChangeArea" class="cas" multiple="false" popper-class="area"></el-cascader>
    </div>
  </div>
</template>
<script>
import { getNewArea } from '@/api/announcement'
import * as CodeMsg from "@/api/CodeChange"
export default {
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    myArea: {
      type: [Array, Object, String],
      // default: []
    }
  },
  model: {
    prop: 'myArea',
    event: 'handlerValueChange'
  },
  data() {
    return {
      options: [],
      ruleForm: {},
      title: '',
      chooseAddressList: [],
      props: {},
      locationNo: ''
    }
  },
  watch: {
    myArea: {
      immediate: true, 
      handler(val) {
        this.ruleForm.area = val
      }
    }
  },
  created(){
  },
  mounted() {
    this.getNewArea()
  },
  methods: {
    getNewArea(){
      getNewArea().then(res => {
        if(res.data.data.code == CodeMsg.CODE_0){
          res.data.data.data.forEach(item=>{
            item.children.forEach(childItem=>{
              delete childItem.children
            })
          })
          this.options = res.data.data.data
        }
      }).catch(error => {
        console.log(error)
      })
    },
    enterHefei(){
        this.ruleForm.area = []
        this.ruleForm.area = ['340000','340100']
        this.ruleForm.province= '安徽省'
        this.ruleForm.city = '合肥市'
        this.placeholder = this.ruleForm.province + '/' + this.ruleForm.city
        this.$emit('changeLocation', {city: '合肥', areaNo:  '340000,340100'})
        this.$store.commit('Set_LocationNo',  '340000,340100');//定位地区编号
        sessionStorage.setItem('locationName', '合肥');//定位地区名
        sessionStorage.setItem('locationNo', '340000,340100');
    },
    // 选择省市区地址
    handleChangeArea(e) {
      if (e && e.length > 0) {
        this.ruleForm.province = this.$refs["cascader"].getCheckedNodes()[0].pathLabels[0]
        this.ruleForm.city = this.$refs["cascader"].getCheckedNodes()[0].pathLabels[1]
        this.ruleForm.label = this.$refs["cascader"].getCheckedNodes()[0].pathLabels
      } else {
        this.ruleForm.province = ''
        this.ruleForm.city = ''
      }
      this.$emit('handlerValueChange', this.ruleForm.area)
      this.$emit('change', this.ruleForm)
    },
  },
}
</script>
<style scoped>
.box {
  width: 100%;
}
.cas {
  width: 100%;
  flex: 1;
}
.cas >>> .el-input__inner {
  width: 220px;
  height: 30px;
}
.province-sty {
    height: 50px;
}
.province-choose {
    width: 100%;
    display: flex;
}
.province-flex {
    flex: 1;
}
.text-sty{
    color: #333;
    font-size: 14px;
    font-family: Microsoft YaHei, Microsoft YaHei-Bold;
    font-weight: 600;
    line-height: 35px;
}
.orange-sty {
    display: inline-block;
    color: #FF9A63;
    padding-left: 20px;
}
.orange-sty:hover {
    cursor: pointer;
}

</style>