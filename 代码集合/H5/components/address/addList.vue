<template>
    <div>
        <div class="add-list">
            <ul>
                <li v-for="(item,index) in list" :key="index" class="add-item" @touchstart="start(item)" @touchmove="move" @touchend="end">
                    <div class="item-box">
                        <div class="info-box" @click.stop="chooseOne(item,index)">
                            <div v-if="item.id == current" class="choose-ico"><img src="~/assets/images/order/gouxuan_icon@2x.png" /></div>
                            <div v-if="source =='account'" class="account-ico">
                                <img v-if="item.isDefault==1" class="add-front-ico" src="~/assets/images/order/dgzz@2x.png" />
                                <div v-else class="first-name">{{ item.receiverName.substring(0,1) }}</div>
                            </div>
                            <div :class="['info-txt',item.id == current || source =='account' ? 'choose-item':'',]">
                                <div class="first-line">
                                    <b>{{ item.receiverName }}</b> 
                                    <div class="phone-p">
                                        <p>{{ item.mobilePhoneNumber }}</p>
                                        <!-- <span class="long-default" v-if="item.isDefault==1 && item.receiverName.length>10">默认</span> -->
                                    </div>
                                    <span class="default-add" v-if="item.isDefault == 1">默认</span>
                                </div>
                                <p class="add-detail">{{ item.areaName }}{{item.detailAddress}}</p>
                            </div>
                        </div>
                        <div class="edit-ico" @click.stop="editAdd(item)"><img src="~/assets/images/order/add_bj_icon@2x.png" /></div>
                    </div>                    
                    <div class="cover-bg" v-if="coverId == item.id" @click.stop="closeCover()"></div>
                    <div class="click-box" v-if="coverId == item.id">
                        <div class="handle-box">
                            <div v-if="item.isDefault == 0" @click.stop="setDefault(item)"><p>设为默认</p></div>
                            <div @click.stop="deleteAsk(item)"><p>删除地址</p></div>
                        </div>
                    </div>                    
                </li>                           
            </ul>
        </div>
        <div class="bottom-add-btn" @click.stop="newAdd()" v-if="addBtn">
            <button type="submit" class="fm-btn">+ 添加收件地址</button>
        </div>   
        <el-dialog :visible.sync="alertDialog" width="0" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false"></el-dialog>
        <div v-if="alertDialog" class="alert">
            <p>是否删除该条数据</p>
            <div class="alert-btn">
                <p @click="deleteAddBtn(item)">{{confirmBtn}}</p>
                <p @click="alertDialog = false">取消</p>
            </div>
        </div>     
    </div>
</template>

<script>
import { receiveList, deleteAdd, defaultAdd } from '@/api/order'
export default {
    props:['source'],
    data(){
        return{
            current:'',
            loop: 0,
            coverId:'',
            list:[],
            alertDialog: false,
            addBtn:null,
            confirmBtn:'',
        }
    },
    methods:{
        chooseOne(item,index){
            if(this.source == 'order'){
                sessionStorage.setItem('addId', item.id);
                this.current = item.id;
                this.$router.go(-1);
            } else {
                this.closeCover()
            }
        },
        setDefault(item){
            defaultAdd({id: item.id}).then(res=>{
                this.closeCover();
                this.getReceiveList();
            })
        },
        deleteAddBtn(){            
            deleteAdd({id: this.coverId}).then(res=>{   
                if(res.code == 0){
                    this.alertDialog = false;
                    this.closeCover();
                    this.getReceiveList();
                }            
            })
        },
        deleteAsk(item){
            this.confirmBtn = '确定删除';
            this.alertDialog = true;
        },
        closeCover(){
            this.coverId = '';
        }, 
        newAdd(){
            this.$router.push('/order/address');
        },
        getReceiveList(){
            receiveList({accountId:this.userInfo.userId}).then(res=>{
                if(res.code == 0){
                    this.list = res.data;
                    if(this.list.length<10){
                        this.addBtn = true 
                    }
                };
            });
        },
        editAdd(item){
            this.$router.push({
                path:'/order/address',
                query:{ id: item.id },
            });
        },
        start(item){
            clearTimeout(this.loop);//再次清空定时器，防止重复注册定时器
            this.loop = setTimeout(() => {
                this.coverId = item.id
            },500);
        },
        move(){
            clearTimeout(this.loop);//清除定时器
            this.loop = 0;
        },
        end(){
            clearTimeout(this.loop)            
        },       
    },
    mounted(){        
        this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
        document.addEventListener('click', this.closeCover)
        this.current = this.$route.query.id;
        // this.current = this.$route.params.id;
        if(this.userInfo){
            this.getReceiveList();
        };
    },
}
</script>

<style scoped lang="stylus">
    @import '~assets/css/order/address.styl'
</style>