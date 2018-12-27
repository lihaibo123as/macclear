<style lang="scss">
.message {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2000;
  width: 100%;
  height: 100%;
  // background: rgba(51, 51, 51, 0.32);
  padding: 15px;
  pointer-events: none;
  .backdrop {
    pointer-events: auto;
    opacity: 1;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2001;
    background-color: #000;
    transition: opacity 0.3s;
    &.in {
      opacity: 0.3;
    }
  }
  .bgcolor {
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
      background-color: #968b07;
    }
    &.bg-danger {
      box-shadow: 0 0 15px #e40000;
      background-color: #f90a0a;
    }
    &:hover {
      box-shadow: 0 0 15px #333;
    }
  }
  .close {
    float: right;
    width: 20px;
    height: 20px;
  }
  .message-confirm {
    position: absolute;
    z-index: 2010;
    width: 300px;
    left: 50%;
    top: 30%;
    margin-left: -150px;
    .alert {
      pointer-events: auto;
    }
    p {
      word-break: break-all;
    }
    hr {
      margin: 10px 0;
    }
    .confirm-action {
      display: flex;
      flex-flow: row-reverse;
      .btn {
        margin-left: 10px;
      }
    }
  }
  .message-alert {
    position: absolute;
    z-index: 2010;
    height: 100%;
    width: 300px;
    &.right {
      right: 15px;
    }
    &.left {
      left: 15px;
    }
    &.center {
      margin-left: -150px;
      left: 50%;
    }

    p {
      pointer-events: auto;
      position: relative;
      padding: 10px;
      width: 300px;
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
}
</style>
<template>
  <div class="message">
    <div class="backdrop in" v-if="status.confirm.show"></div>
    <div class="message-confirm" v-if="status.confirm.show">
      <div class="alert alert-block bgcolor" v-bind:class="classname(status.confirm.type)">
        <button type="button" class="close" v-on:click="confirmCancel">&times;</button>
        <h4 class="alert-heading">{{this.status.confirm.title}}</h4>
        <p v-html="this.status.confirm.desc"></p>
        <p v-if="status.confirm.input">
          <input type="text" class="form-control input-sm" v-model="status.confirm.value">
        </p>
        <hr>
        <p class="confirm-action">
          <button type="button" class="btn btn-sm btn-success" v-on:click="confirmOk">{{status.confirm.ok.title}}</button>
          <button type="button" class="btn btn-sm btn-default" v-on:click="confirmCancel">{{status.confirm.cancel.title}}</button>
        </p>
      </div>
    </div>
    <div class="message-alert right">
      <p
        class="bgcolor"
        v-bind:class="classname(item.type)"
        v-for="(item, index) in queue"
        :key="index"
        v-on:mouseenter="stopdelay(item)"
        v-on:mouseleave="startdelay(item)"
      >
        <button v-if="!item.delay" type="button" class="close" v-on:click="delmsg(item.uuid)">&times;</button>
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
var queue = require("queue");
module.exports = Vue.extend({
  data: () => {
    return {
      queue: [],
      type: ["primary", "success", "info", "warning", "danger"],
      config: {
        delay: 2500
      },
      status: {
        queue: queue({
          concurrency: 1, //并发
          autostart: true
        }),
        confirm: {
          show: false,
          title: "提示",
          desc: "",
          type: "info",
          value: "",
          input: false,
          ok: {},
          cancel: {}
        }
      }
    };
  },
  props: {},
  computed: {
    teststr: function() {}
  },
  components: {},
  methods: {
    confirm: function(config) {
      return new Promise((resolve, reject) => {
        this.status.queue.push(cb => {
          this._confirm(config).then(
            data => {
              resolve(data);
              cb();
            },
            err => {
              reject(err);
              cb();
            }
          );
        });
        this.status.queue.push(function(cb) {
          setTimeout(() => {
            console.log("延迟confirm队列500");
            cb();
          }, 500);
        });
      });
    },
    confirmOk: function() {
      this.status.confirm.ok.cb(this.status.confirm);
      this.status.confirm = {};
    },
    confirmCancel: function() {
      this.status.confirm.cancel.cb(this.status.confirm);
      this.status.confirm = {};
    },
    _confirm: function(config) {
      return new Promise((resolve, reject) => {
        this.status.confirm = Object.assign(
          {
            show: true,
            title: "提示",
            desc: "",
            type: "info",
            cancel: {
              title: "取消",
              cb: reject
            },
            ok: {
              title: "确定",
              cb: resolve
            }
          },
          config
        );
        console.log("confirm", this.status);
      });
    },

    //alert 处理逻辑
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
    },
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
    }
  },
  created: function() {
    window.msgdriver = this; //开发全局接口
  },
  template: `__template__` //必须是单引号 模板替换标识可在配置内更改
});
</script>
