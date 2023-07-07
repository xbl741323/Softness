<template>
  <div class="container">
      <headers />
      <search :cities="cities" />
      <city-list :cities="cities" :hot="hotCities" :letter="letter" />
      <alphabet :cities="cities" @change="handleLetterChange" />
  </div>
</template>

<script>
import axios from 'axios'
import headers from '~/components/city/header'
import search from '~/components/city/search'
import cityList from '~/components/city/list'
import alphabet from '~/components/city/Alphabet'
import {getProvince} from '~/api/home'
export default {
  components: {
    headers,
    search,
    cityList,
    alphabet
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'description', name: 'description', content: 'My custom description' }
      ]
    }
  },
  data(){
    return {
      title: this.$t('title.indexMetaTitle'),
      cities: {},
      hotCities: [],
      letter: ''
    };
  },
  methods:{     
    getCityInfo () {
      getProvince().then(res=>{
        this.cities = res.data.cities
        this.hotCities = res.data.hotCities
      }).catch(err=>{
          console.log(err)
      }); 
      // axios.get('/mock/city.json').then(this.handleGetCityInfoSucc)
    },
    handleGetCityInfoSucc (res) {
      console.log(res)
      res = res.data
      if (res.ret && res.data) {
        const data = res.data
        this.cities = data.cities
        this.hotCities = data.hotCities
      }
    },
    handleLetterChange (letter) {
        this.letter = letter;
        console.log(this.letter,'pppp')
    } 
  },  
  mounted () {
    this.getCityInfo()
  }
}
</script>
<style scoped>
</style>