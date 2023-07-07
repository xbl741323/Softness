<template>
    <div class="search-list">
        <ul>
            <li v-for="(item,index) in list" :key="index" @click="toDetail(item)">
                <div class="list-item">
                    <h3 class="item-title">
                        <span class="bluecircle"></span>
                        <span v-if="item.classification">
                            <span class="title-light">【</span><span class="title-light">{{item.classification | policyType}}</span><span class="title-light">】</span>
                        </span>
                        <span class="title-txt" v-html="item.title"></span>
                    </h3>
                    <div class="item-desc">
                        <p class="item-time" v-if="item.createTime">{{item.createTime}}</p>
                        <!-- <span class="download-file" v-if="item.search_type==3"><i class="el-icon-download" style="margin-right:0.03rem;"></i>{{ $t('message.fileDowland') }}</span> -->
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import {downloadFile} from "@/api/policySquare";
import { Toast } from 'mint-ui';
export default {
    props:["list"],
    data() {
        return {
            filePathUrl:process.env.baseUrl,
            isZC: process.env.PROPERTY_URL,
        };
    },
    filters:{
        policyType(val){
            return val == 1 ? '通知公告': val == 2 ? '行业资讯' : val == 3 ? '卧涛问答' : '卧涛文档'
        },
        searchTypeChange(value) {
          if (value == 0) {
            var search_type = "通知公告";
          } else if(value == 1){
            var search_type = "政策汇编";
          } else if(value == 2) {
              var search_type  = "卧涛问答";
          } else if(value == 3) {
              var search_type  = "文件下载";
          } else if(value == 4) {
              var search_type  = "项目申报";
          } else if(value == 5) {
              var search_type  = "知识产权";
          }else if(value == 10) {
              var search_type  = "行业资讯";
          }else if(value == 99){
              var search_type  = "技术成果";
          }else if(value == 100){
              var search_type  = "技术需求";
          }else if(value == 11){
              var search_type  = '工商注册'
          }else if(value == 12){
              var search_type  = '财税服务'
          }else if(value == 13){
              var search_type  = '融资上市'
          }else if(value == 14){
              var search_type  = '法律服务'
          }else if(value == 15){
              var search_type  = '软件开发'
          }
          return search_type;
      }
    },
    methods: {
       filterType(val){
            // 1:gs工商 2:rz融资 3:fl法律 4:cs财税 
           return val == 11?'1':val == 12?'4':val == 13?'2':val == 14?'3':val == 15?'6':''
        },
        toDetail(item){
            if(item.classification==1){
                const newPath = this.$router.resolve({
                    path: "/policy/" + item.number + '01',
                    query: {
                        id: item.id,
                    }
                });
                window.open(newPath.href, "_self");
            } else if(item.classification==2){
                const newPath = this.$router.resolve({
                    path: "/policy/" + item.industryNo + '101',
                    query: {
                        id: item.id
                    }
                });
                window.open(newPath.href, "_self");
            } else if(item.classification==3){
                const newPath = this.$router.resolve({
                    path: "/policy/questionDetail",
                    query: {
                      id: item.id
                    }
                });
                window.open(newPath.href, "_self");
            } else if(item.classification==4){
                 const newPath = `/policy/files/${item.id}`
                window.open(newPath, "_self");
            } 
        }
    },
};
</script>

<style scoped>
.search-list{
    padding-top: 2.8rem;
    width: 100%;
    background: #fff;
}
.list-item{
    border-bottom: 1px solid #eaebef;
    padding:.48rem .42666666667rem;
    color: #666;
}
.item-title{
    line-height: .64rem;    
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: #333;
    font-weight: 400;
}
.item-title span{
    font-size: .373333333rem;
}
.title-light{
    color: #333;
}
.item-time{
    font-size: .32rem;
    flex: 1;
    color: #999999;
}
.item-desc{
    display: flex;
    margin-top: .2133333333rem;
    font-size: .32rem;
    align-items: center;
}
.download-file{
    text-decoration:none;
    color:#36a6fe;
}
.bluecircle{
    display: inline-block;
    width: 6px;
    height: 6px;
    background: #36a6fe;
    border-radius: 50%;
    position: relative;
    top: -1.5px;
}
</style>
