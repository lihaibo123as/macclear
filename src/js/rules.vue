<style lang="scss">
.app-rule {
  .toggle-icon {
    float: right;
    height: 20px;
    // background: #eee;
    text-align: center;
    font-size: 12px;
    line-height: 20px;
    display: block;
    color: #666;
    cursor: pointer;
  }
  hr {
    margin: 10px 0;
  }
  .panel {
    font-size: 12px;
    .panel-heading {
      cursor: pointer;
      padding: 5px 10px;
      .panel-title {
        font-size: 14px;
      }
      .header-icon {
        padding: 0 0 0 8px;
      }
    }
    .list-group-item {
      padding: 5px 10px;
    }

    .badge {
      padding: 1px 5px;
    }
  }
  .file-path {
  }
}
</style>
<template>
  <div class="app-rule">
    <hr>
    <h5>
      <span v-on:click="toggleAll" class="toggle-icon">{{status.show?'收起':'展开'}}</span>
      应用关联文件数据
    </h5>
    <div class="row">
      <div class="col-xs-12">
        <div class="panel-group">
          <div
            class="panel"
            v-bind:class="ruleClass(rule.style)"
            v-for="(rule, index) in rules"
            :key="index"
          >
            <div class="panel-heading" v-on:click="toggleRule(rule)">
              <div class="pull-right">
                <i v-if="rule.loading" class="fa fa-spinner fa-pulse"></i>
                <span v-if="!rule.files.length&&!rule.loading">未匹配到数据:{{rule.value}}</span>
                <span v-if="rule.files.length">文件数:{{rule.files.length}}</span>
                <span v-if="rule.files.length" class="header-icon">
                  <i class="fa" v-bind:class="ruleToggleIcon(rule)"></i>
                </span>
              </div>
              <h3 class="panel-title">
                <span class="file-path">{{rule.path}}</span>
                <span v-if="rule.title">({{rule.title}})</span>
                <div class="text-danger" v-if="rule.err">Error:{{rule.err}}</div>
              </h3>
            </div>
            <!-- <div class="panel-body"></div> -->
            <ul class="list-group" v-if="rule.show">
              <li class="list-group-item" v-for="(file, index) in rule.files" :key="index">
                <span v-bind:class="fileColor(rule.style)">
                  <i class="fa" v-bind:class="fileType(file)"></i> 
                </span>
                <span class="pull-right">{{file.size}}</span>
                {{file.path}}
                <span class="text-danger" v-if="file.isApp">
                  <i class="fa fa-apple"></i>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
module.exports = Vue.extend({
  data: () => {
    return {
      // rules: []
      status: {
        show: false
      }
    };
  },
  props: {
    rules: Array
  },
  computed: {},
  methods: {
    toggleAll: function() {
      this.status.show = !this.status.show;
      for (var i in this.rules) {
        this.rules[i].hide;
        this.$set(this.rules[i], "show", this.status.show);
      }
    },
    toggleRule: function(rule) {
      this.$set(rule, "show", !rule.show);
    },
    ruleClass: function(style) {
      return ["panel-" + style];
    },
    ruleToggleIcon: function(rule) {
      return [rule.show ? "fa-caret-down" : "fa-caret-left"];
    },
    fileType: function(file) {
      return {
        "fa-folder": file.isDir,
        "fa-file": file.isFile
      };
    },
    fileColor: function(style) {
      return ["text-" + style];
    }
  },
  watch: {
    rules(rules) {
      console.log("rules", rules);
    }
  },
  mounted: function() {
    // console.group("mounted 挂载结束状态===============》");
    // console.log("%c%s", "color:red", "el     : ", this.$el); //已被初始化
    // console.log("%c%s", "color:red", "data   : ", this); //已被初始化
  },
  template: `__template__` //必须是单引号 模板替换标识可在配置内更改
});
</script>
