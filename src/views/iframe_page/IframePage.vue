<template :key="src">
    <iframe id="myIframe" :src='src' class="my-iframe" allowtransparency="yes"></iframe>
</template>

<script>
const baseUrl = process.env.VUE_APP_BASE_API
export default {
    name: "IframePage",
    props:{
        url: {
            type:String,
            default:""
        }
    },
    data() {
        return {
            src: ""
        }
    },
    created(){
    },
    methods: {
        getUrl() {
            if (this.url){
                this.src = this.url
            } else {
                let query = this.$route.fullPath
                console.log(this.$route.fullPath)
                document.getElementById("myIframe").contentWindow.location.reload()
                this.src = baseUrl + query
            }
            console.log(this.src)

        },
    },
    mounted() {
        this.getUrl()
    }
}
</script>

<style scoped>
.my-iframe {
    height: 100%;
    width: 100%;
    border:0;
}
</style>