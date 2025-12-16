# UED 模块化业务组件

<cite>
**本文档引用文件**   
- [index.vue](file://src/components/uedModule/layout/index.vue)
- [HeaderMenus.vue](file://src/components/uedModule/layout/comps/HeaderMenus.vue)
- [LayoutContent.vue](file://src/components/uedModule/layout/comps/LayoutContent.vue)
- [SiderMenus.vue](file://src/components/uedModule/layout/comps/SiderMenus.vue)
- [topMenu.vue](file://src/components/uedModule/menu/topMenu.vue)
- [sideMenu.vue](file://src/components/uedModule/menu/sideMenu.vue)
- [userMenu.vue](file://src/components/uedModule/menu/userMenu.vue)
- [mapMenu.vue](file://src/components/uedModule/menu/mapMenu.vue)
- [index.vue](file://src/components/uedModule/blockCard/index.vue)
- [index.vue](file://src/components/uedModule/vueTour/index.vue)
- [index.ts](file://src/store/uedModule/app/index.ts)
- [index.ts](file://src/store/uedModule/menus/index.ts)
- [index.ts](file://src/store/uedModule/theme/index.ts)
</cite>

## 目录
1. [项目结构](#项目结构)
2. [核心组件](#核心组件)
3. [架构概览](#架构概览)
4. [详细组件分析](#详细组件分析)
5. [依赖关系分析](#依赖关系分析)

## 项目结构

UED模块化业务组件位于`src/components/uedModule`目录下，包含布局系统、菜单组件、卡片容器和引导式交互组件等核心业务组件。该模块通过Pinia进行状态管理，实现了组件间的高效数据联动。

```mermaid
graph TB
subgraph "UED模块"
A[blockCard]
B[layout]
C[menu]
D[vueTour]
end
B --> E[HeaderMenus]
B --> F[LayoutContent]
B --> G[SiderMenus]
C --> H[topMenu]
C --> I[sideMenu]
C --> J[userMenu]
C --> K[mapMenu]
A -.-> "卡片容器"
B -.-> "布局系统"
C -.-> "菜单组件"
D -.-> "引导式交互"
```

**图示来源**
- [项目结构](file://src/components/uedModule)

**本节来源**
- [项目结构](file://src/components/uedModule)

## 核心组件

UED模块化业务组件主要包括四大核心部分：布局系统（Layout）、顶部/侧边菜单（TopMenu/SideMenu）、卡片容器（BlockCard）和引导式交互组件（VueTour）。这些组件通过props和emit实现父子通信，并与Pinia store进行数据联动，形成了完整的业务组件体系。

**本节来源**
- [index.vue](file://src/components/uedModule/layout/index.vue)
- [index.vue](file://src/components/uedModule/blockCard/index.vue)
- [index.vue](file://src/components/uedModule/vueTour/index.vue)

## 架构概览

UED模块采用基于Vue 3的组合式API架构，通过Pinia实现全局状态管理。组件间通过props传递数据，通过emit触发事件，形成了清晰的单向数据流。布局系统作为容器，整合了顶部菜单、侧边菜单和内容区域，实现了灵活的页面布局。

```mermaid
graph TB
subgraph "状态管理"
A[appStore]
B[menusStore]
C[themeStore]
end
subgraph "UI组件"
D[Layout]
E[TopMenu]
F[SideMenu]
G[BlockCard]
H[VueTour]
end
A --> D
B --> D
C --> D
B --> E
B --> F
D --> G
D --> H
style A fill:#f9f,stroke:#333
style B fill:#f9f,stroke:#333
style C fill:#f9f,stroke:#333
style D fill:#bbf,stroke:#333
style E fill:#bbf,stroke:#333
style F fill:#bbf,stroke:#333
style G fill:#bbf,stroke:#333
style H fill:#bbf,stroke:#333
```

**图示来源**
- [index.ts](file://src/store/uedModule/app/index.ts)
- [index.ts](file://src/store/uedModule/menus/index.ts)
- [index.ts](file://src/store/uedModule/theme/index.ts)
- [index.vue](file://src/components/uedModule/layout/index.vue)

## 详细组件分析

### 布局系统分析

布局系统是UED模块的核心容器组件，负责整合页面的整体结构。它通过响应式设计适配不同屏幕尺寸，并支持全屏模式切换。

#### 布局组件结构
```mermaid
classDiagram
class Layout {
+fullScreen : boolean
+watermark : string
+themeConfig : object
+menuConfig : object
+setFullScreen(isFull : boolean)
+handleMenuClick(item : any)
}
class HeaderMenus {
+menuData : array
+userMenu : array
+dataProps : object
+popActive : boolean
+config : object
+handleMenuClick(item : any)
}
class SiderMenus {
+menuData : array
+dataProps : object
+config : object
}
class LayoutContent {
+activeBreadcrumb : array
+activeRoutes : array
}
Layout --> HeaderMenus : "包含"
Layout --> SiderMenus : "包含"
Layout --> LayoutContent : "包含"
HeaderMenus --> TopMenu : "使用"
HeaderMenus --> UserMenu : "使用"
```

**图示来源**
- [index.vue](file://src/components/uedModule/layout/index.vue)
- [HeaderMenus.vue](file://src/components/uedModule/layout/comps/HeaderMenus.vue)
- [SiderMenus.vue](file://src/components/uedModule/layout/comps/SiderMenus.vue)
- [LayoutContent.vue](file://src/components/uedModule/layout/comps/LayoutContent.vue)

**本节来源**
- [index.vue](file://src/components/uedModule/layout/index.vue)

#### 布局系统数据流
```mermaid
sequenceDiagram
participant Route as "路由"
participant AppStore as "AppStore"
participant MenusStore as "MenusStore"
participant ThemeStore as "ThemeStore"
participant Layout as "Layout组件"
Route->>Layout : 路由变化
Layout->>AppStore : 监听fullScreen状态
Layout->>MenusStore : 设置activeRoutes
Layout->>ThemeStore : 监听themeConfig
AppStore-->>Layout : 返回watermark和fullScreen
MenusStore-->>Layout : 返回siderMenus
ThemeStore-->>Layout : 返回themeConfig
Layout->>Layout : 渲染布局
```

**图示来源**
- [index.vue](file://src/components/uedModule/layout/index.vue)
- [index.ts](file://src/store/uedModule/app/index.ts)
- [index.ts](file://src/store/uedModule/menus/index.ts)
- [index.ts](file://src/store/uedModule/theme/index.ts)

### 菜单组件分析

菜单组件包括顶部菜单、侧边菜单、用户菜单和映射菜单，通过统一的数据结构实现菜单的动态渲染和权限控制。

#### 菜单组件关系
```mermaid
graph TD
A[Menu组件] --> B[topMenu]
A --> C[sideMenu]
A --> D[userMenu]
A --> E[mapMenu]
B --> F[UedTopMenu]
C --> G[UedSideMenu]
D --> H[用户菜单数据]
E --> I[菜单映射逻辑]
style B fill:#f96,stroke:#333
style C fill:#f96,stroke:#333
style D fill:#f96,stroke:#333
style E fill:#f96,stroke:#333
```

**图示来源**
- [topMenu.vue](file://src/components/uedModule/menu/topMenu.vue)
- [sideMenu.vue](file://src/components/uedModule/menu/sideMenu.vue)
- [userMenu.vue](file://src/components/uedModule/menu/userMenu.vue)
- [mapMenu.vue](file://src/components/uedModule/menu/mapMenu.vue)

**本节来源**
- [topMenu.vue](file://src/components/uedModule/menu/topMenu.vue)

#### 顶部菜单数据联动
```mermaid
flowchart TD
Start([组件初始化]) --> GetThemeConfig["获取主题配置"]
GetThemeConfig --> WatchEffect["监听主题变化"]
WatchEffect --> UpdateConfig["更新配置对象"]
UpdateConfig --> RenderMenu["渲染菜单"]
RenderMenu --> HandleClick["处理菜单点击"]
HandleClick --> Navigation["导航到目标页面"]
Navigation --> End([完成])
style Start fill:#a9f,stroke:#333
style End fill:#a9f,stroke:#333
```

**图示来源**
- [topMenu.vue](file://src/components/uedModule/menu/topMenu.vue)
- [index.ts](file://src/store/uedModule/theme/index.ts)

### 卡片容器分析

卡片容器组件提供了一种标准化的内容展示方式，支持标题、描述、操作按钮和两列布局等特性。

#### 卡片容器结构
```mermaid
classDiagram
class BlockCard {
+title : string
+more : boolean
+topBorder : boolean
+titleBorder : boolean
+twoColumns : boolean
+contentPadding : number|string
+contentPaddingStyle : computed
}
BlockCard : "插槽 : description"
BlockCard : "插槽 : operation"
BlockCard : "插槽 : content"
```

**图示来源**
- [index.vue](file://src/components/uedModule/blockCard/index.vue)

**本节来源**
- [index.vue](file://src/components/uedModule/blockCard/index.vue)

#### 卡片容器响应式设计
```mermaid
flowchart TD
A[props输入] --> B{twoColumns?}
B --> |是| C[应用two-columns类]
B --> |否| D[普通布局]
C --> E[flex布局]
E --> F[子元素宽度50%]
D --> G[块级布局]
A --> H{contentPadding?}
H --> |是| I[计算padding样式]
H --> |否| J[无padding]
I --> K[应用内边距]
J --> L[无内边距]
```

**图示来源**
- [index.vue](file://src/components/uedModule/blockCard/index.vue)

### 引导式交互组件分析

引导式交互组件基于第三方库@ued-material/vue-tour封装，提供产品功能引导和新用户教程功能。

#### 引导式交互组件结构
```mermaid
classDiagram
class VueTour {
+name : string
+steps : array
+callbacks : object
+options : object
+tour : object
+currentStep : number
+previousStep()
+nextStep()
+stop()
+skip()
+finish()
}
VueTour : "插槽 : actions"
VueTour --> VTour : "使用"
VueTour --> VStep : "使用"
```

**图示来源**
- [index.vue](file://src/components/uedModule/vueTour/index.vue)

**本节来源**
- [index.vue](file://src/components/uedModule/vueTour/index.vue)

#### 引导式交互流程
```mermaid
sequenceDiagram
participant Component as "业务组件"
participant VueTour as "VueTour组件"
participant VTour as "VTour实例"
participant VStep as "VStep实例"
Component->>VueTour : 传递steps配置
VueTour->>VTour : 初始化tour实例
loop 每个步骤
VTour->>VStep : 渲染当前步骤
VStep->>Component : 显示引导层
Component->>VStep : 用户交互
VStep->>VTour : 触发nextStep/previousStep
end
VTour->>Component : 触发onFinish回调
```

**图示来源**
- [index.vue](file://src/components/uedModule/vueTour/index.vue)

## 依赖关系分析

UED模块各组件之间存在明确的依赖关系，通过Pinia store实现状态共享，通过props和emit实现组件通信。

```mermaid
graph LR
A[AppStore] --> B[Layout]
C[MenusStore] --> B
D[ThemeStore] --> B
C --> E[TopMenu]
C --> F[SideMenu]
B --> G[BlockCard]
B --> H[VueTour]
style A fill:#f9f,stroke:#333
style C fill:#f9f,stroke:#333
style D fill:#f9f,stroke:#333
style B fill:#bbf,stroke:#333
style E fill:#bbf,stroke:#333
style F fill:#bbf,stroke:#333
style G fill:#bbf,stroke:#333
style H fill:#bbf,stroke:#333
click A "src/store/uedModule/app/index.ts" "AppStore"
click C "src/store/uedModule/menus/index.ts" "MenusStore"
click D "src/store/uedModule/theme/index.ts" "ThemeStore"
click B "src/components/uedModule/layout/index.vue" "Layout"
click E "src/components/uedModule/menu/topMenu.vue" "TopMenu"
click F "src/components/uedModule/menu/sideMenu.vue" "SideMenu"
click G "src/components/uedModule/blockCard/index.vue" "BlockCard"
click H "src/components/uedModule/vueTour/index.vue" "VueTour"
```

**图示来源**
- [index.ts](file://src/store/uedModule/app/index.ts)
- [index.ts](file://src/store/uedModule/menus/index.ts)
- [index.ts](file://src/store/uedModule/theme/index.ts)
- [index.vue](file://src/components/uedModule/layout/index.vue)
- [topMenu.vue](file://src/components/uedModule/menu/topMenu.vue)
- [sideMenu.vue](file://src/components/uedModule/menu/sideMenu.vue)
- [index.vue](file://src/components/uedModule/blockCard/index.vue)
- [index.vue](file://src/components/uedModule/vueTour/index.vue)

**本节来源**
- [index.ts](file://src/store/index.ts)
- [index.vue](file://src/components/uedModule/layout/index.vue)