<template>
    <div class="quotetext" v-html="content"></div>
</template>
<script>
export default {
    props: {
        content: String
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
.quotetext
    overflow: hidden
    padding: 4px 10px
    *
        max-width: 100% !important
    strong, b
        font-weight: bold !important
    em , i 
        font-style: italic !important


</style>
