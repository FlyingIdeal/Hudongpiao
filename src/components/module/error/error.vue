<template>
    <div class="main-error">
        <div class="main-error-img"><img src="~@/common/images/delete.png" /></div>
        <p v-text="message"></p>
    </div>
</template>

<script>

export default {
    props: {
        message: String
    },
    data(){
    	return {
    		projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`
    	}
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
