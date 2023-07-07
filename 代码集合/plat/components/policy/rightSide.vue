<template>
  <div>
    <div v-for="(item, index) in rightList" :key="index">
    <div class="policy_side" v-if="item.attr&&item.list.length>0">
      <i class="iconfont" style="color:#36A6FE;" v-html="item.icon"></i>
      <span class="right_txt">{{item.title}}</span>
      <span class="right_sty" @click="toList(item.path)">
          <span class="right_more">更多</span>
              <img
                  src="~/assets/images/zhengce/right_icon.png"
                  width="16"
                  height="16"
              />
      </span>
      <div class="policy_content"  v-for="(items,index) in item.list" :key="index">
          <div v-if="item.type!=3">
            <el-tooltip content="Top" placement="top" effect="light" v-if="items.title.length>20">
                <span slot="content" >{{items.title}}</span>
                <span class="art_list" @click="checkDetail(items, item.type)">
                    <span class="circle">
                        <span class="circle_left">{{ items.title }}</span>
                    </span> 
                </span>
            </el-tooltip>
            <div v-else>
                <span class="art_list" @click="checkDetail(items, item.type)">
                    <span class="circle">
                        <span class="circle_left">{{ items.title }}</span>
                    </span> 
                </span>
            </div>
          </div>
          <div v-else>
            <el-tooltip content="Top" placement="top" effect="light" v-if="items.file_name.length>20">
                <span slot="content" >{{items.file_name}}</span>
                <span class="art_list" @click="checkDetail(items, item.type)">
                    <span class="circle">
                        <span class="circle_left">{{ items.file_name }}</span>
                    </span> 
                </span>
            </el-tooltip>
            <div v-else>
                <span class="art_list" @click="checkDetail(items, item.type)">
                    <span class="circle">
                        <span class="circle_left">{{ items.file_name }}</span>
                    </span> 
                </span>
            </div>
          </div>
      </div>
  </div>
  </div>
  </div>
</template>

<script>
import {  esPageFile, esPagePolicy, esPageIndustry} from '@/api/announcement'
import { getQuestionList } from '@/api/question' 
import policyData from '@/pages/index/policy/policy_data'
import * as CodeMsg from "@/api/CodeChange"
export default {
  props: {
    typeId:{
      type: Number,
      required: true
    }
  },
  components: {

  },
  data () {
    return {
      rightList: [...policyData.rightList]
    }
  },

  created () {

  },

  mounted () {
    this.getSide()
  },

  methods: {
    // 跳转到对应详情 自定义type: 0-通知公告 1-行业资讯 2-卧涛问答 3-卧涛文档
    checkDetail(items, type){
        if(type == 0){
          window.open('/policy/'+ items.number + '01' +'?id=' + items.id)
        }else if(type == 1){
          window.open('/policy/'+ items.industry_no + '101' +'?id=' + items.id)
        }else if(type == 2){
          window.open('/policy/questionDetail?id='+ items.id)
        }else if(type == 3){
          window.open('/policy/files/'+ items.id)
        }
    },
    //跳转到对应列表
    toList(data){
        this.$store.state.searchTxt = '';//clear searchTxt in state
        this.$router.push({
            name:data
        })
    },
    // 获取侧边栏数据
    async getSide(){
        this.rightList.map(item => {
            if(item.type == this.typeId){
                item.attr = false
            }else{
                item.attr = true
            }
        })
        let params = {
            pageNo: 1,
            pageSize: 5,
            sort: 'latest'
        }
        await esPagePolicy(params).then(res => {
            if(res.data.code == CodeMsg.CODE_0){
            this.rightList[0].list = res.data.data.data.policyList
            }
        }).catch((error) => {
            console.log(error)
        })

        await esPageIndustry(params).then(res => {
            if(res.data.code == CodeMsg.CODE_0){
            this.rightList[1].list = res.data.data.industryInfoList
            }
        }).catch((error) => {
            console.log(error)
        })

        await getQuestionList({
            pageNo: 1,
            pageSize: 5,
            sortField: 'Time'
        }).then(res => {
            if (res.data.code == CodeMsg.CODE_0) {
            this.rightList[2].list = res.data.data.records
            }
        }).catch((error) => {
            console.log(error)
        })

         await esPageFile(params).then(res=>{
            if(res.data.code == CodeMsg.CODE_0){
              this.rightList[3].list = res.data.data.data.fileList
            }
          }).catch(error =>{
              console.log(error)
          })
    },
  }

}
</script>

<style lang="stylus">
.policy_side{
  width:100%;
  padding:10px 10px;
  .policy_content{
      margin:14px 0;
      .art_list{
          color:#86898B;
          font-size:14px;
          overflow:hidden;
          cursor:pointer;
          text-overflow:ellipsis;
          display:-webkit-box;
          -webkit-box-orient:vertical;
          -webkit-line-clamp:1;
      }
  }
  .circle_left {
    margin-left: 10px;
  }
  .circle{
    background:url('~@/assets/images/industry/yuanquan_gray@2x.png') no-repeat;
    background-size:4px 4px;
    background-position: left;
  }
  .circle:hover{
    color: #36A6FE;
    background:url('~@/assets/images/industry/yuanquan_blue@2x.png') no-repeat;
    background-size:4px 4px;
    background-position: left;
  }
  .right_txt {
    font-size: 14px;
    font-family: Source Han Sans CN, Source Han Sans CN-Regular;
    font-weight: 600;
    color: #233558;
  }
  .right_sty {
    float: right;
    color: #656565;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .right_more {
    font-size: 12px;
    margin-right: 4px;
    color: #A8A8A8;
    font-family: Source Han Sans CN, Source Han Sans CN-Regular;
    font-weight: 400;
  }
}
</style>