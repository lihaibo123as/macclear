/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件,提交 bug :154624410
 * Copyright (c) 2018 <lihaibo123as@163.com>
 * MIT License - http://opensource.org/licenses/mit-license.php
 * Released on: December 25, 2018
 */
module.exports = Vue.extend({
  data: () => {
    return {
      title: "按钮",
      count: 0
    };
  },
  props: {
    error: Object
  },
  computed: {
    errmsg: function() {
      console.log('errmsg:',this.error);
      return this.error;
    }
  },
  methods: {
  },
  template: `<span>{{errmsg}}</span>` //必须是单引号 模板替换标识可在配置内更改
});