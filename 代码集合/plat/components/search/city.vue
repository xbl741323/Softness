<template>
    <div class="box">
        <div class="provinces">
            <div class="list">
                <span :class="[num==null?'city-txt-name':'','city-name']"  @click="clickCity()">{{cityName}}</span>
                <div v-for="(item, index) in district" :key="index">
                    <span @click="clickDistrict(index,item)">
                        <span :class="[num==index?'activeSty':'','areaListSty']" >
                            {{ item.name }}
                        </span>
                    </span>
                </div>
            </div>
            </div>
    </div>
</template>
<script>
import { getNewArea } from '@/api/announcement'
import * as CodeMsg from "@/api/CodeChange"
export default {
    data(){
        return{
            showProvince: true,
            areaList: {},
            activeId: null,
            keepChildOpen: false,
            provinceInfo:{},
            listLength: 0,
            cityList: [],
            attributionId: [],
            citysList: [],
            policySearchParams: [],
            activeNum: 0,
            currentPage: 1,
            provinceValue: '',
            hasProvinces: [],
            callInterface: false,
            cityNo: 'unlimit',
            active: [],
            num: null,
            provinceNo: null,
            district: {},//区县
            districtList: [],//省市区
            cityName: '', //城市名
            paraArea: []
        }
    },
    methods:{
        clickCity(){
            this.num = null
            this.$emit('areaChange', Array.from(this.paraArea)[1])
        },
        clickDistrict(index,item){
            this.num = index
            this.$emit('areaChange', item.no)
        },
        getNewArea(val){
            let arr = []
            if(val!='undefined'&&val!=undefined){
                arr = val.split(',')
                this.paraArea = arr
            }else{
                arr = []
            }
            getNewArea().then(res => {
                if(res.data.data.code == CodeMsg.CODE_0){
                    this.districtList = res.data.data.data
                    if(arr.length > 0){
                       let obj =  this.districtList.find(item => item.no == arr[0])
                       let newArr = Array.from(obj.children)
                       newArr.forEach(item=>{
                        if(item.no == arr[1]){
                           this.cityName = item.name
                           this.district = Array.from(item.children)
                        }
                       })
                    }
                }
            }).catch(error => {
                console.log(error)
            })
        },
    },
    created() {
        if (this.$route.query.cityId) {
            this.activeId = this.$route.query.provinceId
            this.activeNum = 1        
        }
    },
    computed: {
        location() {
            return this.$store.state.Set_LocationNo
        }
    },
    mounted(){
        this.getNewArea(sessionStorage.getItem('locationNo'))
    },
    watch: {
        location(val) {
            this.getNewArea(val);
        }
    },
}
</script>
<style lang="stylus" scoped>
    @import './areas'        
</style>