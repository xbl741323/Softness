<template>
    <!-- 首页热门项目 -->
    <div class="frame">
        <div class="content_box">
             <div style="margin-top: 22px;text-align: center;position: relative;">
                <span style="color: #323232;font-size: 31px;position: absolute;top: -6px;left: 50%;transform: translateX(-50%);">热门项目</span>
                <img
                src="~/assets/images/home/biaoti.png"
                width="259"
                height="30"
                />
            </div>
            <div class="grid">
                <div class="row" v-for="(item,index) in projectList" :key="index">
                    <div class="project_head" :style="{backgroundImage:'url('+ require('@/assets/images/'+item.backgroundUrl)+')'}"  @click="screening(item)">
                        <img class="logo" :src="require('@/assets/images/'+item.url)" />
                        <p>{{item.optionName}}</p>
                    </div>
                    <div class="project_list" @click="toDetail(item.polices[0].number)" >
                        <p class="title">{{item.polices[0].title}}</p>
                        <p class="content">{{item.polices[0].slogan}}</p>
                        <div class="btn">
                            <p @click.stop="toDetail(item.polices[0].number)" class="detail" style="cursor: pointer;">{{$t('txt.checkDetails')}}</p>
                            <p @click.stop="showQia()" class="consult"  style="cursor: pointer;">{{$t('txt.consultingService')}}</p>
                        </div>
                    </div>
                    <div class="four" v-if="list[index].polices.length==4">
                        <div class="second_box" v-for="(items,index) in list[index].polices" :key="index" @click="toDetail(items.number)">
                            <div>
                                <p>{{items.title}}</p>
                                <p>{{items.slogan}}</p>
                            </div>
                            <div class="second_box_mask">
                                <div style="position:absolute;left:50%;top:50%;transform: translate(-50%,-50%);display: flex;align-items: center;">
                                     <img
                                    src="~/assets/images/home/liulan.png"
                                    width="30"
                                    height="30"
                                 />
                                <a style="color: #FFFFFF;position: relative;left: 10px;">查看详情</a>  
                                </div>
                                <!-- <a class="maskbtn2" @click.stop="showQia()">咨询客服</a> -->
                            </div>
                        </div>
                    </div> 
                    <div class="three" v-if="list[index].polices.length==3">
                        <div class="box" v-for="(items,index) in list[index].polices" :key="index" @click="toDetail(items.number)">
                            <div>
                                <p>{{items.title}}</p>
                                <p>{{items.slogan}}</p>
                            </div>
                            <div class="box-mask">
                                <!-- <a class="box-mask1">查看详情</a> -->
                                <div style="position:absolute;left:50%;top:50%;transform: translate(-50%,-50%);display: flex;align-items: center;">
                                     <img
                                    src="~/assets/images/home/liulan.png"
                                    width="30"
                                    height="30"
                                 />
                                <a style="color: #FFFFFF;position: relative;left: 10px;">查看详情</a>  
                                </div>
                                <!-- <a class="box-mask2" @click.stop="showQia()">咨询客服</a> -->
                            </div>
                        </div>
                    </div>
                    <div class="two" v-if="list[index].polices.length==2">
                        <div class="vicy_list" v-for="(items,index) in list[index].polices" :key="index" @click="toDetail(items.number)">
                            <div>
                                <p>{{items.title}}</p>
                                <p>{{items.slogan}}</p>
                            </div>
                            <div class="vicy-list-mask">
                                <!-- <a class="vicy-list-mask1" >查看详情</a> -->
                                 <div style="position:absolute;left:50%;top:50%;transform: translate(-50%,-50%);display: flex;align-items: center;">
                                     <img
                                    src="~/assets/images/home/liulan.png"
                                    width="30"
                                    height="30"
                                 />
                                <a style="color: #FFFFFF;position: relative;left: 10px;">查看详情</a>  
                                </div>
                                <!-- <a class="vicy-list-mask2" @click.stop="showQia()">咨询客服</a> -->
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
    </div>
</template>

<script>
import { getProjectList } from '@/api/home'
export default {
    data(){
        return{
            list:[],
            projectList:[],
            imgPath:'~/assets/images/',
            projectImgs:[
                {url:'home/img01_xiangmu_home@2x.png'},
                {url:'home/img02_xiangmu_home@2x.png'},
                {url:'home/img03_xiangmu_home@2x.png'},
                {url:'home/img04_xiangmu_home@2x.png'},
                {url:'home/img05_xiangmu_home@2x.png'},
                {url:'home/img06_xiangmu_home@2x.png'},
            ]
        }
    },
    methods:{
        screening(data){
            this.$router.push({
                name:'index-project',
                params:{
                    id:data.optionId,
                    classSetNumber:data.categoryId,
                    name:data.categoryName
                }
            })
        },
        showQia() {
            window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no')
        },
        toDetail(num){
            window.open('/project/'+num+2);
        },
        getList(val){
            let param ={
                areaNo: val,
                source:'PC'
            }
            getProjectList(param).then(res=>{
                if(res.data.code==1000){
                    this.projectList = res.data.data;
                    for(let i =0; i<this.projectList.length;i++){
                        this.$set(this.projectList[i],'backgroundUrl',this.projectImgs[i].url)
                    }
                    this.list = JSON.parse(JSON.stringify(this.projectList));
                    for(let i=0;i<this.list.length;i++){
                        this.list[i].polices.splice(0,1);
                    }
                }
            }).catch(err=>{

            })
        }
    },
    computed:{
        getLocationState(){
            return this.$store.state.Set_LocationNo;
        }
    },
    watch:{
        getLocationState(val){
            if(val !== null){
                this.getList(val)
            }else{
                this.getList(100000);
            }
        }
    },
    mounted(){
        if(this.$store.state.Set_LocationNo){
            this.getList(this.$store.state.Set_LocationNo);
        }
    }
}
</script>

<style lang="stylus" scoped>
@import './popProject.styl'
</style>