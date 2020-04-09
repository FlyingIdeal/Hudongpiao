<template>
    <div id="app" class="app">
    	<!-- 这里是需要keepalive的 -->
    	<keep-alive>
		    <router-view v-if="this.$route.meta.keepAlive"></router-view>
		</keep-alive>
		<!-- 这里不会被keepalive -->
		<router-view v-if="!this.$route.meta.keepAlive"></router-view>
    </div>
</template>
<script>
export default {

}
</script>

<style lang="stylus" rel="stylesheet/stylus">
</style>
