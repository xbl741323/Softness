<template>
  <basic-container>
    <div class="avue-crud">
      <el-form :inline="true" :model="filters" ref="filters" @submit.native.prevent>
        <div style="display: flex">
          <div>
            <el-form-item label="关键字：" prop="keywords">
              <el-input
                v-model.trim="filters.keywords"
                placeholder="请输入标题关键字"
                @keyup.enter.native="getFirstAllList()"
              ></el-input>
            </el-form-item>
            <el-form-item label="发布人：" prop="publishMan">
              <el-input
                v-model.trim="filters.publishMan"
                placeholder="请输入发布人姓名或工号"
                @keyup.enter.native="getFirstAllList()"
              ></el-input>
            </el-form-item>
            <el-form-item label="显示状态：" prop="showStatus">
              <el-select v-model="filters.showStatus">
                <el-option label="全部" :value="null"></el-option>
                <el-option label="显示" :value="1"></el-option>
                <el-option label="不显示" :value="2"></el-option>
                <el-option label="已删除" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <!-- 地区 -->
            <el-form-item :label="$t('label.area')" prop="area">
              <el-cascader 
                ref="cascader"
                :options="newAreaOptions"
                :props="{ value: 'no', label: 'name',checkStrictly: true  }"
                v-model="filters.area"
                clearable
                collapse-tags
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <!-- 级别 -->
            <el-form-item
              :label="$t('label.level')"
              prop="level">
              <el-select
                :placeholder="$t('input.choose')"
                v-model="filters.level">
                <el-option
                  v-for="(item, index) in levelData"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-button
              icon="el-icon-search"
              type="primary"
              @click="getFirstAllList()"
            >{{$t('button.search')}}</el-button>
            <el-button
              icon="el-icon-refresh-left"
              @click="resetForm('filters')"
            >{{$t('button.reset')}}</el-button>
            <el-button
              icon="el-icon-plus"
              type="success"
              @click="permissions.sys_policy_edit ? addArticle() : $notAuthorized()"
            >{{$t('button.addArticle')}}</el-button>
          </div>
        </div>
        <div style="margin-bottom: 10px; margin-top: -10px">
          <el-checkbox v-model="senior">高级搜索</el-checkbox>
        </div>
        <div v-if="senior" style="display: inline-block">
          <div
            v-for="(item,index) in belongData"
            :key="index"
            style="float: left; margin-left: 10px"
          >
            <el-form-item :label="item.categoryName+'：'" prop="select">
              <el-select
                placeholder="请选择"
                v-model="selectDrop[index]"
                value-key="id"
                @change="selectData"
                :multiple='item.choice == 1?true:false'
              >
                <el-option
                  v-for="values in item.optionList"
                  :key="values.id"
                  :label="values.name"
                  :value="values.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="display:inline-block;margin-left:10px;">
           <el-form-item label="发布时间：" prop="publishTime">
            <el-date-picker
              @change="showTime"
              v-model="filters.publishTime"
              :unlink-panels="true"
              type="datetimerange"
              format="yyyy-MM-dd HH:mm"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item></div>
        </div>
      </el-form>
      <el-dialog
        width="40%"
        title="批量设置显示状态"
        :visible.sync="statusDialog"
        :close-on-click-modal="false"
      >
        <el-form :model="batchForm" label-width="140px" ref="batchForm" :rules="rules">
          <p style="margin-left: 25px">
            已选择
            <span style="color: #ff0000">{{this.batchList.length}}</span>篇文章
          </p>
          <el-form-item label="设置显示状态：" prop="showStatus">
            <el-radio-group v-model="batchForm.showStatus">
              <el-radio :label="0">置顶</el-radio>
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="2">不显示</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="batchStatus('batchForm')">确 认</el-button>
          <el-button @click="statusDialog = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 批量操作-转移 -->
      <el-dialog
        width="40%"
        title="批量转移"
        :visible.sync="transferDialog"
        :close-on-click-modal="false"
      >
        <div style="height:auto">
          <el-form :model="batchForm" label-width="140px" ref="batchForm" :rules="rules">
            <p style="margin-left: 25px">
              将选择的
              <span style="color: #ff0000">{{this.batchList.length}}</span> 篇文章批量转移到：
            </p>
            <el-form-item label="请选择文章类别：" prop="oldClassify">
              <el-select v-model="batchForm.oldClassify" @change="getSecondData">
                <el-option label="通知公告" value="0"></el-option>
                <el-option label="政策汇编" value="1"></el-option>
                <el-option label="疑难解答" value="2"></el-option>
              </el-select>
            </el-form-item>
            <div v-if="this.batchForm.oldClassify">
              <el-form-item label="请选择二级分类："></el-form-item>
              <el-form-item label="地区：" prop="area">
                  <el-cascader :options="secondAreaOptions" v-model="batchForm.area" placeholder="全部"></el-cascader>
              </el-form-item>
              <div v-for="(item, index) in batchForm.selectDrop" :key="index">
                  <el-form-item v-if="item.must==1" :label="item.categoryName+'：'" :prop="'selectDrop.'+ index +'.itemData'" :rules="rules.selectDrop">
                    <el-select :placeholder="$t('input.choose')" v-model="item.itemData" @change="selectData" :multiple="item.choice == 1?true:false" value-key="id">
                      <el-option  v-for="(option) in item.optionList" :label="option.name" :key="option.id" :value="option.id"></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item v-else :label="item.categoryName+'：'">
                    <el-select :placeholder="$t('input.choose')" v-model="item.itemData" @change="selectData" :multiple="item.choice == 1?true:false" value-key="id">
                      <el-option v-for="(option) in item.optionList" :label="option.name" :key="option.id" :value="option.id"></el-option>
                    </el-select>
                  </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="batchTransferHandle('batchForm')">确 认</el-button>
          <el-button @click="transferDialog = false">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 批量操作-复制 20200812需求要求不做了 -->
      <div>
        <div class="batch-handle">
          <span class="handle-txt" v-if="this.batchList.length != 0">已选择<b>{{batchList.length}}</b>项</span><span class="handle-txt">批量操作：</span>
          <el-button icon="el-icon-view" type="primary" :disabled="this.batchList.length==0" @click="permissions.sys_policy_edit ? statusDialog = true : $notAuthorized()">显示状态</el-button>
          <el-button icon="el-icon-refresh-right" type="success" @click="permissions.sys_policy_edit ? transferDialog = true : $notAuthorized()" :disabled="this.batchList.length==0">转移</el-button>
          <el-button icon="el-icon-delete" type="danger" @click="permissions.sys_policy_del ? deleteBatch() : $notAuthorized()" :disabled="this.batchList.length==0">删除</el-button>
        </div>
        <avue-crud
          class="batch-choose"
          ref="crud"
          :table-loading="tableLoading"
          :page.sync="page"
          :data="tableData"
          :option="tableOption"
          @selection-change="selectionChange"
          @on-load="getList">
          <template slot="pageViews" slot-scope="scope">
            <span>{{ scope.row.pageViews|viewFilter }}</span>
            <span>/</span>
            <span>{{ scope.row.collects|viewFilter }}</span>
          </template>
          <template slot="number" slot-scope="scope">
            <span
              @click="permissions.sys_policy_edit ? handleEdit(scope.row,scope.index) : $notAuthorized()"
              style="color:#409EFF;cursor:pointer;"
            >{{ scope.row.number }}</span>
          </template>
          <template slot="title" slot-scope="scope">
            <span
              @click="permissions.sys_policy_edit ? handleEdit(scope.row,scope.index) : $notAuthorized()"
              style="color:#409EFF;cursor:pointer;"
            >{{ scope.row.title }}</span>
          </template>
          <template slot="createUserName" slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+scope.row.employeeNumber+'   部门：'+scope.row.deptName" placement="right">
                 <span>{{ scope.row.createUserName }}</span>
           </el-tooltip>
          </template>
          <template slot="showStatus" slot-scope="scope">
            <span v-if="scope.row.deleted == 1">{{$t('status.deleted')}}</span>
            <div v-else>
              <el-select
                v-model="scope.row.showStatus"
                @change="changeStatus(scope.row,scope.index)"
                :disabled="scope.row.deleted==1 || !permissions.sys_policy_edit"
              >
                <el-option :label="$t('status.show')" :value="1"></el-option>
                <el-option :label="$t('status.noShow')" :value="2"></el-option>
                <el-option :label="$t('status.toped')" :value="0"></el-option>
              </el-select>
            </div>
          </template>
          <!-- 级别 -->
          <template slot="level" slot-scope="scope">
            <span v-if="scope.row.level">{{scope.row.level | levelFilter}}</span>
          </template>
          <!-- 地区 -->
          <template slot="area" slot-scope="scope">
            <span v-if="scope.row.options">{{scope.row.options | areaFilter}}</span>
          </template> 
          <!-- 汇编类型 -->
          <template slot="assemblyType" slot-scope="scope">
            <span v-if="scope.row.options">{{scope.row.options | assemblyFilter}}</span>
          </template>
          <!-- <template v-for="(item) in classSet" :slot="item.prop" slot-scope="scope">
            <span :key="item.prop">{{ scope.row.options|classifyFilter(item) }}</span>
          </template> -->
          <template slot="showStatusEnum" slot-scope="scope">
            <span v-if="scope.row.deleted == 1">已删除</span>
            <span v-else>{{ scope.row.showStatusEnum }}</span>
          </template>
          <template slot="menu" slot-scope="scope">
            <el-button v-if="scope.row.deleted==1" type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row,scope.index)">{{$t('button.check')}}</el-button>
            <div v-else>
              <el-button type="text" size="small" icon="el-icon-view" @click="handleCheck(scope.row, scope.index)">{{ $t("button.view") }}</el-button>
              <el-button type="text" size="small" icon="el-icon-link" @click="permissions.sys_policy_detail ? getCodeLink(scope.row) : $notAuthorized()" v-if="scope.row.showStatus == 0 || scope.row.showStatus == 1" :data-clipboard-text="scope.row.title+'：'+link" class="link">推广</el-button>
              <el-button type="text" size="small" icon="el-icon-edit" @click="permissions.sys_policy_edit ? fastEdit(scope.row, scope.index) : $notAuthorized()">{{ $t("button.amend") }}</el-button>
              <el-button type="text" size="small" icon="el-icon-delete" @click="permissions.sys_policy_del ? handleDelete(scope.row, scope.index) : $notAuthorized()">{{ $t("button.delete") }}</el-button>
            </div>
          </template>
        </avue-crud>
        <!-- 快速修改弹框 -->
        <el-dialog title="快速修改" width="800px" :visible.sync="dialogEdit" v-model="dialogEdit" @closed="dialogClose" :close-on-click-modal="false">
          <el-form :model="editObj" ref="editObj" :rules="rules" label-width="120px">
            <el-form-item label="文章编号：" prop="number">
              <el-input v-model="editObj.number" :disabled="true" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="文章标题：" prop="title">
              <el-input v-model="editObj.title" :placeholder="$t('input.noMorethan70')" maxlength="70" show-word-limit autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="显示状态：" prop="showStatus">
              <el-radio-group v-model="editObj.showStatus">
                <el-radio :label="0">{{ $t("status.toped") }}</el-radio>
                <el-radio :label="1">{{ $t("status.show") }}</el-radio>
                <el-radio :label="2">{{ $t("status.noShow") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('label.webTitle')" prop="metaTitle">
              <el-input v-model.trim="editObj.metaTitle" :placeholder="$t('input.noMorethan70')" maxlength="70" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.metaKeyword')" prop="metaKeyword">
              <el-input v-model.trim="editObj.metaKeyword" :placeholder="$t('input.noMorethan100')" maxlength="100" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.metaDescription')" prop="metaDescription">
              <el-input type="text" :autosize="{ minRows: 6, maxRows: 8 }" v-model.trim="editObj.metaDescription" onkeyup="this.value=this.value.replace(/[, ]/g,'')" :placeholder="$t('input.noMorethan200')" maxlength="200" show-word-limit />
            </el-form-item>
            <el-form-item :label="$t('label.level')" prop="level" >
                <el-select v-model="editObj.level" :placeholder="$t('input.choose')" @change="levelChange">
                  <el-option
                    v-for="item in levelList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            <el-form-item :label="$t('label.area')" prop="region">
              <el-cascader ref="cas"  @change="areaChange" :options="areaOptions" v-model="editObj.region" :placeholder="casDisable==false?$t('input.choose'):'全国'" :props="{ value: 'no', label: 'name'}" :disabled="casDisable"></el-cascader>
            </el-form-item>
            <div v-for="(item,index) in editObj.selectDrop" :key="index">
              <el-form-item  :label="item.categoryName+'：'" :prop="'selectDrop.'+index+'.itemData'" :rules="rules.selectDrop" v-if="item.must==1">
                <el-select :placeholder="$t('input.choose')" v-model="item.itemData" @change="((val)=>{selectData(val, index)})" :multiple="item.choice == 1?true:false" value-key="id">
                  <el-option v-for="(option) in item.optionList" :label="option.name" :key="option.id" :value="option.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="item.categoryName+'：'" v-else>
                <el-select :placeholder="$t('input.choose')" v-model="item.itemData" @change="((val)=>{selectData(val, index)})" :multiple="item.choice == 1?true:false" value-key="id">
                  <el-option v-for="(option) in item.optionList" :label="option.name" :key="option.id" :value="option.id"></el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="editDo('editObj')">保存</el-button>
            <el-button @click="dialogEdit = false">取 消</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
  </basic-container>
</template>

<script>
import { tableOption } from "@/const/crud/policy/policy";
import { editNotice, delNotice, policyList, batchShowStatus, batchDelete, batchTransfer, listChangeStatus, getrapidChange} from "@/api/policy/policy";
import { getListPolicy, getDropPolicy, getNewArea } from "@/api/policy/list"
import { saveDetal } from "@/util/clearDetail"
import {  getWxYaoCode } from "@/api/personal/myhome";
import ClipboardJS from 'clipboard'
import * as CodeMsg from "@/api/common/CodeChange"
import * as productData from '@/views/project/project-data';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      clickStatus:false,
      princeInfo: {},
      tableLoading:false,
      princeRadio: null,
      princeCopyChild:[],
      dialogEdit: false,
      princeChild: [],
      skiBaseUrl: "",
      classSet: [],
      fastAreaOptions: [],
      filters: {
        keywords:"",
        questionType: null,
        publishTime: [],
        showStatus: null,
        area: [],
        level: null
      },
      levelData: productData.levelData,
      optionList:[],
      batchForm: {},
      senior: false,
      statusDialog: false,
      transferDialog: false,
      copyDialog: false,
      tableData: [],
      newAreaOptions: [],
      tableOption: tableOption,
      belongData: [],
      batchList: [],
      selectDrop: [],
      optionsIds: [],
      secondAreaOptions: [],
      secondSelectData: [],
      saveparam: new FormData(),
      secondClass: [],
      batchVal: [],
      param: {},
      page: {
        total: 0, // 总页数
        layout: "total,prev,pager,next, jumper",
        currentPage: 1, // 当前页数
        pageSize: 20 // 每页显示多少条
      },
      rules: {
        showStatus: [
          { required: true, message: "请选择显示状态", trigger: "change" },
        ],
        title: [
          { required: true, message: this.$t("input.pleaseInputAticleTitle"), trigger: "blur", },
        ],
        metaTitle: [
          { required: true, message: this.$t("input.pleaseInputWebTitle"), trigger: "blur", },
        ],
        metaKeyword: [
          { required: true, message: this.$t("input.pleaseInputMetaKeywords"), trigger: "blur", },
          { min: 1, max: 100, message: this.$t("input.txtLong100"), trigger: "blur", },
        ],
        metaDescription: [
          { required: true, message: this.$t("input.pleaseInputMetaKeywords"), trigger: "blur", },
          { min: 1, max: 200, message: this.$t("input.txtLong200"), trigger: "blur", },
        ],
        region: [
          { required: true, message: this.$t("input.pleaseChooseArea"), trigger: "change", },
        ],
        selectDrop: [
          { required: true, message: this.$t("input.choose"), trigger: "change", },
        ],
        level: [
          { required: true, message: this.$t("input.pleaseChooseLevel"), trigger: "change", },
        ],
        oldClassify: [
          { required: true, message: "请选择分类", trigger: "change", },
        ],
      },
      articleId: null,
      editObj: {
        selectDrop: [],
        region: [],
        level: null
      },
      casDisable: false,
      areaOptions: [],
      provinceOptions: [],//省级
      cityOptions: [],//市级
      districtOptions: [],//区级
      generateAttributeList:[
        {
          attributeId: 1,
          attributeName: '地区',
          attributeValue: '',
          attributeValueDesc: '',
        },{
          attributeId: 2,
          attributeName: '归口',
          attributeValue: '',
          attributeValueDesc: '',
        },{
          attributeId: 3,
          attributeName: '级别',
          attributeValue: '',
          attributeValueDesc: '',
        }
      ],
      levelList: [{
          label: '国家级',
          value: 1
      },{
          label: '省级',
          value: 2
      },{
          label: '市级',
          value: 3
      },{
          label: '区级',
          value: 4
      }],
      fastOptionList:[],
      code:'',
      link:'',
      areaOptionId:'',
    };
  },
  filters: {
    viewFilter(val){
      if(val/10000>=1){
        return (val/10000).toFixed(2)+'万'
      }else{
        return val
      }
    },
    classifyFilter(list, obj) {
      let result = "";
      list.forEach(item => {
        if (item.categoryId == obj.prop) {
          result = item.optionNames.toString();
        }
      });
      return result;
    },
    levelFilter(val){
      if(val){
        return val == 1 ? '国家级' : val == 2 ? '省级' : val == 3 ? '市级' : val == 4 ? '区级' : ''
      }
    },
    areaFilter(val){
      let result = ''
      if(val.length > 0){
        val.forEach(item => {
          if(item.categoryId == 1){
            result = item.optionNames.toString()
          }
        })
        return result
      }
      
    },
    assemblyFilter(val){
      let result = ''
      if(val.length > 0){
        val.forEach(item => {
          if(item.categoryId == 4){
            result = item.optionNames.toString()
          }
        })
        return result
      }
    },

  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created(){
    if (!this.permissions.sys_policy_detail && !this.permissions.sys_policy_edit && !this.permissions.sys_policy_del) return this.$notAuthorized()
    if(sessionStorage.getItem(`${this.$route.path}`)){
      let keepParams  = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
      if(keepParams.detail.path!==""){
        this.$router.push({
          path:keepParams.detail.path,
          query:keepParams.detail.query,
        })
        return;
      }
      this.filters.keywords = keepParams.params.title
      this.filters.showStatus = keepParams.params.showStatus
      this.filters.publishMan = keepParams.params.createUserName
      this.page.currentPage = keepParams.params.start
      this.page.pageSize = keepParams.params.size
      this.filters.publishTime = keepParams.publishTime
      this.senior = keepParams.senior
      this.clickStatus = keepParams.clickStatus
      //动态筛选条件
      this.filters.area = keepParams.area
      this.filters.level = keepParams.level
      this.selectDrop = keepParams.selectDrop
      this.princeInfo = keepParams.princeInfo
    }
  },
  methods: {
    levelChange(e, status, item){
      switch (Number(e)){
        case 1:
          this.casDisable = true
          this.$set(this.editObj, 'region', null);
          this.generateAttributeList[2].attributeValue = 1
          this.generateAttributeList[2].attributeValueDesc = '国家级'
          break
        case 2:
          this.casDisable = false
          this.areaOptions = this.provinceOptions
          this.$set(this.editObj, 'region', status ? item.split(',').map(String) : null);
          this.generateAttributeList[2].attributeValue = 2
          this.generateAttributeList[2].attributeValueDesc = '省级'
          break
        case 3:
          this.casDisable = false
          this.areaOptions = this.cityOptions
          this.$set(this.editObj, 'region', status ? item.split(',').map(String) : null);
          this.generateAttributeList[2].attributeValue = 3
          this.generateAttributeList[2].attributeValueDesc = '市级'
          break
        case 4:
          this.casDisable = false
          this.areaOptions = this.districtOptions
          this.$set(this.editObj, 'region', status ? item.split(',').map(String) : null);
          this.generateAttributeList[2].attributeValue = 4
          this.generateAttributeList[2].attributeValueDesc = '区级'
          break
      }
    },
    getTreeData (data, num) {
      data.forEach(v => {
        if (v.level <= num) {
          if (v.level === num) {
            // children若为空数组，则将children设为undefined
            v.children = undefined
          } else {
            // children若不为空数组，则继续 递归调用 本方法
            this.getTreeData(v.children, num)
          }
        }
      })
      return data
    },
    getCodeLink(row){
      this.link = process.env.VUE_APP_WEB_URL+'policy/'+ row.number+'11' + '?' + 'link=' +this.code; 
      const h = this.$createElement;
      this.$message({
        showClose: true,
        center: true,
        offset: 350,
        duration: 2000,
        dangerouslyUseHTMLString: true,
        type:'success',
        customClass: 'myMessage',
        message: h('div', {style: 'text-align: center'}, [
            h('i',{ class: 'el-icon-success' }),
            h('span', { style: 'color: #555; font-size: 18px'}, ' 您的专属推广链接如下，已自动为您复制： '),
            h('h3', { style: 'color: #67C23A; font-size: 16px' }, row.title),
            h('p', { style: 'color: #67C23A; font-size: 14px' }, this.link)
          ])
      })
      document.querySelector('.link').setAttribute('data-clipboard-text',row.title+': &nbsp;'+this.link);
      new ClipboardJS('.link');
    },
    // 快速修改确认
    editDo(formName) {
      if(this.editObj.region==null||JSON.parse(JSON.stringify(this.editObj.region)).length == 0){
        this.editObj.region = ['000000']
      }
      this.$refs.editObj.validate((valid) => {
        if (valid) {
          this.saveParam();
          let config = {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          };
          editNotice(this.saveparam, config).then(res => {
            if(res.data.code == CodeMsg.CODE_1000){
                this.$message({
                  type: "success",
                  message: this.$t("alert.sucessEdit"),
                  offset: 300,
                });
                this.getList();
                this.$refs['editObj'].resetFields();
                this.dialogEdit = false;
                // this.editObj.selectDrop = [];
            } else {
                this.$message({
                  type: "warning",
                  message: this.$t("alert.failedEdit"),
                  offset: 300,
                });
            }
          }).catch(err => {
            console.log(err);
          });
        }
      });
    },
    //保存弹框数据
    saveParam(){
        this.fastOptionList = [];
        for (let i = 0; i < this.editObj.selectDrop.length; i++) {
          if (Array.isArray(this.editObj.selectDrop[i].itemData) == true) {
            this.editObj.selectDrop[i].itemData.forEach(it=>{
              this.fastOptionList.push(it);
            })
          } else {
            this.fastOptionList.push(this.editObj.selectDrop[i].itemData);
          }
        }
        this.areaOptionId = '';
        this.fastAreaOptions.forEach(item=>{
          if(item.value == this.editObj.region[0]){
            this.areaOptionId = item.optionId
          }
        });
        for (let i = 0; i < this.fastOptionList.length; i++) {
          if(this.fastOptionList[i] == [] || this.fastOptionList[i] == ""){
            this.fastOptionList.splice(i,1);
            i = i - 1;
          }
        };
        this.saveparam = new FormData();
        this.saveparam.append("id", this.articleId);
        this.saveparam.append("type", 1);
        this.saveparam.append("title", this.editObj.title);
        this.saveparam.append("number", this.editObj.number);
        this.saveparam.append("showStatus", this.editObj.showStatus);
        this.saveparam.append("metaTitle", this.editObj.metaTitle);
        this.saveparam.append("metaKeyword", this.editObj.metaKeyword);
        this.saveparam.append("metaDescription", this.editObj.metaDescription);
        this.saveparam.append("optionIds", this.fastOptionList);
        if (this.editObj.region != null) {
          this.saveparam.append("areaNo", this.editObj.region.toString());
          this.saveparam.append("areaOptionId", 2);
        }
        if(this.editObj.level){
          this.saveparam.append("level", this.editObj.level);
        }
    },
    // 快速修改,弹框获取数据
    fastEdit(row, index) {
       this.getDropdown();       
        getrapidChange(row.number).then((res) => {
            // 在动态验证的情况下，赋值已经绑定的，要慎重
            this.articleId = res.data.data.id
            this.editObj.selectDrop.length = 0;
            this.$set(this.editObj,"number",res.data.data.number);
            this.$set(this.editObj,"title",res.data.data.title);
            this.$set(this.editObj,"showStatus",res.data.data.showStatus);
            this.$set(this.editObj,"metaTitle",res.data.data.metaTitle);
            this.$set(this.editObj,"metaKeyword",res.data.data.metaKeyword);
            this.$set(this.editObj,"metaDescription",res.data.data.metaDescription);
            this.$set(this.editObj,"level", Number(res.data.data.level)); 
            if(res.data.data.level){
              this.levelChange(Number(res.data.data.level), true, res.data.data.areaNo)
            }       
            this.fastBelongData.forEach((item, index) => { //optionsId 转 id
              if(res.data.data.categories){
                  res.data.data.categories.forEach((val, index) => {
                    if (val.multi == false && item.categoryId == val.id) {
                      item.itemData = val.checkbox[0]==null?"":val.checkbox[0].optionId //单选框回显数据根据id取值赋值
                    } else if (val.multi == true && item.categoryId == val.id) {
                      item.itemData = []
                      if(val.checkbox[0]==null){
                        item.itemData = [] //多选框第一项没有值直接置空
                      }else{
                        val.checkbox.forEach(it=>{
                          item.itemData.push(it.optionId)//多选框回显数据根据id取值赋值
                        })
                      }
                    }                    
                  });
              }
            });
            for(let i = 0;i<this.fastBelongData.length;i++){
              this.editObj.selectDrop.push(Object.assign({},this.fastBelongData[i]));
            }
            // this.editObj = res.data.data;
            // this.$nextTick(() => {
            //   this.$refs["editObj"].clearValidate();
            // }); 
        }).catch((err) => {
          console.log(err);
        });
        this.dialogEdit = true;
    },
    dialogClose(){
      this.editObj.region=[];
    },
    putArea(val){
      console.log(val)
    },
    areaReset(){
      this.princeInfo = {}
      this.princeChild = [];
      this.princeCopyChild = [];
      this.getAllList();
    },
    showPrinceChild() {
      this.getAllList()
    },
    showProvince(val) {
      this.princeChild = [];
      this.princeCopyChild = []
      if (val.label == "全国") {
         this.princeInfo = {}
         this.princeCopyChild.push(val.children[0].value)
         this.getAllList();
      } else {
        val.children.forEach((item) => {
          this.princeCopyChild.push(item.value);
        });
        this.princeInfo = val;
        this.getAllList();
      }
    },
    showTime(val) {
      console.log(val);
    },
    getAllList() {
      this.page.currentPage = 1;
      this.getList();
    },
    getFirstAllList() {
      this.clickStatus = true
      this.page.currentPage = 1;
      this.getList();
    },
    changeStatus(value) {
      let para = {
        id: value.id,
        showStatus: value.showStatus,
        number:value.number
      };
      this.$confirm(this.$t("alert.editStatus"), this.$t("title.notice"), {
        confirmButtonText: this.$t("button.confirm"),
        cancelButtonText: this.$t("button.cancel"),
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          listChangeStatus(para)
            .then(res => {
              this.getList();
              this.$message({
                type: "success",
                message: this.$t("alert.sucessEdit"),
                offset: 300
              });
            }).catch(err => {
              console.log(err);
              this.getList();
            });
        }).catch(() => {
          this.getList();
        });
    },
    batchStatus(formName) {
      let param = {
        showStatus: this.batchForm.showStatus,
        numbers: this.batchList
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          batchShowStatus(param).then(res => {
              if (res.data.code == CodeMsg.CODE_1000) {
                this.$message({
                  type: "success",
                  message: "设置成功！"
                });
                this.toggleSelection(this.batchVal);
                (this.batchForm = {}), (this.statusDialog = false);
                this.getAllList();
              } else {
                this.$message({
                  type: "warning",
                  message: "操作失败联系工作人员!",
                  offset: 300
                });
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else {
        }
      });
    },
    deleteBatch() {
      this.$confirm(`已选择${this.batchList.length}篇文章，确定删除吗?`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      }).then(() => {
          let param = {
            numbers: this.batchList
          };
          batchDelete(param).then(res => {
              if (res.data.code == CodeMsg.CODE_1000) {
                this.$message({
                  type: "success",
                  message: "删除成功！"
                });
                this.toggleSelection(this.batchVal);
                this.getAllList();
              } else {
                this.$message({
                  type: "warning",
                  message: "操作失败联系工作人员!",
                  offset: 300
                });
              }
            }).catch(err => {
              console.log(err);
            });
        }).catch(() => {});
    },
    batchTransferHandle(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.secondSelectData = [];
          for (let i = 0; i < this.batchForm.selectDrop.length; i++) {
            if (Array.isArray(this.batchForm.selectDrop[i].itemData) == true) {
              this.batchForm.selectDrop[i].itemData.forEach(it=>{
                this.secondSelectData.push(it);
              })
            } else {
              this.secondSelectData.push(this.batchForm.selectDrop[i].itemData);
            }
          }
          for (let i = 0; i < this.secondSelectData.length; i++) {
              if(this.secondSelectData[i] == undefined){
                this.secondSelectData.splice(i,1);
                i = i - 1;
              }
          };
          if(this.batchForm.area==undefined){
            this.param = {
              type: Number(this.batchForm.oldClassify),
              optionIds: this.secondSelectData,
              numbers: this.batchList,
            };        
          } else {
            this.secondAreaOptions.forEach(item=>{
              if(item.value == this.batchForm.area[0]){
                this.areaOptionId = item.optionId
              }
            });
            this.param = {
              type: Number(this.batchForm.oldClassify),
              optionIds: this.secondSelectData,
              numbers: this.batchList,
              areaOptionId: this.areaOptionId,
              areaNo: this.batchForm.area[1],
              parentNo: this.batchForm.area[0],
            };
          }     
          batchTransfer(this.param).then(res => {
              if (res.data.code == CodeMsg.CODE_1000) {
                this.$message({
                  type: "success",
                  message: "设置成功！"
                });
                this.transferDialog = false;
                this.secondSelectData = [];
                this.toggleSelection(this.batchVal);
                this.batchForm = {};
                this.getAllList();
              } else {
                this.$message({
                  type: "warning",
                  message: "操作失败联系工作人员!",
                  offset: 300
                });
              }
            }).catch(err => {
              console.log(err);
            });
        } else {
        }
      });
    },
    selectionChange(val) {
      this.batchList = [];
      this.batchVal = val;
      for (let i = 0; i < this.batchVal.length; i++) {
        this.batchList.push(this.batchVal[i].number);
      }
    },
    toggleSelection(val) {
      this.$refs.crud.toggleSelection(val);
    },
    selectData(val) {
        this.$forceUpdate();
    },
    addArticle() {
      let path = "/policy-addnotice"
      let query = {
        beFrom: 0,
        type: 1
      }
      saveDetal(`${this.$route.path}`,path,query)
      this.$router.push({ path: path, query: query})
    },
    getList() {
      this.tableLoading = true;
      this.optionList = []
      this.selectDrop.forEach((item) => {
        if(Array.isArray(item) == true){
           this.optionList.push(item);
        }else{
           this.optionList.push([item]);
        }
      });
      let params = {
        createUserName: this.clickStatus==true?(this.filters.publishMan):"",
        showStatus: this.clickStatus==true?(this.filters.showStatus):null,
        size: this.page.pageSize,
        start: this.page.currentPage,
        areaNo: '',
        level: this.filters.level == null ? null : this.filters.level,
        type: 1,
        selection: this.clickStatus==true?(this.optionList):[],
        startTime:
          this.clickStatus==true?(
            this.filters.publishTime[0] != null
            ? this.$moment(this.filters.publishTime[0]).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : ""
          ):"",
        endTime:
          this.clickStatus==true?(
            this.filters.publishTime[1] != null
            ? this.$moment(this.filters.publishTime[1]).format(
                "YYYY-MM-DD HH:mm:ss"
              )
            : ""
          ):""
      };
      if(this.filters.area){
        params.areaNo = this.filters.area.toString()
      }
      if(this.filters.keywords!==""&&this.clickStatus){
        params.title = this.filters.keywords;
      };
      // 需要缓存的参数
      let keepParams = {
        clickStatus:this.clickStatus,
        params:params,
        publishTime:this.filters.publishTime,
        senior:this.senior,
        area: this.filters.area,
        level: this.filters.level,
        selectDrop:this.selectDrop,
        princeInfo:this.princeInfo,
        detail:{path:"",query:{}}
      }
      sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
      policyList(params).then(res => {
        this.tableData = res.data.data.resultList.list;
        this.page.total = res.data.data.resultList.total;
        this.classSet = res.data.data.category;
        let otherOptions = [
          {label: '文章编号',prop: 'number',overHidden: true,width: 140,slot:true,}, 
          {label: '标题',prop: 'title',width:400,overHidden: true,slot:true,}, 
          {label: '发布人', prop: 'createUserName',width:120,overHidden:true,slot:true},
          {label: '发布时间', prop: 'createTime',type: 'datetime',overHidden:true,width:120,format: 'yyyy-MM-dd HH:mm',valueFormat: 'yyyy-MM-dd HH:mm:ss'},
          {label: '显示状态',prop: 'showStatus',slot:true},
          {label: '浏览量/收藏量', prop:'pageViews',slot:true,width: 100,overHidden: true},
          {label: '级别',prop: 'level',slot:true},
          {label: '地区',prop: 'area',slot:true, width: 150,},
          {label: '汇编类型',prop: 'assemblyType',slot:true},
          ]
        this.tableOption.column = otherOptions;
        //   this.classSet.forEach(item => {
        //     this.tableOption.column.push(item);
        //   });
        this.tableLoading = false;
      });
    },
    resetForm(formName) {
      this.clickStatus = false
      this.$refs[formName].resetFields();
      this.filters.keywords = ""
      this.filters.publishMan = ""
      this.filters.showStatus = null
      this.selectDrop = [];
      this.optionsIds = [];
      this.filters.publishTime = [];
      this.filters.area = []
      this.filters.level = null
      this.getAllList();
    },
    handleEdit(row, index) {
      let path = "/policy-editnotice"
      let query = {
        number: row.number,
        deleted: row.deleted,
        beFrom: 0,
        type: row.type
      }
      saveDetal(`${this.$route.path}`,path,query)
      this.$router.push({ path: path, query: query})
    },
    handleCheck(row, index) {
      this.skiBaseUrl = "http://web-test.wotao.com/";
      if (process.env.NODE_ENV == "production") {
        this.skiBaseUrl = "https://wotao.com/";
      } else if (process.env.NODE_ENV == "development") {
        this.skiBaseUrl = "http://localhost:3333/";
      }
      window.open(this.skiBaseUrl + "policy/" + row.number + "11");
    },
    handleDelete(row, index) {
      this.$confirm('是否确认删除"' + row.title + '"的通知公告?', "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      }).then(function() {
        return delNotice(row.number);
      }).then(() => {
        this.getList(this.page);
        this.$message({
          type: "success",
          message: "删除成功！",
          offset: 300,
          duration: 2000
        });
      });
    },
    getSecondData(val) {
        getDropPolicy(val).then((res) => {
          this.secondAreaOptions = res.data.data.area;
          this.batchForm.selectDrop = res.data.data.factors;
          // this.$nextTick(() => {
          //   this.$refs["batchForm"].clearValidate();
          // });
        }).catch((err) => {
          console.log(err);
        });
    },
    // 获取动态下拉框数据（搜索、快速修改）
    getDropdown() { 
        getWxYaoCode().then(res=>{
          this.code = res.data.data
        });
        getListPolicy(1).then((res) => {
          this.puntData = {};
          this.belongData = res.data.data.selection;
          this.belongData.forEach((item) => {
            if (item.categoryId == 2) {
              this.puntData = item;
            }
          });
        }).catch((err) => {
          console.log(err);
        });
        getDropPolicy(1).then(res => {
            this.fastBelongData = res.data.data.factors;
            if (res.data.data.area) {
              this.fastAreaOptions = res.data.data.area;
            }
        }).catch(err => {
            console.log(err);
        });
      
        getNewArea().then(res => {
          this.newAreaOptions = res.data.data
          this.provinceOptions = this.getTreeData(JSON.parse(JSON.stringify(res.data.data)), 1)
          this.cityOptions = this.getTreeData(JSON.parse(JSON.stringify(res.data.data)), 2)
          this.districtOptions = JSON.parse(JSON.stringify(res.data.data))
        }).catch(err => {
            console.log(err);
        });
    }
  },
  mounted() {
    this.getDropdown();
  }
};
</script>

<style>
.filter_punt {
  margin: 5px 0px 15px 0px;
}
.filter_province {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  margin-left: 8px;
}
.province_parent {
  margin-left: 0px;
  display: flex;
  align-items: center;
}
.province_child {
  /* background: #ccc; */
  margin-left: 42px;
}
.radio_item:nth-of-type(1) {
  border-left: none;
}
.radio_item {
  margin-right: 10px;
  margin-top: 10px;
  border-left: 1px solid #dcdfe6;
  border-radius: 0px 0px 0px 0px;
}
</style>