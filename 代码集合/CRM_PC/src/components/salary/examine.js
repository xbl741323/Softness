const typeList = [
  {value: 2, label:'行政指标'},
  {value: 3, label:'财务指标'},
  {value: 1, label:'业绩指标'},
]

function planType(val) {
  return val == 1 ? '业绩指标' : val == 2 ? '行政指标' : val == 3 ? '财务指标' : '';
}
function transferKey(val) {
  return val == 'key_1' ? '基础薪酬' : val =='key_2' ? '考勤' : val == 'key_3' ? '津贴' : val == 'key_4' ? '绩效' : val == 'key_5' ? '社保+公积金' : val == 'key_7' ? '其他' : '';
}

const operatorList = [
  {value:0, name:1, val: 1, calculatorType:'num'},
  {value:1, name:2, val: 2, calculatorType:'num'},
  {value:2, name:3, val: 3, calculatorType:'num'},
  {value:16, name:'+', val: '+', calculatorType:'sign'},
  {value:3, name:4, val: 4, calculatorType:'num'},
  {value:4, name:5, val: 5, calculatorType:'num'},
  {value:5, name:6, val: 6, calculatorType:'num'},
  {value:17, name:'-', val: '-', calculatorType:'sign'},
  {value:6, name:7, val: 7, calculatorType:'num'},
  {value:7, name:8, val: 8, calculatorType:'num'},
  {value:8, name:9, val: 9, calculatorType:'num'},
  {value:18, name:'*', val:'*', calculatorType:'sign'},
  {value:9, name:0, val: 0, calculatorType:'num'},
  {value:11, name:'.', val: '.', calculatorType:'sign'},
  {value:12, name:'%', val: '%', calculatorType:'sign'},
  {value:19, name:'/', val: '/', calculatorType:'sign'},
  {value:13, name:'(', val: '(', calculatorType:'sign'},
  {value:14, name:')', val: ')', calculatorType:'sign'},
  {value:15, name:'del'},
  {value:20, name:'清空'},
]

const headerList = [
  {value:1, label:'基础薪酬'},
  {value:2, label:'考勤'},
  {value:3, label:'津贴'},
  {value:4, label:'绩效'},
  {value:5, label:'社保+公积金'},
  // {value:6, label:'个税'},
  {value:7, label:'其他'},
  // {value:8, label:'预留'},
]




export default{
  typeList,
  operatorList,
  planType,
  headerList,
  transferKey
}