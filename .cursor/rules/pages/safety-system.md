# 安全系统管理功能说明

> 📁 **文件路径**: `src/views/safetySystemManager/`  
> 🎯 **页面用途**: 安全知识库和法规管理的模块化系统，包括数据安全知识、行业法规、发布审批等  
> ⏰ **最后更新**: 2024-01-15

## 📋 功能概览

| 功能模块 | 实现状态 | 对应文件 | 说明 |
|---------|---------|---------|------|
| 数据安全知识管理 | ✅ | `dataSecurityKnowledgeManager/index.vue` | 数据安全知识库管理(21KB) |
| 行业法规管理 | ✅ | `industryRegulationManager/index.vue` | 行业法规文档管理 |
| 法律法规管理 | ✅ | `legalAndRegulatoryManager/index.vue` | 法律法规文档管理 |
| 发布审批管理 | ✅ | `publishApprovalManager/index.vue` | 内容发布审批流程 |
| 公共组件 | ✅ | `components/` | 模块间共享的组件 |

## 🎯 核心功能详情

### 1. 数据安全知识管理

**功能描述**: 管理数据安全相关的知识文档，包括安全规范、最佳实践、技术指南等

**实现位置**: 
- 主文件: `src/views/safetySystemManager/dataSecurityKnowledgeManager/index.vue`
- 组件: `dataSecurityKnowledgeManager/components/`

**技术实现**:
```typescript
// 安全知识数据结构
interface SecurityKnowledge {
  id: string
  title: string              // 标题
  category: string           // 分类
  content: string            // 内容
  attachments: File[]        // 附件
  tags: string[]             // 标签
  level: string              // 重要级别
  status: string             // 状态(草稿/发布/归档)
  author: string             // 作者
  reviewer: string           // 审核人
  publishTime: string        // 发布时间
  createTime: string         // 创建时间
  updateTime: string         // 更新时间
}

// 知识管理操作
const handleKnowledgeSave = async (formData: SecurityKnowledge) => {
  const isEdit = !!formData.id
  const url = isEdit ? `/api/security-knowledge/${formData.id}` : '/api/security-knowledge'
  const method = isEdit ? 'put' : 'post'
  
  await Http[method](url, formData)
  message.success(`${isEdit ? '编辑' : '新增'}成功`)
  fetchKnowledgeList()
}
```

**交互流程**:
1. 用户创建或编辑安全知识文档
2. 填写标题、分类、内容等基本信息
3. 可上传相关附件和设置标签
4. 提交审核或直接发布

---

### 2. 行业法规管理

**功能描述**: 管理各行业的法规文档，包括金融、医疗、电信等行业的数据安全法规

**实现位置**: 
- 主文件: `src/views/safetySystemManager/industryRegulationManager/index.vue`
- 组件: `industryRegulationManager/components/`

**技术实现**:
```typescript
// 行业法规数据结构
interface IndustryRegulation {
  id: string
  title: string              // 法规名称
  industry: string           // 所属行业
  regulationType: string     // 法规类型
  issueOrg: string          // 发布机构
  effectiveDate: string      // 生效日期
  content: string            // 法规内容
  summary: string            // 法规摘要
  attachments: File[]        // 法规文件
  relatedLaws: string[]      // 关联法律
  status: string             // 状态
  createTime: string         // 创建时间
}

// 法规搜索和筛选
const searchRegulations = async (searchForm: any) => {
  const response = await Http.get('/api/industry-regulations', {
    params: {
      industry: searchForm.industry,
      regulationType: searchForm.regulationType,
      keyword: searchForm.keyword,
      dateRange: searchForm.dateRange
    }
  })
  return response.data
}
```

**API接口**:
- 查询法规列表: `/api/industry-regulations` (GET)
- 新增法规: `/api/industry-regulations` (POST)
- 编辑法规: `/api/industry-regulations/{id}` (PUT)
- 删除法规: `/api/industry-regulations/{id}` (DELETE)

---

### 3. 法律法规管理

**功能描述**: 管理国家级的法律法规，如《网络安全法》、《数据安全法》等重要法律文档

**实现位置**: 
- 主文件: `src/views/safetySystemManager/legalAndRegulatoryManager/index.vue`
- 组件: `legalAndRegulatoryManager/components/`

**技术实现**:
```typescript
// 法律法规数据结构
interface LegalRegulation {
  id: string
  lawName: string            // 法律名称
  lawCode: string            // 法律编号
  category: string           // 法律分类
  level: string              // 法律级别(国家法/行政法规/部门规章)
  issueOrg: string          // 发布机构
  promulgateDate: string     // 颁布日期
  effectiveDate: string      // 生效日期
  content: string            // 法律条文
  interpretation: string     // 法律解释
  amendments: Amendment[]    // 修正案记录
  relatedLaws: string[]      // 关联法律
  applicableScope: string    // 适用范围
}

// 法律条文检索
const searchLegalArticles = async (keyword: string) => {
  const response = await Http.get('/api/legal-regulations/search', {
    params: { keyword }
  })
  return response.data
}
```

---

### 4. 发布审批管理

**功能描述**: 管理知识和法规文档的发布审批流程，确保内容质量和合规性

**实现位置**: 
- 主文件: `src/views/safetySystemManager/publishApprovalManager/index.vue`
- 组件: `publishApprovalManager/components/`

**技术实现**:
```typescript
// 审批流程数据结构
interface ApprovalProcess {
  id: string
  documentId: string         // 文档ID
  documentType: string       // 文档类型
  title: string              // 文档标题
  submitter: string          // 提交人
  currentStep: number        // 当前步骤
  status: string             // 审批状态
  approvalSteps: ApprovalStep[] // 审批步骤
  submitTime: string         // 提交时间
  completeTime: string       // 完成时间
  comments: string           // 审批意见
}

interface ApprovalStep {
  stepOrder: number          // 步骤顺序
  approver: string           // 审批人
  approverRole: string       // 审批人角色
  status: string             // 步骤状态
  approvalTime: string       // 审批时间
  comments: string           // 审批意见
}

// 审批操作
const handleApproval = async (processId: string, action: string, comments: string) => {
  await Http.post(`/api/approval-process/${processId}/approve`, {
    action, // 'approve' | 'reject' | 'return'
    comments
  })
  
  message.success('审批操作成功')
  fetchApprovalList()
}
```

**交互流程**:
1. 文档提交审批申请
2. 按照预设流程逐级审批
3. 审批人员可以批准、拒绝或退回
4. 审批完成后自动发布或归档

---

### 5. 文件预览功能

**功能描述**: 支持多种格式文件的在线预览，包括PDF、Word、Excel等常见文档格式

**实现位置**: 
- 组件: `src/views/safetySystemManager/components/FilePreview.vue`
- 多个版本: `FilePreview1.vue`, `FilePreview正确.vue`

**技术实现**:
```typescript
// 文件预览组件
interface FilePreviewProps {
  fileUrl: string            // 文件URL
  fileType: string           // 文件类型
  fileName: string           // 文件名称
}

// 支持的文件类型
const supportedFileTypes = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
}

// 文件预览处理
const previewFile = async (fileUrl: string, fileType: string) => {
  if (fileType === 'pdf') {
    // 使用PDF.js预览
    return renderPDFPreview(fileUrl)
  } else if (fileType.includes('word')) {
    // 使用Office在线预览
    return renderOfficePreview(fileUrl)
  } else {
    // 其他格式下载预览
    return downloadAndPreview(fileUrl)
  }
}
```

---

## 🗂️ 文件结构

```
safetySystemManager/
├── dataSecurityKnowledgeManager/     # 数据安全知识管理
│   ├── index.vue                    # 主页面(21KB)
│   └── components/                  # 功能组件
│       ├── DetailModal.vue
│       ├── FormModal.vue
│       └── StatisticsModal.vue
├── industryRegulationManager/       # 行业法规管理
│   ├── index.vue                    # 主页面
│   └── components/                  # 功能组件
│       ├── DetailModal.vue
│       ├── FormModal.vue
│       └── StatisticsModal.vue
├── legalAndRegulatoryManager/       # 法律法规管理
│   ├── index.vue                    # 主页面
│   └── components/                  # 功能组件
│       ├── DetailModal.vue
│       ├── FormModal.vue
│       └── StatisticsModal.vue
├── publishApprovalManager/          # 发布审批管理
│   ├── index.vue                    # 主页面
│   └── components/                  # 功能组件
│       ├── ApprovalModal.vue
│       └── DetailModal.vue
└── components/                      # 公共组件
    ├── FilePreview.vue             # 文件预览组件
    ├── FilePreview1.vue            # 文件预览组件v1
    ├── FilePreview正确.vue          # 正确版本的文件预览
    └── StatisticsModal.vue         # 统计弹窗组件
```

## 🎨 UI/UX 特点

### 布局特色
- 模块化设计，每个子模块相对独立
- 统一的文档管理界面设计风格
- 支持富文本编辑和文件预览

### 组件使用
- **主要组件**: `a-table`, `a-modal`, `a-form`, `a-upload`, 富文本编辑器
- **自定义组件**: 各模块的表单、详情、统计弹窗组件
- **第三方库**: 富文本编辑器、文件预览库

## 📊 数据流设计

### 状态管理
```typescript
// 各模块共享的状态结构
const moduleState = reactive({
  documentList: [],          // 文档列表
  searchForm: {/*搜索条件*/},
  loading: false,            // 加载状态
  selectedRowKeys: [],       // 选中的行
  modalVisible: {            // 弹窗状态
    form: false,
    detail: false,
    statistics: false,
    approval: false
  },
  approvalProcess: null      // 审批流程信息
})
```

### API调用
```typescript
// 通用的模块API调用
import Http from '@/service'

// 获取文档列表（各模块通用）
const fetchDocumentList = async (moduleType: string) => {
  const response = await Http.get(`/api/${moduleType}`, {
    params: { ...searchForm, page: currentPage.value, pageSize: pageSize.value }
  })
  return response.data
}

// 提交审批（各模块通用）
const submitForApproval = async (documentId: string, moduleType: string) => {
  await Http.post('/api/approval-process/submit', {
    documentId,
    documentType: moduleType
  })
}
```

## 🔧 开发要点

### 技术难点
- **模块化架构**: 多个子模块的统一管理和数据共享
- **文档处理**: 富文本内容的编辑、存储和展示
- **文件预览**: 多种文档格式的在线预览实现
- **审批流程**: 复杂的多级审批流程管理

### 注意事项
- ⚠️ 富文本内容需要防止XSS攻击
- ⚠️ 文件上传需要限制格式和大小
- ⚠️ 审批流程需要严格的权限控制

### 优化建议
- 💡 添加文档版本管理功能
- 💡 支持文档的全文检索功能
- 💡 考虑添加文档分类标签系统
- 💡 优化大文件的预览性能

## 🔗 相关联的页面/功能

- **用户权限管理**: 控制各模块的访问和操作权限
- **文档检索系统**: 全局的文档搜索功能
- **通知系统**: 审批流程的消息通知
- **系统日志**: 记录文档操作和审批记录

## 📝 修改历史

| 时间 | 修改内容 | 修改人 | 说明 |
|------|---------|--------|------|
| 2023-11-20 | 基础模块实现 | 开发团队 | 完成各子模块的基本功能 |
| 2024-01-01 | 审批流程优化 | 开发团队 | 完善发布审批管理流程 |
| 2024-01-08 | 文件预览功能 | 开发团队 | 新增多格式文件预览支持 |

---

*📌 **使用提示**: 
1. 各子模块功能相对独立，修改时注意模块间的数据一致性
2. 文档内容涉及合规性，修改时需要严格审核
3. 如有重大功能变更，请同时更新 [项目页面功能索引](mdc:pages/README.md)* 