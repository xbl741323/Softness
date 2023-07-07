<template>
	<div>
		<ul class="list">
			<li class="item-scroll"
			v-for="item of letters"
			:key="item"	
			:ref="item"		
			@click="handleLetterClick"
			>			
			<!-- @touchstart.prevent="handleTouchStart"
			@touchmove="handleTouchMove"
			@touch="handleTouchEnd" -->
			  {{item}}
			</li>
		</ul>
	</div>
</template>
<script>
export default {
	props: {
		cities: Object
	},
	computed: {
		letters () {
			const letters= []
			for (let i in this.cities) {
				letters.push(i)
			}
			return letters
		}
	},
	data () {
		return {
			touchStatus: false,
			startY: 0,
			timer: null
		}
	},
	updated () {
		this.startY = this.$refs['A'][0].offsetTop
	},
	methods: {
		handleLetterClick(e){
			this.$emit('change', e.target.innerText)
      		console.log(e.target.innerText,'eeeee')
		},
		handleTouchStart () {
			this.touchStatus = true
		},
		handleTouchMove (e) {
			if (this.touchStatus) {
				if (this.timer) {
					clearTimeout(this.timer)
				}				
				this.timer = setTimeout(() => {
					const touchY = e.touches[0].clientY - 90
					const index = Math.floor((touchY - this.startY) / 23)
					if (index >= 0 && index < this.letters.length) {
						this.$emit('change', this.letters[index])
      					console.log(this.letters[index],'eeeee')
					}
				}, 100)
			}
		},
		handleTouchEnd () {
			this.touchStatus = false
		}
	}
}
</script>
<style lang="stylus" scoped>
.list
  display: flex
  flex-direction: column
  justify-content: center
  position: absolute
  top: 2.10666667rem
  right: 0
  bottom: 0
  width: .6666667rem 
  .item
    color: #26a2ff
    line-height: .613333333rem 
</style>
<style scoped>
.list .item-scroll{
	text-align: center;
	color: #26a2ff;
	font-size: .373333333rem;
	line-height: .613333333rem 
}
</style>