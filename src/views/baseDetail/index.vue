<template>
  <div class="base-detail-box">
    <div class="base-detail-header">
      <img class="header-info-avator" src="@/assets/images/login/ainta.png" />
      <div class="header-info">
        <div>
          <div class="header-info-text">
            <span class="mr-8">仅支持 EXCEL 格式文件</span>
            <a-tag color="geekblue">默认标签</a-tag>
          </div>
        </div>
        <div class="header-info-status">
          <span class="circle-status" />
          在线
        </div>
      </div>

      <a-button size="small" style="float: right">描边按钮</a-button>
    </div>
    <div class="header-form">
      <a-form class="pd-16" name="basic" autocomplete="off">
        <a-row>
          <a-col :span="8">
            <a-form-item label="组件类型">
              <span>流量探针(APT)</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="注册时间">
              <span>2022-04-21 20:15:08</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="本日上送条数">
              <span>0条</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="唯一标识">
              <span>apt-192.168.33.126-2773879f</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="软件版本">
              <span>asen2.0.69.47825.220421_s</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="许可证">
              <span>正式(2030-01-28到期)</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="设备IP">
              <span><a style="color: var(--primary-color);">192.168.33.188</a></span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="规则版本">
              <span>2.0.25727.220121.1</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="单位">
              <span>TZ9533</span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!--更多信息-->
    <div class="more-info">
      <div class="base-detail-title">更多信息</div>

      <a-form class="pd-16" name="basic" autocomplete="off">
        <a-row>
          <a-col :span="8">
            <a-form-item label="资产编号">
              <span>213892894</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="使用状态">
              <span>使用中</span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="使用人">
              <span>小龙人</span>
            </a-form-item>
          </a-col>
          <a-col :span="16">
            <a-form-item label="描述信息">
              <span>
                资产描述‘process_open’函数存在安全漏洞，该漏洞源于程序在只读模式下没有正确的阻止写入操作。支持对所有的持对所有的持对…
              </span>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="国产化">
              <span>普通</span>
            </a-form-item>
          </a-col>
          <a-col :span="16">
            <a-form-item label="更多信息">
              <span>
                这是服务于浙江省的涉疫系统的重要组成部分，服务于杭州市的数字化这是服务于浙江省的涉疫系统的重要组成部分，这是服务于浙江省的涉疫系统的重要组成部分。
              </span>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!--任务记录-->
    <div class="task-list">
      <div class="base-detail-title">任务记录</div>

      <a-timeline class="pd-24">
        <a-timeline-item>
          <div class="timeline-title">宁波市政数局[系统管理员【系统管理员JIP资产变更申请发起】</div>
          <div class="timeline-date">2022-01-01</div>
        </a-timeline-item>
        <a-timeline-item>
          <div class="timeline-title">宁波市政数局[系统管理员【系统管理员JIP资产变更申请发起】</div>
          <div class="timeline-date">2022-02-01</div>
        </a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
  .base-detail-box {
    padding: 24px 16px;
    .base-detail-header {
      display: flex;
      height: 112px;
      width: 100%;
      padding: 24px 16px;
      background: var(--primary-bg);
      border-bottom: 1px solid var(--primary-divider);
      .header-info-avator {
        width: 64px;
        height: 64px;
        padding: 8px;
        border-radius: 4px;
        background-color: #6e9efd;
      }
      .header-info {
        flex: 1;
        margin-left: 8px;
        .header-info-text {
          font-size: 12px;
          margin-bottom: 16px;
          color: var(--color-text-title);
        }
        .header-info-status {
          font-size: 12px;
          color: var(--color-text-title);
          .circle-status {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #1db969;
            margin-right: 4px;
          }
        }
      }
    }
    .header-form {
      padding: 16px 0;
      background: var(--primary-bg);
    }
    .more-info {
      margin: 16px 0;
      background: var(--primary-bg);
    }
    .base-detail-title {
      height: 46px;
      line-height: 46px;
      text-indent: 16px;
      font-size: 14px;
      font-weight: 600;
      color: var(--color-text-title);
      border-bottom: 1px solid var(--primary-divider);
    }

    .task-list {
      background: var(--primary-bg);
      .timeline-title {
        font-size: 14px;
        font-weight: 400;
      }
      .timeline-date {
        font-size: 12px;
        font-weight: 400;
        color: var(--color-text-sub-title);
      }
    }
  }

  .mr-8 {
    margin-right: 8px;
  }
  .pd-16 {
    padding: 16px;
  }
  .pd-24 {
    padding: 24px 16px;
  }
</style>

<style lang="less">
  // 样式覆盖
  .base-detail-box {
    .ant-form-item {
      margin-bottom: 2px !important;
    }
    .ant-form-item-label {
      label {
        font-size: 12px;
        font-weight: 400;
        color: var(--color-text-placeholder);
      }
    }
    .ant-form-item-control {
      font-size: 12px;
      font-weight: 400;
    }
  }
</style>
