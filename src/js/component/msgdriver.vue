<style lang="scss">
.message {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2001;
  width: 100%;
  height: 100%;
  background: rgba(51, 51, 51, 0.32);
  padding: 15px;
  pointer-events: none;
  .left {
    height: 100%;
    width: 100%;
    float: right;
    width: 300px;
    p {
      pointer-events: auto;
      padding: 10px;
      width: 300px;
      box-shadow: 0 0 15px #333;
      &:hover {
        box-shadow: 0 0 15px #2f7f80;
      }
      .close {
        float: right;
        width: 20px;
        height: 20px;
      }
    }
  }
}
</style>
<template>
  <div class="message">
    <div class="left">
      <p
        class="bg-primary"
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
        {{item.msg}}|{{item.delay}}Nullam id dolor id nibh ultricies vehicula ut id elit.
        <progress></progress>
      </p>
    </div>
  </div>
</template>

<script>
var tool = require("../../util/tool");
module.exports = Vue.extend({
  data: () => {
    return {
      queue: [],
      type: ["primary", "success", "info", "warning", "danger"]
    };
  },
  props: {},
  computed: {
    teststr: function() {}
  },
  methods: {
    delmsg: function(uuid) {
      this.queue = this.queue.filter(function(task) {
        return task.uuid == uuid ? false : true;
      });
    },
    startdelay: function(item) {
      var that = this;
      if (item.delay > 0) {
        // console.log("开启 time", item);
        item.timeflag = setTimeout(function() {
          that.delmsg(item.uuid);
        }, item.delay);
      }
    },
    stopdelay: function(item) {
      if (item.delay > 0 && item.timeflag) {
        // console.log("暂停 time", item);
        clearTimeout(item.timeflag);
      }
    },
    alert: function(msg, type, hide) {
      var that = this;
      if (typeof msg == "string" && msg) {
        if (this.type.indexOf(type) == -1) {
          type = "info";
        }
        var delay = 3000;
        switch (type) {
          case "danger":
            delay = 0;
            break;
          default:
            break;
        }
        var item = Object.assign(
          {
            uuid: tool.uuid(),
            msg: msg,
            delay: delay
          },
          hide
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
    window.msgdriver = this;
  },
  template: `__template__` //必须是单引号 模板替换标识可在配置内更改
});
</script>
