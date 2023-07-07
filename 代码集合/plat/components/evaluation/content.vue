<template>
    <div class="evalution_content">
        <div class="content_main">
        <div class="content_title">科技成果评价内容</div>
        <div class="content_desc">科技成果转化是落实“科学技术是第一生产力”的关键</div>
        <div class="content_tab">
            <div
            v-for="(item) in arr"
            :key="item.id"
            :class="['tab_item',styleStatus==item.id?'tab_color':'tab_item']"
            @mouseover="changeStyle(item.id)"
            >
            <img :src="require('@/assets/images/'+item.imgName)" alt />
            <span :class="[styleStatus==item.id?'font_color':'item_font']">{{ item.title }}</span>
            </div>
        </div>
        <div class="content_intro">
            <div class="intro_left">
                <div class="left_title">{{ title }}</div>
                <div class="left_intro">
                    <div class="intro_item1" v-if="styleStatus == 0">
                    由组织或个人完成的各类科学技术项目所产生的具有一定学术
                    价值或应用价值，举办科学性、创造性、先进性等属性的新发现、
                    新理论、新方法、新技术、新产品、新品种和新工艺等
                    </div>
                    <div class="intro_item2" v-if="styleStatus == 1">
                        <span style="margin-right:10px;">技术开发类应用技术成果</span>
                        <span>社会公益类应用技术成果</span>
                        <div>软科学研究成果</div>
                    </div>
                    <div class="intro_item3" v-if="styleStatus == 2">
                        <div>
                            <span>技术创新程度</span>
                            <span>技术难度和复杂程度</span>
                        </div>
                        <div>
                            <span>经济效益或社会效益</span>
                            <span>技术经济指标的先进程度</span>
                        </div>
                        <div>技术重现性和成熟度</div>
                        <div>技术创新对推动科技进步和提高市场竞争能力的作用</div>
                    </div>
                    <div class="intro_item4" v-if="styleStatus == 3">
                        <div>
                            <span>技术研究报告</span>
                            <span>科技查新报告</span>
                        </div>
                        <div>
                            <span>产品检测报告</span>
                            <span>成果应用报告</span>
                        </div>
                        <div>
                            <span>成果知识产权情况</span>
                            <span style="display:inline-block;width:180px;">经济、社会效益分析报告</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="intro_right">
                <img :src="require('@/assets/images/'+'cgpj/img_cgpj0'+imgNum+'.png')" alt />
            </div>
        </div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            title: "评价对象",
            styleStatus: "0",
            imgNum: "4",
            arr: [
                {
                    id: "0",
                    imgName: "cgpj/icon09_cgpj_selected.png",
                    title: "评价对象"
                },
                {
                    id: "1",
                    imgName: "cgpj/icon10_cgpj_normal.png",
                    title: "评价范围"
                },
                {
                    id: "2",
                    imgName: "cgpj/icon11_cgpj_normal.png",
                    title: "评价指标"
                },
                {
                    id: "3",
                    imgName: "cgpj/icon12_cgpj_normal.png",
                    title: "评价资料"
                }
            ]
        };
    },
    methods: {
        changeStyle(val) {
        this.styleStatus = val;
        if (val == 0) {
            (this.title = "评价对象"),
            (this.arr[0].imgName = "cgpj/icon09_cgpj_selected.png");
            this.arr[1].imgName = "cgpj/icon10_cgpj_normal.png";
            this.arr[2].imgName = "cgpj/icon11_cgpj_normal.png";
            this.arr[3].imgName = "cgpj/icon12_cgpj_normal.png";
        }
        if (val == 1) {
            (this.title = "评价范围"),
            (this.arr[1].imgName = "cgpj/icon10_cgpj_selected.png");
            this.arr[0].imgName = "cgpj/icon09_cgpj_normal.png";
            this.arr[2].imgName = "cgpj/icon11_cgpj_normal.png";
            this.arr[3].imgName = "cgpj/icon12_cgpj_normal.png";
        }
        if (val == 2) {
            (this.title = "评价指标"),
            (this.arr[2].imgName = "cgpj/icon11_cgpj_selected.png");
            this.arr[0].imgName = "cgpj/icon09_cgpj_normal.png";
            this.arr[1].imgName = "cgpj/icon10_cgpj_normal.png";
            this.arr[3].imgName = "cgpj/icon12_cgpj_normal.png";
        }
        if (val == 3) {
            (this.title = "评价资料"),
            (this.arr[3].imgName = "cgpj/icon12_cgpj_selected.png");
            this.arr[0].imgName = "cgpj/icon09_cgpj_normal.png";
            this.arr[1].imgName = "cgpj/icon10_cgpj_normal.png";
            this.arr[2].imgName = "cgpj/icon11_cgpj_normal.png";
        }
        this.imgNum = 4 + Number(val);
        }
    }
};
</script>
<style scoped>
.evalution_content {
  padding-top:20px;
  width: 100%;
  min-width:1200px;
  height: 500px;
  background: #FFF;
  font-family: "Microsoft YaHei UI";
}
.content_main {
  width: 1200px;
  height: 500px;
  /* background: lightYellow; */
  margin: 0 auto;
}
.content_title {
  width: 212px;
  height: 33px;
  font-size: 26px;
  font-weight: bold;
  color: rgba(68, 77, 90, 1);
  opacity: 1;
  margin: 0 auto;
  padding-bottom: 10px;
}
.content_desc {
  width: 390px;
  height: 20px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(147, 150, 155, 1);
  opacity: 1;
  margin: 0 auto;
  /* background: red; */
}
.content_tab {
  display: flex;
  width: 1010px;
  height: 130px;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
  /* background: lightblue; */
  border-bottom: 2px solid rgba(220, 220, 220, 1);
  align-items: center;
  justify-items: center;
  opacity: 1;
}
.tab_item {
  width: 72px;
  height: 132px;
  /* background: red; */
  margin-right: 160px;
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  border-bottom: 2px solid #dcdcdc;
  cursor: pointer;
}
.tab_color {
  border-bottom: 2px solid #397dcf;
}
.font_color {
  display: inline-block;
  text-align: center;
  width: 72px;
  font-weight: 400;
  font-size: 16px;
  color: #397dcf;
  opacity: 1;
  margin-top: 10px;
}
.tab_item img {
  margin-top: 50px;
}
.tab_item .item_font {
  display: inline-block;
  text-align: center;
  width: 72px;
  font-weight: 400;
  font-size: 16px;
  color: rgba(72, 77, 84, 1);
  opacity: 1;
  margin-top: 10px;
}
.content_tab > .tab_item:nth-of-type(1) {
  margin-left: 130px;
}
.content_tab > .tab_item:nth-of-type(4) {
  margin-right: 160px;
}
.content_intro {
  width: 800px;
  height: 266px;
  /* background: red; */
  margin: 0 auto;
  display: flex;
}
.intro_left {
  flex: 2;
  /* background: red; */
}
.left_title {
  margin-top: 50px;
  margin-bottom: 20px;
  width: 80px;
  height: 25px;
  font-size: 20px;
  font-weight: bold;
  line-height: 25px;
  color: rgba(72, 77, 84, 1);
  opacity: 1;
}
.intro_item1,
.intro_item2,
.intro_item3,
.intro_item4 {
  width: 450px;
  /* background: red; */
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  color: rgba(153, 153, 153, 1);
  opacity: 1;
}
.intro_item3 span {
  display: inline-block;
  width: 176px;
  text-align: left;
}
.intro_item4 span {
  display: inline-block;
  width: 160px;
  text-align: left;
}
.intro_right {
  flex: 1;
  /* background: yellow; */
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
