<template>
  <div
    class="frame"
    v-loading="loading"
    :element-loading-text="this.promtMessage"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    v-if="permissions.bt_page_doc_my || permissions.bt_edit_doc_my || permissions.bt_del_doc_my || permissions.bt_download_doc_my"
  >
    <el-form :inline="true" :model="fileForm" @submit.native.prevent>
      <el-form-item :label="$t('label.keywords')" prop="keyWords">
        <el-input
          v-model.trim="fileForm.keyWords"
          placeholder="请输入文件名称关键字"
          @keyup.enter.native="getList()"
        />
      </el-form-item>
      <el-form-item
        label="操作人："
        prop="uploader"
        @keyup.enter.native="getList()"
      >
        <el-input v-model="fileForm.uploader" placeholder="请输入操作人姓名或工号" />
      </el-form-item>
      <el-form-item
        :label="$t('button.showStatus')+'：'"
        prop="showStatus"
        @keyup.enter.native="getList()"
      >
        <el-select v-model="fileForm.showStatus">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 地区 -->
      <el-form-item :label="$t('label.area')" prop="area">
        <el-cascader 
          ref="cascader"
          :options="newAreaOptions"
          :props="{ value: 'no', label: 'name',checkStrictly: true  }"
          v-model="fileForm.area"
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
          v-model="fileForm.level">
          <el-option
            v-for="(item, index) in levelData"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button size="small" type="primary" @click="handleSearch()">{{$t('button.search')}}</el-button>
      <el-button size="small" type="warning" @click="reSet()">{{$t('button.reset')}}</el-button>
      <el-button size="small" type @click="permissions.bt_add_doc_my ? showDialog() : $notAuthorized()">{{$t('button.uploadFile')}}</el-button>
    </el-form>
    <div class="batch-handle">
      <span class="handle-txt" v-if="this.selectedNum != 0">已选择<b>{{selectedNum}}</b>项</span><span class="handle-txt">批量操作：</span>
      <!-- <el-button size="mini" type="success" :disabled="this.selectedNum==0" @click="permissions.bt_edit_doc_my ? BatchcellReplaceFile(selectList) : $notAuthorized()">替换</el-button> -->
      <el-button
        size="mini"
        type="primary"
        @click="permissions.bt_edit_doc_my ? statusDialog = true : $notAuthorized()"
        :disabled="this.selectedNum==0"
      >{{$t('button.showStatus')}}</el-button>
      <el-button
        size="mini"
        type="warning"
        @click="permissions.bt_del_doc_my ? deleteDialog = true : $notAuthorized()"
        :disabled="this.selectedNum==0"
      >{{$t('button.delete')}}</el-button>
    </div>
    <avue-crud
      ref="crud"
      class="batch-choose"
      :page.sync="page"
      :table-loading="tableLoading"
      :data="list"
      :option="tableOption"
      @size-change="sizeChange"
      @selection-change="selectionChange"
      @current-change="currentChange"
    >
      <template slot="fileName" slot-scope="scope">
        <div class="fileName" @click="viewFile(scope.row)">{{scope.row.fileName}}</div>
      </template>
       <template slot="createUserName" slot-scope="scope">
          <el-tooltip effect="dark" :content="'工号：'+scope.row.employeeNumber+'   部门：'+scope.row.deptName" placement="right">
                 <span>{{ scope.row.createUserName }}</span>
           </el-tooltip>
        </template>
        <!-- 级别 -->
        <template slot="level" slot-scope="scope">
          <span v-if="scope.row.level">{{scope.row.level | levelFilter}}</span>
        </template>
        <!-- 地区 -->
        <template slot="areaNo" slot-scope="scope">
          <span v-if="scope.row.areaNo">{{areaFilter(scope.row.areaNo)}}</span>
        </template> 
      <template slot="state" slot-scope="scope">
        <p v-if="scope.row.deleted==1">{{$t('status.deleted')}}</p>
        <el-select
          v-model="scope.row.state"
          @change="submit(scope.row)"
          v-else
          :disabled="scope.row.state == -1 || !permissions.bt_edit_doc_my"
        >
          <el-option :label="$t('status.show')" :value="1"></el-option>
          <el-option :label="$t('status.noShow')" :value="2"></el-option>
          <el-option :label="$t('status.toped')" :value="0" disabled></el-option>
          <el-option label="处理中" :value="-1" disabled v-if="scope.row.state == -1"></el-option>
        </el-select>
      </template>
      <template slot="amount" slot-scope="scope">
        <span v-if="scope.row.isPay == 0">/</span>
        <span v-else>{{scope.row.amount|filterAmount}}</span>
      </template> 
      <template slot="menu" slot-scope="scope">
        <el-button type="text" size="small" @click="viewFile(scope.row)">查看</el-button>
        <el-button type="text" size="small" @click="permissions.bt_edit_doc_my ? handleEdit(scope.row) : $notAuthorized()">编辑</el-button>
        <!-- <el-button type="text" size="small" icon="el-icon-change" v-if="scope.row.deleted !==1" @click="permissions.bt_edit_doc_my ? cellReplaceFile([scope.row]) : $notAuthorized()">替换</el-button> -->
        <el-button type="text" size="small" @click="getCodeLink(scope.row)" :data-clipboard-text="scope.row.fileName+'：'+link" class="link">推广</el-button>
        <el-button type="text" size="small" @click="permissions.bt_download_doc_my ? downLoad(scope.row) : $notAuthorized()">{{$t('button.download')}}</el-button>
        <el-button  type="text" size="small" v-if="scope.row.deleted != 1" @click="permissions.bt_del_doc_my ? deleteFile(scope.row) : $notAuthorized()">{{$t('button.delete')}}</el-button>
      </template>
    </avue-crud>
   <!-- 文件替换 -->
    <file-replace-dialog :uploadDialog="replaceDialog" @closeDialog='closeReplace' :cellData='cellReplaceData' isspecial="1" :whichUrl="whichUrl" :source="source"></file-replace-dialog>
    <!-- 上传弹框 -->
    <el-dialog :visible.sync="uploadDialog" width="45%" :close-on-click-modal="false" center @close="cancleUpload">
      <el-form ref="form" :label-position="labelPosition" :rules="newRules" :model="form" label-width="80px">
        <el-form-item :label="$t('label.level')" prop="level">
          <el-select v-model="form.level" :placeholder="$t('input.choose')" @change="levelChange" style="width:300px;">
            <el-option
              v-for="item in levelList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('label.area')" prop="region">
          <el-cascader ref="cas" 
            style="width:300px;"
            @change="areaChange" 
            :options="areaOptions" 
            v-model="form.region" 
            :placeholder="casDisable==false?$t('input.choose'):'全国'" 
            :props="{ value: 'no', label: 'name'}" 
            :disabled="casDisable || !form.level">
          </el-cascader>
        </el-form-item>
      </el-form>
      <div class="upload">
        <div style="display:flex;align-items:center;">
          <span>选择文件：</span>
          <el-upload
            :disabled="JSON.stringify(fileObj) != '{}'"
            class="upload-demo"
            action
            ref="upload"
            :file-list="fileList"
            :limit="1"
            :accept="acceptList"
            :before-upload="handleBeforeUpload"
            :on-exceed="handleExceed"
            :on-change="OnChange"
            :show-file-list='false'
          >
            <el-button size="small" type="primary" :disabled="JSON.stringify(fileObj) != '{}'">{{$t('label.addFiles')}}</el-button>
            <span class="warning">最多上传1条，仅支持wps、doc、docx、xls、xlsx、pdf、ppt、pptx格式的文件，每份文件不超过5M，付费阅读的文件不得少于2页；</span>
          </el-upload>
        </div>
        <el-form ref="fileForm" label-width="100px" :rules="inputRules" v-if="fileObj.name" style="margin-top: 40px;">
          <el-form-item label="文件名称：" prop="name">
            <edit-box :row="fileObj" :permissions="permissions.bt_edit_doc_my" @saveKeywords="childSave" @deleteRow=deleteRow class="editBox"></edit-box>
          </el-form-item>
          <el-form-item label="类型：" prop="type">
            <el-radio :label="0"  v-model="fileType">免费</el-radio>
            <el-radio :label="1" v-model="fileType">付费</el-radio>
          </el-form-item>
          <el-form-item label="价格：" prop="price" v-if="fileType == 1">
            <template>
              <div style="width: 200px">
                <div class="file-price" @mouseover="showTrue()" @mouseleave="showFalse()" v-if="filePriceInput == 0">
                  <span>{{filePrice}}</span>
                  <i class="el-icon-edit icon-edit" :style="{'marginTop' : filePrice == '' ? '10px': ''}" v-show="fileIconShow || filePrice == ''" @click="editContent()" ></i>
                </div>
                <el-input v-focus v-model="filePrice" v-if="filePriceInput == 1" @blur="updatePrice()"></el-input>
              </div>
            </template>
          <div class="red-text" v-if="showText">{{textMsg}}</div>
          </el-form-item>
          <el-form-item label="价格：" prop="price1" v-else>
            <template>
              <div>/</div>
            </template>
          </el-form-item>
        </el-form>
        <div style="text-align: center;margin-top:40px;">
        <el-button @click="submitUpload()" type="primary"  :disabled="JSON.stringify(fileObj) == '{}' || !form.level || (!casDisable && !form.region) || (fileType == 1 && (filePrice == 0 || showText))" style="width:70px;">{{$t('button.confirm')}}</el-button>
          <el-button @click="cancleUpload()" style="margin-left:50px;width:70px;">{{$t('button.cancel')}}</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 批量改变显示状态 -->
    <el-dialog :visible.sync="statusDialog" width="32%" :before-close="clearValidate">
      <p class="title">{{$t('label.changeStatus')}}</p>
      <p class="choose-file">
        <span>{{$t('label.selected')}}</span>
        <span style="color:red;">{{this.selectedNum}}</span>
        <span>{{$t('label.file')}}</span>
      </p>
      <div class="choose-file">
        <el-form :model="showForm" ref="showForm" :inline="true">
          <el-form-item>
            <span>{{$t('label.setShowStatus')}}：</span>
          </el-form-item>
          <el-form-item prop="status">
            <el-radio-group v-model="showForm.status">
              <el-radio :label="1">{{$t('status.show')}}</el-radio>
              <el-radio :label="2">{{$t('status.noShow')}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialogBtn">
        <el-button size="mini" type="primary" @click="submit()" :disabled="showForm.status == null">{{$t('button.confirm')}}</el-button>
        <el-button size="mini" type="warning" @click="clearValidate">{{$t('button.cancel')}}</el-button>
      </div>
    </el-dialog>
    <!-- 批量删除 -->
    <el-dialog :visible.sync="deleteDialog" width="20%">
      <p class="title">{{$t('label.batchDelete')}}</p>
      <p class="choose-file">
        {{$t('label.selected')}}
        <span style="color:red;">{{this.selectedNum}}</span>
        {{$t('label.file')}},{{$t('label.confirmDelete')}}
      </p>
      <div class="dialogBtn">
        <el-button size="mini" type="primary" @click="batchDelete()">{{$t('button.confirm')}}</el-button>
        <el-button size="mini" type="warning" @click="deleteDialog =false">{{$t('button.cancel')}}</el-button>
      </div>
    </el-dialog>
    <share-dialog :dialogShow="dialogShow" :dialogForm="dialogForm" :type="2" @shareClose="shareClose" v-if="dialogShow"></share-dialog>
  </div>
</template>

<script>
import OSSUploader from '@/util/ossUpload';
import { tableOption} from "@/const/crud/policy/file";
import EditBox from '@/components/file/editBox'//文件名编辑框
import FileReplaceDialog from '@/components/file/fileReplaceDialog'//文件替换框
import { getDocListMy,removeFileMy,batchShowMy,getNewArea, addDocMy, downloadDocMy} from "@/api/policy/list";
import {  getWxYaoCode } from "@/api/personal/myhome";
import { mapGetters } from 'vuex';
import * as productData from '@/views/project/project-data';
import shareDialog from "@/components/shareDialog/index.vue";
export default {
  components:{
    EditBox,
    FileReplaceDialog,
    shareDialog
  },
  data() {
    return {
      labelPosition: "right",
      whichUrl:1,
      tableLoading:false,
      source:false,//文件列表
      tempData:{},
      tempraoryList:[],
      lastTime:new Date(),
      dialogShow: false,
      dialogForm: {},
      libraryList:[],
      fileObj: {},
      fileType: 0,
      filePrice: "",
      filePriceInput: 0,
      fileIconShow: false,
      link:'',
      code:'',
      ossUrl: process.env.VUE_APP_OSS_URL,
      imgBaseUrl: process.env.VUE_APP_IMAGE_BASEURL,
      acceptList: ".doc,.docx,.xls,.xlsx,.pdf,.ppt,.pptx,.wps",
      dict: {},
      textMsg: false,
      fileKeywords:'',
      sourceFile:0,
      createTime: "",
      promtMessage: "",
      loadstatus: "",
      loading: false,
      currentPage: 1,
      pagesize: 20,
      total: 0,
      selectedNum: "",
      tableData: [],
      fileList: [],
      selectList: [],
      list: [],
      newAreaOptions: [],
      page: {
        total: 0, // 总页数
        currentPage: 1, // 当前页数
        pageSize: 20, // 每页显示多少条
        pageSizes:[5,8,10,20,30,50,100]
      },
      replace:{
        total:0,
        currentPage:1,
        pageSize:20
      },
      generateAttributeList:[{
          attributeId: 1,
          attributeName: '归口',
          attributeValue: '',
          attributeValueDesc: '',
        },{
          attributeId: 2,
          attributeName: '级别',
          attributeValue: '',
          attributeValueDesc: '',
        }
      ],
      param: new FormData(),
      para: new FormData(),
      uploadDialog: false,
      statusDialog: false,
      deleteDialog: false,
      replaceDialog: false,
      libraryDialog: false,
      tableOption: tableOption,
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
      fileForm: {
        keyWords:"",
        uploader:"",
        showStatus:"",
        level: null,
        area: []  
      },
      form: {
        level: null,
        region: []  
      },
      levelData: productData.levelData,
      showText: false,
      showForm: {
        stare: null,
      },
      inputRules: {
        name: [{
          required: true,
        }],
        type: [{
          required: true,
        }],
      //   price: [
      //   {
      //     required: true,
      //     message: '请输入价格',
      //     trigger: 'blur',
      //   },
      //   {
      //     validator: (rule, value, callback) => {
      //       const priceRegex = /^[1-9]\d*(\.\d{1,2})?$/;
      //       if (!priceRegex.test(value)) {
      //         callback(new Error('请输入正确的价格（正整数或最多保留两位小数）'));
      //       } else {
      //         callback();
      //       }
      //     },
      //     trigger: 'blur',
      //   }
      // ]
      },
      newRules: {
        region: [
          { required: true, message: this.$t("input.pleaseChooseArea"), trigger: "change", },
        ],
        level: [
          { required: true, message: this.$t("input.pleaseChooseLevel"), trigger: "change" },
        ],
      },
      statusList: [
        {
          value: null,
          label: "全部"
        },
        {
          value: 1,
          label: "显示"
        },
        {
          value: 2,
          label: "不显示"
        },
        {
          value: 0,
          label: "置顶"
        }
      ],
      cellReplaceData:{},
      casDisable: false,
      areaOptions: [],
      provinceOptions: [],//省级
      cityOptions: [],//市级
      districtOptions: [],//区级
    };
  },
  directives: {
    //注册一个局部的自定义指令 v-focus
    focus: {
      // 指令的定义
      inserted: function (el) {
        // 聚焦元素
        el.querySelector("input").focus();
      },
    },
  },
  filters: {
    levelFilter(val){
      if(val){
        return val == 1 ? '国家级' : val == 2 ? '省级' : val == 3 ? '市级' : val == 4 ? '区级' : ''
      }
    },
    filterAmount(val) {
      return val.toFixed(2)
    },
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  created(){
    if(!this.permissions.bt_page_doc_my && !this.permissions.bt_edit_doc_my && !this.permissions.bt_del_doc_my && !this.permissions.bt_download_doc_my) this.$notAuthorized()
    if(sessionStorage.getItem(`${this.$route.path}`)){
      let keepParams  = JSON.parse(sessionStorage.getItem(`${this.$route.path}`))
      this.fileForm.keyWords = keepParams.params.keywords ? keepParams.params.keywords : null
      this.fileForm.uploader = keepParams.params.operatorNoOrName ? keepParams.params.operatorNoOrName : null
      this.fileForm.showStatus = keepParams.params.state ? keepParams.params.state : null
      this.fileForm.level = keepParams.params.level ? keepParams.params.level : null
      this.page.currentPage = keepParams.params.pageNo
      this.page.pageSize = keepParams.params.pageSize
    }
  },
  methods: {
    // 上传
    async uploadFile(file,fileName) {
      if (!file || file.length === 0) {
        return;
      }
      const uploader = await new OSSUploader(true)
      await uploader.upload(file,  this.ossUrl + fileName).then(url => {
        this.handleAddDoc(url, fileName)
      })
    },
    handleAddDoc(fileSourceUrl, fileName) {
      let name = fileName.split('.')
      let type = name.pop()
      let params = {
        isPay: this.fileType,
        fileName: name.join('.'),
        fileSourceUrl: fileSourceUrl,
        fileType: type
      }
      //地区
      if (this.form.region) {
        params.areaNo = this.form.level == 1 ? '000000' : this.form.region.toString()
      }
      if(this.form.level){
        params.level = this.form.level
      }
      if(this.fileType == 1){
        params.amount = Number(this.filePrice).toFixed(2)
      }
      addDocMy(params).then(res=> {
        if (res.data.code == 0) {
          this.$message({
            type: "success",
            message: "上传成功",
          })
          this.fileList = [];
          this.fileObj = {}
          this.fileType = 0
          this.filePrice = '0.00'
          this.filePriceInput = 0
          this.uploadDialog = false
          this.getList();
        } else {
          this.$message({
            type: 'error',
            message: res.data.msg
          })
        }
      })
    },
    handleChange() {

    },
    areaFilter(val) {
      if (val === '000000') { // 处理全国情况
        return '全国';
      }
      const area = val.split(',');
      if (this.dict[area.join('')]) {
        return this.dict[area.join('')].name;
      }
    },
    getAddressString(val) {
      const area = val.split(',');
      let currentNode = { children: areaOptions };

      for (let i = 0; i < area.length; i++) {
        const node = findNode(currentNode.children, area[i]);
        if (!node) return '';

        currentNode = node;
      }

      return currentNode.fullName || '';

      function findNode(nodes, no) {
        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          if (node.no === no) return node;
          if (node.children) {
            const subNode = findNode(node.children, no);
            if (subNode) {
              subNode.fullName = (node.fullName || '') + subNode.name;
              return subNode;
            }
          }
        }
      }
    },
    levelChange(e){
      switch (Number(e)){
        case 1:
          this.casDisable = true
          this.form.region = null
          this.generateAttributeList[1].attributeValue = 1
          this.generateAttributeList[1].attributeValueDesc = '国家级'
          break
        case 2:
          this.casDisable = false
          this.form.region = null
          this.areaOptions = this.provinceOptions
          this.generateAttributeList[1].attributeValue = 2
          this.generateAttributeList[1].attributeValueDesc = '省级'
          break
        case 3:
          this.casDisable = false
          this.form.region = null
          this.areaOptions = this.cityOptions
          this.generateAttributeList[1].attributeValue = 3
          this.generateAttributeList[1].attributeValueDesc = '市级'
          break
        case 4:
          this.casDisable = false
          this.form.region = null
          this.areaOptions = this.districtOptions
          this.generateAttributeList[1].attributeValue = 4
          this.generateAttributeList[1].attributeValueDesc = '区级'
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
    sizeChange(val){
      this.page.pageSize = val;
      this.getList();
    },
    cancleUpload(){
      this.$refs['form'].resetFields()
      this.uploadDialog=false;
      this.replaceDialog=false;
      this.fileList = [];
      this.fileObj = {}
      this.form.level = null
      this.filePrice = ""
      this.fileType = 0
      this.form.region = []
      this.casDisable = false
    },
    deleteRow(row){
      this.$alert('确认删除'+row.name+'吗？','删除',{
        type:'warning',
      }).then(()=>{
        this.fileObj = {}
        this.fileList = [];
      })
    },
    areaChange() {
      console.log(this.form.region, "输出选择的地区");
    },
    cellReplaceFile(row){
      this.whichUrl = 1;
      this.cellReplaceData = row;
      this.replaceDialog = true
    },
    BatchcellReplaceFile(row){
      this.whichUrl = 2;
      this.cellReplaceData = row;
      this.replaceDialog = true
    },
    closeReplace(val){
      this.replaceDialog = val;
      this.getList();
    },
    viewFile(row){
      this.$router.push({
        // path: this.$router.$avueRouter.getPath({
        //   name: "文件详情",
        //   src: "/policySquare/file/fileDetail"
        // }),
        path:'/personal-fileDetail',
        query: {
          id: row.id,
          type: 0
        },
      })
    },
    handleEdit(row) {
      this.$router.push({
        path:'/personal-fileDetail',
        query: {
          id: row.id,
          type: 1
        },
      })
    },
    showDialog(){
      this.uploadDialog = true
      this.createTime = ""
    },
    viewArticle(row) {
      let routeData = this.$router.resolve({
        path: "/policy-editnotice",
        query: {
          number: row.number,
          type: row.type,
          deleted: 0,
          beFrom: 0
        }
      });
      window.open(routeData.href, "_blank");
    },
    clearValidate() {
      this.$refs["showForm"].clearValidate(), (this.statusDialog = false);
    },
    batchDelete() {
      var ids = [];
      var noList =[];
      for (var i = 0; i < this.selectList.length; i++) {
        ids.push(this.selectList[i].id);
        noList.push(this.selectList[i].number);
      }
      let params = {
        ids: ids,
      }
      removeFileMy(params).then(res => {
          this.$message({
            type: "success",
            message: this.$t("alert.sucessDelete")
          });
          this.deleteDialog = false;
          this.getList();
        }).catch(err => {
          this.$message({
            type: "warning",
            message: err
          });
        });
    },
    //重置
    reSet() {
      this.fileForm.keyWords = ""
      this.fileForm.uploader = ""
      this.page.currentPage = 1
      this.fileForm.showStatus = null
      this.fileForm.filePrice = 0.00
      this.fileForm.level = null
      this.fileForm.area = []
      this.getList();
    },
    //批量修改显示状态
    submit(row) {
      let ids = []
      this.selectList.forEach(item=>{
        ids.push(item.id)
      })
      let params = {
        ids: row ? [row.id] : ids,
        state: row ? row.state: this.showForm.status
      }
      batchShowMy(params).then(res => {
        if (res.data.code == 0) {
          this.showForm = {}
          this.statusDialog = false
          this.getList();
          this.$message({
            type: "success",
            message: "修改成功！"
          });
        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          })
        }
      }).catch(err => {
        console.log(err);
      });
    },
    //下载文件
    async downLoad(row) {
      let url = ''
      if (row.pages == 0) {
        window.open(this.imgBaseUrl + row.fileSourceUrl)
      } else {
        await downloadDocMy(row.id).then(res => {
          if (res.data.code == 0) {
            url = res.data.data
          }
        }).catch(err => {
          this.$message({
            type: 'warning',
            message: err
          });
        });
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', row.fileName +'.'+ row.fileType);
        document.body.appendChild(link)
        link.click()
      }
    },
    //删除文件
    deleteFile(row) {
      this.$confirm(
        this.$t("label.confirmDelete"),
        this.$t("message.warningTxt"),
        {
          type: "warning",
          confirmButtonText: "确定删除",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel"
        }
      ).then(() => {
        let params = {
          ids: [row.id],
        }
        removeFileMy(params).then(res => {
          if (res.data.code == 0) {
            this.loadstatus = res;
            this.getList();
            this.$message({
              type: "success",
              message: this.$t("alert.sucessDelete")
            });
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            })
          }
        }).catch(err => {
          console.log(err);
        });
      }).catch(() => {
        console.log("cancel");
      });
    },
    handleSearch() {
      this.page.currentPage = 1
      this.getList()
    },
    getList() {
      var data = {
        pageSize: this.page.pageSize,
        pageNo: this.page.currentPage,
      };
      if(this.fileForm.keyWords){
        data.keywords= this.fileForm.keyWords;
      }
      if(this.fileForm.uploader){
        data.operatorNoOrName = this.fileForm.uploader;
      }
      if(this.fileForm.showStatus != null){
        data.state = this.fileForm.showStatus;
      }
      if(this.fileForm.area != ""){
        data.areaNo = this.fileForm.area.toString();
      }
      if(this.fileForm.level){
        data.level = this.fileForm.level;
      }
      // 需要缓存的参数
      let keepParams = {
        params:data
      }
      sessionStorage.setItem(`${this.$route.path}`,JSON.stringify(keepParams))
      getDocListMy(data).then(res => {
        if(res.data.code === 0){
          let a = res.data.data.records;
          for(let i =0;i< a.length;i++){
            a[i].options = null;//添加一个字段
          }
          this.list = a;
          this.page.total = res.data.data.total;
          this.tableLoading = false
        }else{
          this.$message({
            type:'warning',
            message:res.data.msg
          })
        }
        }).catch(err => {
          console.log(err);
        });
    },
    submitUpload(){
      if(this.form.region==null||JSON.parse(JSON.stringify(this.form.region)).length == 0){
        this.form.region = ['000000']
      }
      let now = new Date()
      if (now - this.lastTime > 3000){
        this.uploadFile(this.fileObj.raw,this.fileObj.name)
        this.lastTime = now
      }
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.getList();
    },
    handleSizeChange(val) {

    },
    selectionChange(val) {
      this.selectList = val;
      this.selectedNum = val.length;
    },
    toggleSelection(val) {
      this.$refs.crud.toggleSelection(val);
    },
    currentChange(val) {
      this.page.currentPage = val
      this.getList()
    },
    handleBeforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 5;
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 5MB!",
          type: "warning",
          offset: 300
        });
        return false
      }
      return true;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件`
      );
    },
    childSave(val){
      if (this.fileObj.name != val.name) {
        this.$message({
          type:'success',
          message:'修改成功！'
        })
      }
      let raw = this.fileObj.raw
      this.fileObj = val;
      this.fileObj.raw = raw
    },
    OnChange(file, fileList) {
      if (file.size/1024/1024 <= 5) {
        this.fileObj = {
          name:file.name,
          raw: file.raw,
          options:null,
          uid:file.uid,
        }
        this.fileList = fileList
      }
    },
    //显示图标
    showTrue() {
      this.fileIconShow = true
    },
    showFalse() {
      this.fileIconShow = false
    },
    //显示输入框
    editContent() {
      this.filePriceInput = 1
    },
    //上传弹窗改变价格
    updatePrice() {
      this.filePriceInput = 0
      this.showText = false
      const priceRegex = /^([1-9]\d*|0)(\.\d{1,2})?$/;
      if (this.filePrice == 0) {
        this.showText = true
        this.textMsg = '请输入价格'
      } else if (!priceRegex.test(this.filePrice)) {
        this.showText = true
        this.textMsg = '请输入正确的价格（正整数或最多保留两位小数）'
      }
    },
    //上传弹窗改变类型
    changeType(row) {
      this.$set(row, 'type', row.type)
    },
    shareClose() {
      this.dialogShow = false
    },
    //推广
    getCodeLink(row){
      this.dialogShow = true
      this.dialogForm = row
    },

    unique(names) {
      const res = new Map();
      return names.filter(
        names => !res.has(names.name) && res.set(names.name, 1)
      );
    },
    getNewArea(){
      getNewArea().then(res => {
        this.newAreaOptions = res.data.data
        this.provinceOptions = this.getTreeData(JSON.parse(JSON.stringify(res.data.data)), 1)
        this.cityOptions = this.getTreeData(JSON.parse(JSON.stringify(res.data.data)), 2)
        this.districtOptions = JSON.parse(JSON.stringify(res.data.data))
        if (!this.newAreaOptions) { // 处理数据不存在的情况
          throw new Error('数据不存在');
        }
        this.dict = {}; // 构造字典
        const buildDict = (data, prefix = '', name = '') => {
          data.forEach(item => {
            this.dict[prefix + item.no] = { name: name + item.name };
            if (item.children) {
              buildDict(item.children, prefix + item.no, name+ item.name);
            }
          });
        };
        buildDict(this.newAreaOptions);
      }).catch(err => {
        console.log(err);
      });
    },
    getCode() {
      getWxYaoCode().then(res=>{
        this.code = res.data.data
      });
    }
  },
  mounted() {
    this.getNewArea()
    this.getList();
    this.getCode()
  },
  watch: {
    loadstatus(val) {
      if (val == undefined) {
        this.loading = true;
      } else {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.frame {
  width: 100%;
  padding: 10px 20px;
  background: #fff;
}
.promt {
  position: relative !important;
}
.promt-box {
  position: fixed !important;
  width: 100px;
  height: 50px;
  margin-left: 50%;
  background: gainsboro;
}
.table-list {
  margin-top: 10px;
}
.table {
  margin-top: 10px;
}
.footer {
  width: 500px;
  margin-top: 10px;
  margin: 0 auto;
}
.upload {
  margin: 20px;
}
.title {
  width: 150px;
  margin: 0 auto;
  font-size: 16px;
  text-align: center;
  margin-top: -40px;
}
.box {
  width: 100%;
  overflow: hidden;
}
.related_article {
  font-size: 12px;
  color: #36a6fe;
  cursor: pointer;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}
.btn {
  float: right;
  margin-top: 10px;
}
.choose-file {
  text-align: center;
  margin: 10px;
}
.batchOperate {
  margin: 10px 0;
}
.dialogBtn {
  margin-top: 40px;
  text-align: center;
}
.file-name {
  color: #36a6fe;
  cursor: pointer;
}
.warning{
  font-size: 12px;
  display: inline-block;
  width: 360px;
  text-align: left;
  vertical-align: middle;
  margin-left: 15px;
  margin-top: -3px;
}
.file-price{
  display: flex;
  align-items: center;
  text-align: left;
}
.icon-edit{
  margin-left: 10px;
  cursor: pointer;
}
.editBox{
  display: flex;
  margin-top: -7px;
}
.button-class{
  margin-left: 500px;
  padding: 5px 10px;
}
.fileName{
  color: #36a6fe;
  cursor: pointer;
}
.red-text{
  color: #F56C6C;
}
</style>