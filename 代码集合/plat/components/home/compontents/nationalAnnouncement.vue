<template>
    <div class="frame">
        <div class="box">
            <div class="list-head">
                <p><span v-if="this.area.areaName!=undefined">{{this.area.areaName}}</span>{{$t('txt.announcementsTxt1')}}</p>
                <p @click="more()">{{$t('txt.more')}}>></p>
            </div>
            <div class="content" v-for="(item,index) in List" :key="index">
                <div >
                    <p class="content-title" @click="toDetails(item.number)">{{item.title}}</p>
                    <p class="content-time">{{item.createTime}}</p>
                </div>
            </div>
      </div>
    </div>
</template>

<script>
export default {
    props: ['List'],
    data() {
        return {
            provinceValue:'',
        };
    },
    methods:{
        more(){
        let cityNo = this.area.areaNo;
        let provinceNo = this.area.parentNo
        this.$router.push({
            name:'index-policy-announcement',
            query:{
            cityId : cityNo,
            provinceId : provinceNo
            }
        })
        },
        toDetails(num){
            var id = num+0+1;
            window.open('/policy/'+ id);
        }
    },
    watch:{
        List(val){
            if(val!=undefined){
                if(val.length>0){
                    this.provinceValue =val[0].provinceValue;
                }else{
                    this.provinceValue= '';
                }
            }else{
                return false;
            }
        },
    }
};
</script>

<style lang="stylus" scoped>
.frame {
    width: 100%;
    height:350px;
    font-size:14px;
    background:#FFF;
    font-family:Microsoft YaHei UI;
    .box{
        .list-head{
            margin:0;
        }
            .list-head p:nth-child(1){
            background:#679FE6;
            padding:7px 18px;
            max-width:250px;
            color:#FFF;
            text-align:center;
        }
        .list-head p:nth-child(2){
            margin-top:-23px;
            color:#88B4EB;
            font-size:14px;
            cursor:pointer;
        }
        .content{
            width:100%;
            overflow:hidden;
            margin:16px 0;
            margin-left:40px;
        }
        .content-title{
            width:83%;
            padding-left:5px;
            border-left:2px solid #36A6FE;
            cursor:pointer;
            color:#373D40;
            text-overflow:ellipsis;
            overflow:hidden;
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:1;
        }
        .content-time{
            margin-left:20px;
            color:#A8A8A8;
        }
    }
}
</style>