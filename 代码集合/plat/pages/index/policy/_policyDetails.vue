<template>
  <div class="frame">
    <div style="background: #f1f1f1ff; height: 30px" />
    <common-detail
      v-if="!whichDetail"
      :article-no="articleId"
      :type-id="0"
      :data="data"
    />
    <other v-else :article-no="articleId" :type-id="0" :data="data" />
  </div>
</template>

<script>
import axios from 'axios'
import CommonDetail from '@/components/policy/commonDetail'
import Other from '@/components/policy/industryDetail'
import Encrypt from '~/plugins/Encrypt'
export default {
  scrollToTop: true,
  components: {
    CommonDetail,
    Other,
  },
  async asyncData({ params,query }) {
    if (process.server) {
      try{
        const whichDetail = params.policyDetails.length == 16?true:false
        let i = whichDetail ? params.policyDetails.substr(params.policyDetails.length - 3,2) : params.policyDetails.substr(params.policyDetails.length - 2,1)
        //1 通知公告 2 政策汇编 3 行业资讯
        let policyType = params.policyDetails.indexOf('TZ')>-1 ? 1 : params.policyDetails.indexOf('ZC')>-1 ? 2 : params.policyDetails.indexOf('HY')>-1 ? 3 : 4
        if (query.draftType == "notice") {//通知公告草稿状态
          policyType = 1
        }
        if (whichDetail) {
          var articleId = params.policyDetails.substr(
            0,
            params.policyDetails.length - 3
          ) // 截取文章编号
          var id = params.policyDetails.substr(
            params.policyDetails.length - 3,
            2
          ) // 截取文章类型
          var screenType = params.policyDetails.substr(
            params.policyDetails.length - 1,
            1
          ) // 截取筛选类型
        } else {
          var articleId = params.policyDetails.substr(
            0,
            params.policyDetails.length - 2
          ) // 截取文章编号
          var id = params.policyDetails.substr(
            params.policyDetails.length - 2,
            1
          ) // 截取文章类型
          var screenType = params.policyDetails.substr(
            params.policyDetails.length - 1,
            1
          ) // 截取筛选类型
        }
        // 政策汇编
        const otherData = await axios.get(
          process.env.ASYNC_DATA_API +
            '/policy/detail?number=' +
            articleId +
            '&type=' +
            id +
            '&token=' +
            screenType
        )
        // 通知公告
        const noticeData = await axios.get(
          process.env.ASYNC_DATA_API +
            '/policy/detailByNumber?number=' +
            articleId +
            '&type=' +
            id +
            '&id=' +
            query.id
        )
        // 行业资讯
        const industryData = await axios.get(
          process.env.ASYNC_DATA_API +
            '/industryWeb/getDetail/' +
            articleId.substr(0, articleId.length-1))
        const industryOldData = await axios.get(
          process.env.ASYNC_DATA_API +
            '/industryWeb/getDetail/' +
            articleId)
        if(policyType==1){
          if(noticeData.data.data.detail){
            let str = Encrypt.aesDecode(noticeData.data.data.detail.content)
            noticeData.data.data.detail.content = str;
            return {
              dataList: noticeData.data.data.detail || {},
              data: noticeData.data.data || {},
              whichDetail
            }
          }
        }else if(policyType==2){
          if(otherData.data.data.detail){
            let str = Encrypt.aesDecode(otherData.data.data.detail.content)
            otherData.data.data.detail.content = str;
            return {
              dataList: otherData.data.data.detail || {},
              data: otherData.data.data || {},
              whichDetail
            }
          }
        }else if(policyType==3){
            return {
              dataList: industryData.data.data.detail || {},
              data: industryData.data.data || {},
              whichDetail
            }
        }else{
          if(industryOldData.data.data.detail){
            return {
              dataList: industryOldData.data.data.detail || {},
              data: industryOldData.data.data || {},
              whichDetail
            }
          }
        }
      }catch(error) {
        console.log(error)
      }
    }
  },
  data() {
    return {
      dataList: {},
      data: {},
      metaDetail: {},
      articleId: '',
      whichDetail: false,
      noticeData: [],
      industryData: [],
      industryOldData: [],
      otherData: []
    }
  },
  created() {    
    this.articleId = this.$route.params.policyDetails
  },
  head() {
    return {
      title: this.dataList.metaTitle,
      meta: [
        { name: 'keywords', content: this.dataList.metaKeyword },
        {
          hid: 'description',
          name: 'description',
          content: this.dataList.metaDescription
        }
      ]
    }
  }
}
</script>

<style lang="stylus" scoped>
.frame {
  width: 100%;
  min-height: 630px;
  background: #F1F1F1;
  font-family: Microsoft YaHei UI;
}
</style>
