# 过渡动画

直接使用 Vue.js 内置的 `<transition>` 组件实现各种过渡动画效果。

## 何时使用

- 当需要在组件切换时添加动画效果时。
- 当需要自定义动画效果时。


:::demo

```vue
<template>
  <div class="transition-demo">
    <div class="demo-grid">
      <!-- 渐显/隐 -->
      <div class="demo-item">
        <button class="toggle-btn" @click="toggleFade">动画切换</button>
        <div class="demo-content">
          <transition name="das-fade">
            <div v-if="showFade" class="demo-box" @click="copyTransitionName('das-fade')">
              <div class="demo-title">渐显/隐</div>
              <div class="demo-name">das-fade</div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 缩放 -->
      <div class="demo-item">
        <button class="toggle-btn" @click="toggleScale">动画切换</button>
        <div class="demo-content">
          <transition name="das-scale">
            <div v-if="showScale" class="demo-box" @click="copyTransitionName('das-scale')">
              <div class="demo-title">缩放</div>
              <div class="demo-name">das-scale</div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 向上 -->
      <div class="demo-item">
        <button class="toggle-btn" @click="toggleSlideUp">动画切换</button>
        <div class="demo-content">
          <transition name="das-slide-up">
            <div v-if="showSlideUp" class="demo-box" @click="copyTransitionName('das-slide-up')">
              <div class="demo-title">向上</div>
              <div class="demo-name">das-slide-up</div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 向下 -->
      <div class="demo-item">
        <button class="toggle-btn" @click="toggleSlideDown">动画切换</button>
        <div class="demo-content">
          <transition name="das-slide-down">
            <div v-if="showSlideDown" class="demo-box" @click="copyTransitionName('das-slide-down')">
              <div class="demo-title">向下</div>
              <div class="demo-name">das-slide-down</div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 向左 -->
      <div class="demo-item">
        <button class="toggle-btn" @click="toggleSlideLeft">动画切换</button>
        <div class="demo-content">
          <transition name="das-slide-left">
            <div v-if="showSlideLeft" class="demo-box" @click="copyTransitionName('das-slide-left')">
              <div class="demo-title">向左</div>
              <div class="demo-name">das-slide-left</div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 向右 -->
      <div class="demo-item">
        <button class="toggle-btn" @click="toggleSlideRight">动画切换</button>
        <div class="demo-content">
          <transition name="das-slide-right">
            <div v-if="showSlideRight" class="demo-box" @click="copyTransitionName('das-slide-right')">
              <div class="demo-title">向右</div>
              <div class="demo-name">das-slide-right</div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 居中折叠 -->
      <div class="demo-item">
        <button class="toggle-btn" @click="toggleFoldCenter">动画切换</button>
        <div class="demo-content">
          <transition name="das-fold-center">
            <div v-if="showFoldCenter" class="demo-box" @click="copyTransitionName('das-fold-center')">
              <div class="demo-title">居中折叠</div>
              <div class="demo-name">das-fold-center</div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 向上折叠 -->
      <div class="demo-item">
        <button class="toggle-btn" @click="toggleFoldUp">动画切换</button>
        <div class="demo-content">
          <transition name="das-fold-up">
            <div v-if="showFoldUp" class="demo-box" @click="copyTransitionName('das-fold-up')">
              <div class="demo-title">向上折叠</div>
              <div class="demo-name">das-fold-up</div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 向下折叠 -->
      <div class="demo-item">
        <button class="toggle-btn" @click="toggleFoldDown">动画切换</button>
        <div class="demo-content">
          <transition name="das-fold-down">
            <div v-if="showFoldDown" class="demo-box" @click="copyTransitionName('das-fold-down')">
              <div class="demo-title">向下折叠</div>
              <div class="demo-name">das-fold-down</div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 向左折叠 -->
      <div class="demo-item">
        <button class="toggle-btn" @click="toggleFoldLeft">动画切换</button>
        <div class="demo-content">
          <transition name="das-fold-left">
            <div v-if="showFoldLeft" class="demo-box" @click="copyTransitionName('das-fold-left')">
              <div class="demo-title">向左折叠</div>
              <div class="demo-name">das-fold-left</div>
            </div>
          </transition>
        </div>
      </div>

      <!-- 向右折叠 -->
      <div class="demo-item">
        <button class="toggle-btn" @click="toggleFoldRight">动画切换</button>
        <div class="demo-content">
          <transition name="das-fold-right">
            <div v-if="showFoldRight" class="demo-box" @click="copyTransitionName('das-fold-right')">
              <div class="demo-title">向右折叠</div>
              <div class="demo-name">das-fold-right</div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'

// 动画状态控制
const showFade = ref(true)
const showScale = ref(true)
const showSlideUp = ref(true)
const showSlideDown = ref(true)
const showSlideLeft = ref(true)
const showSlideRight = ref(true)
const showFoldCenter = ref(true)
const showFoldUp = ref(true)
const showFoldDown = ref(true)
const showFoldLeft = ref(true)
const showFoldRight = ref(true)

// 切换函数
const toggleFade = () => showFade.value = !showFade.value
const toggleScale = () => showScale.value = !showScale.value
const toggleSlideUp = () => showSlideUp.value = !showSlideUp.value
const toggleSlideDown = () => showSlideDown.value = !showSlideDown.value
const toggleSlideLeft = () => showSlideLeft.value = !showSlideLeft.value
const toggleSlideRight = () => showSlideRight.value = !showSlideRight.value
const toggleFoldCenter = () => showFoldCenter.value = !showFoldCenter.value
const toggleFoldUp = () => showFoldUp.value = !showFoldUp.value
const toggleFoldDown = () => showFoldDown.value = !showFoldDown.value
const toggleFoldLeft = () => showFoldLeft.value = !showFoldLeft.value
const toggleFoldRight = () => showFoldRight.value = !showFoldRight.value

// 复制过渡动画名称
const copyTransitionName = async (name) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(name).then(() => {
      message.success('复制成功');
    }).catch(err => {
      message.error('复制失败');
    });
  } else {
    fallbackCopy(name);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  try {
    const successful = document.execCommand('copy');
    message.success('复制' + (successful ? '成功' : '失败'));
  } catch (err) {
    message.error('复制失败');
  }
  document.body.removeChild(textarea);
}
</script>

<style lang="less">
@import 'Comp/transition/style/index.less';
.demo-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.dark {
  .demo-item {
    border: 1px solid #898989;
    background: #000;
    box-shadow: 0 4px 12px rgba(19, 75, 234, 0.3);
  }
}
.demo-item {
  position: relative;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.toggle-btn {
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: 4px;
  border: 1px solid #9b9b9b;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.toggle-btn:hover {
  transform: scale(1.05);
}

.demo-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
  margin-top: 40px;
  margin-bottom: 60px;
}

.demo-box {
  width: 100%;
  height: 80px;
  background: linear-gradient(135deg, #134bea, #6E9EFD);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
  box-shadow: 0 4px 12px rgba(19, 75, 234, 0.3);
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.demo-box:hover {
  background: linear-gradient(135deg, #40a9ff, #85b7ff);
  transform: scale(1.05);
}

.demo-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
}

.demo-name {
  font-size: 11px;
  opacity: 0.8;
}
</style>

```
:::