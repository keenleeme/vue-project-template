<script setup>
  import { ArrowRightOutlined } from '@ant-design/icons-vue';

  const componentItem = [
    [
      {
        group: '欢迎页',
        items: [
          {
            label: 'Popover 气泡提示',
            url: '/'
          },
          {
            label: 'Empty State 空状态提示',
            url: '/'
          }
        ]
      },
      {
        group: '新功能引导',
        items: [
          {
            label: 'Popover 气泡提示',
            url: '/'
          },
          {
            label: 'Steps 步骤条引导',
            url: '/'
          }
        ]
      }
    ],
    [
      {
        group: '提示说明',
        items: [
          {
            label: 'Placeholder 占位符',
            url: '/'
          },
          {
            label: 'Tooltips 工具提示',
            url: '/'
          },
          {
            label: 'Helper Text 帮助文本',
            url: '/'
          },
          {
            label: 'Popover 气泡提示',
            url: '/'
          },
          {
            label: 'Comparison Guide 对比指引',
            url: '/'
          },
          {
            label: 'Empty State 空状态提示',
            url: '/'
          }
        ]
      },
      {
        group: '操作反馈',
        items: [
          {
            label: 'Form Validation 表单校验提示',
            url: '/'
          },
          {
            label: 'Alert 告警',
            url: '/'
          },
          {
            label: 'Modal Dialog 模态对话框',
            url: '/'
          }
        ]
      }
    ],
    [
      {
        group: '用户手册',
        items: [
          {
            label: 'Help Documentation 帮助手册',
            url: '/'
          },
          {
            label: 'Tooltips 工具提示',
            url: '/'
          }
        ]
      },
      {
        group: '操作反馈',
        items: [
          {
            label: 'Form Validation 表单校验提示',
            url: '/'
          },
          {
            label: 'Alert 告警',
            url: '/'
          }
        ]
      }
    ]
  ];

  const axisItem = [
    {
      idx: 2,
      items: [
        {
          label: 'Help Documentation 帮助手册',
          url: '/'
        }
      ]
    },
    {
      idx: 1,
      items: [
        {
          label: 'Modal Dialog 模态对话框',
          url: '/'
        },
        {
          label: 'Popover 气泡提示',
          url: '/'
        },
        {
          label: 'Comparison Guide 对比指引',
          url: '/'
        }
      ]
    },
    {
      idx: 3,
      items: [
        {
          label: 'Helper Text 帮助文本',
          url: '/'
        },
        {
          label: 'Form Validation 表单校验提示',
          url: '/'
        },
        {
          label: 'Tooltips 工具提示',
          url: '/'
        },
        {
          label: 'Placeholder 占位符',
          url: '/'
        }
      ]
    },
    {
      idx: 4,
      items: [
        {
          label: 'Empty State 空状态提示',
          url: '/'
        },
        {
          label: 'Alert 告警',
          url: '/'
        },
        {
          label: 'Notification 通知',
          url: '/'
        },
        {
          label: 'Steps 步骤条引导',
          url: '/'
        }
      ]
    }
  ];
</script>
<template>
  <div class="components-guide">
    <div class="title-wrap">
      <img src="./images/banner.svg" alt="banner" />
      <div class="content">
        <p class="title">引导提示组件知识库</p>
        <p class="desc">
          引导提示组件可以帮助用户快速理解和使用产品，提升操作效率和用户体验。<br />
          此知识库提供了统一的参考框架，便于制定引导策略，提高开发效率、确保一致性。
        </p>
        <a-button type="default" class="bg-white" shape="round">
          查看知识库
          <ArrowRightOutlined />
        </a-button>
      </div>
    </div>
    <div class="saying-wrap">
      <div class="quote-wrap"><img class="quote-icon" src="./images/quote.svg" alt="quote" /></div>
      <p class="saying">人没有方向，就像一辆没有方向盘的车，永远到不了目的地。</p>
      <p class="author">乔治·S·巴顿</p>
    </div>

    <div class="guide-phase">
      <div class="bg-wrap"></div>
      <div class="phase-wrap">
        <p class="phase">GUIDANCE PHASE</p>
        <p class="title">按引导阶段分类</p>
      </div>
      <a-row>
        <a-col :span="8" class="component-type">
          <p>前置引导</p>
          <div class="right-dark" color="#C0D9FF" />
        </a-col>
        <a-col :span="8" class="component-type">
          <p>过程中引导</p>
          <div class="right-dark" color="#C0D9FF" />
          <div class="right" color="#C0D9FF" />
        </a-col>
        <a-col :span="8" class="component-type">
          <p>自助式引导</p>
          <div class="right" color="#C0D9FF" />
        </a-col>
      </a-row>
      <a-row :gutter="{ xs: 8, sm: 8, md: 16, lg: 24 }">
        <a-col v-for="(group, idx) in componentItem" :key="`componentItem-${idx}`" :span="8">
          <div class="compotent-wrap">
            <div v-for="item in group" :key="group.group + item.label">
              <p class="component-group">{{ item.group }}</p>
              <a-button class="components" v-for="comp in item.items" shape="round" :key="group.group + comp.label"
                >{{ comp.label }}<ArrowRightOutlined
              /></a-button>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
    <div class="ux-phase">
      <div class="phase-wrap">
        <p class="phase">USER EXPERIENCE</p>
        <p class="title">按体验感受分类</p>
      </div>
      <div class="card-wrap">
        <div v-for="(item, idx) in axisItem" :key="`axisItem-${idx}`" class="card">
          <div :class="['index', [2, 3].includes(item.idx) ? 'index-odd' : 'index-even']">{{ item.idx }}</div>
          <a-button v-for="comp in item.items" :key="`axisItem-${comp.label}`" class="components" shape="round"
            >{{ comp.label }}
            <ArrowRightOutlined />
          </a-button>
        </div>
        <div class="y-axis">
          <div>阻断强</div>
          <div class="axis"></div>
          <div class="low">阻断弱</div>
        </div>
        <div class="x-axis">
          <div class="low">存在感弱</div>
          <div class="axis"></div>
          <div>存在感强</div>
        </div>
      </div>
    </div>

    <div class="footer-wrap">
      <img class="ufo" src="./images/ufo.svg" alt="ufo" />
      <div class="footer-copy">
        <p class="info">期待您的意见或建议</p>
        <img class="qrcode" src="./images/qrcode.svg" alt="" />
        <p class="copy">Powered By @UED</p>
      </div>
    </div>
  </div>
</template>
<style scoped lang="less">
  @media screen and (max-width: 1440px) {
    .title-wrap {
      padding: 58px 10vw !important;
    }
    .saying-wrap {
      margin: 0px 10vw 80px !important;
    }
    .guide-phase,
    .ux-phase {
      margin: 0px 10vw !important;
    }
  }
  .components-guide {
    background: #f3f6fa;
    height: 100vh;
    overflow-y: auto;
    p {
      margin: 0;
    }
    :deep(.ant-btn) {
      color: #1e2128;
      border-color: #d1d5de;
      &:hover {
        color: #3b74f7;
        border-color: #3b74f7;
      }
    }
    .bg-white {
      background: #f2f3f5;
      border: none;
    }
  }
  .title-wrap {
    background: #5d79ca;
    padding: 58px 14vw;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 60px;
    .title {
      color: #ffffff;
      font-weight: 600;
      font-size: 3.805vw;
      line-height: normal;
      letter-spacing: 0px;
      text-align: left;
      margin-bottom: 26px;
    }
    .desc {
      color: #ffffff;
      font-size: 0.833vw;
      line-height: 32px;
      letter-spacing: 0px;
      text-align: left;
      margin-bottom: 26px;
    }
  }
  .saying-wrap {
    padding: 80px 0 32px;
    border-bottom: 1px solid #1e2128;
    margin: 0px 14vw 80px;
    .quote-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      .quote-icon {
        padding: 0 60px;
      }
      &::after,
      &::before {
        content: '';
        display: inline-block;
        height: 1px;
        flex: 1;
        background-color: #1e2128;
        position: relative;
      }
    }
    .saying,
    .author {
      text-align: center;
      color: #1e2128;
      letter-spacing: 0px;
    }
    .saying {
      font-weight: 600;
      font-size: 1.428vw;
      line-height: 32px;
      padding: 32px 0 8px;
    }
    .author {
      font-size: 0.833vw;
      line-height: 24px;
    }
  }
  .guide-phase,
  .ux-phase {
    margin: 0px 14vw;
    .phase-wrap {
      position: relative;
      .phase {
        color: #ffffff0f;
        font-weight: bold;
        font-size: 4.762vw;
        line-height: 80px;
        letter-spacing: 0px;
        text-align: center;
      }
      .title {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 0;
        float: left;
        color: #ffffff;
        font-weight: 600;
        font-size: 1.904vw;
        line-height: 1.904vw;
        letter-spacing: 0px;
        text-align: center;
      }
    }
    .components {
      display: block;
      margin-top: 12px;
    }
  }
  .guide-phase {
    border-radius: 32px;
    padding: 32px 5.357vw;
    position: relative;
    .bg-wrap {
      height: 23.81vw;
      width: 100%;
      border-radius: 32px;
      background: #5d79ca;
      position: absolute;
      top: 0;
      left: 0;
    }
    .component-type {
      color: #1e2128;
      font-family: PingFang SC;
      font-weight: medium;
      font-size: 14px;
      line-height: 24px;
      letter-spacing: 0px;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin: 32px 0 24px;
      p {
        padding: 2px 0;
        flex: 1;
        background: #c0d9ff;
      }
      .right-dark,
      .right {
        width: 0;
        height: 0;
        border-right: 14px solid transparent;
        border-top: 14px solid transparent;
        border-bottom: 14px solid transparent;
        border-left: 14px solid #c0d9ff;
      }
      .right {
        position: absolute;
        left: 0;
        top: 0;
        border-left: 14px solid #5d79ca;
      }
    }
    .compotent-wrap {
      height: 100%;
      padding: 0 2.381vw 10px;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0px 4px 16px 0px #0639c314;
      > div {
        margin-bottom: 10px;
      }
    }
    .component-group {
      color: #000000;
      font-weight: 700;
      font-size: 16px;
      line-height: 0.952vw;
      letter-spacing: 0px;
      text-align: left;
      position: relative;
      width: fit-content;
      margin-bottom: 24px;
      padding-top: 32px;
      background-image: linear-gradient(to bottom, #c0d9ff, #c0d9ff 8px, transparent 8px, transparent);
      background-size: 100% 8px;
      background-repeat: no-repeat;
      background-position: bottom;
    }
  }
  .ux-phase {
    position: relative;
    .phase-wrap {
      .phase {
        color: #e8f2ff;
      }
      .title {
        color: #5d79ca;
      }
    }
    .card-wrap {
      position: relative;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: 5.714vw;
      padding: 32px 5.357vw;
      margin-top: 48px;
      .y-axis {
        color: #5d79ca;
        font-size: 16px;
        position: absolute;
        height: 100%;
        top: 0;
        left: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        transform: translateX(-50%);
        gap: 16px;
        .axis {
          display: flex;
          flex-direction: column;
          align-items: center;
          height: 100%;
          &::before {
            content: '';
            width: 0;
            height: 0;
            border-right: 10px solid transparent;
            border-bottom: 10px solid #6e9efd;
            border-top: 10px solid transparent;
            border-left: 10px solid transparent;
          }
          &::after {
            content: '';
            width: 6px;
            flex: 1;
            background: linear-gradient(180deg, #6e9efd 0%, #84affe 50%, #98beff00 100%);
          }
        }
        .low {
          color: #98beff;
        }
      }
      .x-axis {
        font-size: 16px;
        gap: 16px;
        color: #5d79ca;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: absolute;
        width: 100%;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        .axis {
          display: flex;
          align-items: center;
          flex: 1;
          &::before {
            content: '';
            height: 6px;
            flex: 1;
            background: linear-gradient(270deg, #6e9efd 0%, #84affe 50%, #98beff00 100%);
          }
          &::after {
            content: '';
            width: 0;
            height: 0;
            border-right: 10px solid transparent;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            border-left: 10px solid #6e9efd;
          }
        }
        .low {
          color: #98beff;
        }
      }
      .card {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        position: relative;
        padding: 16px;
        min-height: 16.428vw;
        border-radius: 8px;
        background: #ffffff;
        box-shadow: 0px 4px 16px 0px #0639c314;
      }
      .index {
        position: absolute;
        top: 0.952vw;
        border-radius: 50%;
        background: #e8f2ff;
        color: #98beff;
        font-weight: 600;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 4.285vw;
        width: 4.285vw;
        font-size: 1.904vw;
      }
      .index-odd {
        left: 0.952vw;
      }
      .index-even {
        right: 0.952vw;
      }
    }
  }

  .footer-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-top: 2.976vw;
    position: relative;
    padding-top: 30px;
    height: 282px;
    .ufo {
      position: absolute;
      z-index: 2;
      bottom: 0;
    }
    &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 252px;
      background: #5d79ca;
      z-index: 1;
    }
    .footer-copy {
      position: absolute;
      z-index: 2;
      bottom: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 72px 0 24px;
      gap: 24px;
      color: #ffffff;
      .info {
        font-weight: 600;
        font-size: 16px;
        line-height: 16px;
        letter-spacing: 0px;
        text-align: center;
      }
      .copy {
        font-weight: 400;
        font-size: 12px;
        line-height: 12px;
        letter-spacing: 0px;
        text-align: center;
      }
    }
  }
</style>
