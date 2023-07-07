<template>
<!-- 排查完成 -->
    <div class="achievement">
        <div class="content">
            <div v-if="!id">新建成果</div>
            <div class="title">基本信息</div>
            <el-form :model="dataList" ref="achievementForm" label-position="left" :rules="rules" label-width="100px" class="achievement-form">
                 <el-form-item label="成果名称：" prop="achievementName">
                    <el-input type="text" v-model="dataList.achievementName" placeholder="不超过30个字"></el-input>
                </el-form-item>
                <el-form-item label="技术摘要：" prop="technologyAbstract">
                    <el-input type="textarea" placeholder="请简要描述技术内容，不超过160个字"
                    v-model="dataList.technologyAbstract"
                    cols="5"
                    rows="5"
                    maxlength="160" 
                    show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="技术类型：" prop="technologyType">
                    <el-select v-model="dataList.technologyType" ref="a" @change="technologyChange" style="width:360px" placeholder="请选择技术类型">
                        <el-option 
                        v-for="item in technologyTypeList"
                        :key="item.dropdownKey"
                        :value="item.dropdownKey"
                        :label="item.dropdownValue">
                        </el-option>                        
                    </el-select>
                </el-form-item>
                 <el-form-item label="所属行业：" prop="industry" >                    
                    <el-select v-model="dataList.industry" multiple :multiple-limit="3" style="width:360px" placeholder="请选择所属行业">
                        <el-option  
                        v-for="item in industryData"
                        :key="item.id"
                        :value="item.id"
                        :label="item.name">
                        </el-option>                     
                    </el-select>
                    <span style="color:red;margin-left:5px;font-size:12px;">最多可选3个行业</span>
                </el-form-item>
                <el-form-item label="所在地：" prop="area" >
                    <el-cascader 
                    ref="myCascader"
                    placeholder="请选择所在地"
                    style="width:360px"
                    size="large" 
                    :options="areaList"                     
                    v-model="dataList.area" 
                    :props="{value: 'id',label: 'areaName'}"
                    @change="ceshi"
                    >
                    </el-cascader>
                </el-form-item>
                <el-form-item label="成熟度：" prop="maturity" >
                    <el-radio-group v-model="dataList.maturity">
                        <el-radio v-for="item in maturityList" :key="item.dropdownKey" :label="Number(item.dropdownKey)">{{item.dropdownValue}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="交易方式：" prop="tradeType">
                    <el-checkbox-group v-model="dataList.tradeType" @change="handleCheckChange">
                        <el-checkbox                        
                            v-for="item in ransferList"
                            :key="item.dropdownKey"
                            :disabled="item.disabled"
                            :label="item.dropdownKey">
                            {{item.dropdownValue}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="交易价格：" prop="tradePrice">
                    <el-input type="number" min="0" v-model="dataList.tradePrice" :disabled="isNegotiation" style="width:300px" ></el-input>&nbsp;-万元&nbsp;&nbsp;&nbsp;
                    <el-checkbox label="面议" :disabled="havePrice" ref="priceType" v-model="isNegotiation " ></el-checkbox>
                </el-form-item> 
                <el-form-item label="显示状态：" prop="status" >
                    <el-radio-group v-model="dataList.status" >
                        <el-radio v-for="(item,index) in showStatusList" :key="index" :label="index+1">{{item}}</el-radio>
                    </el-radio-group>
                </el-form-item>  
                <div style="display:flex;justify-content:start">
                    <!-- :class="{'img-checked':haveImg}" -->
                    <span style="color:red">*</span>&nbsp;
                    <el-form-item style="position:relative;top:-8px" label="图片资料：" prop="coverImg">                    
                        <div >
                        <div class="prompt">
                            <p>1.上传相关图片可获得更多重点推荐机会，图片选择“展示”会在技术成果详情页进行展示，否则仅用于后台审核。</p>
                            <p>2.图片最多6张，格式为jpg，png或gif，大小控制在2M以内。</p>
                            <p>3.图片建议：专利证书或专利申请书图片、技术图纸、样品图片、技术相关网络图片;成熟度处于非研发阶段的项目，必须上传样品图片，如未上传，成熟度将视为处在研发阶段。</p>
                        </div>       
                        <el-upload style="margin-bottom:30px"
                            :headers="headers"
                            action="wtcrm/file/upload"
                            list-type="picture-card"
                            :disabled="fileList.length>6"
                            :limit="6"
                            multiple
                            accept=".jpg,.jpeg,.png,.gif"
                            :before-upload="checkFile"
                            :on-exceed="handleExceed"
                            :on-success="handleSuccess"                                                 
                            :file-list="fileList"                           
                            >
                            <el-button slot="default" :disabled="fileList.length>4" size="small" type="primary">点击上传</el-button>
                            <div  slot="file" slot-scope="{file}"> 
                                <div class="imglist" v-if="file.picture" >   
                                    <span class="el-upload-list__item-actions">                                           
                                        <span                                        
                                        class="el-upload-list__item-delete"
                                        @click="handleRemove(file)"
                                        >
                                        <i class="el-icon-delete"></i>
                                        </span>
                                    </span>                
                                    <img v-if="file.picture.data.match(/icon/)" style="width:170px;height:100px" :src="imgUrl+file.picture.data" alt="加载失败">
                                    <img v-else style="width:170px;height:100px" :src="yaguImgUrl+file.picture.data" alt="加载失败">
                                    <div >
                                        <el-checkbox  v-model="file.isShow" :disabled="file.disabled">展示</el-checkbox>
                                        <!-- <el-checkbox  v-model="file.isCover" @change="changeStatus">设为封面</el-checkbox>     -->
                                        <el-radio @change="changeRadio" v-model="imgShow" :label="file.picture.data">设为封面</el-radio>  
                                    </div>                           
                                </div>                                                      
                            </div>
                        </el-upload>
                        <div v-if="dataList.technologyType" class="cover-img">
                            <span>封面图库</span>
                            <div class="default-img">
                                <img class="img-size" :src="imgUrl+defaultImg" >
                                <el-checkbox v-model="defaultChecked" @change="changeCheck">设为封面</el-checkbox>
                            </div>
                        </div>
                        </div>
                        <span v-if="!haveImg" class="checked-img">请设置封面图片</span>
                    </el-form-item>
                </div>                                                
                <el-form-item label="技术描述：" prop="technicalDesc">
                <div>
                    <tinymce-editor 
                        v-model="dataList.technicalDesc" 
                        @getEditorValue="getChildEditor"  
                        @limit='limitNum' >
                    </tinymce-editor>
                </div>
                </el-form-item>               
                <div class="title desc">备注</div>
                <el-form-item label="备注：" prop="remark" >
                    <el-input type="textarea" 
                    v-model="dataList.remark"
                    cols="5"
                    rows="6"
                    maxlength="200" 
                    show-word-limit></el-input>
                </el-form-item>
                <div v-if="id" class="button">
                    <el-button size="medium " v-preventReClick @click="submitForm('achievementForm')" type="primary">保存</el-button>
                    <el-button size="medium " type="primary" @click="preview('achievementForm',1)">预览</el-button> 
                    <el-button size="medium " type="warning" @click="cancle()">取消</el-button>   
                </div>
                <div v-else class="button">
                    <el-button size="medium " v-preventReClick @click="submitForm('achievementForm')" type="primary">提交</el-button>
                    <el-button size="medium " type="warning" @click="preview('achievementForm',2)">预览</el-button>                                    
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
import { clearDetail } from "@/util/clearDetail"
import {transmitPrice,receivePrice} from '@/util/price.js';
import store from "@/store";
import { getDetails } from "@/api/achievement/index";
import tinymceEditor from "@/views/project/ip-service/tinymceEditor";
import {getArea} from '@/api/clue/clue' 
import {getType,getIndustryList,addAchievement,checkAchievementName,editAchievement,checkAchievementNameEdit} from '@/api/achievement/create'
export default {
    components:{ tinymceEditor },
    props: ['id',"isEditor"],
    data(){
        var checkImg=(rule,value,callback)=>{
            if(this.defaultChecked){
                return callback();
            }else{
                if(this.fileList){
                let haveCover =false;
                this.fileList.forEach(item=>{
                    if(item.isCover){
                        haveCover =true;
                    }
                })
                console.log(haveCover,111111)
                if(haveCover){
                    return callback();
                }else{
                    callback(new Error('请设置封面图片'));
                }
            }else{
                callback(new Error('请设置封面图片'));
            }
            }
            
        };
        var checkChoice = (rule, value, callback) => {
            if (!value && !this.isNegotiation) {
                // return callback(new Error(this.isNegotiation));
                return callback(new Error('请输入交易价格'));
            } 
            if(value){
                const reg = /^(?!0\d|[0.]+$)\d+(\.\d{1,2})?$/
                if (reg.test(value)) {
                  callback();
                } else {
                  callback(new Error('请输入有效金额(大于0且不超过小数点后两位,如:88,88.5)'));
                }
            }else{
                callback();
            }                             
        };
        var checkName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('请输入成果名称'));
            }else {                
                if(this.id){
                    checkAchievementNameEdit(value,this.id).then(res=>{
                        if(res.data.code==0){ 
                            callback(); 
                        }else{
                           callback(new Error('此成果名称已存在，请重新输入'));                                                                              
                        } 
                    })
                }else{
                    checkAchievementName(value).then(res=>{
                        if(res.data.code==0){ 
                             callback(); 
                        }else{
                           callback(new Error('此成果名称已存在，请重新输入'));                                                                              
                        } 
                    })
                }
            }                                                                                                         
        };
        return {
            yaguImgUrl:process.env.VUE_APP_YAGU_IMAGE_BASEURL,
            coverUrls:[],
            imgShow:"",
            dataList:{
                technologyAbstract:'',
                industry:[],
                technologyType:'',
                tradeType:[],
                tradeTypeValues:'',
                content:'', 
                achievementName:'',
                tradePrice:null,
                priceType:false,
                area:'',
                maturity:null,
                technicalDesc:'',
                remark:'',
                status:1,
                editStatus:''
            },
            haveImg:true,
            params:{},
            havePrice:false,
            limit :true,
            defaultCover:[],
            isNegotiation:false,//面议
            imgUrl:process.env.NODE_ENV == "production"?"//static.wotao.com/":"//static-tst.wotao.com/",          
            defaultImg:'',
            defaultChecked:false,
            technologyTypeList:[],
            isCoverList:[],
            industryData:[],
            areaList:[],
            maturityList:[],
            ransferList:[],
            showStatusList:["上架","下架"],
            headers: {
                Authorization: "Bearer " + store.getters.access_token,
            },
            fileList:[],
            rules:{
                achievementName:[
                    {required: true,validator:checkName, trigger: 'blur' },
                    {max: 30, message: '长度小于30个字符', trigger: 'blur' }
                ],
                technologyAbstract:[
                    { required: true, message: '请输入技术摘要', trigger: 'blur' },
                    { max: 160, message: '长度小于160个字符', trigger: 'blur' }
                ],
                technologyType:[
                    { required: true, message: '请选择技术类型', trigger: 'change' }
                ],            
                industry:[
                    { required: true, message: '请选择所属行业', trigger: 'change' }
                ],
                area:[
                    { required: true, message: '请选择所在地', trigger: 'change' }
                ],
                maturity:[
                    { required: true, message: '请选择成熟度', trigger: 'change' }
                ],
                tradeType:[
                    { required: true, message: '请选择交易方式', trigger: 'change' }
                ],        
                technicalDesc:[
                    { required: true, message: '请输入技术描述', trigger: 'blur' }
                ],
                tradePrice:[{ required: true,validator:checkChoice, trigger: 'change'}],
                status:[{ required: true, trigger: 'change'}],
                // coverImg:[{required: true, validator:checkImg, trigger: 'change'}]
            },
            areaTxt:'',
            technologyTypeTxt:'',
            industryTxt:'',
            maturityTxt:'',
            tradeTypeTxt:'',
        }
    },
    computed:{
        getNegotiation(){
            return this.isNegotiation;
        },
        //是否选择封面图库
        getDefaultChecked(){
            return this.defaultChecked;
        },        
    },
    mounted(){
        this.getDropData()  
        this.getEditor()  
    },
    methods:{
        ceshi(val){
            this.$nextTick(()=>{
                this.areaTxt = this.$refs['myCascader'].getCheckedNodes()[0].pathLabels.join('-');
            })
        },
        changeStatus(){
            console.log(this.fileList,"cehsfa111")
            this.fileList.forEach((item,index)=>{
                if(item.isCover){
                    this.defaultChecked=false
                    if(item.isCover!=this.isCoverList[index]){
                        for(let i=0;i<this.fileList.length;i++){
                            if(i!=index){
                                this.fileList[i].isCover=false;
                                this.fileList[i].disabled=false;
                            }else{
                                this.fileList[i].disabled=true;
                            }
                        }                                               
                    }
                }               
            })
            this.isCoverList=this.fileList.map(item=>{
                return item.isCover
            })
        },
        // 下拉框选项数据
        getDropData(){   
            // 技术类型
            let technologyType = new FormData();   
            technologyType.append("type","technologyType");
            getType(technologyType).then(res=>{
                console.log(res,"sss")
                this.technologyTypeList=res.data.data
            }).catch(err=>{
                return err;
            });
            // 成熟度
            let maturity = new FormData();   
            maturity.append("type","maturity");
            getType(maturity).then(res=>{
                console.log(res,"sss")
                this.maturityList=res.data.data
            }).catch(err=>{
                return err;
            });
        //交易方式 
            let tradeType = new FormData();   
            tradeType.append("type","tradeType");
            getType(tradeType).then(res=>{
                console.log(res,"jish")
                this.ransferList=res.data.data
                this.ransferList.forEach(item=>{
                    item.disabled = false
                })
                console.log(this.ransferList,"ransferListransferListransferListransferList")
            }).catch(err=>{
                return err;
            });
            getIndustryList('industrytype').then(res=>{                
                this.industryData=res.data.data[0].options
            }).catch(err=>{
            return err;
            });
            //所在地
            getArea().then(res=>{//地区
                let areaList = res.data.data;        
                for(var i = 0; i <areaList.length; i++){
                    let newList=[];
                    for(var j = 0; j <areaList[i].children.length; j++){                
                    newList.push({
                        areaName:areaList[i].children[j].areaName,
                        id:areaList[i].children[j].id,
                        nodeNumber:areaList[i].children[j].nodeNumber,
                        parentId:areaList[i].children[j].parentId
                    })
                    }            
                areaList[i].children=newList;
                }
                this.areaList=areaList                             
            }).catch(err=>{
            return false;
            });
        },
        //编辑回显数据
        getEditor(){
            if(this.id){               
                let param = new FormData();
                param.append('id',this.id);
                getDetails(param).then(res => {                                    
                    this.dataList = res.data.data;                   
                    this.fileList = [];
                    res.data.data.coverUrls.forEach(item=>{                                          
                        if(item.type == 1){
                            this.defaultImg=item.picture;                                                   
                            if(item.isCover == 1){
                                this.defaultChecked=true;
                            }
                        }else{
                            this.fileList.push({
                            isCover:item.isCover==1?true:false,
                            disabled:false,
                            isShow:item.isShow==1?true:false,
                            picture:{
                                data:item.picture
                            },
                            response:{
                                data:item.picture
                            }
                        })
                        this.imgShow = ""
                        this.fileList.forEach(val=>{
                            if(val.isCover==1){
                            this.imgShow = val.picture.data
                        }
                        })
                        this.defaultChecked=false
                        }                                
                        console.log(this.imgShow,"this.imgShow")                              
                    })                     
                    this.dataList.tradePrice=this.dataList.tradePrice?receivePrice(this.dataList.tradePrice,2):null                                                     
                    this.isNegotiation=this.dataList.priceType==1?true:false
                    this.dataList.tradeType=this.dataList.tradeType.split(',')                
                    let industryList=res.data.data.industry.split(',');
                    this.dataList.industry=industryList.map(item=>{
                        return  Number(item)
                    })
                    let areaList=res.data.data.area.split(',');
                    this.dataList.area=areaList.map(item=>{
                        return  Number(item)
                    }) 
                })                              
            }
        },
        //技术类型
        technologyChange(val){
            this.$nextTick(()=>{
                this.technologyTypeTxt = this.$refs.a.selectedLabel;
            })
        },
        handleCheckChange(val){           
            let a=val.some(item=>{return item=="key5" })
            if(val.some(item=>{return item=="key5" })){
                for(let i=0;i<this.ransferList.length-1;i++){
                    this.ransferList[i].disabled=true;
                }
                this.dataList.tradeType=["key5"];
            }else{
                for(let i=0;i<this.ransferList.length-1;i++){
                    this.ransferList[i].disabled=false;
                }                
            }
            this.$forceUpdate()
        },
        // 上传图片事件组
        //删除图片
        handleRemove(file) {
            console.log(file);
            this.fileList.forEach((item,i)=>{
                if(item.picture==file.picture){
                    this.fileList.splice(i,1)
                }
            })
        },
        checkFile(file){
            let exName=file.name.substr(file.name.lastIndexOf("."))
            console.log(exName,223425)
            if(file.size/1024 > 2*1024){
                this.$message({
                type:"warning",
                message:"上传的图片不得超过2M！",
                offset:300
                })
                return false;
            }else{
                return true;
            }
        },
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择 6 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleSuccess(response, file, fileList){           
            if(!this.defaultChecked&&this.fileList == 0){
                if(fileList[0].response&&fileList[0].response.data){
                this.imgShow = fileList[0].response.data
            }
            }
            this.fileList = fileList
            this.fileList.forEach(item=>{
                item.picture = item.response
                item.isCover = item.response.data == this.imgShow?true:false
                item.isShow = true
                item.disabled = false
            })
            console.log(this.imgShow,"fileList")
            console.log(fileList,"fileList")
            console.log(this.fileList,"输出fileList")
            this.isCoverList=this.fileList.map(item=>{
                return item.isCover
            })
            // console.log(this.isCoverList,99999)
        },                                                  
        changeCheck(){
            if(this.defaultChecked){
                this.imgShow = ""
            }else{
                this.imgShow = this.fileList[0].response.data
            }
        },
        changeRadio(val){
            console.log(val,"val")
            console.log(this.imgShow,"imgShow")
            if(this.imgShow!==""){
                this.defaultChecked = false
            }
        },
        getChildEditor(data) {
            this.dataList.technicalDesc = data;
            console.log(this.dataList.technicalDesc,"desc")
        },
        limitNum(val){
            this.limit = val;
        },       
        //表单操作
        //取消
        cancle(){
            this.$emit('update:isEditor',false)             
        },
        // 提交
        submitForm(formName,isPreview) {            
            this.coverUrls=[];
            console.log(this.fileList,"this.fileList")
            this.fileList.forEach((item,index)=>{                        
                this.coverUrls.push({
                isCover:this.imgShow == item.response.data? 1:0,
                isShow:item.isShow==true?1:0,
                picture:item.picture.data,
                type:0,
                })
            })  
            if(this.defaultChecked){
                this.coverUrls.push({
                isCover:this.defaultChecked==true? 1:0,
                isShow:this.defaultChecked==true? 1:0,
                picture:this.defaultImg,
                type:1,
                })    
            }
            if(this.coverUrls.length >0){
              this.$refs[formName].validate((valid) => {                
                if (valid) {                     
                    let params=Object.assign( {}, this.dataList )
                    params.tradePrice=params.priceType?null:transmitPrice(params.tradePrice,2);
                    params.industry=params.industry==[]?'':params.industry.join(',');
                    params.area=params.area==[]?'':params.area.join(',');
                    params.tradeType=params.tradeType==[]?'':params.tradeType.join(',');
                    params.priceType=params.priceType?1:0;                        
                    console.log(this.coverUrls,'this.coverUrls')                    
                    params.coverUrls=this.coverUrls
                    console.log('1111')                   
                        if(this.id){
                        params.id=this.id
                        editAchievement(params).then(res=>{
                           if(res.data.code==0){
                                this.$message({
                                    message: '修改成功',
                                    type: 'success'
                                    });
                                clearDetail('/project/technological-achievements')    
                                setTimeout(
                                    this.$router.push({
                                    path:'/project/technological-achievements',                                
                                }), 4000)                                
                            }   
                        })
                    }else{
                        addAchievement(params).then(res=>{
                            if(res.data.code==0){
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                    });
                                clearDetail('/project/technological-achievements')       
                                setTimeout(
                                    this.$router.push({
                                    path:'/project/technological-achievements',                                
                                }), 4000)                                
                            }                    
                        })
                    }                                                          
                } else {
                    this.$message({
                        message: '信息填写不正确，请检查表单',
                        type: 'error',
                        duration:4000,
                        offset:160
                        });
                    return false;
                }                
            });
            } else{
                this.$message({
                        message: "请上传封面图片！",
                        type: 'warning',
                        duration:4000,
                        offset:160
                        });
            }                        
        },
        preview(formName,num){
                this.coverUrls=[];
                    console.log(this.fileList,"this.fileList")
                    this.fileList.forEach((item,index)=>{                        
                       this.coverUrls.push({
                        isCover:this.imgShow == item.response.data? 1:0,
                        isShow:item.isShow==true?1:0,
                        picture:item.picture.data,
                        type:0,
                       })
                    })  
                    if(this.defaultChecked){
                        this.coverUrls.push({
                        isCover:this.defaultChecked==true? 1:0,
                        isShow:this.defaultChecked==true? 1:0,
                        picture:this.defaultImg,
                        type:1,
                       })    
                    }
            if(this.coverUrls.length >0){
                this.$refs[formName].validate((valid) => {                
                    if (valid ) {                 
                        if(num ==1){
                                let params=Object.assign( {}, this.dataList )
                                params.industry=params.industry==[]?'':params.industry.join(',');
                                params.area=params.area==[]?'':params.area.join(',');
                                params.tradeType=params.tradeType==[]?'':params.tradeType.join(',');
                                params.priceType=params.priceType?1:0;                        
                                params.coverUrls=this.coverUrls
                                sessionStorage.setItem('previewDetai',JSON.stringify(params))
                                window.open('/#/preview-shopresult','_blank')   
                    
                        }else{
                            let params=Object.assign( {}, this.dataList )
                            params.industry=params.industry==[]?'':params.industry;
                            params.area=params.area==[]?'':params.area;
                            params.tradeType=params.tradeType==[]?'':params.tradeType;
                            params.priceType=params.priceType?1:0;   

                            params.areaTxt = this.areaTxt;
                            params.technologyTypeTxt = this.technologyTypeTxt;
                            // 成熟度
                            let maturityList = this.maturityList
                            maturityList.forEach(item=>{
                                if(item.dropdownKey == this.dataList.maturity){
                                    this.maturityTxt = item.dropdownValue
                                }
                            })
                            params.maturityTxt = this.maturityTxt; 
                            // 所属行业
                            let a = []
                            let industryData = this.industryData
                            industryData.forEach(item=>{
                                if(params.industry.includes(item.id)){
                                    a.push(item.name)
                                }
                            })
                            this.industryTxt = a.join(',') 
                            params.industryTxt = this.industryTxt
                            // 交易方式
                            let b = []
                            let ransferList = this.ransferList
                            ransferList.forEach(item=>{
                                if(params.tradeType.includes(item.dropdownKey)){
                                    b.push(item.dropdownValue)
                                }
                            })
                            this.tradeTypeTxt = b.join(';') 
                            params.tradeTypeTxt = this.tradeTypeTxt                                            
                            params.coverUrls=this.coverUrls
                            sessionStorage.setItem('previewDetai',JSON.stringify(params))
                            window.open('/#/preview-shopresult','_blank')   
                        }                                                                                                 
                    }else {
                        this.$message({
                        message: '信息填写不正确，请检查表单',
                        type: 'error',
                        duration:4000,
                        offset:160
                        });
                        return false;
                    }                
            });
            }else{
                this.$message({
                        message: "请上传封面图片！",
                        type: 'warning',
                        duration:4000,
                        offset:160
                });
            }               
        }
    },
    watch: {
        'dataList.technologyType'(val){
           this.technologyTypeList.forEach(item=>{
               if(val==item.dropdownKey){
                   this.defaultImg=item.dropdownDesc
               }              
           })
            deep: true
        },  
        'dataList.tradePrice'(val){
            if(val){
            this.havePrice=true;    
            }else {
                this.havePrice=false
            }
            deep: true
        },                         
        getNegotiation(val){
            this.dataList.priceType=val?1:0            
        },
        getDefaultChecked(val){
            if(val){
                for(let i=0;i<this.fileList.length;i++){
                    this.fileList[i].isCover=false;
                    this.fileList[i].disabled=false;
                }
            }
        },        
    }, 
}
</script>

<style scoped>
.checked-img{
    color:red;
    font-size:12px;
    margin-bottom:20px
}
.achievement{
    width:100%;   
    padding-top :20px;
    padding-bottom :20px;
    margin-left: 10px;
    background :#fff;
}    
.content{
    width:80%;
    margin-left: 5%;
}       
.title{
    padding-left :18px ;
    margin-top: 30px;
    border-left :10px solid #3D85DC;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:bold;   
    color:rgba(51,51,51,1);
}
.desc{
    margin-top: 60px;
    margin-bottom: 50px;
    position:relative;
    left:-30px
}
.achievement-form{
    margin-top:30px;
    margin-left:20px;
}
.prompt{
    width :100%;
    margin :20px auto;
    font-size:14px;
    font-family:Microsoft YaHei;
    font-weight:400;
    line-height:20px;
    color:rgba(110,166,233,1);
}
    
.buttons{
    margin-left:40%
}
           
.module-con{
    width: 100%;
    margin: 30px auto;
    display: flex;
}
            
.consult-img{
    margin: 20px auto
}
               
.member-wrapper{
    margin-top:10px;
    width: 100%;
    display: inline-block;
}
                
.member-last{
    margin-right: 0 !important
}
                    
.member-list{
    list-style: none;
    text-align :center;
    background:rgba(255,255,255,1);
    width: 170px;
    height:200px;
    float: left;
    margin-left:20px;
    margin-bottom: 10px;
}                   
.photo{
    width:170px;
    height:170px;
    background:rgba(255,255,255,1);
    box-shadow:0px 0px 6px rgba(0,0,0,0.16);
    opacity:1;
}
                    
.photo img{
    width:170px;
    height:170px;
    background:rgba(255,255,255,1);
    border:1px dashed rgba(110,166,233,1);
    opacity:1;
}
.releaseBtn{
    margin-left:40%;
}
.cover-img{
    margin-bottom:40px
}

.default-img{
    width:140px;
    display:flex;
    flex-direction: column;
    align-items: center;
}
.img-size{
    width:140px;
    height:82px;
}
.imglist{
    height:200px;
}
.button{
    margin:100px auto;
    width:240px;
    display: flex;
    justify-content: space-around;
}

</style>
<style >
.achievement .el-upload-list--picture-card .el-upload-list__item{ 
    width:170px;
    height:150px;
    border:none;
    border-radius: 0;
    margin-right:30px

}
.achievement .el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border-radius: 6px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 170px;
    height: 100px;
    line-height: 100px;
    vertical-align: top;
}
.achievement .el-upload-list--picture-card .el-upload-list__item-actions {
    position: absolute;
    width: 100%;
    height: 100px;
    left: 0;
    top: 0;
    cursor: default;
    text-align: center;
    color: #fff;
    opacity: 0;
    font-size: 20px;
    background-color: rgba(0,0,0,.5);
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
}
</style>