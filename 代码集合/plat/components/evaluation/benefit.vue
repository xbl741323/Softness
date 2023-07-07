<template>
    <div class="evalution_benefit">
        <div class="benefit_main">
        <div class="benefit_title">成果评价好处</div>
        <div class="benefit_desc">科技成果转化是落实“科学技术是第一生产力”的关键</div>
        <div class="benefit_content">
            <div class="benefit_item" v-for="(item,index) in arr" :key="index">
            <div class="item_img">
                <img :src="require('@/assets/images/'+item.imgUrl)" alt />
            </div>
            <div class="item_title">{{ item.title }}</div>
            <div class="item_desc">{{ item.desc }}</div>
            </div>
        </div>
        <div class="benefit_btn" @click="toggle">立即咨询</div>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      arr: [
        {
          imgUrl: "cgpj/icon_cgpj01.png",
          title: "行业认可",
          desc: "通过行业权威专家的评价，有利于技术成果快速获得行业的认可"
        },
        {
          imgUrl: "cgpj/icon_cgpj02.png",
          title: "佐证材料",
          desc:
            "评价报告是申报国家科技成果登记，推荐国家、地方及行业科技奖励的重要佐证材料"
        },
        {
          imgUrl: "cgpj/icon_cgpj03.png",
          title: "证明材料",
          desc:
            "在技术交易、合作中消除交易双方的信息不对称，减少沟通谈判成本，提高交易效率"
        },
        {
          imgUrl: "cgpj/icon_cgpj04.png",
          title: "优化成果",
          desc:
            "各领域专家参与的技术成果评价，为产品和技术的改进、提升案，指明了完善的方向"
        },
        {
          imgUrl: "cgpj/icon_cgpj05.png",
          title: "政策支持",
          desc:
            "《“十三五”国家科技创新规划的通知》中把第三方评价成果作为财政科技经费支持的重要依据"
        },
        {
          imgUrl: "cgpj/icon_cgpj06.png",
          title: "项目融资",
          desc: "在获取投资、许可、转让、合作中对成果价值的重要评判依据"
        },
        {
          imgUrl: "cgpj/icon_cgpj07.png",
          title: "技术交易",
          desc: "有利减少技术交易中卖卖双方的沟通和谈判成本，提高交易效率"
        },
        {
          imgUrl: "cgpj/icon_cgpj08.png",
          title: "结题验收",
          desc:
            "是对科研项目研发目标的完成情况、成果的创新性和效果评判的重要依据"
        }
      ]
    };
  },
  methods:{
    toggle(){
      window.open('https://tb.53kf.com/code/client/0c8e8b081090b185745c9bc98ff4b6cb1/2','','height=499,width=712,top=240px,left=220px,toolbar=no,menubar=yes,scrollbars=yes,resizable=yes,location=no,status=no')
    }
  }
};
</script>
<style scoped>
.evalution_benefit {
  padding-top:20px;
  width: 100%;
  min-width:1200px;
  height: 672px;
  background: #f5f5f5ff;
  font-family: "Microsoft YaHei UI";
  padding-bottom: 20px;
}
.benefit_main {
  width: 1200px;
  height: 672px;
  margin: 0 auto;
  /* background: lightyellow; */
}
.benefit_title {
  width: 159px;
  height: 33px;
  font-size: 26px;
  font-weight: bold;
  color: rgba(68, 77, 90, 1);
  opacity: 1;
  margin: 0 auto;
  padding-bottom: 10px;
}
.benefit_desc {
  width: 390px;
  height: 20px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(147, 150, 155, 1);
  opacity: 1;
  margin: 0 auto;
  /* background: red; */
}
.benefit_content {
  width: 1200px;
  height: 530px;
  /* background: pink; */
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
}
.benefit_item {
  width: 248px;
  height: 216px;
  opacity: 1;
  background: #f5f5f5ff;
  margin-bottom: 0px;
  cursor: pointer;
}
.benefit_item:hover {
  background: #ffffffff;
}

.item_img {
  width: 248px;
  height: 100px;
  /* background-color: lightyellow; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.item_title {
  width: 80px;
  height: 25px;
  font-size: 20px;
  font-weight: 400;
  line-height: 25px;
  color: rgba(72, 77, 84, 1);
  opacity: 1;
  margin: 0 auto;
}
.item_desc {
  width: 224px;
  height: 68px;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: rgba(153, 153, 153, 1);
  opacity: 1;
  margin: 0 auto;
  margin-top: 5px;
}
.benefit_btn {
  width: 180px;
  height: 34px;
  text-align: center;
  background: rgba(61, 133, 220, 1);
  opacity: 1;
  line-height: 34px;
  border-radius: 20px;
  margin: 0 auto;
  font-size: 16px;
  font-family: "Source Han Sans CN";
  font-weight: 400;
  color: rgba(255, 255, 255, 1);
  opacity: 1;
  cursor: pointer;
}
</style>