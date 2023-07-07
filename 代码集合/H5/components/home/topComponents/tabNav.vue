<template>
    <div class="nav">
         <div>
             <ul class="nav-list">
                 <li v-for="(item,index) in navData" :key="index" class="nav-item" @click="toList(item,index)">
                     <div class="nav-circle">
                         <img :src="require('@/assets/images/'+item.src)" alt="">
                     </div>
                     <p>{{item.name}}</p>
                 </li>
             </ul>
         </div>
    </div>    
</template>

<script>
export default {
    data(){
        return {
            navData:[
                {
                    name:'通知公告',
                    src:'home/icon_tongzhi_home@3x.png',
                    path:'/policy/announcement'
                },{
                name:'政策汇编',
                    src:'home/icon_huibian_home@3x.png',
                    path:'/policy/assembly'
                },{
                    name:'卧涛问答',
                    src:'home/icon_jieda_home@3x.png',
                    path:'/policy/troubleList'
                },{
                    name:'项目申报',
                    src:'home/icon_xiangmu_home@3x.png',
                    path:''
                }
            ]
        };  
    },
    methods:{   
        toList(item,index){
            this.$router.push(item.path)
        }
    },
    mounted(){
    },
}
</script>

<style scoped>
.nav{
    width: 100%;
    margin-top: .42rem;
    padding-bottom: .42rem;
}
.nav-list{
    display: flex;
    align-items: center;
}
.nav-item{
    width: 25%;
    text-align: center;
}
.nav-item p{
    margin-top: .27rem;
    font-size: .32rem;
    color: #333;
}
.nav-circle{
    width: 1.066666667rem;
    height: 1.066666667rem;
    position: relative;
    border-radius:50%;
    margin: 0 auto;
}
.nav-circle img{
    width: 100%;
}
</style>
