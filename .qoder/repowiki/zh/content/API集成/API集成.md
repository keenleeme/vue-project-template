# API集成

<cite>
**本文档引用的文件**  
- [index.ts](file://src/libs/fetch/index.ts)
- [types.ts](file://src/libs/fetch/types.ts)
- [index.ts](file://src/service/index.ts)
- [alert.ts](file://src/api/alert.ts)
</cite>

## 目录
1. [简介](#简介)
2. [请求封装机制](#请求封装机制)
3. [API服务入口](#api服务入口)
4. [业务API定义示例](#业务api定义示例)
5. [组件中调用API的最佳实践](#组件中调用api的最佳实践)
6. [错误处理模式](#错误处理模式)

## 简介
本项目采用分层架构设计，通过封装Axios实现统一的HTTP请求管理。API集成体系由三层构成：底层请求封装（`src/libs/fetch`）、中间服务层（`src/service`）和上层业务API定义（`src/api`）。该架构实现了请求配置统一管理、拦截器集中处理、错误全局提示和业务接口清晰分离，提升了代码可维护性和开发效率。

## 请求封装机制

`src/libs/fetch/index.ts` 文件基于 Axios 封装了一个名为 `Request` 的类，用于统一处理所有 HTTP 请求。该封装提供了请求/响应拦截器、错误统一处理和基础配置功能。

### 请求拦截器
在请求发送前，自动注入用户认证令牌（token）到请求头中：
```typescript
config.headers.Authorization = `Bearer ${token}`;
```
若用户已登录，系统会从 Pinia 状态管理中获取 token 并附加到每个请求的 Authorization 头部。

### 响应拦截器
对响应进行统一处理，针对常见的 HTTP 错误状态码进行全局提示：
- 401：未授权，自动清除用户状态并跳转至登录页
- 400、403、404、500 等：显示对应的错误消息
- 其他状态码：显示通用连接错误提示

### 错误统一处理
当响应状态异常时，使用 Ant Design Vue 的 `message.error` 方法弹出错误提示，确保用户能及时感知请求失败情况。

### 基础配置与类型定义
通过 `types.ts` 定义了关键接口：
- `ResponseType<T>`：标准化响应结构，包含 code、data 和 message 字段
- `CreateAxiosConfig`：扩展 Axios 配置，支持 baseURL 和 headers
- `RequestConfigType`：请求配置类型，支持 showError 控制是否显示错误提示

**Section sources**
- [index.ts](file://src/libs/fetch/index.ts#L1-L140)
- [types.ts](file://src/libs/fetch/types.ts#L1-L16)

## API服务入口

`src/service/index.ts` 文件作为 API 服务的统一入口，通过 `createService()` 工厂函数创建并导出一个全局唯一的请求实例。

该服务配置了基础 URL 和超时时间：
- `baseURL`：从环境变量 `API_BASE_PATH` 获取，若未设置则默认为根路径
- `timeout`：从环境变量 `TIME_OUT` 获取，若未设置则默认为 60 秒

通过单例模式确保整个应用使用同一个请求实例，保证配置一致性，并便于统一管理和测试。

**Section sources**
- [index.ts](file://src/service/index.ts#L1-L12)

## 业务API定义示例

以 `src/api/alert.ts` 为例，展示了如何定义具体的业务 API 接口。该文件导出了 `alertApi` 对象，包含一系列与告警管理相关的 API 方法。

### 请求方法
使用封装后的 `createService` 实例提供的 `get`、`post`、`put`、`delete` 方法发起请求。

### URL与参数
- 获取告警列表：`GET /api/alerts`，支持分页、过滤和时间范围查询
- 获取告警详情：`GET /api/alerts/{id}`
- 处理告警：`POST /api/alerts/{id}/process`
- 批量操作：如批量处理、忽略、删除等均通过 POST 请求实现

### 返回类型
所有方法都明确声明了返回的 Promise 类型，例如：
```typescript
getAlertList: (params: AlertFilter) => Promise<AlertListResponse>
```
利用 TypeScript 的类型系统确保类型安全，提高代码可读性和维护性。

### 特殊配置
对于文件导出等特殊需求，支持传递额外配置：
```typescript
responseType: 'blob'
```
以便正确处理二进制数据流。

**Section sources**
- [alert.ts](file://src/api/alert.ts#L1-L195)

## 组件中调用API的最佳实践

在 Vue 组件中调用 API 应遵循以下最佳实践：

1. **导入API模块**：在组件中导入对应的 API 文件
2. **使用组合式API**：在 `setup` 函数中调用 API 方法
3. **处理异步操作**：使用 async/await 或 Promise 链式调用
4. **状态管理**：将 API 返回数据绑定到响应式变量
5. **加载状态**：在请求期间显示加载指示器
6. **数据更新**：请求成功后及时更新 UI

示例：
```typescript
const handleSearch = async () => {
  loading.value = true
  try {
    const response = await alertApi.getAlertList(queryParams)
    alertList.value = response.data.list
    pagination.total = response.data.total
  } catch (error) {
    // 错误已在拦截器中处理
  } finally {
    loading.value = false
  }
}
```

**Section sources**
- [index.vue](file://src/views/uedTypical/dataSecurityRisk/index.vue#L1-L429)
- [QueryForm.vue](file://src/views/uedTypical/dataSecurityRisk/components/QueryForm.vue#L1-L284)
- [RiskList.vue](file://src/views/uedTypical/dataSecurityRisk/components/RiskList.vue#L1-L374)

## 错误处理模式

本项目采用分层错误处理模式：

### 框架层处理（自动）
- HTTP 状态码错误：由响应拦截器统一捕获并提示
- 请求配置错误：在请求拦截器中捕获并提示
- 网络连接错误：Axios 自动抛出，由拦截器处理

### 业务层处理（手动）
- 业务逻辑错误：当响应体中的 `code < 0` 时，拦截器会根据 `showError` 配置决定是否显示错误消息
- 特殊场景处理：如 401 未授权状态会触发用户登出和页面跳转

### 组件层处理（可选）
- 成功提示：某些操作成功后可手动添加成功提示
- 特殊错误处理：对特定接口的特定错误进行个性化处理
- 用户交互反馈：在加载、成功、失败等状态下更新 UI 状态

这种分层处理模式既保证了错误处理的一致性，又保留了足够的灵活性以应对特殊业务需求。

**Section sources**
- [index.ts](file://src/libs/fetch/index.ts#L1-L140)
- [alert.ts](file://src/api/alert.ts#L1-L195)
- [index.vue](file://src/views/uedTypical/dataSecurityRisk/index.vue#L1-L429)