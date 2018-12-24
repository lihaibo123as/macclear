<style lang="scss">
.message {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2001;
  width: 100%;
  height: 100%;
  // background: rgba(51, 51, 51, 0.32);
  padding: 15px;
  pointer-events: none;
  .right {
    height: 100%;
    float: right;
    width: 300px;
  }
  .center {
    height: 100%;
    width: 300px;
    margin: auto;
  }
  p {
    position: relative;
    pointer-events: auto;
    padding: 10px;
    width: 300px;
    box-shadow: 0 0 15px #333;
    color: #fff;
    &.bg-primary {
      box-shadow: 0 0 15px #2f7f80;
    }
    &.bg-success {
      box-shadow: 0 0 15px #009e05;
      background-color: #30a500;
    }
    &.bg-info {
      box-shadow: 0 0 15px #2f7f80;
      background-color: #4f98bd;
    }
    &.bg-warning {
      box-shadow: 0 0 15px #af5900;
      background-color: #efc800;
    }
    &.bg-danger {
      box-shadow: 0 0 15px #e40000;
      background-color: #f90a0a;
    }
    &:hover {
      box-shadow: 0 0 15px #333;
    }

    .close {
      float: right;
      width: 20px;
      height: 20px;
    }
    progress {
      -webkit-appearance: none;
      height: 2px;
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      &::-webkit-progress-bar {
        background-color: rgba(251, 251, 251, 0.32);
      }

      &::-webkit-progress-value {
        background-color: orange;
      }
    }
  }
}
</style>
<template>
  <div class="message">
    <div class="center">
      <p
        v-bind:class="classname(item.type)"
        v-for="(item, index) in queue"
        :key="index"
        v-on:mouseenter="stopdelay(item)"
        v-on:mouseleave="startdelay(item)"
      >
        <button
          v-if="!item.delay"
          type="button"
          class="close"
          v-on:click="delmsg(item.uuid)"
        >&times;</button>
        {{item.msg}}
        <progress v-if="item.progress" :value="item.progress" :max="item.delay"></progress>
      </p>
    </div>
  </div>
</template>

<script>
/**
 * msgdriver 组建使用方式
 * app容器添加 <msgdriver></msgdriver>
 * msg:消息
 * type:"primary", "success", "info", "warning", "danger"
 * config:{
 * delay:3000//延迟几秒关闭,不设置则需要用户点击关闭
 * }
 * window.msgdriver.alert(msg, type, config);
 */
var tool = require("../../util/tool");
module.exports = Vue.extend({
  data: () => {
    return {
      queue: [],
      type: ["primary", "success", "info", "warning", "danger"],
      config: {
        delay: 2500
      }
    };
  },
  props: {},
  computed: {
    teststr: function() {}
  },
  methods: {
    classname: function(type) {
      return "bg-" + type;
    },
    delmsg: function(uuid) {
      this.queue = this.queue.filter(function(task) {
        return task.uuid == uuid ? false : true;
      });
    },
    startdelay: function(item) {
      if (item.delay > 0) {
        // console.log("开启 time", item);
        item.timeflag = setTimeout(() => {
          this.delmsg(item.uuid);
        }, item.delay + 200);

        item.progressflag = setInterval(() => {
          if (item.progress > item.delay) {
            this.clearProgress(item);
          } else {
            item.progress += 50;
          }
        }, 50);
      }
    },
    clearProgress: function(item) {
      if (item.progressflag) {
        clearInterval(item.progressflag);
        item.progress = 0;
        item.progressflag = undefined;
      }
    },
    stopdelay: function(item) {
      if (item.delay > 0 && item.timeflag) {
        // console.log("暂停 time", item);
        clearTimeout(item.timeflag);
        this.clearProgress(item);
      }
    },
    alert: function(msg, type, config) {
      var that = this;
      if (typeof msg == "string" && msg) {
        if (this.type.indexOf(type) == -1) {
          type = "info";
        }
        var delay = this.config.delay;
        switch (type) {
          case "danger":
            delay = 0;
            break;
          default:
            break;
        }
        var item = Object.assign(
          {
            type: type,
            uuid: tool.uuid(),
            msg: msg,
            delay: delay,
            progress: 0
          },
          config
        );
        this.startdelay(item);
        this.queue.push(item);
        console.warn("加入队列:", this.queue, delay, type);
      } else {
        console.warn("异常消息:", msg);
      }
    }
  },
  created: function() {
    window.msgdriver = this; //开发全局接口
  },
  template: `__template__` //必须是单引号 模板替换标识可在配置内更改
});
</script>
