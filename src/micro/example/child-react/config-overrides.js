const MicroRouterJsonPlugin = require('micro-router-json-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');

module.exports = function override(config, env) {
  config.output.publicPath = '/react/';

  if (config.devServer) {
    config.devServer.publicPath = '/react/';
  }
  
  
  // 添加你的插件new InterpolateHtmlPlugin(env.raw),
  config.plugins.push(new MicroRouterJsonPlugin(
    {
      routerPath: process.cwd() +'/src/router.js',
      encrypt:false
    }
  ));
  
  return config;
}
