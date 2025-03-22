<template>
  <!-- 主容器 -->
  <div class="ai-chat-container">
    <!-- 左侧历史记录区域 -->
    <div class="chat-sidebar" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
      <!-- 侧边栏头部 -->
      <div class="sidebar-header">
        <div class="logo">Web AI</div>
        <!-- 新增对话按钮 -->
        <a-button type="primary" block @click="createNewChat" class="new-chat-btn">
          <template #icon><plus-outlined /></template>
          新增对话
        </a-button>
        <a-button type="text" shape="circle" @click="showSettingModal = true" class="tools">
          <template #icon><SettingOutlined /></template>
        </a-button>
      </div>

      <!-- 历史对话列表 -->
      <div class="history-list">
        <div
          v-for="chat in historyData"
          :key="chat.id"
          class="history-item"
          :class="{ active: currentTaskId === chat.taskId }"
          @click="switchChat(chat.taskId)"
        >
          <message-outlined />
          <span class="chat-title">{{ chat.title }}</span>
          <!-- 历史记录操作按钮 -->
          <div class="action-buttons">
            <!-- 删除对话按钮 -->
            <a-button type="text" @click.stop="deleteChat(chat.taskId)" class="action-btn">
              <template #icon><delete-outlined /></template>
            </a-button>
            <!-- 重新开启对话按钮 -->
            <a-button type="text" @click.stop="reopenChat(chat.taskId)" class="action-btn">
              <template #icon><reload-outlined /></template>
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧对话内容区域 -->
    <div class="chat-content">
      <!-- 对话区域头部 -->
      <div class="chat-header">
        <h1>Web AI Assistant</h1>
        <!-- 头部操作区 -->
        <div class="header-actions">
          <!-- 折叠侧边栏按钮 -->
          <a-button type="text" @click="toggleSidebar">
            <template #icon><menu-outlined /></template>
          </a-button>
        </div>
      </div>

      <!-- 消息展示区域 -->
      <div class="messages-container" ref="messagesContainer">
        <!-- 思考中状态只在没有消息时显示 -->
        <div v-if="isGenerating && currentMessages.length === 0" class="thinking-container">
          <div class="thinking-animation">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div class="thinking-text">正在思考中...</div>
        </div>
        <!-- 消息列表 -->
        <div v-for="message in currentMessages" :key="message.id" class="message" :class="message.type">
          <div class="message-avatar">
            {{ message.type === 'user_question' ? '👤' : '🤖' }}
          </div>

          <div class="message-content">
            <!-- 用户消息 -->
            <template v-if="message.type === 'user_question'">
              {{ message.text }}
              
              <!-- 添加文件显示区域 -->
              <div v-if="message.files && message.files.length" class="uploaded-files-display">
                <div v-for="file in message.files" :key="file.name" class="file-item">
                  <file-outlined /> {{ file.name }}
                </div>
              </div>

              <!-- 用户消息的复制按钮 -->
              <!-- <a-button type="text" class="copy-btn" @click="copyMessage(message.text)">
                <template #icon><copy-outlined /></template>
              </a-button> -->
            </template>

            <!-- AI 回答 -->
            <template v-else>
              <!-- 思考过程（可折叠） -->
              <div v-if="message.reasoning" class="reasoning-section">
                <div class="reasoning-header" @click="message.isReasoningExpanded = !message.isReasoningExpanded">
                  <span>思考过程</span>
                  <down-outlined v-if="!message.isReasoningExpanded" />
                  <up-outlined v-if="message.isReasoningExpanded" />
                </div>
                <div v-show="message.isReasoningExpanded" class="reasoning-content markdown-body">
                  <div v-html="message.reasoningHtml"></div>
                </div>
              </div>

              <!-- AI 回答内容 -->
              <div v-if="message.text" class="ai-content markdown-body">
                <div v-html="message.html"></div>
              </div>

              <!-- iframe 预览 -->
              <div v-if="message.iframeUrl" class="iframe-container">
                <div class="iframe-header">
                  <span>预览</span>
                  <div class="iframe-actions">
                    <!-- 添加一键写入按钮 -->
                    <a-button type="primary" size="small" @click="handleQuickWrite(message)" class="quick-write-btn">
                      <template #icon><edit-outlined /></template>
                      一键写入
                    </a-button>
                    <!-- 现有的全屏按钮 -->
                    <a-button type="text" @click="toggleIframeFullscreen(message)">
                      <template #icon>
                        <fullscreen-exit-outlined v-if="message.isFullscreen" />
                        <fullscreen-outlined v-else />
                      </template>
                    </a-button>
                  </div>
                </div>
                <div class="iframe-wrapper" :class="{ fullscreen: message.isFullscreen }">
                  <iframe :src="message.iframeUrl" class="preview-iframe" sandbox="allow-same-origin allow-scripts">
                  </iframe>
                  <a-button
                    v-if="message.isFullscreen"
                    class="exit-fullscreen-btn"
                    type="primary"
                    @click="toggleIframeFullscreen(message)"
                  >
                    <template #icon><fullscreen-exit-outlined /></template>
                  </a-button>
                </div>
              </div>

              <!-- 添加 completion_result 内容显示 -->
              <div v-if="message.completionText" class="completion-text markdown-body">
                <div v-html="message.completionText"></div>
              </div>
              <!-- 状态消息 -->
              <div v-if="message.status" class="status-message">
                <loading-outlined spin v-if="message.isGenerating" />
                {{ message.status }}
              </div>
              <!-- 生成中动画 -->
              <div v-if="message.isGenerating && !message.status" class="generating-indicator">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>

              <!-- AI消息的复制按钮 -->
              <!-- <a-button v-if="message.text" type="text" class="copy-btn" @click="copyMessage(message.text)">
                <template #icon><copy-outlined /></template>
              </a-button> -->
            </template>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chat-input-area">
        <div class="input-wrapper">
          <!-- 消息输入框 -->
          <a-textarea
            v-model:value="inputMessage"
            :rows="3"
            placeholder="输入消息... (Ctrl + Enter 发送)"
            @pressEnter.ctrl="sendMessage"
            class="message-input"
            :disabled="isGenerating"
          />
          <!-- 操作按钮区域 -->
          <div class="input-actions">
            <!-- 文件上传按钮 -->
            <a-upload accept=".json,.jpg,.jpeg,.png," :before-upload="handleFileUpload" :show-upload-list="false">
              <a-button type="text" class="upload-btn">
                <template #icon><upload-outlined /></template>
              </a-button>
            </a-upload>
            <!-- 已上传文件展示区 -->
            <div v-if="uploadedFiles.length" class="uploaded-files">
              <a-tag
                v-for="file in uploadedFiles"
                :key="file.name"
                closable
                @close="uploadedFiles = uploadedFiles.filter((f) => f.name !== file.name)"
              >
                {{ file.name }}
              </a-tag>
            </div>
            <!-- 发送/停止按钮 -->
            <a-button
              :type="isGenerating ? 'default' : 'primary'"
              @click="isGenerating ? stopGeneration(false) : sendMessage()"
              class="send-btn"
              :class="{ 'stop-btn': isGenerating }"
            >
              <template #icon>
                <send-outlined v-if="!isGenerating" />
                <stop-outlined v-else />
              </template>
              {{ isGenerating ? '停止生成' : '发送' }}
            </a-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置弹窗 -->
    <SettingModal :open="showSettingModal" @update:open="showSettingModal = $event" />
  </div>
</template>

<script>
  import { defineComponent } from 'vue';
  // 导入所需的图标组件
  import {
    SettingOutlined,
    PlusOutlined,
    DeleteOutlined,
    ReloadOutlined,
    CopyOutlined,
    UploadOutlined,
    MenuOutlined,
    MessageOutlined,
    SendOutlined,
    StopOutlined,
    DownOutlined,
    UpOutlined,
    LoadingOutlined,
    FullscreenOutlined,
    FullscreenExitOutlined,
    FileOutlined,
    EditOutlined
  } from '@ant-design/icons-vue';
  import { message, Modal } from 'ant-design-vue';
  // 添加这行
  import axios from 'axios';
  // 导入消息提示组件
  import MarkdownIt from 'markdown-it';
  import SettingModal from './components/SettingModal.vue';

  // 创建 markdown-it 实例
  const md = new MarkdownIt({
    html: true,
    breaks: true,
    linkify: true
  });

  export default defineComponent({
    name: 'AIChat',
    // 注册图标组件
    components: {
      SettingOutlined,
      PlusOutlined,
      DeleteOutlined,
      ReloadOutlined,
      CopyOutlined,
      UploadOutlined,
      MenuOutlined,
      MessageOutlined,
      SendOutlined,
      StopOutlined,
      DownOutlined,
      UpOutlined,
      LoadingOutlined,
      FullscreenOutlined,
      FullscreenExitOutlined,
      SettingModal,
      FileOutlined,
      EditOutlined
    },
    // 组件数据
    data() {
      return {
        isSidebarCollapsed: false, // 侧边栏是否折叠
        inputMessage: '', // 输入框内容
        currentTaskId: '', // 当前对话的 taskId
        chatHistory: [], // 对话历史记录
        ws: null, // WebSocket实例
        isGenerating: false, // 是否正在生成回答
        currentGeneratingMessage: null, // 当前正在生成的消息
        // taskId: '', // 任务ID
        uploadedFiles: [], // 已上传的文件列表
        showSettingModal: false, // 是否显示设置弹窗
        lastTextReasoning: '', // 上次文本推理的内容
        lastText: '', // 上次文本内容
        taskIds: [], // 存储任务ID数组
        historyData: [], // 存储历史对话数据
        chatSettings: null, // 存储聊天设置
        currentMessages: [], // 当前对话消息列表
        lastTime: '', // 上次发送时间
      };
    },
    // 监听器
    watch: {
      // 监听消息列表变化，自动滚动到底部
      // currentMessages: {
      //   handler() {
      //     this.scrollToBottom()
      //   },
      //   deep: true
      // },

      // 监听当前消息变化，自动保存到历史记录
      currentMessages: {
        handler(newMessages) {
          if (this.currentTaskId) {
            const currentChat = this.chatHistory.find((c) => c.taskId === this.currentTaskId);
            if (currentChat) {
              currentChat.messages = newMessages;
            }
          }
          this.scrollToBottom();
        },
        deep: true
      }
    },
    // 生命周期钩子
    created() {
      // 从本地存储加载设置
      const savedSettings = localStorage.getItem('chatSettings');
      this.chatSettings = savedSettings ? JSON.parse(savedSettings) : null;

      // 页面加载时获取选中的模型
      if (this.chatSettings) {
        const selectedModel = this.chatSettings;
        localStorage.setItem('chatSettings', JSON.stringify(selectedModel));
      }

      // 从本地存储加载 taskIds
      const savedTaskIds = localStorage.getItem('taskIds');
      if (savedTaskIds) {
        this.taskIds = Array.isArray(savedTaskIds) ? savedTaskIds : JSON.parse(savedTaskIds);
      }
      this.createNewChat();

      // this.handlePageClose()
      // 添加页面关闭和刷新事件监听
      window.addEventListener('beforeunload', this.handlePageClose);
      // 初始化WebSocket连接
      this.initWebSocket();
    },
    beforeUnmount() {
      // 移除事件监听
      window.removeEventListener('beforeunload', this.handlePageClose);
      window.removeEventListener('keydown', this.handleKeyDown);
      // 关闭 WebSocket 连接
      this.closeWebSocket();
    },
    mounted() {
      // 添加 ESC 键监听
      window.addEventListener('keydown', this.handleKeyDown);
    },
    methods: {
      // 初始化WebSocket连接
      initWebSocket() {
        this.ws = new WebSocket('ws://10.20.114.19:3005/api/ai/generate');

        // WebSocket连接成功
        this.ws.onopen = () => {
          console.log('WebSocket连接已建立');
        };

        // 接收消息
        this.ws.onmessage = this.handleWebSocketMessage;

        // 连接关闭
        this.ws.onclose = () => {
          console.log('WebSocket连接已关闭');
        };

        // 发生错误
        this.ws.onerror = (error) => {
          console.error('WebSocket错误:', error);
          message.error('连接出错');
        };
      },

      // 关闭WebSocket连接
      closeWebSocket() {
        if (this.ws) {
          const { chatSettings } = this;
          // 发送取消请求
          if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(
              JSON.stringify({
                taskId: this.currentTaskId || '',
                type: 'cancel',
                isAbandoned: true,
                chatSettings
              })
            );
          }
          // 关闭连接
          this.ws.close();
          this.ws = null;
        }
      },

      // 处理接收到的WebSocket消息
      handleWebSocketMessage(event) {
        try {
          const response = JSON.parse(event.data);
          const type = response?.type || '';
          const say = response?.say || '';
          const text = response?.text || '';
          const ask = response?.ask || '';

          // 处理 api_req_failed 错误
          if (ask === 'api_req_failed') {
            message.error(text || '请求失败');
            this.isGenerating = false;
            if (this.currentGeneratingMessage) {
              this.currentGeneratingMessage.isGenerating = false;
            }
            return;
          }
          if (ask === 'resume_completed_task') {
            return
          }

          // 如果没有 type，但有 ask，则使用 ask 作为 type
          const messageType = type || ask;
          if (!messageType && !ask) {
            console.warn('未知消息类型:', response);
            return;
          }

          // 获取或创建当前的 AI 回答消息
          let currentAIMessage = this.currentMessages[this.currentMessages.length - 1];
          if (ask === 'resume_task' || ask === 'completion_result') {
            currentAIMessage.status = null;
            return;
          }
          if (!currentAIMessage || currentAIMessage.type === 'user_question') {
            currentAIMessage = {
              id: Date.now(),
              type: 'ai_response',
              text: '',
              html: '',
              reasoning: '',
              reasoningHtml: '',
              isGenerating: true,
              isReasoningExpanded: true,
              isFullscreen: false,
              completionText: '',
              status: null
            };
            this.currentMessages.push(currentAIMessage);
            this.currentGeneratingMessage = currentAIMessage;
          }

          if (this.lastTime !== response.ts) {
            console.log('lastTime', this.lastTime);
            // 保存上一次的文本和推理文本
            this.lastText = currentAIMessage.text;
            this.lastTextReasoning = currentAIMessage.reasoning;
          }
          this.lastTime = response?.ts || '';
          switch (messageType) {
            case 'error':
              message.error(text || message || '发生错误');
              this.isGenerating = false;
              currentAIMessage.isGenerating = false;
              break;

            case 'create_task':
              this.currentTaskId = text;
              this.currentTaskId = text;
              if (text && !this.taskIds.includes(text)) {
                this.taskIds.push(text);
                localStorage.setItem('taskIds', JSON.stringify(this.taskIds));
              }
              break;

            case 'api_req_started':
              // this.lastText = currentAIMessage.text;
              // this.lastTextReasoning = currentAIMessage.reasoning;
              currentAIMessage.status = '正在思考中...';
              break;

            case 'say':
              currentAIMessage.isGenerating = true;
              if (say === 'reasoning') {
                currentAIMessage.reasoning = `${this.lastTextReasoning}\n${text}`.trim();
                currentAIMessage.reasoningHtml = md.render(currentAIMessage.reasoning);
              } else if (say === 'text') {
                currentAIMessage.text = `${this.lastText}\n${text}`.trim();
                currentAIMessage.html = md.render(currentAIMessage.text);
                currentAIMessage.status = null;
              } else if (say === 'completion_result') {
                currentAIMessage.completionText = md.render(text);
                currentAIMessage.isGenerating = false;
                this.isGenerating = false;
                if (this.currentGeneratingMessage) {
                  this.currentGeneratingMessage.isGenerating = false;
                  this.currentGeneratingMessage.status = null;
                }
                // 重置临时存储的文本
                this.lastText = '';
                this.lastTextReasoning = '';
              }
              break;

            case 'ask':
              if (ask === 'followup') {
                // currentAIMessage.html = md.render(text);
                currentAIMessage.text = `${this.lastText}\n${text}`.trim();
                currentAIMessage.html = md.render(currentAIMessage.text);
                // 重置生成状态
                this.isGenerating = false;
                if (this.currentGeneratingMessage) {
                  this.currentGeneratingMessage.isGenerating = false;
                  this.currentGeneratingMessage.status = null;
                }
              } else {
                currentAIMessage.status = '代码生成中...';
              }
              break;

            case 'install':
              currentAIMessage.status = '项目下载安装中...';
              break;

            case 'build':
              currentAIMessage.status = '项目打包部署中...';
              break;

            case 'iframe':
              currentAIMessage.iframeUrl = text;
              break;

            case 'completion_result':
              this.isGenerating = false;
              currentAIMessage.isGenerating = false;
              currentAIMessage.status = null;
              this.lastText = '';
              this.lastTextReasoning = '';
              break;

            default:
              console.warn('未知的消息类型:', messageType);
              break;
          }
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        } catch (error) {
          console.error('处理WebSocket消息时出错:', error);
        }
      },
      // 查询历史
      async getHistory() {
         // 发送历史记录到后端
         const res = await axios.post('/api/ai/history', {
            taskIds: this.taskIds
          });

          // 处理返回的历史记录
          if (res.data && res.data.code === 0 && res.data.history) {
            // 解析每条历史记录
            this.historyData = res.data.history
              .map((historyStr) => {
                try {
                  // 解析 JSON 字符串为对象数组
                  const messages = JSON.parse(historyStr.message);
                  // 找到第一条用户消息作为标题
                  const userMessage = messages.find((msg) => msg.type === 'say' && msg.say === 'user_question');
                  // 使用第一条消息的 taskId 作为对话 ID
                  const taskId = historyStr.taskId || '';
                  return {
                    id: taskId, // 使用 taskId 作为唯一标识
                    title: userMessage?.text || '新对话',
                    messages,
                    taskId // 保存 taskId
                  };
                } catch (e) {
                  console.error('解析历史记录失败:', e);
                  return null;
                }
              })
              .filter(Boolean); // 过滤掉解析失败的记录
          }
      },

      // 创建新对话
      async createNewChat() {
        try {
          // 先关闭当前对话
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            await this.ws.send(
              JSON.stringify({
                taskId: this.currentTaskId || '',
                type: 'cancel',
                isAbandoned: true,
                chatSettings: this.chatSettings
              })
            );
            this.closeWebSocket();
          }
         this.getHistory()
          console.log('historyData', this.historyData);

          // 重置状态
          this.currentTaskId = '';
          this.currentMessages = [];
          this.inputMessage = '';
          this.uploadedFiles = [];
          this.isGenerating = false;
          this.currentGeneratingMessage = null;

          // 初始化新的 WebSocket 连接
          this.initWebSocket();

          // 添加默认欢迎消息
          this.currentMessages.push({
            id: Date.now(),
            type: 'ai',
            text: '您好！我是一个专业的智能问答系统。我可以帮您解答问题、编写代码、分析数据，让我们开始愉快的对话吧！',
            html: '<p>您好！我是一个专业的智能问答系统。我可以帮您解答问题、编写代码、分析数据，让我们开始愉快的对话吧！</p>'
          });
        } catch (error) {
          console.error('创建新对话失败:', error);
        }
      },

      // 切换对话
      switchChat(taskId) {
        // 如果正在生成回答，先停止
        if (this.isGenerating) {
          this.stopGeneration(true);
        }
        this.getHistory()
        // 重新发送消息 告诉AI 切换对话
        this.resendMessage(taskId);
        const chat = this.historyData.find((c) => c.taskId === taskId);
        if (chat) {
          this.currentTaskId = chat.taskId;
          this.currentMessages = [];
          
          let currentAiMessage = null;
          
          chat.messages.forEach((element) => {
            // 用户发送的消息
            if (element.say === 'user_question' || element.say === 'user_feedback') {
              // 如果之前有AI消息，先把它加入到消息列表中
              if (currentAiMessage) {
                this.currentMessages.push({...currentAiMessage, status: null});
             
                currentAiMessage = null;
              }
              
              // 添加用户消息
              const userMessage = {
                id: element.ts || Date.now(),
                type: 'user_question',
                text: element.text,
                html: md.render(element.text)
              };
              this.currentMessages.push(userMessage);
            } else {
              // AI的消息
              if (!currentAiMessage) {
                currentAiMessage = {
                  id: element.ts || Date.now(),
                  type: 'ai',
                  text: '',
                  html: '',
                  reasoning: '',
                  reasoningHtml: '',
                  isReasoningExpanded: true,
                  isFullscreen: false,
                  completionText: '',
                  iframeUrl: '',
                  commandOutput: []
                };
              }
              
              // 处理不同类型的AI消息
              switch (element.say) {
                case 'reasoning':
                  currentAiMessage.reasoning = (currentAiMessage.reasoning + '\n' + element.text).trim();
                  currentAiMessage.reasoningHtml = md.render(currentAiMessage.reasoning);
                  break;
                case 'text':
                  currentAiMessage.text = (currentAiMessage.text + '\n' + element.text).trim();
                  currentAiMessage.html = md.render(currentAiMessage.text);
                  break;
                case 'command_output':
                  currentAiMessage.commandOutput.push(element.text);
                  break;
                case 'iframe':
                  currentAiMessage.iframeUrl = element.text;
                  break;
                case 'completion_result':
                  currentAiMessage.completionText = md.render(element.text);
                  break;
                default:
                  // 处理其他类型的消息
                  if (element.ask === 'followup') {
                    currentAiMessage.text = (currentAiMessage.text + '\n' + element.text).trim();
                    currentAiMessage.html = md.render(currentAiMessage.text);
                  } else if (element.ask === 'completion_result') {
                    currentAiMessage.completionText = md.render(element.text);
                  }
                  break;
              }
            }
          });
          
          // 如果最后还有未添加的AI消息，添加到消息列表中
          if (currentAiMessage) {
            const aiMessage = {...currentAiMessage, status: ''};
            this.currentMessages = [...this.currentMessages, aiMessage];
          }
          
          // 重置其他状态
          this.isGenerating = false;
          this.currentGeneratingMessage = null;
          this.uploadedFiles = [];
          this.inputMessage = '';
        }
      },

      // 删除对话
      deleteChat(taskId) {
        // 添加删除确认
        Modal.confirm({
          title: '确认删除',
          content: '确定要删除这个对话吗？删除后无法恢复。',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            // 从本地存储的 taskIds 中移除当前 taskId
            this.taskIds = this.taskIds.filter(id => id !== taskId);
            // 更新本地存储
            localStorage.setItem('taskIds', JSON.stringify(this.taskIds));
            
            // 如果删除的是当前对话，重置当前对话ID
            if (this.currentTaskId === taskId) {
              this.currentTaskId = '';
            }
            
            // 重新获取历史记录
            this.createNewChat();
            // 显示删除成功提示
            message.success('对话已删除');
          }
        });
      },

      // 重新开启对话
      reopenChat(taskId) {
        const chat = this.chatHistory.find((c) => c.taskId === taskId);
        if (chat) {
          this.switchChat(taskId);
        }
      },

      // 发送消息
      sendMessage() {
        if (!this.inputMessage.trim() || this.isGenerating) return;

        const { chatSettings } = this;
        if (!chatSettings) {
          message.warning({
            content: '请先配置一个模型',
            onClose: () => {
              this.showSettingModal = true;
            }
          });
          return;
        }

        // 创建用户消息
        const userMessage = {
          taskId: this.currentTaskId || '',
          id: Date.now(),
          type: 'user_question',
          text: this.inputMessage,
          isGenerating: false,
          files: this.uploadedFiles
        };
        this.currentMessages.push(userMessage);

        // 创建AI回复消息
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: '',
          isGenerating: true
        };
        this.currentMessages.push(aiMessage);
        this.currentGeneratingMessage = aiMessage;

        // 发送WebSocket消息
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.isGenerating = true;

          // 构建发送给后端的数据格式
          const payload = {
            taskId: this.currentTaskId || '',
            type: 'user_question',
            message: this.inputMessage,
            files: this.uploadedFiles,
            // 添加设置参数
            aiModelConfig: chatSettings
          };

          this.ws.send(JSON.stringify(payload));
          this.inputMessage = '';
          this.uploadedFiles = [];
        } else {
          console.error('WebSocket未连接');
          this.initWebSocket();
        }
      },

      // 重新发送消息
      resendMessage(taskId) {
        this.ws.send(
          JSON.stringify({
            taskId,
            type: 'history',
            aiModelConfig: this.chatSettings
          })
        );
      },

      // 修改停止生成方法
      stopGeneration(isAbandoned) {
        this.isGenerating = false;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(
            JSON.stringify({
              taskId: this.currentTaskId || '',
              type: 'cancel',
              isAbandoned,
              aiModelConfig: this.chatSettings
            })
          );
        }
      },

      // 复制消息内容
      copyMessage(content) {
        navigator.clipboard.writeText(content);
      },

      // 切换侧边栏显示状态
      toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
      },

      // 滚动到底部
      scrollToBottom() {
        if (this.$refs.messagesContainer) {
          setTimeout(() => {
            this.$refs.messagesContainer.scrollTop = this.$refs.messagesContainer.scrollHeight;
          }, 100);
        }
      },

      // 处理文件上传
      handleFileUpload(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();

          reader.onload = (e) => {
            const fileInfo = {
              type: this.getFileType(file.name),
              content: e.target?.result,
              name: file.name,
              size: file.size
            };
            this.uploadedFiles.push(fileInfo);
            resolve(true);
          };

          reader.onerror = (error) => {
            reject(error);
          };

          // 根据文件类型选择读取方式
          if (this.getFileType(file.name) === 'json') {
            reader.readAsText(file);
          } else {
            reader.readAsDataURL(file);
          }
        });
      },

      // 获取文件类型
      getFileType(fileName) {
        if (fileName.endsWith('.json')) return 'json';
        if (/\.(jpg|jpeg|png|gif)$/i.test(fileName)) return 'image';
        return 'unknown';
      },

      // 加载设置
      loadSettings() {
        const savedSettings = localStorage.getItem(this.STORAGE_KEY);
        if (savedSettings) {
          this.settings = JSON.parse(savedSettings);
        }
      },

      // 保存设置
      handleSettingSave() {
        // 保存到本地存储
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.settings));

        // 更新WebSocket连接（如果需要）
        this.closeWebSocket();
        this.initWebSocket();

        this.showSettingModal = false;

        // 提示保存成功
        this.$message.success('设置已保存');
      },

      // 取消设置
      handleSettingCancel() {
        // 重置为保存的设置
        this.loadSettings();
        this.showSettingModal = false;
      },

      // 切换思考内容的展开/折叠
      toggleReasoning(message) {
        message.isExpanded = !message.isExpanded;
      },

      // 添加切换全屏方法
      toggleIframeFullscreen(message) {
        message.isFullscreen = !message.isFullscreen;
        // 全屏时禁止页面滚动
        document.body.style.overflow = message.isFullscreen ? 'hidden' : '';
      },

      handleKeyDown(event) {
        if (event.key === 'Escape') {
          // 查找并退出全屏的 iframe
          const fullscreenMessage = this.currentMessages.find((msg) => msg.isFullscreen);
          if (fullscreenMessage) {
            this.toggleIframeFullscreen(fullscreenMessage);
          }
        }
      },

      // 处理页面关闭
      handlePageClose() {
        const { chatSettings } = this;
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          // 发送取消请求
          this.ws.send(
            JSON.stringify({
              taskId: this.currentTaskId || '',
              type: 'cancel',
              isAbandoned: true,
              chatSettings
            })
          );
        }
      },

      // 更新设置
      updateChatSettings(settings) {
        this.chatSettings = settings;
        localStorage.setItem('chatSettings', JSON.stringify(settings));
      },

      // 添加一键写入方法
      async handleQuickWrite(message) {
        try {
          // 显示加载中状态
          const hide = message.loading('正在写入...', 0);
          
          // {
          //   taskId: this.currentTaskId,
          //   messageId: message.id,
          //   iframeUrl: message.iframeUrl
          // }
          // 调用后端接口
          const response = await axios.post('/file/write-file', {
            path: message.iframeUrl,
            content: message.completionText,
            type: 'vue',
            start: message.start,
            end: message.end
          });

          // 隐藏加载状态
          hide();

          if (response.data.code === 0) {
            // 写入成功
            message.success('写入成功');
          } else {
            // 写入失败
            message.error(response.data.message || '写入失败');
          }
        } catch (error) {
          console.error('一键写入失败:', error);
          message.error('写入失败，请稍后重试');
        }
      },
    }
  });
</script>

<style scoped>
  .tools {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .ai-chat-container {
    display: flex;
    height: 100vh;
    background-color: #f8f9fa;
    overflow: hidden;
  }

  .chat-sidebar {
    width: 280px;
    background-color: #fff;
    border-right: 1px solid #e8e8e8;
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  }

  .sidebar-collapsed {
    width: 0;
    padding: 0;
    border: none;
    display: none;
  }

  .logo {
    font-size: 24px;
    font-weight: bold;
    color: #1890ff;
    text-align: center;
    margin-bottom: 16px;
    font-family: 'Arial', sans-serif;
  }

  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
  }

  .header-buttons {
    display: flex;
    gap: 8px;
    align-items: center;
    min-width: 0;
  }

  .new-chat-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 8px 12px;
    white-space: nowrap;
    overflow: hidden;
  }

  .new-chat-btn :deep(.anticon) {
    margin-right: 4px;
    font-size: 14px;
    display: flex;
    align-items: center;
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }

  .history-item {
    padding: 12px 16px;
    margin: 4px 0;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
  }

  .history-item:hover {
    background-color: #f5f5f5;
  }

  .history-item.active {
    background-color: #e6f7ff;
    color: #1890ff;
  }

  .action-buttons {
    margin-left: auto;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .history-item:hover .action-buttons {
    opacity: 1;
  }

  .action-btn {
    padding: 4px 8px;
  }

  .chat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
  }

  .chat-header {
    padding: 16px 24px;
    background-color: #fff;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .chat-header h1 {
    margin: 0;
    font-size: 20px;
    color: #1f1f1f;
  }

  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    padding-bottom: 100px;
    scroll-behavior: smooth;
  }

  .message {
    display: flex;
    align-items: flex-start;
    margin-bottom: 24px;
    max-width: 85%;
    gap: 12px;
    position: relative;
  }

  .message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f2f5;
    font-size: 22px;
    flex-shrink: 0;
    margin-top: 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .message.user_question {
    margin-left: auto;
    flex-direction: row-reverse;
  }

  .message.say,
  .message.reasoning,
  .message.ask,
  .message.install,
  .message.build,
  .message.iframe,
  .message.ai {
    margin-right: auto;
  }

  .message.user_question .message-content {
    background-color: #1890ff;
    color: white;
    border-top-right-radius: 4px;
  }

  .message.say .message-content,
  .message.reasoning .message-content,
  .message.ask .message-content,
  .message.install .message-content,
  .message.build .message-content,
  .message.ai .message-content {
    background-color: #f5f5f5;
    color: #333;
    border-top-left-radius: 4px;
  }

  .message-content {
    padding: 12px 16px;
    border-radius: 12px;
    position: relative;
    word-break: break-word;
    line-height: 1.6;
    max-width: calc(100% - 52px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    align-self: flex-start;
  }

  .ai-content {
    margin-top: 8px;
  }

  .copy-btn {
    position: absolute;
    bottom: 0px;
    right: 0px;
    opacity: 0.5;
    width: 24px;
    height: 24px;
    padding: 0;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .message.user_question .copy-btn {
    color: white;
    opacity: 0.7;
  }

  .copy-btn:hover {
    opacity: 1;
  }

  .message.user_question .message-avatar {
    background-color: #1890ff;
    color: white;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  }

  .message:not(.user_question) .message-avatar {
    background-color: #f0f2f5;
    color: #1890ff;
  }

  /* 状态消息样式改进 */
  .status-message {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1890ff;
    font-size: 14px;
    padding: 8px 12px;
    background-color: rgba(24, 144, 255, 0.1);
    border-radius: 6px;
    margin-bottom: 8px;
  }

  .status-message .anticon {
    font-size: 16px;
  }

  .chat-input-area {
    padding: 20px;
    background-color: #fff;
    border-top: 1px solid #f0f0f0;
    position: sticky;
    bottom: 0;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
  }

  .input-wrapper {
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
  }

  .message-input {
    width: 100%;
    resize: none;
    border-radius: 8px;
    margin-bottom: 12px;
    padding: 12px;
    font-size: 14px;
    border-color: #d9d9d9;
    transition: all 0.3s;
  }

  .message-input:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
  }

  .input-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 12px;
  }

  .send-btn {
    min-width: 100px;
    height: 38px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition: all 0.3s;
  }

  .stop-btn {
    background-color: #ff4d4f;
    border-color: #ff4d4f;
    color: white;
  }

  .stop-btn:hover {
    background-color: #ff7875;
    border-color: #ff7875;
  }

  .upload-btn {
    border-radius: 6px;
  }

  .uploaded-files {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-right: 12px;
  }

  .ant-tag {
    margin: 0;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* 滚动条样式 */
  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* 设置弹窗样式 */
  :deep(.ant-modal-content) {
    border-radius: 8px;
  }

  :deep(.ant-form-item) {
    margin-bottom: 24px;
  }

  :deep(.ant-slider-mark-text) {
    font-size: 12px;
  }

  .reasoning-header {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 8px;
    background-color: #f8f9fa;
    border-radius: 6px;
    margin-bottom: 8px;
  }

  .reasoning-content {
    padding: 12px;
    background-color: #fff;
    border-radius: 6px;
    border: 1px solid #e8e8e8;
  }

  .preview-iframe {
    width: 100%;
    height: 500px;
    border-radius: 8px;
    border: 1px solid #e8e8e8;
    margin-top: 12px;
  }

  /* Markdown 样式调整 */
  :deep(.v-md-preview) {
    background-color: transparent !important;
  }

  :deep(.v-md-preview code) {
    background-color: #f6f8fa;
    padding: 2px 6px;
    border-radius: 4px;
  }

  :deep(.v-md-preview pre) {
    background-color: #f6f8fa !important;
    border-radius: 8px;
    margin: 16px 0;
  }

  /* 思考中动画样式 */
  .thinking-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px;
    color: #1890ff;
  }

  .thinking-animation {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }

  .thinking-animation span {
    display: inline-block;
    width: 12px;
    height: 12px;
    background-color: #1890ff;
    border-radius: 50%;
    animation: thinking 1.4s infinite ease-in-out both;
  }

  .thinking-animation span:nth-child(1) {
    animation-delay: -0.32s;
  }

  .thinking-animation span:nth-child(2) {
    animation-delay: -0.16s;
  }

  .thinking-text {
    font-size: 16px;
    color: #1890ff;
    opacity: 0.8;
  }

  @keyframes thinking {
    0%,
    80%,
    100% {
      transform: scale(0);
    }
    40% {
      transform: scale(1);
    }
  }

  /* 添加生成中指示器样式 */
  .generating-indicator {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
    vertical-align: middle;
  }

  .generating-indicator .dot {
    width: 4px;
    height: 4px;
    background-color: currentColor;
    border-radius: 50%;
    opacity: 0.5;
    animation: blink 1.4s infinite both;
  }

  .generating-indicator .dot:nth-child(2) {
    animation-delay: 0.2s;
  }

  .generating-indicator .dot:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes blink {
    0%,
    80%,
    100% {
      opacity: 0.5;
      transform: scale(1);
    }
    40% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  /* 添加 Markdown 样式 */
  .markdown-body {
    font-family:
      -apple-system,
      BlinkMacSystemFont,
      Segoe UI,
      Helvetica,
      Arial,
      sans-serif;
    font-size: 14px;
    line-height: 1.6;
    word-wrap: break-word;
  }

  .markdown-body pre {
    background-color: #f6f8fa;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
  }

  .markdown-body code {
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
    font-size: 85%;
    padding: 0.2em 0.4em;
  }

  /* 添加 iframe 相关样式 */
  .iframe-container {
    margin: 10px 0;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .iframe-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #fafafa;
    border-bottom: 1px solid #e8e8e8;
  }

  .iframe-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .quick-write-btn {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    height: 24px;
    padding: 0 8px;
  }

  .quick-write-btn :deep(.anticon) {
    font-size: 12px;
  }

  .iframe-wrapper {
    position: relative;
    transition: all 0.3s ease;
  }

  .iframe-wrapper.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1000;
    background: white;
  }

  .preview-iframe {
    width: 100%;
    height: 500px;
    border: none;
    transition: all 0.3s ease;
  }

  .iframe-wrapper.fullscreen .preview-iframe {
    height: 100vh;
  }

  /* 全屏时的退出按钮样式 */
  .exit-fullscreen-btn {
    position: fixed;
    bottom: 12px;
    right: 12px;
    z-index: 1001;
    opacity: 0.6;
    transition: all 0.3s ease;
    padding: 0;
    height: 28px;
    width: 28px;
    font-size: 12px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    background-color: rgba(0, 0, 0, 0.5);
    border: none;
    transform: scale(0.9);
  }

  .exit-fullscreen-btn:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.8);
    transform: scale(1);
  }

  .exit-fullscreen-btn :deep(.anticon) {
    font-size: 14px;
  }

  /* 添加 completion 文本样式 */
  .completion-text {
    margin-top: 16px;
    padding: 16px;
    background-color: #f8f9fa;
    border-radius: 4px;
    border: 1px solid #e8e8e8;
  }

  .completion-text p {
    margin-bottom: 8px;
  }

  .completion-text ul {
    padding-left: 20px;
  }

  .chat-title {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 8px;
  }

  /* 添加文件显示样式 */
  .uploaded-files-display {
    margin-top: 8px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  .file-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
    font-size: 13px;
  }

  .file-item :deep(.anticon) {
    font-size: 14px;
  }
</style>
