/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件,提交 bug :154624410
 * Author lihaibo123as@163.com
 * Licensed under ISC
 * Released on: December 21, 2018
 */
module.exports={data:function(){return{datestr:""}},computed:{},methods:{parse:function(){this.time?this.datestr=this.dateFormat(this.time):this.datestr=this.time},dateFormat:function(t){return new Date(t).format(this.format?this.format:"Y-m-d H:i")}},props:{time:Number,format:String},watch:{time(){this.parse()},format(){this.parse()}},created:function(){},updated:function(){},beforeMount:function(){this.parse()},template:'<span v-html="datestr"></span>'};