function robotInit(options = {}): void {
  // https://wlgc.das-security.cn/material-detail/114 组件详情配置信息
  // 机器人插件（JS文件），由各个产品后端存放，后续更新只需要替换文件
  // 机器人配置项建议从后端配置读取，后续更新二维码等，只需要修改配置项，无需更新前后端
  // 线上咨询弹窗壳子由机器人控制，弹窗内容部署在云端
  // 机器人不能从云端加载，否则当部署环境无法访问到云端或者网络断开时，机器人会无法加载
  const script = document.createElement('script');
  script.type = 'module';
  script.src = 'https://aiservice.dbappsecurity.com.cn/robot-plugin.js';
  document.head.appendChild(script);
  script.onload = () => {
    window.RobotInit({
      // id: '',
      // onlineParams: {
      //   appKey: '', // 自己产品英文名称缩写，用于统计产品使用率等数据
      //   xiaoAn: {
      //     web_plugin_id: '', // 小安配置 必传 钉钉联系（@郭泽阳）申请获取
      //     // 其余配置
      //   },
      //   xiaoHeng: {
      //     appKey: '', // 小恒配置 必传 钉钉联系（@黄旗亮）申请获取
      //     appSecret: '', // 小恒配置 必传 钉钉联系（@黄旗亮）申请获取
      //     // 其余配置
      //   }
      // },
      // onlineSrc: '',
      // disconnectTips: '',
      // move: false,
      // codeSrc: '',
      // dialogWidth: '50%',
      // dialogHeight: '50%',
      // bottom: 20,
      // online: false,
      // code: false,
      ...options
    });
  };
}

export default robotInit;
