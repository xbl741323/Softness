(function() {
    console.log("判断移动端");
    var sUserAgent = navigator.userAgent.toLowerCase();
    if (/ipad|iphone|midp|rv:1.2.3.4|ucweb|android|windows ce|windows mobile/.test(sUserAgent)) {
        console.log("移动端");
        //跳转移动端页面
        // window.location.replace("http://web-mobile.wotao.com/");//跳转后没有后退功能 
    } else {
        console.log("PC端");
        // window.location.replace("http://web-test.wotao.com/")
    }
})();