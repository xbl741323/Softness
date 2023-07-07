exports.install = function (Vue) {
  var lastTime = 0;//初始时间戳
  Vue.prototype.throttle = function (intervalTime) {
    //获取当前时间的时间戳
    let now = new Date().valueOf();
    if(lastTime == 0 || (now- lastTime) > intervalTime){
      //重置上一次点击时间，intervalTime是我自己设置的间隔时间，根据自己的需要传参
      lastTime = now;
      return true;
    }else{
      return false;
    }
  }
}