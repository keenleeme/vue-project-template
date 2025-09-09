# 色彩

推荐使用以下调色板的颜色作为设计和开发规范，以保证页面和组件之间的视觉一致。

## 主色

主色是平台色彩的核心，用于重要的交互元素和平台识别。

<div class="color-palette">
  <div class="color-section">
    <div class="color-row">
      <div class="color-card" @click="copyColor('#134bea')">
        <div class="color-block" style="background-color: #134bea;"></div>
        <div class="color-info">
          <div class="color-name">Primary</div>
          <div class="color-value">#134bea</div>
        </div>
      </div>
      <div class="color-card" @click="copyColor('#6E9EFD')">
        <div class="color-block" style="background-color: #6E9EFD;"></div>
        <div class="color-info">
          <div class="color-name">Light Primary</div>
          <div class="color-value">#6E9EFD</div>
        </div>
      </div>
      <div class="color-card" @click="copyColor('#0639C3')">
        <div class="color-block" style="background-color: #0639C3;"></div>
        <div class="color-info">
          <div class="color-name">Dark Primary</div>
          <div class="color-value">#0639C3</div>
        </div>
      </div>
    </div>
  </div>
</div>

## 状态色

状态色用于不同状态的信息传达，帮助用户理解当前的操作状态。

<div class="color-palette">
  <div class="color-section">
    <div class="color-row">
      <div class="color-card" @click="copyColor('#134bea')">
        <div class="color-block" style="background-color: #134bea;"></div>
        <div class="color-info">
          <div class="color-name">Primary</div>
          <div class="color-value">#134bea</div>
        </div>
      </div>
      <div class="color-card" @click="copyColor('#3B71EE')">
        <div class="color-block" style="background-color: #3B71EE;"></div>
        <div class="color-info">
          <div class="color-name">Info</div>
          <div class="color-value">#3B71EE</div>
        </div>
      </div>
      <div class="color-card" @click="copyColor('#1DB969')">
        <div class="color-block" style="background-color: #1DB969;"></div>
        <div class="color-info">
          <div class="color-name">Success</div>
          <div class="color-value">#1DB969</div>
        </div>
      </div>
      <div class="color-card" @click="copyColor('#FF7F29')">
        <div class="color-block" style="background-color: #FF7F29;"></div>
        <div class="color-info">
          <div class="color-name">Warning</div>
          <div class="color-value">#FF7F29</div>
        </div>
      </div>
      <div class="color-card" @click="copyColor('#F53C3C')">
        <div class="color-block" style="background-color: #F53C3C;"></div>
        <div class="color-info">
          <div class="color-name">Error</div>
          <div class="color-value">#F53C3C</div>
        </div>
      </div>
    </div>
  </div>
</div>

## 中性色

中性色用于文本、背景、边框等，是界面设计中最常用的颜色。

<div class="color-palette">
  <div class="color-section">
    <h3>文本色</h3>
    <div class="color-row">
      <div class="color-card" @click="copyColor('#134BEA')">
        <div class="color-block" style="background-color: #134BEA;"></div>
        <div class="color-info">
          <div class="color-name">链接</div>
          <div class="color-value">#134BEA</div>
        </div>
      </div>
      <div class="color-card" @click="copyColor('#1E2435')">
        <div class="color-block" style="background-color: #1E2435;"></div>
        <div class="color-info">
          <div class="color-name">标题 Title</div>
          <div class="color-value">#1E2435</div>
        </div>
      </div>
      <div class="color-card" @click="copyColor('#353C51')">
        <div class="color-block" style="background-color: #353C51;"></div>
        <div class="color-info">
          <div class="color-name">正文 Content</div>
          <div class="color-value">#353C51</div>
        </div>
      </div>
      <div class="color-card" @click="copyColor('#7E8494')">
        <div class="color-block" style="background-color: #7E8494;"></div>
        <div class="color-info">
          <div class="color-name">辅助/图标 Sub Color</div>
          <div class="color-value">#7E8494</div>
        </div>
      </div>
      <div class="color-card" @click="copyColor('#ADB1BC')">
        <div class="color-block" style="background-color: #ADB1BC;"></div>
        <div class="color-info">
          <div class="color-name">失效 Disabled</div>
          <div class="color-value">#ADB1BC</div>
        </div>
      </div>
    </div>
  </div>
  
  <div class="color-section">
    <h3>背景色</h3>
    <div class="color-row">
      <div class="color-card" @click="copyColor('#CBD0DB')">
        <div class="color-block" style="background-color: #CBD0DB; border: 1px solid #E9EAF0;"></div>
        <div class="color-info">
          <div class="color-name">边框 Border</div>
          <div class="color-value">#CBD0DB</div>
        </div>
      </div>
      <div class="color-card" @click="copyColor('#E9EAF0')">
        <div class="color-block" style="background-color: #E9EAF0; border: 1px solid #CBD0DB;"></div>
        <div class="color-info">
          <div class="color-name">分割线 Divider</div>
          <div class="color-value">#E9EAF0</div>
        </div>
      </div>
      <div class="color-card" @click="copyColor('#F6F7FB')">
        <div class="color-block" style="background-color: #F6F7FB; border: 1px solid #E9EAF0;"></div>
        <div class="color-info">
          <div class="color-name">背景 Background</div>
          <div class="color-value">#F6F7FB</div>
        </div>
      </div>
    </div>
  </div>
</div>

## 渐变色

渐变色用于营造层次感和视觉焦点，适用于按钮、卡片等重要元素。

<div class="color-palette">
  <div class="color-section">
    <div class="color-row">
      <div class="color-card gradient-card" @click="copyColor('linear-gradient(135deg, #134bea, #6E9EFD)')">
        <div class="color-block" style="background: linear-gradient(135deg, #134bea, #6E9EFD);"></div>
        <div class="color-info">
          <div class="color-name">主渐变</div>
          <div class="color-value">135deg, #134bea, #6E9EFD</div>
        </div>
      </div>
      <div class="color-card gradient-card" @click="copyColor('linear-gradient(135deg, #1DB969, #4CD284)')">
        <div class="color-block" style="background: linear-gradient(135deg, #1DB969, #4CD284);"></div>
        <div class="color-info">
          <div class="color-name">成功渐变</div>
          <div class="color-value">135deg, #1DB969, #4CD284</div>
        </div>
      </div>
      <div class="color-card gradient-card" @click="copyColor('linear-gradient(135deg, #FF7F29, #FEA562)')">
        <div class="color-block" style="background: linear-gradient(135deg, #FF7F29, #FEA562);"></div>
        <div class="color-info">
          <div class="color-name">警告渐变</div>
          <div class="color-value">135deg, #FF7F29, #FEA562</div>
        </div>
      </div>
      <div class="color-card gradient-card" @click="copyColor('linear-gradient(135deg, #F53C3C, #F87C79)')">
        <div class="color-block" style="background: linear-gradient(135deg, #F53C3C, #F87C79);"></div>
        <div class="color-info">
          <div class="color-name">错误渐变</div>
          <div class="color-value">135deg, #F53C3C, #F87C79</div>
        </div>
      </div>
    </div>
  </div>
</div>

<script setup>
import { ref } from 'vue'
import { message } from 'ant-design-vue'

const copyColor = async (color) => {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(color).then(() => {
      message.success('复制成功');
    }).catch(err => {
      message.error('复制失败');
    });
  } else {
    fallbackCopy(color);
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

<style scoped>
.color-palette {
  margin: 24px 0;
}

.color-section {
  margin-bottom: 32px;
}

.color-section h3 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.color-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.color-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}

.color-card:hover {
  border-color: #134bea;
  box-shadow: 0 2px 8px rgba(19, 75, 234, 0.15);
  transform: translateY(-2px);
}

.color-block {
  width: 60px;
  height: 60px;
  border-radius: 6px;
  margin-bottom: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-info {
  text-align: center;
}

.color-name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  margin-bottom: 4px;
}

.color-value {
  font-size: 12px;
  color: #8c8c8c;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

.gradient-card .color-value {
  font-size: 10px;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .color-row {
    gap: 12px;
  }
  
  .color-card {
    min-width: 100px;
    padding: 12px;
  }
  
  .color-block {
    width: 50px;
    height: 50px;
  }
}
</style>