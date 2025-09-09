const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3009;

// 启用 CORS
app.use(cors({
  origin: true,
  credentials: true
}));

// 解析 JSON
app.use(express.json());

// Mock 用户数据
const mockUser = {
  id: 'mock-user-001',
  username: 'testuser',
  email: 'test@example.com',
  name: '测试用户'
};

// Mock JWT Token (实际项目中应该用真实的 JWT 库生成)
const mockToken = 'mock-jwt-token-' + Date.now();

// 登录接口
app.post('/api/user/v1/login', (req, res) => {
  console.log('Mock login request:', req.body);
  
  res.json({
    code: 200,
    message: '登录成功',
    data: {
      accessToken: mockToken,
      refreshToken: 'mock-refresh-token-' + Date.now(),
      user: mockUser,
      expiresIn: 3600
    }
  });
});

// 注册接口
app.post('/api/user/v1/register', (req, res) => {
  console.log('Mock register request:', req.body);
  
  res.json({
    code: 200,
    message: '注册成功',
    data: {
      accessToken: mockToken,
      refreshToken: 'mock-refresh-token-' + Date.now(),
      user: mockUser
    }
  });
});

// 验证码接口
app.get('/api/user/v1/captcha', (req, res) => {
  console.log('Mock captcha request');
  
  res.json({
    code: 200,
    message: '获取验证码成功',
    data: {
      captchaId: 'mock-captcha-' + Date.now(),
      captchaBase64: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iNDAiIGZpbGw9IiNmMGYwZjAiLz48dGV4dCB4PSI1MCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSI+MTIzNDwvdGV4dD48L3N2Zz4='
    }
  });
});

// Token 验证接口
app.get('/api/user/v1/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  console.log('Mock verify token request:', authHeader);
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    res.json({
      code: 200,
      message: 'Token 有效',
      data: {
        user: mockUser,
        valid: true
      }
    });
  } else {
    res.status(401).json({
      code: 401,
      message: 'Token 无效或缺失',
      data: null
    });
  }
});

// 刷新 Token 接口
app.post('/api/user/v1/refresh-token', (req, res) => {
  console.log('Mock refresh token request:', req.body);
  
  res.json({
    code: 200,
    message: 'Token 刷新成功',
    data: {
      accessToken: 'mock-new-token-' + Date.now(),
      refreshToken: 'mock-new-refresh-token-' + Date.now(),
      expiresIn: 3600
    }
  });
});

// 登出接口
app.post('/api/user/v1/logout', (req, res) => {
  console.log('Mock logout request');
  
  res.json({
    code: 200,
    message: '登出成功',
    data: null
  });
});

// 钉钉相关接口
app.get('/api/user/v1/dingtalk/login-url', (req, res) => {
  res.json({
    code: 200,
    message: '获取登录URL成功',
    data: {
      loginUrl: 'https://mock-dingtalk-login-url.com'
    }
  });
});

app.get('/api/user/v1/dingtalk/callback', (req, res) => {
  res.json({
    code: 200,
    message: '钉钉登录成功',
    data: {
      accessToken: mockToken,
      user: mockUser
    }
  });
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    code: 200,
    message: 'Mock server is running',
    data: { status: 'ok', timestamp: new Date().toISOString() }
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Mock server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  POST /api/user/v1/login');
  console.log('  POST /api/user/v1/register');
  console.log('  GET  /api/user/v1/captcha');
  console.log('  GET  /api/user/v1/verify-token');
  console.log('  POST /api/user/v1/refresh-token');
  console.log('  POST /api/user/v1/logout');
  console.log('  GET  /health');
});
