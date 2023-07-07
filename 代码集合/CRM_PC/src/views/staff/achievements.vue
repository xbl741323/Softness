<template>
    <div>
        <basic-container>
            <div>
                <el-tabs  v-model="tabName" @tab-click="handleClick" >
                    <!-- 注意tab name值与主页保持一致 -->
                    <el-tab-pane name="1" label="回款金额"></el-tab-pane>
                    <el-tab-pane name="2" label="新增合同"></el-tab-pane>
                    <el-tab-pane name="5" label="创建线索"></el-tab-pane>
                    <el-tab-pane name="4" label="客户跟进"></el-tab-pane>
                </el-tabs>
            </div>
            <!-- 新增合同列表 -->
            <new-contracts v-if="tabName==2 && permissions.sys_contract_statistics"></new-contracts>
            <follow v-if="tabName==4 && permissions.sys_clue_follow_statistics"></follow>
            <payment v-if="tabName==1 && permissions.sys_receive_statistics"></payment>
            <create-clue v-if="tabName==5 && permissions.sys_clue_statistics"></create-clue>
        </basic-container>
    </div>
</template>

<script>
import newContracts from "@/components/staff/achievement/new-contracts";
import follow from "@/components/staff/achievement/follow";
import payment from "@/components/staff/achievement/payment";
import createClue from "@/components/staff/achievement/createClue";
import { mapGetters } from 'vuex';

export default {
    components:{
        newContracts,
        follow,
        payment,
        createClue
    },
    data(){
        return{
            tabName:"1",
        }
    },
    computed: {
        ...mapGetters(['permissions'])
    },
    methods:{
        handleClick(val) {
            console.log(this.permissions,99999);
            let urlQuery=JSON.parse(sessionStorage.getItem(`staff-achievements`));
            urlQuery.tabName=this.tabName;
            console.log(this.tabName);
            if (this.tabName == 1 && !this.permissions.sys_receive_statistics) {
                this.$notAuthorized()
            }
            if (this.tabName == 2 && !this.permissions.sys_contract_statistics) {
                this.$notAuthorized()
            }
            if (this.tabName == 5 && !this.permissions.sys_clue_statistics) {
                this.$notAuthorized()
            }
            if (this.tabName == 4 && !this.permissions.sys_clue_follow_statistics) {
                this.$notAuthorized()
            }
            sessionStorage.setItem(`staff-achievements`, JSON.stringify(urlQuery));
        },
    },
    created(){
        if(sessionStorage.getItem(`staff-achievements`)){
            let obj=JSON.parse(sessionStorage.getItem(`staff-achievements`));
            this.tabName = obj.tabName;
            console.log(this.tabName,)
        }else{
            let urlQuery={
                tabName:this.tabName,
            }
            // urlQuery["formDatas"+this.tabName]=this.filters
            sessionStorage.setItem(`staff-achievements`, JSON.stringify(urlQuery));
        }
        console.log("created")
    }

}
</script>

<style scoped>
.search-form{
    margin:10px 0;
}
.search-form >>> .el-form-item{
    margin-right:30px;
}
.time{
    display: flex;
    align-items: center;
    font-size:14px;
    margin:10px 0  20px 0
}
</style>
