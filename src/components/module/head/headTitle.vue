<template>
    <div class="header">
        <div class="loginIcon"><i class="icon-name"></i></div>
        <h2 class="headerTitle" v-text="toptitle"></h2>
        <div class="Occupy"></div>
    </div>
</template>
<script>
export default {
    props: {
        toptitle: String
    },
    data() {
    	return {
    		projectId: `${this.$route.query.projectId}`,
            passKey: `${this.$route.query.passKey}`
    	}
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>
