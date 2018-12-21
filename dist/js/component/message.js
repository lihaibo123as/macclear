/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件,提交 bug :154624410
 * Author lihaibo123as@163.com
 * Licensed under ISC
 * Released on: December 21, 2018
 */
module.exports={methods:{show:function(){this.$emit("update:loading",!0)},hide:function(){this.$emit("update:loading",!1)}},props:{loading:Boolean},created:function(){console.log("loading create",this.$data)},updated:()=>{console.log("loading updated",this.$data)},template:'<div class="loading" v-on:click="hide" v-if="loading"><div class="loading-bg"></div><div class="loading-icon"><i class="layui-icon-loading layui-icon layui-anim layui-anim-rotate layui-anim-loop"></i></div></div>'};