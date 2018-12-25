<style lang="scss">
.rules {
}
</style>
<template>
  <div class="rules">app检索规则配置</div>
</template>

<script>
module.exports = Vue.extend({
  data: () => {
    return {
      title: "规则管理"
    };
  },
  props: {
    rules: Array
  },
  computed: {},
  methods: {},
  watch: {},
  mounted: function() {
    console.group("mounted 挂载结束状态===============》");
    console.log("%c%s", "color:red", "el     : " , this.$el); //已被初始化
    console.log("%c%s", "color:red", "data   : " , this.$data); //已被初始化
    console.log("app-rules-config", this);
  },
  template: `__template__` //必须是单引号 模板替换标识可在配置内更改
});
</script>
