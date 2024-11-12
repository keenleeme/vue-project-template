const MicroRouterJsonPlugin = require('micro-router-json-plugin')
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const path = require('path');

module.exports = function override(config, env) {
  config.output.publicPath = '/subapp/react/';

  // config.devServer.publicPath = '/subapp/react/';
  
  config.output.path = path.resolve(__dirname, '../../../../dist/subapp/react')   
  
  // 添加你的插件new InterpolateHtmlPlugin(env.raw),
  config.plugins.push(new MicroRouterJsonPlugin(
    {
      routerPath: process.cwd() +'/src/router.js',
      encrypt:false
    }
  ));
  
  return config;
}
