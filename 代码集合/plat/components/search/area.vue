<template>
    <div>
        <div class="attribution" v-if="showProvince">
        <!-- provinceList -->
            <div class="provinces">
            <div class="list" v-if="showProvince" @mouseleave="provinceLeave(provinceInfo)">
                <div v-for="(items, index) in areaList.area" :key="index">
                    <span class="areaListSty" :class="[{ activeTab: activeId == items.value}]" @mouseenter="keepChildOpen = true,provinceInfo = items,getTab(items.value,items)" @click="callInterface = true,clickTab(items.value)">
                        {{ items.label }}
                    </span>
                </div>
            </div>
            </div>
            <!-- cityList -->
            <div v-show="this.listLength > 0" class="city-box" :class="[showProvince ? '' : 'has-province']" @mouseover="keepChildList()" @mouseleave="leaveChildList()">
            <div v-for="item in this.citysList.children" :key="item.id" class="city-list">
                <span :class="[{ activeStyle: cityList.indexOf(item.value) > -1 }]" @click="getId(item.value, item.parentNo)">
                    {{ item.label }}
                </span>
            </div>
            </div>
         </div>
      <!-- 只显示所属市 -->
        <div v-else class="only-show-city">
            <div class="city-name" >
                <p v-for="item in this.citysList.children" :key="item.id" @click="getId(item.value,item.parentNo)" :class="[{activeSty:cityList.indexOf(item.value)>-1}]">
                    {{item.label}}
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import { getAreaList } from '@/api/announcement'
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
            provinceNo: null,
        }
    },
    methods:{
        provinceLeave(provinceInfo){
            this.keepChildOpen = false;
            setTimeout(()=>{
                if(!this.keepChildOpen){
                    this.getTab(this.provinceNo,provinceInfo);
                }
            },100);
        },
        keepChildList(){
            this.keepChildOpen = true;
        },
        leaveChildList(){
            if(this.showProvince){
                this.remove();
            }
            if(this.cityList.length>0 && this.cityList.includes('unlimit')){
                this.keepChildOpen = false;
                this.getTab(this.provinceNo,this.provinceInfo); 
            }
        },
        remove() {
            this.listLength = 0
            if (this.cityList.length > 0) {
                this.listLength = 1
            }
        },
        getList() {
        },
        // 市级
        getCityList(list) {
            let unlimited = {
                label: '全部',
                parentNo: list.value,
                value: 'unlimit'
            }
            // 显示全部
            if(list.children.length>0 && list.children[0].value !== 'unlimit'){//当前定位地区不在后台设置地区时 添加市级全部选项 3-30
                list.children.unshift(unlimited);
            }
            this.citysList = list
            this.listLength = list.children.length
        },
        getArea(val) {
            getAreaList(0).then((res) => {
                if (res.data.code == 1000) {
                this.areaList = res.data.data
                this.attributionId = [];
                this.policySearchParams =[];
                for (let i = 0; i < this.areaList.selection.length; i++) {
                    var a = {
                    name: '全部',
                    id: '' + this.areaList.selection[i].categoryName,
                    cla: '' + this.areaList.selection[i].categoryName
                    }
                    if (!this.attributionId.includes(a.id)) {
                    this.attributionId.push(a.id)
                    }
                    this.areaList.selection[i].options.unshift(a)
                    // 所有分类放在一个对象内
                    if (
                    this.policySearchParams.length < this.areaList.selection.length
                    ) {
                    const param = { id: '', optionIds: [] }
                    param.id = this.areaList.selection[i].categoryId
                    param.name = this.areaList.selection[i].categoryName
                    this.policySearchParams.push(param)
                    }
                    // 首页跳转
                    if (this.$route.query.optionsNo) {
                        if (
                            !this.attributionId.includes(this.$route.query.optionsNo)
                        ) {
                            this.attributionId.splice(
                            this.attributionId.indexOf(this.$route.query.classSetNumber),
                            1
                            )
                            this.attributionId.push(this.$route.query.optionsNo)
                        }
                        for (let i = 0; i < this.policySearchParams.length; i++) {
                            if (
                            this.policySearchParams[i].id ==
                            this.$route.query.classSetNumber
                            ) {
                            this.policySearchParams[i].optionIds.push(
                                this.$route.query.optionsNo
                            )
                            }
                        }
                    }
                }
                if (this.areaList.area) {
                    const b = {
                        children: [],
                        label: '全部',
                        value: null,
                        id: null,
                        parentNo: null
                    }
                    this.areaList.area.unshift(b)
                    for (let i = 0; i < this.areaList.area.length; i++) {
                    // 删除国家级下面的子集
                    if (this.areaList.area[i].value == 100000) {
                        this.areaList.area[i].children = []
                    }
                    }
                    if (val !== null) {
                    var a = []
                    for (let i = 0; i < this.areaList.area.length; i++) {
                        if (this.areaList.area[i].value == val) {
                        this.getCityList(this.areaList.area[i])
                        }
                        a.push(this.areaList.area[i].value)
                    }
                    this.hasProvinces = a;
                    this.callInterface = true;
                    if (a.includes(val) && val != null) {
                        if(val == 100000){//定位到全国
                            this.showProvince = true;   
                            this.getTab(null);
                        }else{
                            this.showProvince = false;
                            this.getTab(val,null,1);//1标识为当前定位在后端给的地区范围内 3-30
                        }
                    } else {
                        this.hasProvinces.push(val)
                        this.showProvince = true;
                        this.getTab(null)
                    }
                    }
                }
                // this.getList()
                }
            })
            this.activeNum = 0
        },
        // 省份单选
        getTab(provinceValue,provinceData,data) {
            this.currentPage = 1;
            if(this.hasProvinces.indexOf(this.$store.state.Set_LocationNo) >-1){//当前定位不在所给地区范围内
                this.active = [];
                if(this.cityNo != 'unlimit' && !this.cityList.includes('unlimit') && !this.callInterface){
                console.log('********************')
                }else{
                this.cityList = [];
                this.cityList.push('unlimit');
                } 
                if(sessionStorage.getItem('policySquareChildNO')){
                    this.cityList = [];
                    this.cityList.push(sessionStorage.getItem('policySquareChildNO'));
                    this.active.push(sessionStorage.getItem('policySquareChildNO'));
                } else {
                    this.activeId = provinceValue;
                    this.active.push(provinceValue);
                    this.active.push('100001');  
                    this.active.push((Number(provinceValue)+Number(1)).toString()); 
                }
                if(provinceValue==null){
                    this.active = [];
                    this.cityList =[];
                }
            }else{
                if (provinceValue != this.activeId || data == 1) {
                    this.active = [];
                    this.cityList = [];
                    this.activeId = provinceValue;
                    this.cityList.push('unlimit');
                    this.active.push(provinceValue);
                    this.active.push('100001');
                    this.active.push((Number(provinceValue)+Number(1)).toString());
                    if (provinceValue == null) {
                        this.showProvince = true;
                        this.active = []
                        this.cityList = []
                        this.listLength = 0;
                    }
                } else {
                    this.active = []
                    this.listLength = 0
                    this.activeId = null
                };
                if(this.hasProvinces.indexOf(this.$store.state.Set_LocationNo) == -1 && provinceValue == 100000){//当前定位省份不在地区归口中，选择国家级 12.08.21
                    this.active.push('100001');
                };
            }
            if(provinceData){
                if(this.provinceNo && provinceData && provinceValue ==this.provinceNo){
                this.areaList.area.forEach(element => {
                    if(element.value == this.provinceNo){
                    this.getCityList(element);
                    }
                });
                }else if(this.provinceNo == null && !provinceValue){
                this.getCityList({
                    children: [],
                    label: '全部',
                    value: null,
                    id: null,
                    parentNo: null
                    });
                }else{
                this.getCityList(provinceData);
                };
            }
            if(this.callInterface){
                this.provinceNo = provinceValue;
                this.getList();
                this.callInterface = false;
            };
        },
        clickTab(provinceValue){
            this.getTab(provinceValue);
            this.$emit('areaChange',this.active)
        },
        // 市级多选
        getId(cityValue, provinceValue){
            sessionStorage.removeItem("policySquareChildNO")
            this.provinceNo = provinceValue;
            this.cityNo = cityValue;
            this.currentPage = 1;
            if (this.cityList.includes(cityValue)){
                // 取消选中状态
                this.cityList.splice(this.cityList.indexOf(cityValue), 1)
                if (this.cityList.length == 0) {
                this.active = [];
                this.cityList.push('unlimit');
                this.active.push(provinceValue);
                this.active.push('100001');
                this.active.push((Number(provinceValue)+Number(1)).toString());                
                }
            } else {
                // 添加选中状态
                this.cityList = [];
                if(cityValue == 'unlimit'){
                    this.active = [];
                    this.cityList.push('unlimit');
                    this.active.push(provinceValue);
                    this.active.push('100001');
                    this.active.push((Number(provinceValue)+Number(1)).toString());
                }else{
                this.cityList.push(cityValue);
                }
            }
            // 原来为全部点击其他省份
            if (this.activeId == null) {
                if (provinceValue !== null) {
                if (provinceValue == this.activeId) {
                } else {
                    if(cityValue == 'unlimit'){
                        this.active = [];
                        this.cityList.push('unlimit');
                        this.active.push(provinceValue);
                        this.active.push('100001');
                        this.active.push((Number(provinceValue)+Number(1)).toString());
                    }else{
                        this.active = this.cityList;
                        this.activeId = provinceValue;
                    }
                }
                } else {
                this.active = this.cityList
                this.activeId = provinceValue
                }
            } else {
                // 非全部
                if (provinceValue !== this.activeId) {
                // 所选市对应省份不是上一个所选省份
                if(cityValue == 'unlimit'){
                    this.active = [];
                    this.cityList.push('unlimit');
                    this.active.push(this.$store.state.Set_LocationNo);
                    this.active.push('100001');
                    this.active.push((Number(this.$store.state.Set_LocationNo)+Number(1)).toString());
                }else{
                    this.cityList.push(cityValue);
                    this.active = this.cityList;
                }
                this.activeId = provinceValue;
                } else {
                this.active = [];
                if(cityValue == 'unlimit'){
                    this.cityList.push('unlimit');
                    this.active.push(provinceValue);
                    this.active.push('100001');
                    this.active.push((Number(provinceValue)+Number(1)).toString());
                }else{
                    this.cityList.push(cityValue);
                    this.active = this.cityList;
                }
                }
            }
            this.activeId = provinceValue;
            this.getList();
            // 市级选中值
            this.$emit('areaChange',this.active)
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
        this.getArea(sessionStorage.getItem('locationNo'));
    },
    watch: {
        location(val) {
            this.getArea(val);
        }
    },
}
</script>
<style lang="stylus" scoped>
    @import './areas'        
</style>