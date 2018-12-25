<style lang="scss">
.app-files {
}
</style>
<template>
  <div class="rules">app 文件列表:{{rules.length}}</div>
</template>

<script>
module.exports = Vue.extend({
  data: () => {
    return {
      // rules: []
    };
  },
  props: {
    rules: Array
  },
  computed: {},
  methods: {},
  watch: {
    rules(rules) {
      console.log("rules", rules);
    }
  },
  mounted: function() {
    console.group("mounted 挂载结束状态===============》");
    console.log("%c%s", "color:red", "el     : ", this.$el); //已被初始化
    console.log("%c%s", "color:red", "data   : ", this); //已被初始化
  },
  beforeUpdate: function() {
    console.group("beforeUpdate 更新前状态===============》");
    console.log("%c%s", "color:red", "el     : ", this.$el);
    console.log("%c%s", "color:red", "data   : ", this.$data);
  },
  updated: function() {
    console.group("updated 更新完成状态===============》");
    console.log("%c%s", "color:red", "el     : ", this.$el);
    console.log("%c%s", "color:red", "data   : ", this.$data);
  },
  beforeDestroy: function() {
    console.group("beforeDestroy 销毁前状态===============》");
    console.log("%c%s", "color:red", "el     : ", this.$el);
    console.log("%c%s", "color:red", "data   : ", this.$data);
  },
  destroyed: function() {
    console.group("destroyed 销毁完成状态===============》");
    console.log("%c%s", "color:red", "el     : ", this.$el);
    console.log("%c%s", "color:red", "data   : ", this.$data);
  },
  template: `__template__` //必须是单引号 模板替换标识可在配置内更改
});
</script>
