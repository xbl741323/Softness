<template >
    <div class="index_whole">
        <!-- banner -->
        <div class="img_box banner">
            <img src="@/assets/images/cgpj/banner_chengguo@3x.png" />
        </div>

        <!-- 定义 -->
        <div class="index_box">
            <h3 class="index_tit"><span>科技成果评价定义</span></h3>
            <p>科技成果评价是通过国家专业机构组织权威专家依照规定程序和标准，对科技成果进行审查与辨别，对其科学性、创造性、先进性、可行性和应用前景等进行科学客观全面评价，最终形成权威评价结果</p>
            <div class="img_box index_img">
                <img src="@/assets/images/cgpj/img01-cgpj@3x.png" />
            </div>
            <div class="button" @click="showMeiqia">立即咨询</div>
        </div>

        <!-- 好处 -->
        <div class="index_box">
            <h3 class="index_tit title_lower"><span>科技成果评价好处</span></h3>
            <div class="good_box grey">
               <div class="good_bor" >
                    <p class="bor" v-for="(item, index) in advArr" :key="index">
                        <img :src="require('@/assets/images/cgpj/' + item.imgUrl)">
                        <span>{{item.title}}</span>
                    </p>
                </div>
            </div>
        </div>

        <!-- 内容 -->
        <div class="index_box grey">
            <h3 class="index_tit title_lower"><span>科技成果评价内容</span></h3>
            <div class="tabs_head">
                <p @click="cur=0" :class="{tabs_cur:cur==0}"><img src="@/assets/images/cgpj/icon01_cgpj@3x.png" alt=""><span>评价对象</span></p>
                <p @click="cur=1" :class="{tabs_cur:cur==1}"><img src="@/assets/images/cgpj/icon02_cgpj@3x.png" alt=""><span>评价范围</span></p>
                <p @click="cur=2" :class="{tabs_cur:cur==2}"><img src="@/assets/images/cgpj/icon03_cgpj@3x.png" alt=""><span>评价指标</span></p>
                <p @click="cur=3" :class="{tabs_cur:cur==3}"><img src="@/assets/images/cgpj/icon04_cgpj@3x.png" alt=""><span>评价资料</span></p>
            </div>
            <div class="tabs_body">
                <p v-if="cur==0">由组织或个人完成的各类科学技术项目所产生的具有一定学术价值或应用价值，举办科学性、创造性、先进性等属性的新发现、新理论、新方法、新技术、新产品、新品种和新工艺等</p>
                <p v-if="cur==1">技术开发类应用技术成果 社会公益类应用技术成果 <br/>软科学研究成果</p>
                <p v-if="cur==2">技术创新程度 技术难度和复杂程度<br/> 经济效益或社会效益 技术经济指标的先进程度<br/> 技术重现性和成熟度<br/> 技术创新对推动科技进步和提高市场竞争能力的作用</p>
                <p v-if="cur==3">技术研究报告 科技查新报告<br/> 产品检测报告 成果应用报告<br/> 成果知识产权情况 经济、社会效益分析报告</p>
            </div>
        </div>

        <!-- 流程 -->
        <div class="index_box">
            <h3 class="index_tit title_lower"><span>科技成果评价流程</span></h3>
            <div class="img_box img_loc">
                <img src="@/assets/images/cgpj/img04_cgpj@3x.png" alt="">
            </div>
        </div>
    </div>   
</template>

<script>
export default {
     head () {
        return {
     title: "卧涛科技-权威科技成果评价机构",    
     meta: [
        { charset: "utf-8" },
        {
          name: "keywords",
          content:
            "科技成果评价,科技成果鉴定,科技成果登记"
        },
        {
          hid: "description",
          name: "description",
          content:
            "卧涛科技，权威科技成果评价机构。提供科技成果评价、科技成果鉴定、科技成果登记等科技服务。技术成果评价就上卧涛网！"
        }
      ],
    }
  },
     data () {
         return{
              cur:0,
              advArr:[
                  {
                      title:"行业认可",
                      imgUrl:"icon_cgpj01@3x.png",
                  },
                  {
                      title:"佐证材料",
                      imgUrl:"icon_cgpj02@3x.png",
                  },
                  {
                      title:"证明材料",
                      imgUrl:"icon_cgpj03@3x.png",
                  },
                  {
                      title:"优化成果",
                      imgUrl:"icon_cgpj04@3x.png",
                  },
                  {
                      title:"政策支持",
                      imgUrl:"icon_cgpj05@3x.png",
                  },
                  {
                      title:"项目政策",
                      imgUrl:"icon_cgpj06@3x.png",
                  },
                  {
                      title:"技术交易",
                      imgUrl:"icon_cgpj07@3x.png",
                  },
                  {
                      title:"结题验收",
                      imgUrl:"icon_cgpj08@3x.png",
                  },
              ],
         }
     },
     methods: {
         showMeiqia() {
          var _53 = $53.createApi(); /*开发者文档1.1 创建SDK资源对象*/
          _53.push("cmd", "mtalk");
          _53.query();
      },
     },
     layout: "footer",   
    
};
</script>

<style scoped>
.index_whole {
    color: #333333; 
    font-size: 0.32rem;
    background: #Eff2f3;
    padding-bottom: 1.33333333333rem;
}
.banner {
    width: 100%;
}
.img_box img {
    display: block;
    width: 100%;
}
.index_box {
    margin-bottom: 0.32rem;
    background:#FFFFFF;
    padding: 0.21333333333rem 0.42666666666rem;
}
.grey {
    background: #EFF2F3;
}
.index_tit {
    text-align: center;
    font-size: 0.42666666666rem;
    color: #333333;
    line-height: 0.53333333333rem;
    padding-bottom: 0.42666666666rem;
    font-weight: bold;
}
.title_lower {
    padding-bottom: 0.42666666666.rem;
}
.index_tit span {
    position: relative;
    display: inline-block;
}
.index_tit span::before,
.index_tit span::after {
    content: "";
    position: absolute;
    width: 0.8rem;
    height: 0.05333333333rem;
    top: 0.24rem;
}
.index_tit span::before {
    left: -38px;
    background: linear-gradient(270deg, #36A6FE 0%, rgba(187, 218, 242, 0) 100%);
}
.index_tit span::after {
    right: -38px;
    background: linear-gradient(90deg, #36A6FE 0%, rgba(187, 218, 242, 0) 100%);
}
.index_box p {
    font-size: 0.32rem;
    color: #999999;
    line-height: 0.53333333333rem;
}
.index_img {
    width: 75%;
    margin: -0.16rem auto 0.48rem;
}
.button {
  height:0.85333333333rem;
  background: #36A6FE;
  border-radius:0.53333333333rem;
  display: block;
  width: 100%;
  line-height: 0.58666666666rem;
  font-size: 0.42666666666rem;
  box-sizing: border-box;
  padding: 0.13333333333rem;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  margin-bottom: 0.64rem;
}
.good_box{
    display: flex;
    justify-content: space-around;
}
.good_box .good_bor p {
    display: inline-block;
    width: 25%;
    text-align: center;
    padding: 0.29333333333rem 0 0.32rem;
}
.good_box .good_bor p span {
    display: block;
    font-size: 0.32rem;
    color: #333333;
    line-height: 0.37333333333rem;
}
.good_box .good_bor img {
    display: block;
    width: 36%;
    margin: 0 auto 0.16rem;
}
.good_box{
    border-radius: 0.16rem;
}
.good_box .good_bor p span{
    color: #666666;
    line-height: 0.56rem;
}
.bor{
    border-right: 1px solid #E7E6EB;
    border-bottom: 1px solid #E7E6EB;
}
.good_bor p:nth-last-child(1){
    border: none;
}
.good_bor p:nth-last-child(2){
    border-bottom:none;
}
.good_bor p:nth-last-child(3){
    border-bottom:none;
}
.good_bor p:nth-last-child(4){
    border-bottom:none;
}
.good_bor p:nth-last-child(5){
    border-right:none;
}
.good_box .good_bor p{
    height: 80px;
}
.img_loc {
    padding: 0.10666666666rem 0 0.02133333333rem;
}
.tabs_head {
    display: flex;
    justify-content: space-between;
}
.tabs_cur{
    border-radius: 0.16rem 0.16rem 0 0;
}
.tabs_head p {
    display: inline-block;
    width: 21%;
    text-align: center;
    padding: 0.21333333333rem 0 0.32rem;
}
.tabs_head p.tabs_cur {
    background: #ffffff;
}
.tabs_head p span {
    display: block;
    font-size: 0.32rem;
    color: #333333;
    line-height: 0.37333333333rem;
}
.tabs_head img {
    display: block;
    width: 36%;
    margin: 0 auto 0.16rem;
}
.tabs_body {
    background: #ffffff;
    padding: 0.42666666666rem 0.21333333333rem;
    border-radius: 0 0.16rem 0.16rem 0.16rem;
}
.tabs_body p {
    color: #999999;
    font-size: 0.32rem;
    line-height: 0.53333333333rem;
}
</style>
