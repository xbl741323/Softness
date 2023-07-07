<template>
  <div class="main-industry">
    <div class="preview-industry">
      <div class="left">
        <div class="head">
          <div class="title">
            {{ form.title }}
          </div>
          <div class="head-content">
            <div class="content-industry">
              <span v-for="(item,index) in form.industryList" :key="index">
                <span v-if="index<3" class="industry-class">
                  {{ item }}
              </span>
              </span>
               <span slot="reference" class="industry-class-two" v-if="form.industryList.length > 3">更多标签</span>
            </div>
            <div class="content-share">
              <span><i class="el-icon-view icon-sty"></i>123456</span>
              <span><i class="el-icon-star-on icon-sty"></i>已收藏</span>
              <span><i class="el-icon-position icon-sty"></i>分享</span>
            </div>
          </div>
        </div>
        <div class="content">
          <div class="content-top">
            <span>
              <img
                src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic2.zhimg.com%2F50%2Fv2-4175772413506316c621f16b0ee5d65f_hd.jpg&refer=http%3A%2F%2Fpic2.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1619337619&t=33354e6f103fbc5bdf8b3cd7eb5a1a4b"
                alt=""
              />
            </span>
            <span class="img-info">
              <span>{{ this.form.publishMan }}</span>
              <span>2021-03-19</span>
            </span>
          </div>
          <div class="content-center" v-html="form.content"> </div>
          <div class="content-foot">
            <p>
              <span class="que-sty">上个问题></span>
              <span>【专利】如何立即商标权的还以，注册商标有什么特殊要求？</span>
            </p>
            <p>
              <span class="que-sty">上个问题></span>
              <span >【专利】如何立即商标权的还以，注册商标有什么特殊要求？</span>
            </p>
          </div>
        </div>
      </div>
      <div class="right">
        <h3>热点文章</h3>
        <p v-for="(item,index) in files" :key="index">
          <span class="circle"></span>
          <span>{{ item.name }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {},
      files: [],
    };
  },
  created() {
    this.form = JSON.parse(this.$route.query.form);
    if(!this.form.publishMan){
      this.form.publishMan = "管理员"
    }
    if(this.form.industryList){
       
    }else{
      this.form.industryList = []
    }
    this.files = JSON.parse(this.$route.query.files);
    console.log(this.files)
    console.log(this.form)
  },
};
</script>

<style scoped>
.main-industry {
  width: 100%;
  background: #f1f1f1;
  overflow: hidden;
}
.preview-industry {
  width: 1200px;
  display: flex;
  margin: 20px auto;
  background: #f1f1f1;
}
.head {
  width: 850px;
  height: 120px;
  background: #fff;
  opacity: 1;
  border-radius: 10px;
  margin-bottom: 20px;
  overflow: hidden;
}
.head .title {
  /* background: pink; */
  margin: 20px 0 15px 25px;
  height: 26px;
  line-height: 26px;
  font-size: 26px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.head .head-content {
  /* background: pink; */
  display: flex;
  justify-content: space-between;
  margin-left: 25px;
}
.industry-class {
  display: inline-block;
  width: 129px;
  height: 24px;
  text-align: center;
  line-height: 24px;
  background: #e1f2ff;
  border-radius: 40px;
  padding: 0 20px;
  color: #0a5c9c;
  font-size: 12px;
  opacity: 1;
  margin-right: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.industry-class-two{
  border: 1px solid #ebe5e5;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 129px;
  height: 24px;
  background:#fff;
  border-radius: 40px;
  color: #0a5c9c;
  font-size: 12px;
  opacity: 1;
  margin-right: 10px;
}
.head-content .content-industry {
  display: flex;
}
.head-content .content-share {
  /* background: chocolate; */
  display: flex;
  justify-content: center;
  align-items: center;
}
.head-content .content-share span {
  display: flex;
  height: 12px;
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
  color: #000000;
  opacity: 0.3;
  margin-right: 25px;
}
.right {
  width: 330px;
  height: 790px;
  background: #fff;
  opacity: 1;
  border-radius: 10px;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}
.left {
  margin-right: 20px;
}
.content {
  width: 850px;
  min-height: 650px;
  background: #fff;
  opacity: 1;
  border-radius: 10px;
  overflow: hidden;
}
.icon-sty {
  margin-right: 2px;
}
.right h3 {
  margin-left: 40px;
  font-weight: 400;
  line-height: 41px;
  color: #474141;
  font-size: 24px;
  margin-bottom: 0px;
  flex: none;
}
.right p {
  width: 247px;
  margin-left: 38px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  font-weight: 400;
  color: #3d3e3e;
  margin-bottom: 0px;
}
.circle {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background: #918d8d;
  margin-right: 12px;
}
.content-top {
  width: 770px;
  height: 100px;
  /* background: pink; */
  margin: 35px 0 10px 40px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.content-center {
  width: 770px;
  min-height: 100px;
  /* background: pink; */
  margin: -10px 0 10px 40px;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  padding: 20px 0px 20px 10px;
}
.content-foot {
  width: 770px;
  height: 100px;
  /* background: pink; */
  margin: 35px 0 0px 40px;
  font-size: 14px;
}
.content-top img {
  margin-left: 5px;
  width: 70px;
  height: 70px;
  border-radius: 70px;
  border: 1px solid #ccc;
  opacity: 1 !important;
}
.img-info {
  display: flex;
  flex-direction: column;
  margin-left: 13px;
}
.img-info span:nth-of-type(1) {
  font-size: 18px;
  font-weight: 400;
  color: #3d3e3e;
  margin-bottom: 9px;
}
.img-info span:nth-of-type(2) {
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  opacity: 0.3;
}
.que-sty {
  color: #3d3e3e;
}
.hover-show-sty{
  width: 500px;
  display: flex;
}
</style>