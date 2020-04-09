<template>
    <div class="main-error">
        <div class="main-error-img"><img src="~@/common/images/delete.png" /></div>
        <p v-text="title != 'undefined' ? title : '404'"></p>
    </div>
</template>

<script>
export default {
	data(){
		return {
			projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`,
			title: `${this.$route.query.title}`
		}
	}
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
