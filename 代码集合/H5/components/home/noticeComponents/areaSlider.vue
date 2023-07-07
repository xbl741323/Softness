<template>
    <div class="hot">
        <div>
            <ul class="hot-list">
                <li v-for="(item,index) in hotData" :key="index" class="hot-item">
                    <img :src="require('@/assets/images/'+bgImg[0].src)" alt="">
                    <div class="area-desc">
                        <h3>{{item.areaName}}</h3>
                        <p>{{item.title}}</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>    
</template>

<script>
import {getCity} from '~/api/home'
export default {
    data(){
        return {
            hotData:[],
            bgImg:[
                {
                    src: 'home/img_adress01_home@3x.png',
                },{
                    src: 'home/img_adress02_home@3x.png',
                },{
                    src: 'home/img_adress03_home@3x.png',
                },{
                    src: 'home/img_adress04_home@3x.png',
                }
            ]
        };  
    },
    computed:{
            getLocationState(){
                return this.$store.state.city;
            }
    },
    methods:{   
            getCityList(){
                getCity(this.getLocationState).then(res=>{
                    this.hotData = res.data
                }).catch(err=>{
                    console.log(err)
                }); 
            },
    },
    watch:{
        getLocationState(val){
            this.getCityList(val);
            console.log(6666666666666)
        }
    },
    mounted(){
        this.getCityList()
    }
}
</script>

<style scoped>
.hot{
    width: 100%;
    position: relative;
}
.hot-list{
    display: -moz-box; /*Firefox*/
    display: -webkit-box; /*Safari,Opera,Chrome*/
    display: flex;
    overflow-x: scroll;
    -webkit-overflow-scrolling:touch;
    overflow-y: hidden;
}
.hot-item{
    height: 1.76rem;
    width: 2.08rem;
    display:block;
    position: relative;
    margin-right: .16rem;
}
.hot-item img{
    width: 100%;
}
.hot-list::-webkit-scrollbar {
    display:none
}
.area-desc{
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    text-align: center;
    transform:translate(-50%,-50%);
    color: #fff;
}
.area-desc h3{
    font-size: .42rem;
}
.area-desc p{
    font-size: .32rem;
    margin-top: .2rem;
}
</style>
