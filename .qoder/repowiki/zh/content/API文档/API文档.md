# API文档

<cite>
**本文档引用的文件**   
- [common.ts](file://src/api/common.ts#L1-L355)
- [index.ts](file://src/libs/fetch/index.ts#L1-L140)
- [index.ts](file://src/service/index.ts#L1-L12)
- [env.development](file://env.development#L1-L11)
</cite>

## 目录
1. [API接口定义](#api接口定义)
2. [自定义请求客户端](#自定义请求客户端)
3. [业务服务逻辑封装](#业务服务逻辑封装)
4. [环境配置与超时设置](#环境配置与超时设置)
5. [实际请求示例](#实际请求示例)

## API接口定义

`src/api/common.ts` 文件定义了前端应用所需的核心API接口，包括菜单获取、权限管理、用户认证等功能。所有接口均基于Promise异步模式实现，并通过`createService`进行HTTP请求。

### 菜单与权限接口

#### 获取菜单数据
- **HTTP方法**: `GET` (模拟)
- **URL路径**: `/api/common/getMenus`
- **认证方式**: 无（本地模拟数据）
- **请求参数**: 无
- **响应数据结构**:
```json
[
  {
    "id": "workBench",
    "title": "工作台",
    "icon": "AppstoreOutlined",
    "path": "/workBench",
    "children": [...]
  }
]
```

#### 获取权限数据
- **HTTP方法**: `GET` (模拟)
- **URL路径**: `/api/common/getPermissions`
- **认证方式**: 无
- **请求参数**: 无
- **响应数据结构**:
```json
["base::example:index", "base::theme:index", "base::workBench:index"]
```

#### 获取网站配置
- **HTTP方法**: `GET` (模拟)
- **URL路径**: `/api/common/getWebsiteConfig`
- **认证方式**: 无
- **请求参数**: 无
- **响应数据结构**:
```json
{
  "loginConfig": {
    "logo": "string",
    "title": "string",
    "desc": "string"
  }
}
```

### 用户认证接口

#### 用户登录
- **HTTP方法**: `POST`
- **URL路径**: `/api/user/v1/login`
- **认证方式**: Bearer Token（响应后存储）
- **请求参数 (body)**:
```json
{
  "username": "string",
  "password": "string",
  "captcha": "string"
}
```
- **响应数据结构**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "token": "string",
    "refreshToken": "string",
    "userInfo": {}
  }
}
```

#### 用户注册
- **HTTP方法**: `POST`
- **URL路径**: `/api/user/v1/register`
- **认证方式**: 无
- **请求参数 (body)**:
```json
{
  "username": "string",
  "password": "string",
  "email": "string"
}
```

#### 用户登出
- **HTTP方法**: `POST`
- **URL路径**: `/api/user/v1/logout`
- **认证方式**: Bearer Token
- **请求参数**: 无

#### 获取验证码
- **HTTP方法**: `GET`
- **URL路径**: `/api/user/v1/captcha`
- **认证方式**: 无
- **响应数据结构**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "captchaId": "string",
    "image": "base64"
  }
}
```

#### 刷新Token
- **HTTP方法**: `POST`
- **URL路径**: `/api/user/v1/refresh-token`
- **认证方式**: 无（使用refreshToken）
- **请求参数 (body)**:
```json
{
  "refreshToken": "string"
}
```

#### 验证Token
- **HTTP方法**: `GET`
- **URL路径**: `/api/user/v1/verify-token`
- **认证方式**: Bearer Token
- **响应数据结构**:
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "valid": true,
    "exp": 1672531200
  }
}
```

#### 获取钉钉登录URL
- **HTTP方法**: `GET`
- **URL路径**: `/api/user/v1/dingtalk/login-url`
- **认证方式**: 无
- **请求参数 (query)**:
```json
{
  "state": "string",
  "redirectUri": "string"
}
```

#### 获取钉钉用户信息
- **HTTP方法**: `GET`
- **URL路径**: `/api/user/v1/dingtalk/callback`
- **认证方式**: 无
- **请求参数 (query)**:
```json
{
  "code": "string"
}
```

**已弃用接口**
- 无明确标记为@deprecated的接口。

**迁移路径**
- 所有接口均通过`createService`统一调用，未来如需更换HTTP客户端，只需修改`src/service/index.ts`中的`createService`实现。

**Section sources**
- [common.ts](file://src/api/common.ts#L1-L355)

## 自定义请求客户端

`src/libs/fetch/index.ts` 实现了一个基于Axios的自定义请求客户端，封装了拦截器、错误处理和统一配置。

### 拦截器

#### 请求拦截器
- **功能**: 自动添加Authorization头
- **逻辑**: 从Pinia store中读取token，若存在则添加`Bearer {token}`到请求头
- **错误处理**: 配置错误时全局提示"接口请求配置错误"

#### 响应拦截器
- **功能**: 全局HTTP状态码错误处理
- **错误映射**:
  - `401`: 未授权，清除用户和菜单状态，跳转至登录页
  - `400`: 请求错误
  - `403`: 拒绝访问
  - `404`: 请求出错
  - `408`: 请求超时
  - `500`: 服务器错误
  - 其他: 连接出错

### 错误处理
- **HTTP层**: 通过响应拦截器统一处理状态码错误，使用Ant Design Vue的message组件全局提示
- **业务层**: 在`request`方法中检查响应体的`code < 0`，若为真且`showError=true`，则提示`msg`字段内容

### 配置选项
- **baseURL**: 来自环境变量`API_BASE_PATH`或默认`/`
- **timeout**: 来自环境变量`TIME_OUT`或默认60000ms
- **showError**: 每个请求可配置是否显示错误提示，默认true

### 请求方法封装
- `get<D>(url, params, config)`: GET请求
- `post<D>(url, data, config)`: POST请求
- `put<D>(url, data, config)`: PUT请求
- `delete<D>(url, params, config)`: DELETE请求
- 所有方法均返回`Promise<ResponseType<D>>`

```mermaid
sequenceDiagram
participant 前端 as 前端应用
participant 请求客户端 as Request客户端
participant Axios as Axios实例
participant 服务器 as 后端服务器
前端->>请求客户端 : 调用post('/api/login', data)
请求客户端->>请求客户端 : 构造RequestConfig
请求客户端->>Axios : 发起请求
Axios->>Axios : 请求拦截器
Axios->>Axios : 添加Authorization头(如有token)
Axios->>服务器 : 发送HTTP请求
服务器-->>Axios : 返回HTTP响应
Axios->>Axios : 响应拦截器
Axios->>Axios : 检查HTTP状态码
Axios->>请求客户端 : 返回AxiosResponse
请求客户端->>请求客户端 : 检查业务code
请求客户端-->>前端 : resolve(data) 或 reject(error)
```

**Diagram sources**
- [index.ts](file://src/libs/fetch/index.ts#L1-L140)

**Section sources**
- [index.ts](file://src/libs/fetch/index.ts#L1-L140)

## 业务服务逻辑封装

`src/service/index.ts` 文件定义了`createService`工厂函数，用于创建和配置请求实例。

### 封装逻辑
- **配置初始化**: 从环境变量读取`API_BASE_PATH`和`TIME_OUT`，提供默认值
- **实例创建**: 使用`new Request(defaultConfig)`创建Request实例
- **导出模式**: 直接导出`createService()`的调用结果，即一个已配置的Request实例

### 与API层对接
- `src/api/common.ts`中通过`import createService from '@/service';`引入该实例
- 所有API函数（如`onLogin`, `onRegister`）直接调用`createService.post()`等方法
- 形成"API定义层 -> 业务服务层 -> 请求客户端层"的清晰分层架构

```mermaid
classDiagram
class Request {
-instance : AxiosInstance
-userStore : UserStore
-menusStore : MenusStore
+constructor(createConfig)
+request(config)
+get(url, params, config)
+post(url, data, config)
+put(url, data, config)
+delete(url, params, config)
}
class createService {
+defaultConfig : {baseURL, timeout}
+request : Request
+return request
}
class APIFunctions {
+onLogin(data)
+onRegister(data)
+onLogout()
+getCaptcha()
}
APIFunctions --> Request : 使用
createService --> Request : 创建
Request --> Axios : 封装
```

**Diagram sources**
- [index.ts](file://src/service/index.ts#L1-L12)

**Section sources**
- [index.ts](file://src/service/index.ts#L1-L12)

## 环境配置与超时设置

### 配置加载机制
- **加载逻辑**: `configs/utils.ts`中的`loadEnv()`函数
- **加载流程**:
  1. 根据`NODE_ENV`确定环境模式（默认development）
  2. 读取`env.{mode}`文件（如`env.development`）
  3. 解析为对象并挂载到`process.env`

### API基础路径
- **变量名**: `API_BASE_PATH`
- **开发环境值**: `/` (来自`env.development`)
- **实际作用**: 通过Vite的`define`配置注入到`process.env.API_BASE_PATH`

### 超时设置
- **变量名**: `TIME_OUT`
- **开发环境值**: `60000` (60秒)
- **默认值**: `1000 * 60` (60秒)
- **应用位置**: `src/service/index.ts`中作为`timeout`配置

### 代理配置
- **文件**: `dev.env.js`
- **规则**: 所有`/api`前缀的请求代理到`DEV_PROXY_TARGET_local_server`
- **作用**: 开发环境下解决跨域问题，真实请求地址由代理服务器转发

**Section sources**
- [env.development](file://env.development#L1-L11)
- [utils.ts](file://configs/utils.ts#L20-L29)
- [vite.config.base.ts](file://configs/vite.config.base.ts#L78-L80)

## 实际请求示例

### 用户登录请求
```bash
curl -X POST 'http://localhost:3000/api/user/v1/login' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIs...' \
  -d '{
    "username": "admin",
    "password": "123456",
    "captcha": "abcd"
  }'
```

### 登录成功响应
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "ref_eyJhbGciOiJIUzI1NiIs...",
    "userInfo": {
      "id": 1,
      "username": "admin",
      "roles": ["admin"]
    }
  }
}
```

### 获取菜单请求
```bash
curl -X GET 'http://localhost:3000/api/common/getMenus' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIs...'
```

### 获取菜单响应
```json
[
  {
    "id": "workBench",
    "title": "工作台",
    "icon": "AppstoreOutlined",
    "path": "/workBench",
    "children": [
      {
        "id": "workBench",
        "title": "工作台",
        "icon": "AppstoreOutlined",
        "path": "/workBench"
      }
    ]
  }
]
```

### 401错误响应处理
```json
{
  "code": -1,
  "msg": "未授权，请重新登录(401)"
}
```
*注：前端会自动跳转至登录页并清除状态*