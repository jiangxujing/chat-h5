<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
	import {resetFontSize} from '@/common/utils.js'
	export default {
		name: 'App',
		mounted() {
			 resetFontSize(document, window)
		}
	}
</script>

<style>
	body,html{
		padding:0;
		margin:0;
		width:100%;
		height:100%;
	}
	#app{
		width:100%;
		height:100%;
	}
</style>
