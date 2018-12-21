/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件,提交 bug :154624410
 * Author lihaibo123as@163.com
 * Licensed under ISC
 * Released on: December 21, 2018
 */
module.exports={data:function(){return{}},methods:{show:function(){this.$emit("update:loading",!0)},hide:function(){this.$emit("update:loading",!1)}},props:{loading:Boolean},created:function(){},updated:()=>{},template:'\n    <div class="loading" v-on:click="hide" v-if="loading">\n        <div class="loading-bg"></div>\n        <div class="loading-icon"><i class="fa fa-spinner fa-pulse"></i></div>\n    </div>\n    '};