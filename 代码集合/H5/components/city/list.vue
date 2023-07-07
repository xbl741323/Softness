<template>
	<div class="wrapper" ref="wrapper">
    <div>
    	<div class="area">
        <div class="title border-topbottom">当前定位城市</div>
        <div class="button-list">
          <div class="button-wrapper">
            <div class="button" @click="handleCityChange">{{location}}</div>
          </div>        
        </div>
      </div>
      <div class="area" v-if="hot.length>0">
        <div class="title border-topbottom">热门城市</div>
        <div class="button-list">
          <div class="button-wrapper" 
          v-for="item of hot"
          :key="item.id"
          @click="handleCityClick(item.name,item.id)"
          >
            <div class="button">{{item.name}}</div>
          </div>
        </div>
      </div>
      <div 
      class="area"
      v-for="(item,key) of cities"
      :key="key"
      :ref="key"
      >
        <div class="title border-topbottom">{{key}}</div>
        <div class="item-list">
          <div class="item-choose-sty"
          v-for="(innerItem,index) in item"
          :key="index"
          @click="handleCityClick(innerItem.name,innerItem.id)"
          >
            {{innerItem.name}}
          </div>          
        </div>     
      </div>      
    </div>
  </div>
</template>

<script>
import { getLocation } from "@/api/home";
import BScroll from 'better-scroll'
export default {
  data() {
    return {
      location: '',
      identification:'',
      areaNo:'',
    };
  },
  props: {
    hot: Array,
    cities: Object,
    letter: String
  },
  methods: {
    // 点击列表城市选择
    handleCityClick(city,areaNo){
      this.$store.commit('changeCity', city);
      this.$store.commit('changeNo', areaNo);
      sessionStorage.setItem('localCity', city);
      sessionStorage.setItem('localAreaNo', areaNo);
      this.$router.go(-1)
    },
    // 点击当前城市选择
    handleCityChange(){
      this.$store.commit('changeCity', this.location);
      this.$store.commit('changeNo', this.areaNo);
      sessionStorage.setItem('localCity', this.location);
      sessionStorage.setItem('localAreaNo', this.areaNo);
      this.$router.go(-1)
    },
    // 获取定位值
    getLocationData() {
      getLocation(this.identification).then(res => {
        if (res.code == 1000) {
          this.location = res.data.areaName;
          this.areaNo = res.data.areaNo;
          this.$store.commit("changeCity", res.data.areaName);
          this.$store.commit("changeNo", res.data.areaNo);
          sessionStorage.setItem('localAreaNo', this.areaNo);
          localStorage.setItem('identification', res.data.identification);
        } else {
          this.location = '全国';
          this.areaNo = 100000;
          this.$store.commit("changeNo", this.areaNo);
          sessionStorage.setItem('localAreaNo', this.areaNo);
        }
      }).catch(err => {
        console.log(err);
      });
    }
  },
  watch: {
    letter () {
      if (this.letter) {
        const element = this.$refs[this.letter][0]
        this.scroll.scrollToElement(element)       
      }      
    }
  },
  mounted () {
    this.scroll = new BScroll(this.$refs.wrapper, {
        click: true
    })
    if (localStorage.getItem("identification")) {
      this.identification = localStorage.getItem("identification")
    }
    this.getLocationData();   
  }
}
</script>

<style lang="stylus" scoped>
.border-topbottom
    &:before
      border-color: #ccc
    &:after
      border-color: #ccc
  .border-bottom
    &:before
      border-color: #ccc
  .wrapper
    position: absolute
    top: 2.266666667rem
    left: 0
    right: 0
    bottom: 0
    overflow: hidden
    .title
      line-height: .8rem
      background: #eee
      padding-left: .266666667rem
      color: #666
      font-size: .37333333rem
    .button-list
      overflow: hidden
      padding: .1rem .6rem .1rem .1rem
      .button-wrapper
        float: left
        width: 33.33%
        .button
          margin: .1333333333rem
          z-index: 999
          padding: .1333333333rem 0
          text-align: center
          border: 1px solid #ccc
          font-size: .373333333rem
          border-radius: 4px
    .item-list
      .item-choose-sty
        line-height: 1.0133333333rem
        padding-left: .26666667rem
        color #2c3e50
        font-size .37333333rem
</style>