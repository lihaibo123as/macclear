/**
 * MacClear 1.0.0
 * 帮助Mac 用户完全删除 App ,清理历史残留文件.
 * Copyright (c) 2018 <lihaibo123as@163.com>
 * MIT License - http://opensource.org/licenses/mit-license.php
 * Released on: December 27, 2018
 */
module.exports = Vue.extend({
  data: () => {
    return {
      /**
       * EACCES (拒绝访问): 试图以被一个文件的访问权限禁止的方式访问一个文件。
EADDRINUSE (地址已被使用): 试图绑定一个服务器（net、http 或 https）到本地地址，但因另一个本地系统的服务器已占用了该地址而导致失败。
ECONNREFUSED (连接被拒绝): 无法连接，因为目标机器积极拒绝。 这通常是因为试图连接到外部主机上的废弃的服务。
ECONNRESET (连接被重置): 一个连接被强行关闭。 这通常是因为连接到远程 socket 超时或重启。 常发生于 http 和 net 模块。
EEXIST (文件已存在): 一个操作的目标文件已存在，而要求目标不存在。
EISDIR (是一个目录): 一个操作要求一个文件，但给定的路径是一个目录。
EMFILE (系统打开了太多文件): 已达到系统文件描述符允许的最大数量，且描述符的请求不能被满足直到至少关闭其中一个。 当一次并行打开多个文件时会发生这个错误，尤其是在进程的文件描述限制数量较低的操作系统（如 macOS）。 要解决这个限制，可在运行 Node.js 进程的同一 shell 中运行 ulimit -n 2048。
ENOENT (无此文件或目录): 通常是由 fs 操作引起的，表明指定的路径不存在，即给定的路径找不到文件或目录。
ENOTDIR (不是一个目录): 给定的路径虽然存在，但不是一个目录。 通常是由 fs.readdir 引起的。
ENOTEMPTY (目录非空): 一个操作的目标是一个非空的目录，而要求的是一个空目录。 通常是由 fs.unlink 引起的。
EPERM (操作不被允许): 试图执行一个需要更高权限的操作。
EPIPE (管道损坏): 写入一个管道、socket 或 FIFO 时没有进程读取数据。 常见于 net 和 http 层，表明远端要写入的流已被关闭。
ETIMEDOUT (操作超时): 一个连接或发送的请求失败，因为连接方在一段时间后没有做出合适的响应。 常见于 http 或 net。 往往标志着 socket.end() 没有被正确地调用。
       */
    };
  },
  props: ["error"],
  computed: {
    errmsg: function() {
      console.warn("errmsg:", this.error);
      switch (this.error.code) {
        case "EPERM":
          return `错误:${this.error.path},无操作权限`;
          break;
        case "ENOENT":
          return `错误:${this.error.path},文件不存在`;
          break;
        default:
          return this.error;
      }
    }
  },
  methods: {},
  template: `<span>{{errmsg}}</span>` //必须是单引号 模板替换标识可在配置内更改
});