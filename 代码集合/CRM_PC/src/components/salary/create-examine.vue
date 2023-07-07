<template>
  <div class="create-plan-frame">
    <div class="head-examine">
      <el-form :model="examineForm" inline label-width="90px">
        <el-form-item>
          <el-input v-model.trim="examineForm.name" maxlength="20" placeholder="请输入方案名称" />
        </el-form-item>
        <el-form-item label="方案类型：">
          <span class="plan-name">{{planForm.planType | planType}}</span>
        </el-form-item>
        <el-form-item label="关联方案：" v-if="planForm.planType == 1">
          <el-select v-model="planForm.relatedPlanId" @change="changeRelatedPlan">
            <el-option 
              v-for="item in planList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
        </el-form-item>
        <el-button class="plan-btn" size="mini" type="primary" @click="addExamine()">新建考核项</el-button>
      </el-form>
      <div class="examine-grid">
        <div>考核项</div>
        <div>指标说明</div>
        <div>结果值录入人</div>
        <div>考核标准</div>
        <div>等级规则</div>
        <div>等级结果</div>
        <div>计算方式</div>
        <div>计算规则</div>
        <div>结果值名称</div>
        <div>操作</div>
      </div>
    </div>
  
  <div class="examine-plan-content">
    <div v-for="(examine, examineIndex) in examineList" :key="examine.id" >
      <div>
        <p class="examine-name">{{examine.name}}
          <!-- <span class="reserved">(是否纳入预留：
            <el-radio-group v-model="examine.isReserved">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          )
          </span> -->
          <i class="el-icon-delete del-btn" @click="delExaminePlan(examineIndex)"></i>
          <i class="el-icon-edit edit-btn" @click="editName(examine, examineIndex)"></i> 
        </p>
        <div v-for="(item, index) in examine.selectedIndicatorList" :key="item.id" class="border-box">
          <el-form :model="validateForm" ref="validateForm" :rules="rules">
            <!-- 非等级指标 -->
            <div v-if="item.indexType != '1-2'" class="examine-grid common">
              <p>{{item.name}}</p>
              <p>{{item.des || '/'}}</p>
              <p>{{item.type == 1 ? '系统获取' : item.type == 2 ? '人工录入' : item.type == 3 ? '系统计算' : item.type == 4 ? '系统统计' : '系统统计'}}</p>
              <p>/</p>
              <p></p>
              <p></p>
              <p></p>
              <el-form-item :prop="'#'+examineIndex +'#'+index+'#computeRule'" :rules="rules.computeRule" v-if="item.isComputed">
                <el-input class="input-width" v-model="item.computeRule" @click.native="showOperator(item)" placeholder="请输入计算规则" />
              </el-form-item>
              <p v-if="!item.isComputed"></p>
              <el-form-item :prop="'#'+examineIndex +'#'+index+'#resultNameId'" :rules="rules.resultNameId" v-if="item.isComputed">
                <el-select v-model="item.resultNameId" class="input-width" @change="changeResultId">
                  <el-option
                    v-for="item in resultData"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                    :disabled="item.disabled"
                  />
                </el-select>
              </el-form-item>
              <p v-if="!item.isComputed"></p>
              <div>
                <el-button slot="reference" type="text" size="mini" class="del-examine-btn" @click="delExamine(examine, index)">删除</el-button>
              </div>
            </div>
            <!-- 等级指标 -->
            <div v-if="item.indexType == '1-2'" class="examine-grid common">
              <p>{{item.name}}</p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <p></p>
              <el-form-item :prop="'#'+examineIndex +'#'+index+'#resultNameId'" :rules="rules.resultNameId">
                <el-select v-model="item.resultNameId" class="input-width" @change="changeResultId">
                  <el-option
                  v-for="item in resultData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                  :disabled='item.disabled'
                  />
                </el-select>
              </el-form-item>
              <div>
                <el-button slot="reference" type="text" size="mini" class="del-examine-btn" @click="delExamine(examine, index)">删除</el-button>
              </div>
            </div>
            <!-- 等级指标第二层 -->
            <div v-if="item.indexType == '1-2' || item.planItemIndexKpGradeConfList && item.planItemIndexKpGradeConfList.length > 0">
              <div v-for="(el, subScript) in item.planItemIndexKpGradeConfList" :key="el.id">
                <div class="examine-grid common">
                  <p class="second-floor">{{el.name}}</p>
                  <p></p>
                  <p></p>
                  <p></p>
                  <el-form-item>
                    <el-radio-group v-model="el.reachType">
                      <el-radio :label="1">单项达到</el-radio>
                      <el-radio :label="2">全部达到</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <p></p>
                  <el-form-item>
                    <el-radio-group v-model="el.valueType">
                      <el-radio :label="1">求和</el-radio>
                      <el-radio :label="2">固定值</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <p v-if="el.valueType == 1"></p>
                  <el-form-item v-if="el.valueType == 2" :prop="'#'+examineIndex+'#'+index+'#'+subScript+'#computeRule'" :rules="rules.computeRule">
                    <el-input v-model="el.computeRule" class="input-width" @click.native="showOperator(el)" placeholder="请输入计算规则" />
                  </el-form-item>
                  <p></p>
                </div>
                <!-- 等级指标第三层 -->
                <div v-for="(row, lastIndex) in el.planItemIndexKpGradeIndexConfList" :key="row.id" class="examine-grid common">
                  <p class="third-floor">{{row.name}}</p>
                  <p>{{row.des}}</p>
                  <p>{{row.type == 1 ? '系统获取' : row.type == 2 ? '人工录入' : row.type == 3 ? '系统计算' : '系统统计'}}</p>
                  <el-form-item :prop="'#'+examineIndex+'#'+index+'#'+subScript+'#'+lastIndex+'#gradeStandardValue'" :rules="rules.gradeStandardValue">
                    <el-input class="input-width input-with-select" placeholder="请输入标准值" v-model="row.gradeStandardValue">
                      <el-select v-model="row.gradeStandardSign" slot="prepend" placeholder="请选择">
                        <el-option label="≥" value=">="></el-option>
                        <el-option label="≤" value="<="></el-option>
                        <el-option label="<" value="<"></el-option>
                        <el-option label="=" value="="></el-option>
                      </el-select>
                    </el-input>
                  </el-form-item>
                  <p></p>
                  <p>系统获取</p>
                  <p></p>
                  <el-form-item v-if="el.valueType == 1" :prop="'#'+examineIndex+'#'+index+'#'+subScript+'#'+lastIndex+'#computeRule'" :rules="rules.computeRule">
                    <el-input class="input-width" v-model="row.computeRule" placeholder="请输入计算规则" @click.native="showOperator(row)" />
                  </el-form-item>
                  <p v-if="el.valueType == 1"></p>
                </div>
              </div>
            </div>
          </el-form>
        </div>
        <div>
          <p class="add-indicator" @click="addIndicator(examine)"><i class="el-icon-plus"></i>添加指标项</p>
        </div>
      </div>
    </div>
  </div>

    <!-- 新建考核项 -->
    <el-dialog :visible.sync="addExamineDialog" title="创建考核项" width="350px" :close-on-click-modal="false">
      <el-form :model="addForm" ref="addForm" :rules="addRules" inline>
        <el-form-item label="考核项名称：" prop="examineName">
          <el-input v-model.trim="addForm.examineName" maxlength="10" placeholder="请输入考核项名称(限10个字)" />
        </el-form-item>
        <el-form-item label="是否为管理考核内容" v-if="planForm.planType != 2 && planForm.planType != 3">
          <el-radio-group v-model="addForm.isManager">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否纳入预留：" v-if="!addForm.isManager">
          <el-radio-group v-model="addForm.isReserved">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" type="primary" @click="create()">创建</el-button>
      </div>
    </el-dialog>

    <!-- 添加指标项 -->
    <el-dialog :visible.sync="indicatorDialog" title="添加指标项" :close-on-click-modal="false">
      <el-form :model="indicatorForm" inline @keyup.enter.native="changeType(false)">
        <el-form-item label="指标类型：">
          <el-select v-model="indicatorForm.type" @change="changeType(false)">
            <el-option 
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="true"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="关键词：">
          <el-input v-model="indicatorForm.keyWords" />
        </el-form-item>
        <el-button size="mini" type="primary" @click="changeType">搜索</el-button>
      </el-form>
      <!-- 等级指标 2 -->
      <el-tabs v-model="indicatorType" @tab-click="clickTab" v-if="indicatorForm.type == 1">
        <el-tab-pane name="0" label="单项指标" :disabled="onlyShowManage"></el-tab-pane>
        <el-tab-pane name="1" label="等级指标" :disabled="onlyShowManage"></el-tab-pane>
        <el-tab-pane name="2" label="管理指标" :disabled="!onlyShowManage"></el-tab-pane>
      </el-tabs>
      <!-- 财务指标 3 -->
      <el-tabs v-model="indicatorType" @tab-click="changeFinancialTab" v-if="indicatorForm.type == 3">
        <el-tab-pane name="0" label="单项指标" ></el-tab-pane>
        <el-tab-pane name="1" label="预留指标" ></el-tab-pane>
      </el-tabs>
      <!-- 指标列表 -->
      <el-table ref="multipleTable" :data="indicatorList" border @selection-change="selectionChange" :row-key="(row)=>{return row.id}">
        <el-table-column type="selection" :selectable="selectAble" :reserve-selection="true" ></el-table-column>
        <el-table-column label="指标名称" prop="name"></el-table-column>
        <el-table-column label="指标说明" >
          <template slot-scope="{row}">
            <span>{{row.des || '/'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="指标属性" width="100">
          <template slot-scope="{row}">
            <span>{{ row.signs == '-' ? '减项' : row.signs == '+' ? '加项' : '/' }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="paging"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5, 10, 20, 30 ]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
      <div slot="footer">
        <el-button size="mini" @click="cancel()">取消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd()">添加</el-button>
      </div>
    </el-dialog> 

    <!-- 计算规则-编辑器 -->
    <el-dialog :visible.sync="operatorDialog" title="公式设置" :close-on-click-modal="false" width="750px">
      <calculator v-if="operatorDialog" @formula="getFormula" :editOperator="editOperator" :planType='planForm.planType' :examineList="examineList" :relatedPlanId='planForm.relatedPlanId' />
    </el-dialog>

    <!-- 编辑考核项名称 -->
    <el-dialog :visible.sync="editExamineDialog" title="编辑考核项名称" width="350px" :close-on-click-modal="false">
      <el-form :model="editForm" ref="editForm" :rules="addRules" inline>
        <el-form-item label="考核项名称：" prop="name">
          <el-input v-model.trim="editForm.name" maxlength="10" placeholder="请输入考核项名称(限10个字)" />
        </el-form-item>
        <el-form-item label="是否为管理考核内容" v-if="planForm.planType != 2 && planForm.planType != 3">
          <el-radio-group v-model="editForm.isManager" @change="getManagerState()">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否纳入预留：" v-if="!editForm.isManager">
          <el-radio-group v-model="editForm.isReserved">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" type="primary" @click="confirmEdit()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 新建方案 -->
    <el-dialog :visible.sync="addPlanDialog" :close-on-click-modal="false" title="方案属性" :show-close="false" width="600px">
      <el-form :model="planForm" ref="planForm" :rules="planRules" inline>
        <el-form-item label="方案名称：" prop="name">
          <el-input placeholder="请输入方案名称(限20字)" max="20" v-model="planForm.name" />
        </el-form-item>
        <el-form-item label="方案类型：" prop="planType">
          <el-radio-group v-model="planForm.planType">
            <el-radio v-for="item in typeList" :key="item.value" :label="item.value" :disabled="(item.value == 3 && finanicalNum > 0)">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联方案：" v-if="planForm.planType == 1" prop="relatedPlanId">
          <el-select v-model="planForm.relatedPlanId" @change="selectRelatedPlan">
            <el-option 
              v-for="item in planList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            />
          </el-select>
          <span class="plan-text">关联方案为行政类基础方案</span>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="mini" @click="cancelPlan()">取消</el-button>
        <el-button size="mini" type="primary" @click="confirmAddPlan()">确定</el-button>
      </div>
    </el-dialog>

    <!-- 变更关联方案 -->
    <el-dialog :visible.sync="relatedDialog" title="更换关联方案提示" :close-on-click-modal="false" width="500px">
      <p>更换关联方案后，该方案所添加的指标项将被全部清空是否更换关联方案?</p>
      <div slot="footer">
        <el-button size="mini" @click="cancelChange()">取消</el-button>
        <el-button size="mini" type="primary" @click="confirmChange()">确定</el-button>
      </div>
    </el-dialog>


    <!-- 指标操作按钮 -->
    <div class="exmaine-add-btn">
      <el-button size="mini" @click="cancelAddOrEdit()">取消</el-button>
      <el-button size="mini" type="primary" @click="confirm()" v-preventReClick>{{$route.query.id ? '保存' : '完成'}}</el-button>
    </div>
  </div>
</template>

<script>
import { pageKpGradeIndex, pageKpIndex } from "@/api/salary/target"
import { addPlan, getPlan, modPlan, examinePlan } from "@/api/salary/examine";
import { result } from '@/api/salary/result'
import examineData from "./examine";
import calculator from './calculator.vue';
import { mapGetters } from "vuex";
export default {
  components: {
    calculator
  },
  data(){
    var gradeValidate = (rule, value, callback)=>{
      let indexList = rule.field.match(/\d/ig);
      let index = 0
      let pattern = /^\d{1,8}(\.(\d{1,2}))?$/;
      if(pattern.test(
        this.examineList[indexList[index]].selectedIndicatorList[indexList[index+1]].planItemIndexKpGradeConfList[indexList[index+2]].planItemIndexKpGradeIndexConfList[indexList[index+3]].gradeStandardValue
      )){
        callback();
      }else{
        callback(new Error('请输入0或正数,小数点后两位'))
      }
    };
    var ruleValidate = (rule, value, callback)=>{
      let indexList = rule.field.match(/(?<=#).*?(?=#)/ig);
      let index = 0;
      if(indexList.length == 2){
        if(this.examineList[indexList[index]].selectedIndicatorList[indexList[index+1]].computeRule){
          callback();
        }else{
          callback(new Error('请输入计算规则!'));
        }
      }else if(indexList.length == 3){
        if(this.examineList[indexList[index]].selectedIndicatorList[indexList[index+1]].planItemIndexKpGradeConfList[indexList[index+2]].computeRule){
          callback();
        }else{
          callback(new Error('请输入计算规则'));
        }
      }else if(indexList.length == 4){
        if(this.examineList[indexList[index]].selectedIndicatorList[indexList[index+1]].planItemIndexKpGradeConfList[indexList[index+2]].planItemIndexKpGradeIndexConfList[indexList[index+3]].computeRule){
          callback();
        }else{
          callback(new Error('请输入计算规则'));
        }
      }else{
        callback();
      }
    }
    var resultNameIdValidate = (rule, value, callback)=>{
      let indexList = rule.field.match(/(?<=#).*?(?=#)/ig);
      let index = 0;
      if(indexList.length == 2){
        if(this.examineList[indexList[index]].selectedIndicatorList[indexList[index+1]].resultNameId){
          callback();
        }else{
          callback(new Error('请选择结果值名称!'));
        }
      }else{
        callback();
      }
    }
    return {
      addPlanDialog: false,
      addExamineDialog: false,
      indicatorDialog: false,
      operatorDialog: false,
      editExamineDialog: false,
      relatedDialog: false,
      examineList: [],
      indicatorList: [],
      selectedList: [],
      selectedIndicatorList: [],
      selectedIds: [],//已选择的指标id
      pageKpList: [],
      pageKpGradeList: [],
      pageAdministrativeList: [],
      pageFinancialList: [],
      planList: [],
      resultData: [],//结果值list
      resultIds: [],//所有结果值id
      typeList: examineData.typeList,
      examineForm: {},
      validateForm: {},
      planForm: {},
      editOperator: {},//当前编辑的计算规则
      indicatorForm: {
        type: 0
      },
      rules: {
        gradeStandardValue: [{required: true, validator: gradeValidate,trigger:'blur'}],
        computeRule: [{required: true, validator: ruleValidate }],
        resultNameId: [{required: true, validator: resultNameIdValidate }]
      },
      addRules:{
        examineName:[{required:true, message:'请输入考核项名称',trigger:'blur'}],
        name:[{required:true, message:'请输入考核项名称',trigger:'blur'}],
      },
      planRules:{
        name: [{required: true, message:'请输入方案名称',trigger:'blur'}],
        planType: [{required: true, message:'请选择方案类型', trigger:'blur'}],
        relatedPlanId:[{required: true, message:'请选择关联方案',trigger:'blur'}]
      },
      examine: {},//当前选中的考核项
      addForm: {
        isReserved: false,
        isManager: false
      },
      editForm: {},
      indicatorType: '0',
      currentPage: 1,
      pageSize: 10,
      total: 0,
      planId:'',
      planRelatedList: [],
      relatedPlanId:'',//当前关联的方案id
      allExamineList: [],//全部考核项
      finanicalNum: 0,//财务方案数量
      taxNum: 0,//个税方案数量
      onlyShowManage: false,//是否只显示管理指标
      currentManager: false,//编辑前是否为管理考核内容
    }
  },
  filters:{
    planType(val){
      return examineData.planType(val);
    }
  },
  computed: {
    ...mapGetters(['permissions'])
  },
  mounted(){
    this.getResult();
    this.getExaminePlan();//获取所有方案
    this.getPlanList();//获取关联方案
    if(this.$route.query.operate == 'edit'){
      if(this.permissions.salary_plan_detail){
        this.planId = this.$route.query.id;
        this.getPageIndex();//全部考核项
        this.getPageKpIndex();
        setTimeout(() => {//防止数据层级太多页面显示错误
          this.getPlan();
        }, 300);
      }else{
        this.$notAuthorized();
      }
    }else{
      this.addPlanDialog = true;
    }
  },
  methods:{
    getManagerState(){
      this.$confirm('更换考核项类型后，该考核项所添加的指标项将被全部清空是否更换考核项类型？','更换考核项类型提示',{
        type: "warning",
        confirmButtonText: "更换",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
      }).then(()=>{

      }).catch(()=>{
        this.editForm.isManager = this.currentManager;
      })
    },
    clickTab(){
      this.pageSize = 10;
      this.currentPage = 1;
      this.changeTab()
    },
    changeResultId(){//已选结果值置灰处理
      this.resultData.forEach(el => {
        this.$set(el,'disabled', false);
      });
      this.examineList.forEach(el => {
        el.selectedIndicatorList.forEach(element => {
          if(this.resultIds.indexOf(element.resultNameId) != -1){
            this.$set(this.resultData[this.resultIds.indexOf(element.resultNameId)],'disabled',true);
          }
        });
      });
    },
    getResult(){//获取结果值list
      let param = {
        pageNo: 1,
        pageSize: -1
      }
      result(param).then(res=>{
        this.resultData = res.data.data.records;
        this.resultData.forEach(el => {
          this.$set(el,'disabled',false);
        });
        this.resultIds = Array.from(this.resultData,({id})=>id);
      })
    },
    getExaminePlan(){
      let param = {
        pageSize: -1,
        pageNo: 1,
      }
      examinePlan(param).then(res=>{
        res.data.data.records.forEach(item => {
          if(item.planType == 3){
            this.finanicalNum++;
          }
          if(item.planType == 4){
            this.taxNum++;
          }
        });
      })
    },
    cancelChange(){
      this.planForm.relatedPlanId = this.relatedPlanId;
      this.relatedDialog = false;
    },
    confirmChange(){
      this.examineList = [];
      this.selectedIndicatorList = [];
      this.selectedIds = [];
      this.relatedDialog = false;
      this.resultData.forEach(el => {
        this.$set(el,'disabled', false);
      });
      this.selectRelatedPlan();
    },
    changeRelatedPlan(val){
      if(val != this.relatedPlanId){
        this.relatedDialog = true;
      }
    },
    selectRelatedPlan(){
      this.planRelatedList = [];
      this.planList.forEach(item=>{
        if(item.id == this.planForm.relatedPlanId){
          this.relatedPlanId = this.planForm.relatedPlanId;
          this.planRelatedList.push({
            name: item.name,
            planType: item.planType,
            planId: item.id
          })
        }
      })
    },
    confirmAddPlan(){
      this.$refs.planForm.validate(valid=>{
        if(valid){
          this.$set(this.examineForm,'name',this.planForm.name)
          this.indicatorForm.type = this.planForm.planType;
          this.addPlanDialog = false;
        }else{
          return false;
        }
      })
    },
    cancelPlan(){
      this.$confirm('确定取消新建方案吗?','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.$router.push('/salary/examine-plan');
      })
    },
    getPlanList(){
      let param = {
        pageSize: -1,
        pageNo: 1,
        planType: 2
      }
      examinePlan(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.planList = res.data.data.records
        }
      })
    },
    delExaminePlan(index){
      this.$confirm('确定删除该考核项吗','删除提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.examineList[index].selectedIndicatorList.forEach(item => {
          if(this.selectedIds.indexOf(item.indexId) > -1){
            this.selectedIds.splice(this.selectedIds.indexOf(item.indexId), 1);
          }
        });
        this.examineList.splice(index, 1);
      })
    },
    confirmEdit(){
      this.$refs.editForm.validate(valid=>{
        if(valid){
          this.examineList[this.editForm.index].name = this.editForm.name;
          this.examineList[this.editForm.index].isReserved = this.editForm.isReserved;
          this.examineList[this.editForm.index].isManager = this.editForm.isManager;
          if(this.editForm.isManager != this.currentManager){
            this.examineList[this.editForm.index].selectedIndicatorList.forEach(item => {
              if(this.selectedIds.indexOf(item.indexId) > -1){
                this.selectedIds.splice(this.selectedIds.indexOf(item.indexId), 1);
              }
            });
            this.examineList[this.editForm.index].planItemIndexConfList = [];
            this.examineList[this.editForm.index].selectedIndicatorList = [];
          }
          this.editExamineDialog = false;
        }else{
          return false;
        }
      })
    },
    editName(row,index){
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editForm.index = index;
      this.currentManager = row.isManager;
      this.editExamineDialog = true;
    },
    cancelAddOrEdit(){
      this.$confirm('取消后将不会保存新增或修改的信息','取消提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        history.go(-1);
      })
    },
    getPlan(){//编辑-获取方案详情
      getPlan(this.planId).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          this.$set(this.examineForm,'name',res.data.data.name);
          this.$set(this.examineForm,'id',res.data.data.id);
          this.$set(this.planForm,'planType', res.data.data.planType);
          this.examineList = res.data.data.planItemList;
          if(res.data.data.planRelList.length>0){
            this.planForm.relatedPlanId = res.data.data.planRelList[0].planId;
            this.planList.forEach(item=>{
              if(item.id == this.planForm.relatedPlanId){
                this.planRelatedList.push({
                  name: item.name,
                  planType: item.planType,
                  planId: item.id
                })
              }
            })
          }
          this.examineList.forEach( el => {
            this.$set(el,'selectedIndicatorList',el.planItemIndexConfList);
            el.selectedIndicatorList.forEach(item => {
              if(this.resultIds.indexOf(item.resultNameId) != -1){//已选的结果值置灰处理
                this.$set(this.resultData[this.resultIds.indexOf(item.resultNameId)],'disabled', true);
              }
              item.computeRuleList.forEach(rule => {//非等级指标
                if(Number(rule.val) >= 0 && rule.type == 'param'){
                  this.allExamineList.forEach(row => {
                    if(row.id == rule.val){
                      this.$set(rule,'name',row.name)
                    }
                  });
                  if(Number(rule.val) == '0' && rule.type == 'param'){
                    this.$set(rule,'name','结果值')
                  }
                }else{
                  this.$set(rule,'name',rule.val);
                }
              })
              
              if(item.planItemIndexKpGradeConfList && item.planItemIndexKpGradeConfList.length > 0){//等级指标
                item.planItemIndexKpGradeConfList.forEach( el => {
                  el.computeRuleList.forEach(rule => {
                    this.allExamineList.forEach(row => {
                      // if(row.indexId == rule.val){
                      //   this.$set(rule,'name',row.name)
                      // }
                      if(Number(rule.val) >= 0 && rule.type == 'param'){
                        this.allExamineList.forEach(row => {
                          if(row.id == rule.val){
                            this.$set(rule,'name',row.name)
                          }
                        });
                        if(Number(rule.val) == '0' && rule.type == 'param'){
                          this.$set(rule,'name','结果值')
                        }
                      }else{
                        this.$set(rule,'name',rule.val);
                      }
                    });
                    
                    el.planItemIndexKpGradeIndexConfList.forEach( kpGrade =>{
                      kpGrade.computeRuleList.forEach(rule => {
                        if(Number(rule.val) >= 0 && rule.type == 'param'){
                          this.allExamineList.forEach(row => {
                            if(row.id == rule.val){
                              this.$set(rule,'name',row.name)
                            }
                          });
                          if(Number(rule.val) == '0' && rule.type == 'param'){
                            this.$set(rule,'name','结果值')
                          }
                        }else{
                          this.$set(rule,'name',rule.val);
                        }
                      })
                    })
                  })
                });
              }

              /* 非等级指标 */
              this.editOperator = item;
              this.getFormula(item.computeRuleList);

              if(item.planItemIndexKpGradeConfList && item.planItemIndexKpGradeConfList.length > 0){//等级指标
                item.planItemIndexKpGradeConfList.forEach( el => {
                  this.editOperator = el;
                  this.getFormula(el.computeRuleList);
                  el.planItemIndexKpGradeIndexConfList.forEach( kpGrade =>{
                    this.editOperator = kpGrade;
                    this.getFormula(kpGrade.computeRuleList)
                  })
                });
              }

            });
            if(el.selectedIndicatorList.length > 0){//已选项处理
              let typeIdlist = Array.from(el.selectedIndicatorList,({indexId})=> indexId);
              this.selectedIds= this.filterArr([...this.selectedIds, ...typeIdlist]);
            }
          });
        }
      })
      this.$forceUpdate();
    },
    delExamine(row, subScript){
      this.$confirm('方案中有其他指标的计算规则使用到该指标做配置，删除后该计算规则将重置，是否确定删除','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        if(row.selectedIndicatorList[subScript].resultNameId){
          this.$set(this.resultData[this.resultIds.indexOf(row.selectedIndicatorList[subScript].resultNameId)],'disabled',false);//删除的指标对应的结果值重置为可选
        }
        let currentId = this.$route.query.operate == 'edit' ? row.selectedIndicatorList[subScript].indexId : row.selectedIndicatorList[subScript].id;
        this.examineList.forEach( examine => {
          examine.selectedIndicatorList.forEach( indicator=>{
            indicator.computeRuleList.forEach( item=>{
              if(item.type == 'param' && currentId == Number(item.val) ){
                indicator.computeRuleList = [{name:'/',type:'null',val:'/'}];
                indicator.computeRule = ''
              }
            })
            if(indicator.indexType == '1-2'){
              indicator.planItemIndexKpGradeConfList.forEach(KpGrade=>{
                KpGrade.computeRuleList.forEach( item=>{
                  if(item.type == 'param' && currentId == Number(item.val)){
                    KpGrade.computeRuleList = [{name:'/',type:'null',val:'/'}];
                    KpGrade.computeRule = ''
                  }
                })
              })
            }
          } )
        });
        this.del(row,subScript);
      })
    },
    del(row, subScript){
      this.selectedIds.forEach((el, index) => {
        if(this.$route.query.operate == 'edit' && el == row.selectedIndicatorList[subScript].indexId){
          this.selectedIds.splice(index, 1);
          row.selectedIndicatorList.splice(subScript,1);
          this.selectedIndicatorList.forEach((item, idIndex) => {
            if(item.id == el){
              this.selectedIndicatorList.splice(idIndex, 1);
            }
          });
        }
        if(this.$route.query.operate != 'edit' && el == row.selectedIndicatorList[subScript].id){
            this.selectedIds.splice(index, 1);
            row.selectedIndicatorList.splice(subScript,1);
            this.selectedIndicatorList.forEach((item, idIndex) => {
              if(item.id == el){
                this.selectedIndicatorList.splice(idIndex, 1);
              }
            });
        }
      });
      this.$forceUpdate();
      this.$message({
        type:'success',
        message:'删除成功！'
      })
    },
    confirm(){
      if (!this.$refs.validateForm) {
        this.$message({
          type:'warning',
          message:'请至少添加一个指标项'
        })
      }else{
        let validateStatus = true;
        this.$refs.validateForm.forEach(el => {
          el.validate(valid=>{
            if(valid){
              
            }else{
              validateStatus = false;
            }
          })
        });
        if(validateStatus){
          let param = {
            name: this.examineForm.name,
            planType: this.planForm.planType,
            planItemList:[]
          }
          if(this.planForm.planType == 1){
            param.planRelList = this.planRelatedList;
          }
          if(this.$route.query.id){
            param.id = this.examineForm.id
          }
          this.selectedIndicatorList.forEach(el => {
            if(el.indexType == '1-2'){
              el.enterType = el.planItemIndexKpGradeConfList.length > 0 ? 1 : 2;
              el.planItemIndexKpGradeConfList.forEach( item => {
                item.planItemIndexKpGradeIndexConfList.forEach( kpGrade => {
                  kpGrade.indexId = kpGrade.id
                });
              });
            }else{

            }
          });
          let operateStatus = true;
          this.examineList.forEach( (el,index) => {
            param.planItemList.push({id: el.id || null, name:el.name, isReserved: el.isReserved,isManager: el.isManager, planItemIndexConfList: el.selectedIndicatorList});
            if(!el.selectedIndicatorList){
              operateStatus = false;
            }
          });
          if(operateStatus){
            if(this.$route.query.id){
              modPlan(param).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                  this.$message({
                    type:'success',
                    message:"方案修改成功！"
                  })
                  this.$router.push('/salary/examine-plan');
                }else{
                  this.$message({
                    type:'warning',
                    message: res.data.msg
                  })
                }
              })
            }else{
              addPlan(param).then(res=>{
                if(res.data.code == CodeMsg.CODE_0){
                  this.$message({
                    type:'success',
                    message:"方案添加成功！"
                  })
                  this.$router.push('/salary/examine-plan');
                }else{
                  this.$message({
                    type:'warning',
                    message: res.data.msg
                  })
                }
              })
            }
          }else{
            this.$message({
              type:'warning',
              message:'请检查考核项是否完整！'
            })
          }
        }
      }
    },
    getFormula(el){
      let val = JSON.parse(JSON.stringify(el));
      if(val.length > 0){
        val.forEach(item => {
          if(item.computeRuleList){
            this.$set(item,'val',item.indexId);
            this.$set(item,'type', 'param');
          }
        });
        this.$set(this.editOperator,'computeRuleList',val);
        var ruleStr = '';
        val.forEach( el => {
          ruleStr+=el.name;
        });
        this.$set(this.editOperator,'computeRule',ruleStr);
      }else{
        this.$set(this.editOperator,'computeRuleList',[{type: 'null',val:'/'}]);
        this.$set(this.editOperator,'computeRule',null);
      }
      this.operatorDialog = false;
    },
    showOperator(row){//计算规则编辑器
      this.editOperator = row;
      this.operatorDialog = true;
    },
    confirmAdd(){
      this.selectedIndicatorList = JSON.parse(JSON.stringify(this.selectedList));
      this.$refs.multipleTable.clearSelection();//清除选择项
      this.selectedIndicatorList.forEach( el => {
        if(el.indexType == '1-2'){
          el.indexId = el.id;
          el.computeRule = null;
          this.$set(el,'resultNameId','');
          el.computeRuleList = [{type: 'null',val:'/'}];
          el.enterType = el.kpGradeList.length > 0 ? 1 : 2;
          el.kpGradeList.forEach( item => {
            item.kpGradeId = item.grade;
            item.reachType = item.reachType;
            item.valueType = item.valueType;
            item.computeRule = null;
            item.computeRuleList =[{type: 'null',val:'/'}];
          });
          this.$set(el,'planItemIndexKpGradeConfList',el.kpGradeList)
        }else if(el.indexType == '1-3'){
          el.indexId = el.id;
          el.computeRule = null;
          this.$set(el,'resultNameId','');
          el.computeRuleList = [{type: 'null',val:'/'}];
          el.enterType = el.kpMgDependencyList.length > 0 ? 1 : 2;
        }else{
          el.indexId = el.id;
          el.computeRule = null;
          this.$set(el,'resultNameId','');
          el.computeRuleList = [{type: 'null',val:'/'}];
          el.enterType = el.skpSysItemList.length > 0 ? 1 : 2;
        }
      });
      this.examine.selectedIndicatorList = [...this.examine.selectedIndicatorList || [], ...this.selectedIndicatorList];
      if(this.selectedIndicatorList.length > 0){
        let typeIdlist = Array.from(this.selectedIndicatorList,({id})=> id)
        this.selectedIds= this.filterArr([...this.selectedIds, ...typeIdlist]);
      }
      this.indicatorDialog = false;
      console.log(this.examineList);
    },
    filterArr(arr){
      return arr.filter(function(item, index, arr){
        return arr.indexOf(item,0) === index
      })
    },
    cancel(){
      this.$refs.multipleTable.clearSelection();//清除选择项
      this.indicatorDialog = false;
    },
    selectAble(row){
      if(row.able){
        return true;
      }
      return false;
    },
    selectionChange(row){
      this.selectedList = row;
    },
    addIndicator(row){
      this.examine = row;
      if(this.selectedIndicatorList.length > 0){
        let typeIdlist = Array.from(this.selectedIndicatorList,({id})=> id)
        this.selectedIds= this.filterArr([...this.selectedIds, ...typeIdlist]);
      }
      this.indicatorForm = {
        type: 0
      },
      this.indicatorDialog = true;
      this.indicatorForm.type = this.planForm.planType;
      this.onlyShowManage = row.isManager;
      this.indicatorType = row.isManager ? '2' : '0';
      let type = this.changeExamineType(this.planForm.planType, row.isManager);
      this.getPageKpIndex(type);
    },
    changeExamineType(type, isManager){
      return type == 2 ? '2-1' : type == 3 ? '3-1' : type == 1 ? (isManager ? '1-3' : '1-1') : type == 4 ? '4-1' : ''
    },
    changeTab(){
      switch (Number(this.indicatorType)) {
        case 0:
          this.getPageKpIndex('1-1');
          break;
        case 1:
          this.getPageKpIndex('1-2');
          break;
        case 2:
          this.getPageKpIndex('1-3');
          break;
        default:
          break;
      }
    },
    changeFinancialTab(){
      this.pageSize = 10;
      this.currentPage = 1;
      switch (Number(this.indicatorType)) {
        case 0:
          this.getPageKpIndex('3-1');
          break;
        case 1:
          this.getPageKpIndex('3-2');
          break;
        default:
          break;
      }
    },
    checkId(){//检查是否已选
      this.indicatorList.forEach( el => {
        if(this.selectedIds.indexOf(el.id) != -1){
          el.able = false;
        }
      });
    },
    getPageKpIndex(indexType){
      let param = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        name: this.indicatorForm.keyWords,
        indexType: indexType || null
      }
      //指标类型indexType 1:业绩指标 1-1:单项指标 1-2:等级指标 2:行政指标 3:财务指标 4:个税指标
      pageKpIndex(param).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          res.data.data.records.forEach( el => {
            this.$set(el, 'able', true);
            // this.$set(el, 'examineType', 0); //type 0-单项指标 1-等级指标
            this.$set(el, 'id', el.id);
            this.$set(el, 'indexType', indexType);
            if(el.kpGradeList){
              el.kpGradeList.forEach(item => {
                this.$set(item, 'reachType', 1);//达标方式 1-单项达标 2-全部达标
                this.$set(item, 'valueType', 1);//计算规则1-求和（子项之和）2-固定值（顾名思义）
                item.kpIndexList.forEach( res=>{
                  this.$set(res, 'enterType', 1);//录入方式1-系统获取 2-人工录入 默认系统获取
                  this.$set(res, 'gradeStandardSign', '>=');//等级标准符号
                  this.$set(res,'computeRuleList',[{type: 'null',val:'/'}]);//计算规则
                })
                this.$set(item,'planItemIndexKpGradeIndexConfList',item.kpIndexList);
              });
            }
          });
          
          this.indicatorList = res.data.data.records;
          this.checkId();
          this.total = res.data.data.total;
        }
      })
    },
    getPageIndex(){
      let param = {
        pageNo: 1,
        pageSize: -1,
        indexType: null
      }
      //指标类型indexType 1:业绩指标 1-1:单项指标 1-2:等级指标 2:行政指标 3:财务指标 4:个税指标
      pageKpIndex(param).then(res => {
        if (res.data.code == CodeMsg.CODE_0) {
          res.data.data.records.forEach( el => {
            this.$set(el, 'able', true);
            // this.$set(el, 'examineType', 0); //type 0-单项指标 1-等级指标
            this.$set(el, 'id', el.id);
          });
          this.allExamineList = res.data.data.records;
          this.checkId();
          this.total = res.data.data.total;
        }
      })
    },
    getPageKpGradeIndex(){
      let param = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        name: this.indicatorForm.keyWords,
      }
      //业绩指标-等级指标 指标类型indexType 1:业绩指标 1-1:单项指标 1-2:等级指标 2:行政指标 3:财务指标 4:个税指标
      pageKpGradeIndex(param).then(res=>{
        if(res.data.code == CodeMsg.CODE_0){
          res.data.data.records.forEach( el => {
            this.$set(el, 'able', true);
            // this.$set(el, 'examineType', 1);//type 0-单项指标 1-等级指标
            this.$set(el, 'id', '1-'+el.id);
            this.$set(el, 'indexType', '1-2');
            el.kpGradeList.forEach(item => {
              this.$set(item, 'reachType', 1);//达标方式 1-单项达标 2-全部达标
              this.$set(item, 'valueType', 1);//计算规则1-求和（子项之和）2-固定值（顾名思义）
              item.kpIndexList.forEach( res=>{
                this.$set(res, 'enterType', 1);//录入方式1-系统获取 2-人工录入 默认系统获取
                this.$set(res, 'gradeStandardSign', '>=');//等级标准符号
                this.$set(res,'computeRuleList',[{type: 'null',val:'/'}]);//计算规则
              })
              this.$set(item,'planItemIndexKpGradeIndexConfList',item.kpIndexList);
            });
          });
          this.indicatorList = res.data.data.records;
          if(this.$route.query.operate == 'edit'){
            this.pageKpGradeList = this.indicatorList;
          }
          this.checkId();
          this.total = res.data.data.total;
        }
      })
    },
    addExamine(){
      this.addExamineDialog = true;
    },
    changeType(status){//status- true点击分页操作 false其他操作
      if(!status){
        this.currentPage = 1;
      }
      switch (this.indicatorForm.type) {
        case 2:
          this.getPageKpIndex('2-1');
          break;
        case 3:
          this.indicatorType = '0'
          this.getPageKpIndex('3-1');
          break;
        case 4:
          this.getPageKpIndex('4-1');
          break;
        case 1:
          this.changeTab();
          break;
        default:
          break;
      }
    },
    create(){
      this.$refs.addForm.validate(valid=>{
        if(valid){
          this.examineList.push({
            name: this.addForm.examineName,
            isManager: this.addForm.isManager,
            isReserved: this.addForm.isManager ? false : this.addForm.isReserved
          })
          this.addExamineDialog = false;
          this.addForm = {
            isReserved: false,
            isManager: false
          };
        }else{
          return false;
        }
      })
    },
    handleSizeChange(val){
      this.pageSize = val;
      this.changeType(true);
    },
    handleCurrentChange(val){
      this.currentPage = val;
      this.changeType(true);
    }
  }
}
</script>

<style scoped>
  .create-plan-frame{
    padding: 20px;
    background: #FFFFFF;
    font-size: 12px;
    min-height: 100%;
    padding-bottom: 150px;
  }
  .examine-grid{
    display: grid;
    grid-template-columns: 14% 16% 7% 14% 8% 7% 7% 12% 10% 5%;
    text-justify: center;
    background: #f6f6f6;
    color: #555555;
    padding: 5px 10px;
  }
  .examine-name{
    width: 200px;
    background: #f6f6f6;
    padding: 10px;
    margin-bottom: 0;
  }
  .reserved{
    color: #A47F7F;
  }
  .add-indicator{
    width: 100px;
    color: #409EFF;
    cursor: pointer;
  }
  .common{
    background: #FFFFFF;
    border-bottom: 1px solid #f6f6f6;
  }
  .second-floor{
    margin-left: 20px;
  }
  .third-floor{
    margin-left: 40px;
  }
  .input-width{
    max-width: 150px;
    margin: 0 !important;
    padding-top: 10px;
  }
  .border-box{
    border: 1px solid #f6f6f6;
    border-bottom: 0;
  }
  .border-box p{
    line-height: 50px;
    margin-top: 0;
    margin-bottom: 0;
  }
  .input-with-select >>> .el-select{
    width: 40px;
  }
  .input-with-select >>> .el-input__icon{
    width: 0px !important;
  }
  .input-with-select >>> .el-input__inner{
    padding-left: 8px !important;
  }
  .input-with-select >>> .el-radio{
    padding-top: 10px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .exmaine-add-btn{
    background: #FFFFFF;
    border-top: 1px solid #d7d7d7;
    position: fixed;
    padding: 20px 0;
    bottom: 0;
    width: 90%;
    text-align: center;
  }
  .del-examine-btn{
    color: red;
    margin-left: 10px;
    margin-top: 10px;
  }
  .edit-btn{
    float: right;
    margin-right: 10px;
    color: #409EFF;
    cursor: pointer;
  }
  .del-btn{
    color: red;
    float: right;
    cursor: pointer;
  }
  .plan-text{
    color:#555555;
    margin-left: 10px;
  }
  .plan-name{
    color: #585a5e;
  }
  .plan-btn{
    margin-left: 20px
  }
  .head-examine{
    width: 100%;
    background: #FFFFFF;
    position: absolute;
    margin-top: -20px;
    padding-top: 20px;
    z-index: 999;
  }
  .examine-plan-content{
    padding-top: 80px;
  }
</style>