

  //工作台权限
  function filterPer(imgList){
    let obj = Object.keys(JSON.parse(sessionStorage.getItem('pigx-permissions')).content);
    return imgList.filter(item => Object.keys(item.Privilege).some(el => obj.some(i =>i ==  el )))
  }
// 拼接接口
  function insertStr(soure, firstPosition, firstStr) {
  return   soure = soure.slice(0, firstPosition) + firstStr + soure.slice(firstPosition)
  } 
  /**
   * @param str 拼接接口
   * @param Interface 接口
   * @param strLength 截取数量
   * @param num 判断数量
   * 
   * ***/
  function filterPort(num, str, Interface, strLength){
    if( num ==1){
    return  insertStr(Interface,strLength,str+'/')
    }else if(num ==2){
      return  insertStr(Interface,strLength,'/'+str)
    }
    else{
      return Interface + str
    }
  }
  function titleCase(str) {
    return  str.slice(0,1).toUpperCase() +str.slice(1).toLowerCase();
  }
export {
  titleCase,
  filterPort,
  filterPer
}

