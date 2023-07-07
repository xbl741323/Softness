

import { signSelf, getEssAuthStatus} from '~/api/order'
export const sign = {
  data(){
    return {
      signPromptDialog: false,
      currentSignPromptDialog: false,
      signTitle:'',
      contractType: '',
      currentOrder: {}
    }
  },
  methods:{
    //contractType 合同类型（1：电子；2：纸质）
    signPrompt(row){
      this.currentOrder = row;
      this.contractType = row.contractType;
      if(row.contractType == 2 && row.contractScope != 3){
        this.signTitle = '合同正在审核中，有问题请联系业务经理'
        this.signPromptDialog = true;
      }else if(row.contractType == 1){
        this.signTitle = '当前您的签约方式为 "电子合同", 是否切换签约方式'
        this.currentSignPromptDialog = true;
      }else{
        this.signTitle = '当前您的签约方式为 "纸质合同", 是否切换签约方式'
        this.currentSignPromptDialog = true;
      };
    },
    essAuth(row, userInfo, statusValue){
      if (userInfo && userInfo.certifiedType == 1 && userInfo.autType == 2) {
        return this.$confirm('由于系统升级，电子签约前需要您更新为高级认证， 请您先认证！', '签约提示', {
          confirmButtonText: '去认证',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (userInfo.userType == 1) {
            this.$router.push("/member/authentication/authentication-personal");
          } else {
            this.$router.push("/member/authentication/authentication-unit");
          }
        }).catch(() => {

        });
      }
      if (userInfo && userInfo.certifiedType == 2 && userInfo.authorizedType != 2 && userInfo.autType == 2) {
        return this.$confirm('由于系统升级，电子签约前需要您进行高级授权， 请先去完成授权！', '签约提示', {
          confirmButtonText: '去授权',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (userInfo.userType == 1) {
            this.$router.push("/member/authentication/authentication-personal");
          } else {
            this.$router.push("/member/authentication/authentication-unit");
          }
        }).catch(() => {

        });
      }
      getEssAuthStatus().then(res=>{
        if(res.data.code == 0){
          if('0,1,4'.match(JSON.parse(res.data.data.status))){
            this.signDialog = false;
            this.essAuthDialog = true;
          }else if(res.data.data.status == 3){
            this.signDialog = false;
            window.open(res.data.data.authUrl,'_self');
          }else{
            let param = {
              orderId: row.id,
              returnUrl: statusValue != null ? process.env.PC_URL+'/member/order?statusValue='+statusValue : process.env.PC_URL+'/member/order'
            }
            signSelf(param).then(res=>{
              if(res.data.code == 0){
                if (statusValue != null) {
                  window.open(res.data.data);
                  window.open('/member/order?statusValue=1', '_self');
                } else {
                  window.open(res.data.data, '_self');
                }
                
              }else{
                this.$message({
                  type:'warning',
                  message: res.data.msg,
                  offset:100
                })
              };
            })
          }
        }
      })
    },
  }
}