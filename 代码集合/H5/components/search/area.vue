<template>
    <div class="child-cont">
        <div class="province">
            <div v-for="(item,idx) in provinces" :key="idx" @click="clickProvince(item)" class="item">
                <p :class="[indexP == item.areaNo ? 'choosed' : '']">{{item.areaName}}</p>
            </div>
        </div>
        <div class="city">
            <div v-for="(item,idc) in cityItem" :key="idc" class="item" @click="clickCity(item)">
            <p :class="[indexC == item.value ? 'choosed' : '']">{{item.label}}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { getSelection } from "@/api/policySquare";
import { switchProvincePC } from "@/api/search";
export default {
    props:["choosed","indexP", "indexC"],
    data() {
        return {
            provinces:[],
            citys:[],
            cityItem: [],
        };
    },
    methods: {
        getAreaData(){
             switchProvincePC().then(res=>{
                this.provinces = res.data;
            });
            getSelection(4).then(res=>{
                this.citys = res.data.area
            });
        },
        //点击省份筛选市级
        clickProvince(i){
            this.getCity(i.areaNo)
        },
        //获取城市数据
        getCity(no){
            this.$emit('update:indexP', no); 
            let list = this.citys;
            let idx = list.findIndex(item=>item.value == no);
            if (idx == -1) return this.noCity(no);
            list.forEach(item=>{
                if(item.value == no) {
                    this.cityItem = item.children
                }
            });
        },
        //选择城市
        clickCity(item){
            this.$emit('update:indexC', item.value); 
            this.$emit('childChange', item) 
        },
        //省份下无数据
        noCity(data){
            let city = [
                {parentNo: data, label: "国家级", value: "100001"},
                {parentNo: data, label: "省级", value: "320001"}
            ];
            this.cityItem = city
        },
    },
    mounted(){
        if(this.choosed == 'area') return this.getAreaData()
    }
};
</script>

<style lang="stylus" scoped>
@import './search-child'
</style>
