import { getClueDetail} from '@/api/clue/clue'
const math = require('mathjs')

export default{

  timeRules:{//订单信息验证
    finishTime: [{required :true, message:'请选择交付时间',trigger:'blur'}],
    productCount: [{required: true, pattern: /^\+?[1-9]{1}[0-9]{0,2}\d{0,0}$/, message: '1-999的整数',trigger:'blur'}],
    agencyFee: [{pattern: /^\d{1,10}(\.\d{1,2})?$/, message: '最多十位整数,小数点取两位',trigger:'blur'}],
    thirdPartyFee: [{pattern: /^\d{1,10}(\.\d{1,2})?$/, message: '最多十位整数,小数点取两位',trigger:'blur'}],
    governmentFee: [{pattern: /^\d{1,10}(\.\d{1,2})?$/, message: '最多十位整数,小数点取两位',trigger:'blur'}]
  },

  info:[//线索信息头部
    {id: 1,name: '线索编号'},
    {id: 2,name: '线索名称'},
    {id: 3,name: '联系人'},
    {id: 4,name: '手机号'},
    // {id: 5,name: '客户归属'},
    // {id: 6,name: '线索归属'},
    {id: 7,name: '业务员'},
  ],

  expireTimeOption: {//日期选择限制
    disabledDate(date){
      return date.getTime() > Date.now();
    }
  },
  TimeOption: {//交付时间限制
    disabledDate(date){
      return date.getTime() < Date.now();
    }
  },

  tableOption:{//审核人表单
    emptyText: '取消',
    column:[
      {
        type: 'input',
        labelWidth: '70px',
        span: 5,
        fixed: true,
        label: '审核人',
        prop: 'auditor',
        search: true,
        slot: true,
        formslot: true,
        rules: [{
          required: true,
          message: '请选择审核人',
          trigger: 'blur'
        }]
      }
    ]
  },

  getClueDetails(id) {
    return getClueDetail({id:id}).then(res=>{
      return res.data.data
    })
  },

  getSummaries(param) {//产品价格合计
    const { columns, data } = param;
    const sums = [];
    let sum = 0;//代理费
    let governmentFee = 0;//官费
    let thirdPartyFee = 0;//第三方
    let agentPriceIndeterminate = 0;//待定数量
    let thirdPriceIndeterminate = 0;
    let govPriceIndeterminate = 0;
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = '总价';
        return;
      }else if(index === 1 || index === 8){
        return;
      }else if(index ===2){
        return ;
      }else if(index === 3){
        data.forEach(element => {
          if(element.agentTotalUncertain){
            agentPriceIndeterminate ++;
          }else{
            sum += Number(math.format(Number(element.agencyFee),14));
          }
        });
      }else if(index === 4){
        data.forEach(element => {
          if(element.thirdTotalUncertain){
            thirdPriceIndeterminate ++;
          }else{
            thirdPartyFee += Number(math.format(Number(element.thirdPartyFee),14));
          }
        });
      }else if(index === 5){
        data.forEach(element => {
          if(element.govTotalUncertain){
            govPriceIndeterminate ++;
          }else{
            governmentFee += Number(math.format(Number(element.governmentFee),14));
          }
        });
      } else if(index === 7){
        return;
      }
      const values = data.map(item => Number(item[column.property]));
      if (!values.every(value => isNaN(value))) {
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0);
      } else {
        sums[index] = '';
      }
    });
    if(agentPriceIndeterminate >0){
      sums[3] = '待定';
    }else{
      sums[3] = Number(math.format(sum,14)) ;
    }
    if(thirdPriceIndeterminate >0){
      sums[4] = '待定';
    }else{
      sums[4] = Number(math.format(thirdPartyFee,14));
    }
    if(govPriceIndeterminate >0){
      sums[5] = '待定';
    }else{
      sums[5] = Number(math.format(governmentFee,14));
    }
    if(thirdPriceIndeterminate >0 || govPriceIndeterminate >0 || agentPriceIndeterminate >0){
      sums[6] = '待定';
      this.constractSum = '待定';
    }else{
      sums[6] = Number(math.format(sum + thirdPartyFee + governmentFee,14));
      this.constractSum = Number(math.format(sums[6]*100,12));
    }
    // sums[2] = Number(math.format(sum,14));
    // sums[3] = Number(math.format(thirdPartyFee,14));
    // sums[4] = Number(math.format(governmentFee,14));
    // sums[6] = Number(math.format(sum + thirdPartyFee + governmentFee,14));
    // this.constractSum = Number(math.format(sums[6]*100,12));
    return sums;
  },
  getOrderSummaries(param) {//订单价格合计
    const { columns, data } = param;
    const sums = [];
    let totalAmount = 0;
    columns.forEach((column, index) => {
      if (index === 0) {
        sums[index] = '总价';
        return;
      }else if(index === 1 || index === 8 ||index ===2 || index === 3 || index === 4 || index === 5){
        return ;
      }else if(index === 6){
        data.forEach(element => {
          totalAmount += Number(math.format(Number(element.totalAmount),14));
        });
      } else if(index === 7){
        return;
      }
      const values = data.map(item => Number(item[column.property]));
      if (!values.every(value => isNaN(value))) {
        sums[index] = values.reduce((prev, curr) => {
          const value = Number(curr);
          if (!isNaN(value)) {
            return prev + curr;
          } else {
            return prev;
          }
        }, 0);
      } else {
        sums[index] = '';
      }
    });
    sums[6] = Number(math.format(Number(totalAmount/100) ,14));
    return sums;
  },
}
