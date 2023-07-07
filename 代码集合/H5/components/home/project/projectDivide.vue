<template>
    <div class="project-wrapper">
        <div class="project-box">
            <div class="first-project" @click="toProject(firstName)">
                <div class="project-item">
                    <h3>{{firstName}}</h3>
                    <p>{{$t('home.checkBelongProject')}}</p>
                    <div class="residue-img"><img v-if="this.firstUrl" :src="require('@/assets/images/'+firstUrl)" alt /></div>
                </div>
            </div>
            <div class="second-project" @click="toProject(secondName)">
                <div class="project-item">
                    <h3>{{secondName}}</h3>
                    <p>{{$t('home.checkBelongProject')}}</p>
                    <div class="residue-img"><img v-if="this.secondUrl" :src="require('@/assets/images/'+secondUrl)" alt=""></div>
                </div>
            </div>
        </div>
        <div class="project-box">
            <div class="third-project" @click="toProject(thirdName)">
                <div class="project-item">
                    <h3>{{thirdName}}</h3>
                    <p>{{$t('home.checkBelongProject')}}</p>
                    <div class="residue-img"><img v-if="this.thirdUrl" :src="require('@/assets/images/'+thirdUrl)" alt=""></div>
                </div>
            </div>
            <div class="residue-project">
                <div v-for="(item,index) in projectData" :key="index" class="project-cont">
                    <div class="project-item" v-if="index==3||index==4||index==5||index==6" @click="toProject(item.optionName)">
                        <h3>{{item.optionName}}</h3>
                        <p class="under">{{$t('home.checkBelongProject')}}</p>
                        <div class="residue-img"><img v-if="item.url" :src="require('@/assets/images/'+item.url)" alt=""></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {homeProject} from '~/api/home'
// import Headers from './noticeComponents/head'
export default {
    data(){
        return {
            imgPath: process.env.CDN_LOCAL_URL,
            obj:{},
            projectData:[],
            firstName:'',
            secondName:'',
            thirdName:'',
            firstUrl:'',
            secondUrl:'',
            thirdUrl:'',
        };
    },
    methods:{  
        toProject(name){
           this.obj = {}
           this.projectData.forEach(item=>{
               if(item.optionName == name) {
                 this.obj = item
                 return;
               }
            })
            console.log(this.obj,"输出需要的obj")
            this.$router.push({
                path:"/project",
                query:{
                    obj:this.obj
                }
            })
        },
        getData(){
            homeProject(7).then(res=>{
                this.projectData = res.data
                console.log(this.projectData,"输出首页项目信息")
                this.firstName = this.projectData[0].optionName;
                this.secondName = this.projectData[1].optionName;
                this.thirdName = this.projectData[2].optionName;
                this.firstUrl = this.projectData[0].url;
                this.secondUrl = this.projectData[1].url;
                this.thirdUrl = this.projectData[2].url;
            }).catch(err=>{
                console.log(err)
            }); 
        }
    },
    mounted(){
        this.getData()
    }
}
</script>
<style scoped>
   .project-wrapper{       
       width: 100%;
       padding-bottom: .53333333rem;
   }
   .project-box{
       width: 100%;
       display: flex;
   }
   .first-project{
       width: 33%;
       height: 1.7066667rem;
       margin-bottom: 0.1066667rem;       
       position: relative;
       background: linear-gradient(180deg, #FEB690 0%, #E6674D 100%);
   }
   .second-project{
       margin-left: 1%;
       width: 66%;
       height: 1.7066667rem;
       position: relative;
       margin-bottom: 0.1066667rem;
       background: linear-gradient(181deg, #A484FF 0%, #8271FC 100%);
   }
   .third-project{
       width: 33%;
       height: 3.52rem;
       position: relative;
       background: linear-gradient(181deg, #A484FF 0%, #8271FC 100%);
   }
   .residue-project{
       margin-left: 1%;
       width: 66%;
       display: inline-block;
   }
   .project-cont{
       width: 49%;
       float: left;
       height: 1.7066667rem;
       position: relative;
   }
   .project-cont:first-child, .project-cont:nth-child(2), .project-cont:nth-child(3){
       display: none;
   }
   .project-cont:nth-child(odd){
       margin-left: 2%;
   }
   .project-cont:nth-child(4){       
       background: linear-gradient(180deg, #F9B25D 0%, #F58B46 100%);
   }
   .project-cont:nth-child(5){
        background: linear-gradient(180deg, #87A2FC 0%, #4885EF 100%);
   }
   .project-cont:nth-child(6){
       margin-top: 0.1066667rem;
       background: linear-gradient(180deg, #8FB1FF 0%, #509AFC 100%);
   }
   .project-cont:nth-child(7){
       margin-top: 0.1066667rem;
       background: linear-gradient(180deg, #FEB690 0%, #E6674D 100%);
   }
   .project-item{
       margin: .1rem 0 .16rem .16rem;
       color: #fff;
   }   
   .project-item p{
       opacity: 0.6;
   }
   .project-item h3{
       font-size: .37333333rem;   
       overflow: hidden;
       text-overflow: ellipsis;
       display: -webkit-box;
       -webkit-box-orient: vertical;
   }
   .project-item p{
       font-size: .32rem;
       margin-top: .01rem;
       overflow: hidden;
       text-overflow: ellipsis;
       white-space: nowrap;
   }
   .under{
       opacity: 0.6;
   }
   .first-img{
       position: absolute;
       bottom: .32rem;
       right: .32rem;
       width: 1.28rem;
       height: 1.28rem;
   }
   .first-img img{
       width: 100%;
   }
   .residue-img{
       position: absolute;
       bottom: .16rem;
       right: .16rem;
       width: .64rem;
       height: .64rem;
   }
   .residue-img img{
       width: 100%;
   }
</style>
