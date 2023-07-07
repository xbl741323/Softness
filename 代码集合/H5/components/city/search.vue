<template>
  <div>
	<div class="search">
	  <input v-model="keyword" class="search-input" type="text" placeholder="输入省城名称" />	 
	</div>
  <div 
    class="search-content" 
    ref="search"
    v-show="keyword"
  >
    <ul>
      <li 
      v-for="item of list"
      class="search-item border-bottom"
      :key="item.id"
      @click="handleCityClick(item.name,item.id)"
      >
        {{item.name}}
      </li>
      <li 
        class="search-item border-bottom"
        v-show="hasNoData"
      >
    未找到匹配数据</li>
    </ul>
  </div>
</div>
</template>

<script>
import Bscroll from 'better-scroll'
export default {
	name: 'CitySearch',
  props: {
    cities: Object
  },
  data () {
    return {
      keyword: '',
      list: [],
      timer: null
    }
  },
  methods: {
    handleCityClick (city,areaNo) {
      this.$store.commit('changeCity', city);
      this.$store.commit('changeNo', areaNo);
      this.$router.push('/')
    },
  },
  computed: {
    hasNoData () {
      return !this.list.length
    }
  },
  watch: {
    keyword () {
      if (this.timer) {
        clearTimeout(this.timer)
      }
      if (!this.keyword) {
        this.list = []
        return
      }
      this.timer = setTimeout(() => {
        const result = []
          for (let i in this.cities) {
            this.cities[i].forEach((value) => {
              if (value.spell.indexOf(this.keyword) > -1 ||
                value.name.indexOf(this.keyword) > -1 ){
                result.push(value)
              }
            })
          }
          this.list = result
      },100)
    }
  },
  mounted () {
    this.scroll = new Bscroll(this.$refs.search, {
        click: true
    })
  }
}
</script>

<style lang="stylus" scoped>
.search
  height: 1.2rem
  line-height 1.2rem
  padding: 0 .426666667rem
  background: #26a2ff
  position fixed
  width 100%
  top 1.066666667rem
  .search-input
    box-sizing: border-box
    width: 100%    
    height: .8rem
    line-height: .8rem
    padding: 0 .1rem
    text-align: center
    border-radius: .06rem
    border none
    color: #666
.search-content
  position: absolute
  z-index: 9999
  top: 2.27rem
  left: 0
  right: 0
  bottom: 0
  overflow: hidden
  background: #f2f2f2
  .search-item
    line-height: .85rem
    text-align: left
    padding-left: .266666667rem
    background: #fff
    color #2c3e50
    font-size .373333333rem
</style>