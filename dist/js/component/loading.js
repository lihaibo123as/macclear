    nw.loadCss({content : ".loading{position:fixed;z-index:2000;width:100%;height:100%}.loading .loading-bg{width:100%;height:100%;background:rgba(0,0,0,0.08)}.loading .loading-icon{position:absolute;left:50%;top:50%;background:rgba(0,0,0,0.6);width:50px;height:50px;margin-left:-25px;margin-top:-25px;border-radius:10px;text-align:center;line-height:50px}.loading .loading-icon>i{font-size:15px;font-weight:bold;color:#e0e0e0}.loading.active{display:block}"});

module.exports = Vue.extend({
  data: function() {
    return {};
  },
  methods: {
    show: function() {
      this.$emit("update:loading", true); //触发父类属性更新
    },
    hide: function() {
      this.$emit("update:loading", false);
    }
  },
  props: {
    loading: Boolean
  },
  created: function() {
    // console.log('loading create', this.$data);
  },
  updated: () => {
    // console.log('loading updated', this.$data);
  },
  template: '<div class="loading" v-on:click="hide" v-if="loading"><div class="loading-bg"></div><div class="loading-icon"><i class="fa fa-spinner fa-pulse"></i></div></div>'
});