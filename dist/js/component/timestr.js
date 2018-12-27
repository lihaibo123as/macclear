/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件.
 * Copyright (c) 2018 <lihaibo123as@163.com>
 * MIT License - http://opensource.org/licenses/mit-license.php
 * Released on: December 27, 2018
 */
module.exports = {
  data: function() {
    return {
      datestr: ""
    };
  },
  computed: {},
  methods: {
    parse: function() {
      if (this.time) {
        this.datestr = this.dateFormat(this.time);
        return;
      }
      this.datestr = this.time;
    },
    dateFormat: function(time) {
      return new Date(time).format(this.format ? this.format : "Y-m-d H:i");
    }
  },
  props: {
    time: Number,
    format: String
  },
  //数据监听
  watch: {
    time() {
      this.parse();
    },
    format() {
      this.parse();
    }
  },
  created: function() {
    // console.log('string_color create', this.$data);
  },
  updated: function() {
    // console.log('string_color updated', this);
  },
  beforeMount: function() {
    // console.log('string_color beforeMount', this);
    this.parse();
  },
  template: '<span v-html="datestr"></span>'
};