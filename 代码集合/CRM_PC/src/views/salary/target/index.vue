<template>
    <div class="salary_target">
        <basic-container>
            <el-tabs v-model="targetTab" @tab-click="handleClick()">
                <el-tab-pane label="指标管理" name="1"></el-tab-pane>
                <el-tab-pane label="结果值名称管理" name="2"></el-tab-pane>
                <el-tab-pane label="工资表表头配置" name="3"></el-tab-pane>
            </el-tabs>
            <!-- 结果值名称管理 -->
            <result-manage v-if="targetTab == '2'"></result-manage>
            <!-- 工资表表头配置 -->
            <header-configuration :treeData="treeData" v-if="targetTab == '3'" />
            <!-- 指标管理 -->
            <div v-if="targetTab == '1'">
                <div class="target_header">
                    <div class="header_left">
                        <span>指标类型：</span>
                        <el-radio-group v-model="targetType" @change="handleChange">
                            <el-radio-button border :label="2" class="tab_item_a">行政指标</el-radio-button>
                            <el-radio-button border :label="3" class="tab_item_b">财务指标</el-radio-button>
                            <el-radio-button border :label="1" class="tab_item_b">业绩指标</el-radio-button>
                        </el-radio-group>
                    </div>
                    <div class="header_right">
                        关键字：
                        <el-input placeholder="请输入指标名称" v-model="searchName" class="right_input" @keyup.enter.native="handleChange"></el-input>
                        <el-button type="primary" @click="handleChange">搜索</el-button>
                    </div>
                </div>
                <el-divider></el-divider>
                <div>
                    <el-tabs v-model="activeName" v-if="targetType == 1" @tab-click="handleChange">
                        <el-tab-pane label="单项指标" name="1"></el-tab-pane>
                        <el-tab-pane label="等级指标" name="2"></el-tab-pane>
                        <el-tab-pane label="管理指标" name="3"></el-tab-pane>
                    </el-tabs>
                    <el-tabs v-model="financial" v-if="targetType == 3" @tab-click="handleChange">
                        <el-tab-pane label="单项指标" name="1"></el-tab-pane>
                        <el-tab-pane label="特殊指标" name="2"></el-tab-pane>
                    </el-tabs>
                    <avue-crud ref="crud" :data="showData" :option="tableOption" v-if="targetType != 1 || (activeName != 2 && activeName != 3)" :page.sync="page" @size-change="sizeChange" @current-change="currentChange">
                        <template slot="name" slot-scope="scope">
                            <span>{{ scope.row.name || '/' }}</span>
                        </template>
                        <template slot="des" slot-scope="scope">
                            <span>{{ scope.row.des || '/' }}</span>
                        </template>
                        <template slot="skpSysItemList" slot-scope="scope">
                            <div v-if="scope.row.skpSysItemList==false">/</div>
                            <template v-else>
                                <div v-for="item in scope.row.skpSysItemList" :key="item.id">
                                    <span class="block">{{item.name + '(' + item.signs + ')'}}</span>
                                </div>
                            </template>
                        </template>
                        <template slot="signs" slot-scope="scope">
                            <span>{{ scope.row.signs == '-' ? '减项' : scope.row.signs == '+' ? '加项' : '/' }}</span>
                        </template>
                    </avue-crud>

                    <!-- 管理指标 -->
                    <div v-else-if="targetType == 1 && activeName == '3'">
                        <el-table :data="showData" border>
                            <el-table-column label="指标名称">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.name || '/' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="指标描述">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.des || '/' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="依赖指标">
                                <template slot-scope="scope">
                                    <div v-if="scope.row.kpMgDependencyList==false">/</div>
                                    <template v-else>
                                        <div v-for="item in scope.row.kpMgDependencyList" :key="item.id">
                                            <span class="block">{{item.name + '(' + item.signs + ')'}}</span>
                                        </div>
                                    </template>
                                </template>
                            </el-table-column>
                            <el-table-column label="指标属性" width="200">
                                <template slot-scope="scope">
                                    <span>{{ scope.row.signs == '-' ? '减项' : scope.row.signs == '+' ? '加项' : '/' }}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="paging">
                            <el-pagination
                                @size-change="sizeChange"
                                @current-change="currentChange"
                                :current-page="page.currentPage"
                                background
                                :page-sizes="[10, 20, 30, 50]"
                                :page-size="page.pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="page.total">
                            </el-pagination>
                        </div>
                    </div>
                    
                    <!-- 等级指标 -->
                    <el-table :data='showData' :span-method="spanMethod" border v-else>
                        <el-table-column label="等级指标" align="center">
                            <template>
                                {{showDataName}}
                            </template>
                        </el-table-column>
                        <el-table-column label="等级分类" align="center">
                            <template slot-scope="scope">
                                {{scope.row.name1}}
                            </template>
                        </el-table-column>
                        <el-table-column label="指标名称" align="center">
                            <template slot-scope="scope">
                                {{scope.row.name2}}
                            </template>
                        </el-table-column>
                        <el-table-column label="指标描述" align="center">
                            <template slot-scope="scope">
                                {{scope.row.des}}
                            </template>
                        </el-table-column>
                        <el-table-column label="指标对应系统项" align="center" v-if="activeName != '3'">
                            <template slot-scope="scope">
                                <div v-for="item in scope.row.kpSysItemList" :key="item.id" class="block">
                                    {{item.name + '(' + item.signs + ')'}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="指标属性" align="center">
                            <template>
                                <div>{{ showDataSigns == '-' ? '减项' : showDataSigns == '+' ? '加项' : '/' }}</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

        </basic-container>
    </div>
</template>

<script>
import { tableOption } from "@/const/crud/salary/target"
import { pageKpIndex } from "@/api/salary/target"
import { fetchNewTree } from "@/api/admin/dept";
import resultManage from '../result-manage.vue'
import HeaderConfiguration from '@/components/salary/header-configuration.vue';
export default {
    components: { 
        resultManage,
        HeaderConfiguration
    },
    data() {
        return {
            targetType: sessionStorage.getItem("targetType") ? sessionStorage.getItem("targetType") : 2,
            searchName: sessionStorage.getItem("searchName") ? sessionStorage.getItem("searchName") : "",
            tableOption: tableOption,
            showData: [],
            treeData: [],
            activeName: sessionStorage.getItem("activeName") ? sessionStorage.getItem("activeName") : "1",
            financial: '1',
            showDataName: "",
            showDataSigns: "",
            page: {
                total: 0, // 总页数
                currentPage: sessionStorage.getItem("currentPage") || 1, // 当前页数
                pageSize: sessionStorage.getItem("pageSize") || 10, // 每页显示多少条
                pageSizes: [5, 8, 10, 20, 30, 50, 100],
            },
            targetTab: sessionStorage.getItem("targetTab") ? sessionStorage.getItem("targetTab") : '1'
        }
    },
    created() {
        this.getKpList();
        this.getDept();
    },
    methods: {
        handleClick(){
            sessionStorage.setItem("targetTab", this.targetTab);
        },
        getDept(){
            fetchNewTree({menuFlag:"emp_list"}).then((response) => {
                this.treeData = response.data.data; 
            });
        },
        spanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0) {
                if (rowIndex === 0) {
                    return {
                        rowspan: 6,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
            if (columnIndex === 1) {
                if (rowIndex === 0) {
                    return {
                        rowspan: 3,
                        colspan: 1
                    }
                } else if (rowIndex === 3){
                    return {
                        rowspan: 3,
                        colspan: 1
                    }
                } else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
            if (columnIndex === 5) {
                if (rowIndex === 0) {
                    return {
                        rowspan: 6,
                        colspan: 1
                    }
                }  else {
                    return {
                        rowspan: 0,
                        colspan: 0
                    }
                }
            }
        },
        getPageKpIndex(indexType){
            let params = {
                pageNo: this.page.currentPage,
                pageSize: this.page.pageSize,
                name: this.searchName,
                indexType: indexType || null
            }
            //业绩指标-单项指标
            pageKpIndex(params).then(res => {
                if (res.data.code == 0) {
                    if(indexType == '1-2'){
                        let a = []
                        if (res.data.data.records == false) return
                        res.data.data.records[0].kpGradeList.forEach(item => {
                            item.kpIndexList.forEach(item1 => {
                                a.push({
                                    name1: item.name, //等级分类
                                    name2: item1.name, //指标名称
                                    des: item1.des, //指标描述
                                    kpSysItemList: item1.kpSysItemList //指标对应系统项
                                })
                            })
                        });
                        this.showData = Object.assign([],a)
                        this.showDataName = res.data.data.records[0].name
                        this.showDataSigns = res.data.data.records[0].signs
                    }else{
                        this.showData = res.data.data.records
                        this.page.total = res.data.data.total;
                    }
                }
            })
        },
        changeTab(){
            sessionStorage.setItem("activeName", this.activeName);
            switch (Number(this.activeName)) {
                case 1:
                    this.getPageKpIndex('1-1');
                    break;
                case 2:
                    this.getPageKpIndex('1-2');
                    break;
                case 3:
                    this.getPageKpIndex('1-3');
                    break;
                default:
                    break;
            }
        },
        changeFinancial(){
            switch (Number(this.financial)) {
                case 1:
                    this.getPageKpIndex('3-1');
                    break;
                case 2:
                    this.getPageKpIndex('3-2');
                    break;
                default:
                    break;
            }
        },
        getKpList() {
            this.showData = []
            sessionStorage.setItem("targetType", this.targetType);
            sessionStorage.setItem("searchName", this.searchName);
            sessionStorage.setItem("currentPage",this.page.currentPage);
            sessionStorage.setItem("pageSize",this.page.pageSize);
            switch (Number(this.targetType)) {//方案类型1-绩效方案 2-行政方案 3-财务方案 
                case 2:
                    this.getPageKpIndex('2-1');
                    break;
                case 3:
                    this.changeFinancial();
                    break;
                case 1:
                    this.changeTab();
                    break;
                default:
                    break;
            }
        },
        sizeChange(val) {
            this.page.pageSize = val;
            this.getKpList();
        },
        currentChange(current) {
            this.page.currentPage = current;
            this.getKpList();
        },
        handleChange() {
            this.page = {
                total: 0, // 总页数
                currentPage: 1, // 当前页数
                pageSize: 10, // 每页显示多少条
                pageSizes: [5, 8, 10, 20, 30, 50, 100],
            }
            this.getKpList()
        }
    }
}
</script>

<style lang="scss">
.salary_target{
    .target_header{
        display: flex;
    }
    .tab_item_a{
        border-radius: 0;
        margin-right: 10px;
        :deep(.el-radio-button__inner){
            border-radius: 0;
        }
    }
    .tab_item_b{
        margin: 0 10px;
        border-left: 1px solid #dcdfe6;
        :deep(.el-radio-button__inner){
            border-radius: 0;
        }
    }
    .header_right{
        margin-left: 50px;;
    }
    .right_input{
        width: 200px;
        margin-right: 10px;
    }
    .block{
        display: inline-block;
        padding: 10px;
        margin: 5px 0;
        background: #f2f2f2;
    }
}
</style>