<template>
    <div class="frame">
        <div class="box">
            <div class="list-head">
            <p><span v-if="this.area.areaName!=undefined">
                {{this.area.areaName}}</span>{{$t('txt.announcementsTxt1')}}</p>
            <p @click="more()">{{$t('txt.more')}}>></p>
            </div>
            <div class="content" v-for="(item,index) in List" :key="index">
                <div style="display:flex;width:100%;align-items: center;" >
                    <div class="circle"></div>
                    <p class="content-title" @click="toDetails(item.number)">{{item.title}}</p>
                    <p class="content-time">{{item.createTime}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['List','area'],
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
            window.open('/policy/'+ id)
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
    font-family:Microsoft YaHei UI;
    background:#FFF;
    .box{
        height:350px;
        background:#FFF;
        .list-head{
            margin-left:40px; 
            margin-bottom:24px;
            padding-top:20px;
        }
        .list-head p:nth-child(1){
            marin-left:3%;
            background: #68b2ef1a;
            padding:7px 18px;
            max-width:250px;
            color: #36A6FE;
            text-align:center;
            border-radius: 60px;
        }
        .list-head p:nth-child(2){
            margin-left:92%;
            margin-top:-23px;
            font-size:14px;
            cursor:pointer;
            opacity: 0.5;
        }
        .content{
            width:100%;
            overflow:hidden;
            margin:16px 0;
            margin-left:40px;
        }
        .circle{
            width: 8px;
            height: 8px;
            background: #F97700;
            border-radius: 50%;
            opacity: 1;
        }
        .content-title{
            width:83%;
            padding-left:5px;
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