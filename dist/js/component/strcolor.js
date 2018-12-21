/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件,提交 bug :154624410
 * Author lihaibo123as@163.com
 * Licensed under ISC
 * Released on: December 21, 2018
 */
module.exports={data:function(){return{fixstr:""}},computed:{},methods:{parse:function(){if(this.text&&this.search&&this.text.indexOf(this.search)>-1){var t=this.colorStyle(),e=this.text.replace(this.search,t);this.fixstr=e}else this.fixstr=this.text},colorStyle:function(){return'<b style="text-decoration: underline;" class="text-'+(this.color?this.color:"success")+'">'+this.search+"</b>"}},props:{search:String,text:String,color:{type:String,validator:function(t){return-1!==["success","warning","danger","info","primary"].indexOf(t)}}},watch:{search(){this.parse()},text(){this.parse()},color(){this.parse()}},created:function(){},updated:function(){},beforeMount:function(){this.parse()},template:'<span v-html="fixstr"></span>'};