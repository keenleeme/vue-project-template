<template>
  <div class="trace-task-detail-container">
    <a-card style="height: 100%">
      <div class="page-header">
        <div>
          <div class="page-title">溯源任务详情</div>
          <div class="page-subtitle">聚合账号访问行为、数据标签与风险告警，快速完成关联研判</div>
        </div>
        <a-button @click="goBack">
          <template #icon><ArrowLeftOutlined /></template>
          返回列表
        </a-button>
      </div>

      <template v-if="task">
        <div class="overview-panel">
          <div class="overview-main">
            <div class="overview-type">{{ getTraceTypeLabel(task.traceType) }}</div>
            <div class="overview-name">{{ task.name }}</div>
            <div class="overview-desc">
              {{ task.description || '围绕账号访问链路、命中数据标签与风险告警进行关联分析。' }}
            </div>
          </div>
          <div class="overview-side">
            <div class="overview-side-item">
              <span class="item-label">任务状态</span>
              <a-tag :color="getStatusTagColor(task.status)">
                {{ getStatusLabel(task.status) }}
              </a-tag>
            </div>
            <div class="overview-side-item">
              <span class="item-label">创建时间</span>
              <span>{{ formatDateTime(task.createTime) }}</span>
            </div>
            <div class="overview-side-item">
              <span class="item-label">最近更新时间</span>
              <span>{{ formatDateTime(task.updateTime) }}</span>
            </div>
          </div>
        </div>

        <div class="info-section">
          <a-row :gutter="[16, 16]">
            <a-col :span="8">
              <div class="info-card">
                <div class="info-label">任务名称</div>
                <div class="info-value">{{ task.name }}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info-card">
                <div class="info-label">任务描述</div>
                <div class="info-value">{{ task.description || '-' }}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="info-card">
                <div class="info-label">执行并发说明</div>
                <div class="info-value">最多支持 {{ MAX_RUNNING_TASKS }} 个任务并行执行</div>
              </div>
            </a-col>
          </a-row>
        </div>

        <div class="condition-panel">
          <div class="panel-title">筛选条件</div>
          <a-row :gutter="[16, 16]">
            <a-col :span="8">
              <div class="condition-item">
                <div class="condition-label">应用</div>
                <div class="condition-value">{{ taskFilterSummary.app }}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="condition-item">
                <div class="condition-label">账号</div>
                <div class="condition-value">{{ taskFilterSummary.account }}</div>
              </div>
            </a-col>
            <a-col :span="8">
              <div class="condition-item">
                <div class="condition-label">发生时间</div>
                <div class="condition-value">{{ taskFilterSummary.timeRange }}</div>
              </div>
            </a-col>
          </a-row>
        </div>

        <template v-if="accountInsight">
          <a-tabs v-model:activeKey="activeTab" class="detail-tabs">
            <a-tab-pane key="analysis" tab="溯源分析">
              <div class="tab-panel">
                <a-row :gutter="[16, 16]">
                  <a-col :span="10">
                    <div class="module-card profile-card">
                      <div class="module-header">
                        <div class="module-title">账号基本信息</div>
                      </div>
                      <div class="profile-top">
                        <div class="profile-avatar">{{ accountInsight.accountName.slice(0, 1).toUpperCase() }}</div>
                        <div class="profile-meta">
                          <div class="profile-name">{{ accountInsight.accountName }}</div>
                          <div class="profile-sub">{{ accountInsight.department }}</div>
                        </div>
                      </div>
                      <div class="profile-list">
                        <div class="profile-row">
                          <span>账号名称</span>
                          <strong>{{ accountInsight.accountName }}</strong>
                        </div>
                        <div class="profile-row">
                          <span>所属应用</span>
                          <strong> {{ accountInsight.appInfo.domain }} / {{ accountInsight.appInfo.name }} </strong>
                        </div>
                        <div class="profile-row">
                          <span>重要程度</span>
                          <a-tag :color="importanceColorMap[accountInsight.appInfo.importance]">
                            {{ accountInsight.appInfo.importance }}
                          </a-tag>
                        </div>
                        <div class="profile-row">
                          <span>部门</span>
                          <strong>{{ accountInsight.department }}</strong>
                        </div>
                      </div>
                    </div>
                  </a-col>
                  <a-col :span="14">
                    <a-row :gutter="[16, 16]">
                      <a-col :span="8" v-for="metric in accountInsight.metrics" :key="metric.label">
                        <div class="metric-card">
                          <div class="metric-label">{{ metric.label }}</div>
                          <div class="metric-value">{{ metric.value }}</div>
                          <div class="metric-desc">{{ metric.desc }}</div>
                        </div>
                      </a-col>
                    </a-row>
                  </a-col>
                </a-row>

                <a-row :gutter="[16, 16]" class="module-row">
                  <a-col :span="12">
                    <div class="module-card chart-card top10-chart-card">
                      <div class="module-header">
                        <div class="module-title">访问IP TOP10</div>
                        <div class="module-extra">IP / 访问次数</div>
                      </div>
                      <div ref="ipTop10ChartRef" class="chart-container top10-chart-canvas"></div>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="module-card chart-card top10-chart-card">
                      <div class="module-header">
                        <div class="module-title">访问API TOP10</div>
                        <div class="module-extra">API / 访问次数</div>
                      </div>
                      <div ref="apiTop10ChartRef" class="chart-container top10-chart-canvas"></div>
                    </div>
                  </a-col>
                </a-row>

                <a-row :gutter="[16, 16]" class="module-row">
                  <a-col :span="12">
                    <div class="module-card chart-card">
                      <div class="module-header">
                        <div class="module-title">访问数据标签分布</div>
                        <div class="module-extra">悬浮查看数据标签、请求命中与返回命中次数</div>
                      </div>
                      <div ref="labelTreemapRef" class="chart-container"></div>
                    </div>
                  </a-col>
                  <a-col :span="12">
                    <div class="risk-distribution-grid">
                      <div class="module-card distribution-card">
                        <div class="module-header">
                          <div class="module-title">Web安全告警分布</div>
                        </div>
                        <div class="distribution-list">
                          <div
                            v-for="item in accountInsight.webAlertDistribution"
                            :key="`web-${item.name}`"
                            class="distribution-row"
                          >
                            <div class="distribution-main">
                              <a-tag :color="riskLevelColorMap[item.level]">{{ item.level }}</a-tag>
                              <span class="distribution-name">{{ item.name }}</span>
                            </div>
                            <strong>{{ item.count }}</strong>
                          </div>
                        </div>
                      </div>

                      <div class="module-card distribution-card">
                        <div class="module-header">
                          <div class="module-title">异常行为风险分布</div>
                        </div>
                        <div class="distribution-list">
                          <div
                            v-for="item in accountInsight.behaviorAlertDistribution"
                            :key="`behavior-${item.name}`"
                            class="distribution-row"
                          >
                            <div class="distribution-main">
                              <a-tag :color="riskLevelColorMap[item.level]">{{ item.level }}</a-tag>
                              <span class="distribution-name">{{ item.name }}</span>
                            </div>
                            <strong>{{ item.count }}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </a-tab-pane>

            <a-tab-pane key="risk" tab="风险分析">
              <div class="tab-panel">
                <div class="module-card narrative-card">
                  <div class="module-header">
                    <div class="module-title">综合描述</div>
                  </div>
                  <div class="narrative-text">{{ webSummaryText }}</div>
                  <div class="narrative-text">{{ behaviorSummaryText }}</div>
                </div>

                <div class="timeline-section">
                  <div class="section-title">Web安全事件时间线</div>
                  <a-row :gutter="[16, 16]">
                    <a-col :span="6">
                      <div class="module-card timeline-nav-card">
                        <div
                          v-for="slot in accountInsight.webTimeline"
                          :key="slot.id"
                          :class="['timeline-nav-item', { active: selectedWebSlot?.id === slot.id }]"
                          @click="selectedWebSlotId = slot.id"
                        >
                          <div class="timeline-nav-time">{{ slot.timeRange }}</div>
                          <div class="timeline-nav-name">{{ slot.name }}</div>
                          <div class="timeline-nav-count">事件 {{ slot.count }} 次</div>
                        </div>
                      </div>
                    </a-col>
                    <a-col :span="18">
                      <div class="module-card">
                        <a-collapse :bordered="false" class="api-collapse">
                          <a-collapse-panel v-for="api in selectedWebSlot?.apis || []" :key="api.key">
                            <template #header>
                              <div class="api-panel-header">
                                <div class="api-panel-main">
                                  <a-tag color="blue" class="method-tag">{{ api.method }}</a-tag>
                                  <span>{{ api.path }}</span>
                                </div>
                                <div class="api-panel-count">告警 {{ api.count }} 次</div>
                              </div>
                            </template>
                            <a-table
                              :columns="riskEventColumns"
                              :data-source="api.events"
                              :pagination="false"
                              size="small"
                              :scroll="{ x: 1180 }"
                              :row-key="(record: RiskEvent) => record.id"
                            >
                              <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'level'">
                                  <a-tag :color="riskLevelColorMap[record.level]">
                                    {{ record.level }}
                                  </a-tag>
                                </template>
                                <template v-else-if="column.key === 'dataTags'">
                                  <div class="data-tag-cell">
                                    <div>请求：{{ joinTags(record.requestTags) }}</div>
                                    <div>返回：{{ joinTags(record.responseTags) }}</div>
                                  </div>
                                </template>
                                <template v-else-if="column.key === 'operation'">
                                  <a-button type="link" @click="openEventDetail(record as RiskEvent)">
                                    查看详情
                                  </a-button>
                                </template>
                              </template>
                            </a-table>
                          </a-collapse-panel>
                        </a-collapse>
                      </div>
                    </a-col>
                  </a-row>
                </div>

                <div class="timeline-section">
                  <div class="section-title">异常行为时间线</div>
                  <a-row :gutter="[16, 16]">
                    <a-col :span="6">
                      <div class="module-card timeline-nav-card">
                        <div
                          v-for="slot in accountInsight.behaviorTimeline"
                          :key="slot.id"
                          :class="['timeline-nav-item', { active: selectedBehaviorSlot?.id === slot.id }]"
                          @click="selectedBehaviorSlotId = slot.id"
                        >
                          <div class="timeline-nav-time">{{ slot.timeRange }}</div>
                          <div class="timeline-nav-name">{{ slot.name }}</div>
                          <div class="timeline-nav-count">事件 {{ slot.count }} 次</div>
                        </div>
                      </div>
                    </a-col>
                    <a-col :span="18">
                      <div class="module-card">
                        <a-collapse :bordered="false" class="api-collapse">
                          <a-collapse-panel v-for="api in selectedBehaviorSlot?.apis || []" :key="api.key">
                            <template #header>
                              <div class="api-panel-header">
                                <div class="api-panel-main">
                                  <a-tag color="cyan" class="method-tag">{{ api.method }}</a-tag>
                                  <span>{{ api.path }}</span>
                                </div>
                                <div class="api-panel-count">告警 {{ api.count }} 次</div>
                              </div>
                            </template>
                            <a-table
                              :columns="riskEventColumns"
                              :data-source="api.events"
                              :pagination="false"
                              size="small"
                              :scroll="{ x: 1180 }"
                              :row-key="(record: RiskEvent) => record.id"
                            >
                              <template #bodyCell="{ column, record }">
                                <template v-if="column.key === 'level'">
                                  <a-tag :color="riskLevelColorMap[record.level]">
                                    {{ record.level }}
                                  </a-tag>
                                </template>
                                <template v-else-if="column.key === 'dataTags'">
                                  <div class="data-tag-cell">
                                    <div>请求：{{ joinTags(record.requestTags) }}</div>
                                    <div>返回：{{ joinTags(record.responseTags) }}</div>
                                  </div>
                                </template>
                                <template v-else-if="column.key === 'operation'">
                                  <a-button type="link" @click="openEventDetail(record as RiskEvent)">
                                    查看详情
                                  </a-button>
                                </template>
                              </template>
                            </a-table>
                          </a-collapse-panel>
                        </a-collapse>
                      </div>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
        </template>

        <template v-else-if="sensitiveAnalysisResult">
          <div class="fallback-section sensitive-trace-section">
            <a-alert
              type="info"
              show-icon
              message="敏感数据溯源（线索溯源）"
              description="基于线索交集匹配的访问日志聚合结果，各维度清单均可查看访问日志条数、首末次命中时间及访问情况说明。"
            />

            <div class="module-card sensitive-result-card">
              <div class="module-header">
                <div class="module-title">溯源分析结果</div>
                <a-button type="primary" @click="sensitiveResultDetailOpen = true">查看详细信息</a-button>
              </div>

              <a-row :gutter="[16, 16]">
                <a-col :xs="24" :md="8">
                  <div class="sensitive-stat-block">
                    <div class="sensitive-stat-label">分析时间范围</div>
                    <div class="sensitive-stat-value">
                      {{ sensitiveAnalysisResult.timeRange[0] }} ~ {{ sensitiveAnalysisResult.timeRange[1] }}
                    </div>
                  </div>
                </a-col>
                <a-col :xs="24" :md="8">
                  <div class="sensitive-stat-block">
                    <div class="sensitive-stat-label">任务名称</div>
                    <div class="sensitive-stat-value">{{ sensitiveAnalysisResult.taskName }}</div>
                  </div>
                </a-col>
                <a-col :xs="24" :md="8">
                  <div class="sensitive-stat-block">
                    <div class="sensitive-stat-label">匹配的 API 访问日志总数</div>
                    <div class="sensitive-stat-value sensitive-stat-number">
                      {{ sensitiveAnalysisResult.matchedAccessLogTotal.toLocaleString() }}
                    </div>
                  </div>
                </a-col>
              </a-row>

              <div class="sensitive-block">
                <div class="sensitive-block-title">线索</div>
                <ul class="sensitive-clue-list">
                  <li v-for="(line, idx) in sensitiveAnalysisResult.clues" :key="idx">{{ line }}</li>
                </ul>
              </div>

              <a-row :gutter="[16, 16]" class="sensitive-entity-row">
                <a-col :xs="12" :lg="4">
                  <div class="entity-count-pill">
                    <span class="entity-count">{{ sensitiveAnalysisResult.apiRows.length }}</span>
                    <span class="entity-label">涉及 API</span>
                  </div>
                </a-col>
                <a-col :xs="12" :lg="4">
                  <div class="entity-count-pill">
                    <span class="entity-count">{{ sensitiveAnalysisResult.appRows.length }}</span>
                    <span class="entity-label">涉及应用</span>
                  </div>
                </a-col>
                <a-col :xs="12" :lg="4">
                  <div class="entity-count-pill">
                    <span class="entity-count">{{ sensitiveAnalysisResult.dataRows.length }}</span>
                    <span class="entity-label">涉及数据</span>
                  </div>
                </a-col>
                <a-col :xs="12" :lg="4">
                  <div class="entity-count-pill">
                    <span class="entity-count">{{ sensitiveAnalysisResult.fileRows.length }}</span>
                    <span class="entity-label">涉及文件</span>
                  </div>
                </a-col>
                <a-col :xs="12" :lg="4">
                  <div class="entity-count-pill">
                    <span class="entity-count">{{ sensitiveAnalysisResult.accountRows.length }}</span>
                    <span class="entity-label">涉及账号</span>
                  </div>
                </a-col>
                <a-col :xs="12" :lg="4">
                  <div class="entity-count-pill">
                    <span class="entity-count">{{ sensitiveAnalysisResult.ipRows.length }}</span>
                    <span class="entity-label">涉及 IP</span>
                  </div>
                </a-col>
              </a-row>

              <div class="sensitive-block sensitive-entity-tables">
                <div class="sensitive-block-title">匹配对象清单与访问情况</div>
                <a-tabs v-model:activeKey="sensitiveEntityTab" size="small" class="sensitive-entity-tabs">
                  <a-tab-pane key="api" :tab="`API（${sensitiveAnalysisResult.apiRows.length}）`">
                    <a-table
                      size="small"
                      :columns="sensitiveAccessColumns"
                      :data-source="sensitiveAnalysisResult.apiRows"
                      :pagination="{ pageSize: 6, size: 'small' }"
                      :scroll="{ x: 900 }"
                    />
                  </a-tab-pane>
                  <a-tab-pane key="app" :tab="`应用（${sensitiveAnalysisResult.appRows.length}）`">
                    <a-table
                      size="small"
                      :columns="sensitiveAccessColumns"
                      :data-source="sensitiveAnalysisResult.appRows"
                      :pagination="{ pageSize: 6, size: 'small' }"
                      :scroll="{ x: 900 }"
                    />
                  </a-tab-pane>
                  <a-tab-pane key="data" :tab="`数据（${sensitiveAnalysisResult.dataRows.length}）`">
                    <a-table
                      size="small"
                      :columns="sensitiveAccessColumns"
                      :data-source="sensitiveAnalysisResult.dataRows"
                      :pagination="{ pageSize: 6, size: 'small' }"
                      :scroll="{ x: 900 }"
                    />
                  </a-tab-pane>
                  <a-tab-pane key="file" :tab="`文件（${sensitiveAnalysisResult.fileRows.length}）`">
                    <a-table
                      size="small"
                      :columns="sensitiveAccessColumns"
                      :data-source="sensitiveAnalysisResult.fileRows"
                      :pagination="{ pageSize: 6, size: 'small' }"
                      :scroll="{ x: 900 }"
                    />
                  </a-tab-pane>
                  <a-tab-pane key="account" :tab="`账号（${sensitiveAnalysisResult.accountRows.length}）`">
                    <a-table
                      size="small"
                      :columns="sensitiveAccessColumns"
                      :data-source="sensitiveAnalysisResult.accountRows"
                      :pagination="{ pageSize: 6, size: 'small' }"
                      :scroll="{ x: 900 }"
                    />
                  </a-tab-pane>
                  <a-tab-pane key="ip" :tab="`IP（${sensitiveAnalysisResult.ipRows.length}）`">
                    <a-table
                      size="small"
                      :columns="sensitiveAccessColumns"
                      :data-source="sensitiveAnalysisResult.ipRows"
                      :pagination="{ pageSize: 6, size: 'small' }"
                      :scroll="{ x: 900 }"
                    />
                  </a-tab-pane>
                </a-tabs>
              </div>

              <p class="sensitive-hint">弹窗内提供同结构完整清单，便于复制与对照研判。</p>
            </div>
          </div>
        </template>

        <template v-else>
          <div class="fallback-section">
            <a-alert
              type="info"
              show-icon
              message="当前详情页重点适配“账号溯源”与“敏感数据溯源”任务。"
              description="源 IP 溯源等类型可查看基础信息与已选条件；账号溯源展示完整分析时间线。"
            />

            <div class="module-card generic-condition-card">
              <div class="module-header">
                <div class="module-title">当前溯源条件</div>
              </div>
              <div class="condition-tag-list">
                <a-tag v-for="tag in task.conditionTags ?? []" :key="tag" class="condition-tag">
                  {{ tag }}
                </a-tag>
              </div>
            </div>
          </div>
        </template>
      </template>

      <a-empty v-else description="未找到对应任务" />
    </a-card>

    <a-modal
      v-model:open="sensitiveResultDetailOpen"
      title="溯源分析结果详情"
      width="920px"
      centered
      :footer="null"
      :body-style="{ maxHeight: '75vh', overflowY: 'auto' }"
      @cancel="sensitiveResultDetailOpen = false"
    >
      <template v-if="sensitiveAnalysisResult">
        <a-descriptions bordered :column="1" size="small" class="sensitive-desc">
          <a-descriptions-item label="分析时间范围">
            {{ sensitiveAnalysisResult.timeRange[0] }} ~ {{ sensitiveAnalysisResult.timeRange[1] }}
          </a-descriptions-item>
          <a-descriptions-item label="任务名称">{{ sensitiveAnalysisResult.taskName }}</a-descriptions-item>
          <a-descriptions-item label="匹配的 API 访问日志总数">
            <strong>{{ sensitiveAnalysisResult.matchedAccessLogTotal.toLocaleString() }}</strong> 条
          </a-descriptions-item>
        </a-descriptions>

        <div class="sensitive-modal-section">
          <div class="sensitive-modal-section-title">线索</div>
          <ul class="sensitive-clue-list modal">
            <li v-for="(line, idx) in sensitiveAnalysisResult.clues" :key="idx">{{ line }}</li>
          </ul>
        </div>

        <div class="sensitive-modal-section">
          <div class="sensitive-modal-section-title">涉及的 API 与访问情况</div>
          <a-table
            size="small"
            :columns="sensitiveAccessColumns"
            :data-source="sensitiveAnalysisResult.apiRows"
            :pagination="{ pageSize: 8, size: 'small' }"
            :scroll="{ x: 900 }"
          />
        </div>

        <div class="sensitive-modal-section">
          <div class="sensitive-modal-section-title">涉及的应用与访问情况</div>
          <template v-if="sensitiveAnalysisResult.appRows.length">
            <a-table
              size="small"
              :columns="sensitiveAccessColumns"
              :data-source="sensitiveAnalysisResult.appRows"
              :pagination="{ pageSize: 8, size: 'small' }"
              :scroll="{ x: 900 }"
            />
          </template>
          <span v-else class="entity-empty">暂无匹配应用</span>
        </div>

        <div class="sensitive-modal-section">
          <div class="sensitive-modal-section-title">涉及的数据与访问情况</div>
          <a-table
            size="small"
            :columns="sensitiveAccessColumns"
            :data-source="sensitiveAnalysisResult.dataRows"
            :pagination="{ pageSize: 8, size: 'small' }"
            :scroll="{ x: 900 }"
          />
        </div>

        <div class="sensitive-modal-section">
          <div class="sensitive-modal-section-title">涉及的文件与访问情况</div>
          <a-table
            size="small"
            :columns="sensitiveAccessColumns"
            :data-source="sensitiveAnalysisResult.fileRows"
            :pagination="{ pageSize: 8, size: 'small' }"
            :scroll="{ x: 900 }"
          />
        </div>

        <div class="sensitive-modal-section">
          <div class="sensitive-modal-section-title">涉及的账号与访问情况</div>
          <template v-if="sensitiveAnalysisResult.accountRows.length">
            <a-table
              size="small"
              :columns="sensitiveAccessColumns"
              :data-source="sensitiveAnalysisResult.accountRows"
              :pagination="{ pageSize: 8, size: 'small' }"
              :scroll="{ x: 900 }"
            />
          </template>
          <span v-else class="entity-empty">日志侧未聚合到独立账号维度</span>
        </div>

        <div class="sensitive-modal-section">
          <div class="sensitive-modal-section-title">涉及的 IP 与访问情况</div>
          <template v-if="sensitiveAnalysisResult.ipRows.length">
            <a-table
              size="small"
              :columns="sensitiveAccessColumns"
              :data-source="sensitiveAnalysisResult.ipRows"
              :pagination="{ pageSize: 8, size: 'small' }"
              :scroll="{ x: 900 }"
            />
          </template>
          <span v-else class="entity-empty">暂无匹配 IP</span>
        </div>
      </template>
    </a-modal>

    <a-modal
      v-model:open="detailModalOpen"
      title="告警详情"
      width="70%"
      centered
      :footer="null"
      :body-style="{ maxHeight: '70vh', overflowY: 'auto' }"
    >
      <a-descriptions v-if="currentEventDetail" :column="2" bordered>
        <a-descriptions-item label="发生时间">
          {{ currentEventDetail.time }}
        </a-descriptions-item>
        <a-descriptions-item label="风险等级">
          <a-tag :color="riskLevelColorMap[currentEventDetail.level]">
            {{ currentEventDetail.level }}
          </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="告警名称">
          {{ currentEventDetail.name }}
        </a-descriptions-item>
        <a-descriptions-item label="API">
          {{ currentEventDetail.method }} {{ currentEventDetail.path }}
        </a-descriptions-item>
        <a-descriptions-item label="客户端">
          {{ currentEventDetail.client }}
        </a-descriptions-item>
        <a-descriptions-item label="服务端">
          {{ currentEventDetail.server }}
        </a-descriptions-item>
        <a-descriptions-item label="请求数据标签">
          {{ joinTags(currentEventDetail.requestTags) }}
        </a-descriptions-item>
        <a-descriptions-item label="返回数据标签">
          {{ joinTags(currentEventDetail.responseTags) }}
        </a-descriptions-item>
        <a-descriptions-item :span="2" label="研判说明">
          {{ currentEventDetail.detail }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import dayjs from 'dayjs';
  import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { ArrowLeftOutlined } from '@ant-design/icons-vue';
  import * as echarts from 'echarts';
  import type { ECharts, EChartsOption } from 'echarts';
  import {
    MAX_RUNNING_TASKS,
    formatDateTime,
    formatSensitiveClueValue,
    getAppName,
    getSensitiveClueDimensionLabel,
    getStatusLabel,
    getStatusTagColor,
    getTraceTaskById,
    getTraceTypeLabel,
    type AccountTraceConditions,
    type SensitiveTraceConditions,
    type TraceTask
  } from './task-store';

  type RiskLevel = '高' | '中' | '低';

  interface RankingItem {
    name: string;
    count: number;
  }

  interface ApiRankingItem {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    count: number;
  }

  interface LabelDistributionItem {
    name: string;
    requestCount: number;
    responseCount: number;
    totalCount: number;
  }

  interface RiskDistributionItem {
    level: RiskLevel;
    name: string;
    count: number;
  }

  interface RiskEvent {
    id: string;
    time: string;
    level: RiskLevel;
    name: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    client: string;
    server: string;
    requestTags: string[];
    responseTags: string[];
    detail: string;
  }

  interface RiskApiGroup {
    key: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path: string;
    count: number;
    events: RiskEvent[];
  }

  interface TimelineSlot {
    id: string;
    timeRange: string;
    name: string;
    count: number;
    apis: RiskApiGroup[];
  }

  interface SummaryCount {
    total: number;
    high: number;
    medium: number;
    low: number;
  }

  interface SensitiveAccessRow {
    key: string;
    name: string;
    accessCount: number;
    firstSeen: string;
    lastSeen: string;
    situation: string;
  }

  interface SensitiveTraceAnalysisResult {
    timeRange: [string, string];
    taskName: string;
    clues: string[];
    matchedAccessLogTotal: number;
    apiRows: SensitiveAccessRow[];
    appRows: SensitiveAccessRow[];
    dataRows: SensitiveAccessRow[];
    fileRows: SensitiveAccessRow[];
    accountRows: SensitiveAccessRow[];
    ipRows: SensitiveAccessRow[];
  }

  interface AccountInsight {
    accountName: string;
    department: string;
    appInfo: {
      id: string;
      name: string;
      domain: string;
      importance: '高' | '中' | '低';
    };
    timeRange: [string, string];
    metrics: Array<{ label: string; value: string; desc: string }>;
    ipTop10: RankingItem[];
    apiTop10: ApiRankingItem[];
    labelDistribution: LabelDistributionItem[];
    webAlertDistribution: RiskDistributionItem[];
    behaviorAlertDistribution: RiskDistributionItem[];
    webSummary: SummaryCount;
    behaviorSummary: SummaryCount;
    webTimeline: TimelineSlot[];
    behaviorTimeline: TimelineSlot[];
  }

  const APP_META: Record<string, { domain: string; importance: '高' | '中' | '低'; department: string }> = {
    'app-oa': {
      domain: 'oa.das.local',
      importance: '中',
      department: '综合办公部'
    },
    'app-erp': {
      domain: 'erp.das.local',
      importance: '高',
      department: '供应链运营部'
    },
    'app-api': {
      domain: 'api-gateway.das.local',
      importance: '高',
      department: '开放平台部'
    },
    'app-finance': {
      domain: 'finance.das.local',
      importance: '高',
      department: '财务稽核部'
    },
    'app-hr': {
      domain: 'hr.das.local',
      importance: '中',
      department: '人力资源部'
    }
  };

  const importanceColorMap = {
    高: 'error',
    中: 'warning',
    低: 'default'
  } as const;

  const riskLevelColorMap = {
    高: 'error',
    中: 'warning',
    低: 'success'
  } as const;

  const riskEventColumns: any[] = [
    { title: '发生时间', dataIndex: 'time', key: 'time', width: 170 },
    { title: '等级', dataIndex: 'level', key: 'level', width: 90 },
    { title: '告警名称', dataIndex: 'name', key: 'name', width: 180 },
    { title: '客户端(IP端口)', dataIndex: 'client', key: 'client', width: 190 },
    { title: '服务端(IP端口)', dataIndex: 'server', key: 'server', width: 190 },
    { title: '数据标签', dataIndex: 'dataTags', key: 'dataTags', width: 240 },
    { title: '操作', dataIndex: 'operation', key: 'operation', width: 100, fixed: 'right' }
  ];

  const route = useRoute();
  const router = useRouter();
  const task = ref<TraceTask | undefined>();
  const activeTab = ref('analysis');
  const detailModalOpen = ref(false);
  const sensitiveResultDetailOpen = ref(false);
  const sensitiveEntityTab = ref('api');

  const sensitiveAccessColumns: any[] = [
    { title: '对象', dataIndex: 'name', key: 'name', width: 240, ellipsis: true },
    { title: '访问日志条数', dataIndex: 'accessCount', key: 'accessCount', width: 120, align: 'right' },
    { title: '首次命中时间', dataIndex: 'firstSeen', key: 'firstSeen', width: 166 },
    { title: '最近访问时间', dataIndex: 'lastSeen', key: 'lastSeen', width: 166 },
    { title: '访问情况', dataIndex: 'situation', key: 'situation', ellipsis: true, minWidth: 220 }
  ];

  const currentEventDetail = ref<RiskEvent | null>(null);
  const labelTreemapRef = ref<HTMLDivElement>();
  const ipTop10ChartRef = ref<HTMLDivElement>();
  const apiTop10ChartRef = ref<HTMLDivElement>();
  const selectedWebSlotId = ref('');
  const selectedBehaviorSlotId = ref('');
  let labelChartInstance: ECharts | null = null;
  let ipTop10ChartInstance: ECharts | null = null;
  let apiTop10ChartInstance: ECharts | null = null;

  const joinTags = (tags: string[]) => (tags.length ? tags.join('、') : '-');

  const uniqStrings = (items: string[]) => Array.from(new Set(items.map((s) => s.trim()).filter(Boolean)));

  const parseSensitiveTimeRange = (tr: [string, string]) => {
    const start = dayjs(tr[0]);
    const end = dayjs(tr[1]);
    if (!start.isValid() || !end.isValid()) {
      return { start: dayjs('2026-04-21 09:00:00'), end: dayjs('2026-04-22 09:00:00') };
    }
    return { start, end };
  };

  const buildSensitiveSituation = (
    kind: 'api' | 'app' | 'data' | 'file' | 'account' | 'ip',
    h: number,
    n: number,
    name: string
  ) => {
    const shortName = name.length > 24 ? `${name.slice(0, 24)}…` : name;
    switch (kind) {
      case 'api': {
        const getPct = 35 + (h % 55);
        const tagged = 12 + (h % 52);
        return `GET 约占 ${getPct}%，其余为 POST/PUT；与该 API 链路相关的敏感标签命中约 ${tagged} 条。`;
      }
      case 'app':
        return `该应用下聚合 ${n.toLocaleString()} 条访问日志，涵盖接口探测、数据读取与文件传输等 ${2 + (h % 4)} 类行为。`;
      case 'data': {
        const req = Math.max(1, Math.floor(n * (0.28 + (h % 35) / 100)));
        const res = Math.max(1, n - req);
        return `请求侧约 ${req} 条、响应侧约 ${res} 条；与「${shortName}」关联的敏感上下文一致。`;
      }
      case 'file':
        return `下载类约 ${Math.max(1, Math.floor(n * 0.52))} 条、预览/在线约 ${Math.max(1, Math.floor(n * 0.3))} 条，其余为元数据或列表拉取。`;
      case 'account':
        return `鉴权成功占绝大多数，失败/重试 ${2 + (h % 9)} 次；活跃时段与任务分析窗口基本重合。`;
      case 'ip':
        return `以客户端源 IP 为主；关联会话约 ${3 + (h % 7)} 个，流量高峰多集中在窗口中段。`;
      default:
        return `共 ${n.toLocaleString()} 条相关访问日志。`;
    }
  };

  const buildSensitiveAccessRows = (
    names: string[],
    seed: number,
    timeRange: [string, string],
    kind: 'api' | 'app' | 'data' | 'file' | 'account' | 'ip'
  ): SensitiveAccessRow[] => {
    const { start, end } = parseSensitiveTimeRange(timeRange);
    const spanMin = Math.max(end.diff(start, 'minute'), 1);

    return names.map((name, i) => {
      const h = seed + i * 47 + name.length * 3;
      let accessCount: number;
      switch (kind) {
        case 'api':
          accessCount = 180 + (h % 2400);
          break;
        case 'app':
          accessCount = 320 + (h % 3100);
          break;
        case 'data':
          accessCount = 90 + (h % 1900);
          break;
        case 'file':
          accessCount = 40 + (h % 880);
          break;
        case 'account':
          accessCount = 120 + (h % 1600);
          break;
        case 'ip':
          accessCount = 150 + (h % 2200);
          break;
        default:
          accessCount = 100 + (h % 900);
      }

      const offset1 = (h % Math.max(1, Math.floor(spanMin * 0.35))) + 2;
      const offset2 = (h % 220) + 8;
      let first = start.add(offset1, 'minute');
      let last = first.add(offset2, 'minute');
      if (last.isAfter(end)) last = end;
      if (first.isAfter(last)) first = last.subtract(Math.min(90, spanMin), 'minute');
      if (first.isBefore(start)) first = start;

      return {
        key: `${kind}-${i}-${name.slice(0, 32)}`,
        name,
        accessCount,
        firstSeen: first.format('YYYY-MM-DD HH:mm:ss'),
        lastSeen: last.format('YYYY-MM-DD HH:mm:ss'),
        situation: buildSensitiveSituation(kind, h, accessCount, name)
      };
    });
  };

  const buildSensitiveTraceAnalysisResult = (currentTask?: TraceTask): SensitiveTraceAnalysisResult | null => {
    if (!currentTask || currentTask.traceType !== 'sensitive') return null;

    const c = currentTask.conditions as SensitiveTraceConditions;
    const clues: string[] = [];

    if (c.clues?.length) {
      c.clues.forEach((clue, index) => {
        const label = getSensitiveClueDimensionLabel(clue.dimension);
        const value = formatSensitiveClueValue(clue);
        if (label && value) clues.push(`线索${index + 1}（${label}）：${value}`);
      });
    }

    if (!clues.length && (currentTask.conditionTags?.length ?? 0) > 0) {
      currentTask.conditionTags!.forEach((tag) => clues.push(tag));
    }

    if (!clues.length) {
      clues.push('（未解析到结构化线索，请在任务中补充至少两条线索维度以便精确定位。）');
    }

    const timeClue = c.clues?.find((clue) => clue.dimension === 'timeRange')?.timeRange;
    const timeRange: [string, string] =
      timeClue?.length === 2
        ? [timeClue[0], timeClue[1]]
        : c.timeRange?.length === 2
          ? [c.timeRange[0], c.timeRange[1]]
          : ['—', '—'];

    const involvedApps = uniqStrings(c.appIds.map(getAppName));

    const apiHints = uniqStrings([
      ...(c.apiPath ? [`GET ${c.apiPath}`, `POST ${c.apiPath}`] : []),
      ...(c.apiPath?.includes('/export') ? ['POST /api/v1/file/transfer/log'] : []),
      'GET /api/v1/audit/access/stream',
      'GET /api/v1/access/log/search',
      'POST /api/v1/trace/correlate'
    ]);

    const involvedData = uniqStrings([
      ...c.requestDataTags,
      ...c.responseDataTags,
      ...(c.dataClue ? [c.dataClue] : []),
      ...((c.clues || [])
        .filter((clue) => clue.dimension === 'requestDataTag' || clue.dimension === 'responseDataTag')
        .flatMap((clue) => (Array.isArray(clue.values) ? clue.values : clue.value ? [clue.value] : [])))
    ]);

    const involvedFiles = uniqStrings([
      ...(c.fileName ? [c.fileName] : []),
      ...((c.clues || [])
        .filter((clue) => clue.dimension === 'fileName')
        .map((clue) => clue.value || '')
        .filter(Boolean))
    ]);

    const involvedAccounts = uniqStrings([
      ...(c.loginAccount ? [c.loginAccount] : []),
      ...((c.clues || [])
        .filter((clue) => clue.dimension === 'accountName')
        .map((clue) => clue.value || '')
        .filter(Boolean))
    ]);

    const involvedIps = uniqStrings([
      ...(c.clientIp ? [c.clientIp] : []),
      ...(c.serverIp ? [c.serverIp] : []),
      ...((c.clues || [])
        .filter((clue) => clue.dimension === 'sourceIp' || clue.dimension === 'destIp')
        .map((clue) => clue.value || '')
        .filter(Boolean))
    ]);

    const seed = currentTask.id.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const statusBoost =
      currentTask.status === 'success' ? 4200 : currentTask.status === 'running' ? 2100 : 0;
    const matchedAccessLogTotal = 6800 + (seed % 7200) + statusBoost;

    const dataNames = involvedData.length ? involvedData : ['身份证号（请求侧）', '手机号（返回侧）'];
    const fileNames = involvedFiles.length ? involvedFiles : ['证据包-archive.zip'];

    const apiRows = buildSensitiveAccessRows(apiHints, seed, timeRange, 'api');
    const appRows = buildSensitiveAccessRows(involvedApps, seed + 11, timeRange, 'app');
    const dataRows = buildSensitiveAccessRows(dataNames, seed + 22, timeRange, 'data');
    const fileRows = buildSensitiveAccessRows(fileNames, seed + 33, timeRange, 'file');
    const accountRows = buildSensitiveAccessRows(involvedAccounts, seed + 44, timeRange, 'account');
    const ipRows = buildSensitiveAccessRows(involvedIps, seed + 55, timeRange, 'ip');

    return {
      timeRange,
      taskName: currentTask.name,
      clues,
      matchedAccessLogTotal,
      apiRows,
      appRows,
      dataRows,
      fileRows,
      accountRows,
      ipRows
    };
  };

  const createRiskEvent = (prefix: string, index: number, partial: Omit<RiskEvent, 'id'>): RiskEvent => ({
    id: `${prefix}-${index}`,
    ...partial
  });

  const buildAccountInsight = (currentTask?: TraceTask): AccountInsight | null => {
    if (!currentTask || currentTask.traceType !== 'account') return null;

    const conditions = currentTask.conditions as AccountTraceConditions;
    const appMeta = APP_META[conditions.appId] || {
      domain: `${conditions.appId}.das.local`,
      importance: '中' as const,
      department: '安全运营部'
    };
    const appName = getAppName(conditions.appId);

    const webTimeline: TimelineSlot[] = [
      {
        id: 'web-1',
        timeRange: '09:00 ~ 10:00',
        name: '高频越权接口扫描',
        count: 18,
        apis: [
          {
            key: 'web-api-1',
            method: 'GET',
            path: '/api/v1/payment/order/detail',
            count: 11,
            events: [
              createRiskEvent('web', 1, {
                time: '2026-04-21 09:14:22',
                level: '高',
                name: '敏感订单越权读取',
                method: 'GET',
                path: '/api/v1/payment/order/detail',
                client: '10.10.24.16:50432',
                server: '172.16.20.11:8443',
                requestTags: ['客户编号'],
                responseTags: ['银行卡号', '身份证号'],
                detail: '同一账号在短时间内连续请求多个订单编号，响应返回包含银行卡号与身份证号。'
              }),
              createRiskEvent('web', 2, {
                time: '2026-04-21 09:18:09',
                level: '高',
                name: '订单详情批量探测',
                method: 'GET',
                path: '/api/v1/payment/order/detail',
                client: '10.10.24.16:50436',
                server: '172.16.20.11:8443',
                requestTags: ['客户编号'],
                responseTags: ['银行卡号'],
                detail: '请求参数呈连续递增规律，疑似通过脚本批量枚举订单详情。'
              })
            ]
          },
          {
            key: 'web-api-2',
            method: 'POST',
            path: '/api/v1/payment/export',
            count: 7,
            events: [
              createRiskEvent('web', 3, {
                time: '2026-04-21 09:27:51',
                level: '中',
                name: '敏感报表导出',
                method: 'POST',
                path: '/api/v1/payment/export',
                client: '10.10.24.16:50998',
                server: '172.16.20.20:8443',
                requestTags: ['审批意见'],
                responseTags: ['银行卡号', '手机号'],
                detail: '导出接口命中多个敏感字段，且导出频次高于同部门账号基线。'
              })
            ]
          }
        ]
      },
      {
        id: 'web-2',
        timeRange: '13:00 ~ 14:30',
        name: '敏感数据批量导出',
        count: 21,
        apis: [
          {
            key: 'web-api-3',
            method: 'POST',
            path: '/api/v1/customer/export',
            count: 14,
            events: [
              createRiskEvent('web', 4, {
                time: '2026-04-21 13:08:15',
                level: '高',
                name: '批量客户信息导出',
                method: 'POST',
                path: '/api/v1/customer/export',
                client: '10.10.24.16:51320',
                server: '172.16.20.31:8443',
                requestTags: ['客户编号'],
                responseTags: ['手机号', '邮箱地址', '银行卡号'],
                detail: '导出结果涉及大量客户个人信息，且筛选条件覆盖全量客户数据。'
              })
            ]
          },
          {
            key: 'web-api-4',
            method: 'GET',
            path: '/api/v1/account/query',
            count: 7,
            events: [
              createRiskEvent('web', 5, {
                time: '2026-04-21 13:26:40',
                level: '中',
                name: '敏感账户信息读取',
                method: 'GET',
                path: '/api/v1/account/query',
                client: '10.10.24.20:50211',
                server: '172.16.20.18:8443',
                requestTags: ['客户编号'],
                responseTags: ['银行卡号', '手机号'],
                detail: '账号在同一时间段内多次读取不同账户明细，访问模式偏离历史画像。'
              })
            ]
          }
        ]
      },
      {
        id: 'web-3',
        timeRange: '18:30 ~ 19:30',
        name: '低频异常页面浏览',
        count: 17,
        apis: [
          {
            key: 'web-api-5',
            method: 'GET',
            path: '/api/v1/payment/audit/log',
            count: 10,
            events: [
              createRiskEvent('web', 6, {
                time: '2026-04-21 18:44:19',
                level: '低',
                name: '审计日志高频查看',
                method: 'GET',
                path: '/api/v1/payment/audit/log',
                client: '10.10.24.16:53310',
                server: '172.16.20.41:8443',
                requestTags: [],
                responseTags: ['联系人信息'],
                detail: '访问对象主要为高风险订单的审计日志，属于潜在踩点行为。'
              })
            ]
          }
        ]
      }
    ];

    const behaviorTimeline: TimelineSlot[] = [
      {
        id: 'behavior-1',
        timeRange: '08:00 ~ 09:00',
        name: '非工作时段登录',
        count: 13,
        apis: [
          {
            key: 'behavior-api-1',
            method: 'POST',
            path: '/api/v1/auth/login',
            count: 13,
            events: [
              createRiskEvent('behavior', 1, {
                time: '2026-04-21 08:02:10',
                level: '中',
                name: '异常时段登录',
                method: 'POST',
                path: '/api/v1/auth/login',
                client: '10.10.24.16:49012',
                server: '172.16.20.8:443',
                requestTags: [],
                responseTags: [],
                detail: '账号在历史低活跃时间段出现登录，来源终端与常用办公终端不一致。'
              })
            ]
          }
        ]
      },
      {
        id: 'behavior-2',
        timeRange: '10:00 ~ 11:30',
        name: '访问行为骤增',
        count: 26,
        apis: [
          {
            key: 'behavior-api-2',
            method: 'GET',
            path: '/api/v1/customer/detail',
            count: 12,
            events: [
              createRiskEvent('behavior', 2, {
                time: '2026-04-21 10:12:54',
                level: '高',
                name: '访问频率突增',
                method: 'GET',
                path: '/api/v1/customer/detail',
                client: '10.10.24.16:50112',
                server: '172.16.20.61:8443',
                requestTags: ['客户编号'],
                responseTags: ['手机号', '邮箱地址'],
                detail: '单位时间内请求量超过个人过去 30 日同接口均值的 4.7 倍。'
              })
            ]
          },
          {
            key: 'behavior-api-3',
            method: 'POST',
            path: '/api/v1/payment/approve',
            count: 14,
            events: [
              createRiskEvent('behavior', 3, {
                time: '2026-04-21 11:04:38',
                level: '中',
                name: '审批链路密集触发',
                method: 'POST',
                path: '/api/v1/payment/approve',
                client: '10.10.24.16:50150',
                server: '172.16.20.22:8443',
                requestTags: ['审批意见'],
                responseTags: [],
                detail: '该账号在短周期内对大量付款单据执行审批动作，明显高于同角色均值。'
              })
            ]
          }
        ]
      },
      {
        id: 'behavior-3',
        timeRange: '20:00 ~ 21:00',
        name: '高敏接口跨端访问',
        count: 17,
        apis: [
          {
            key: 'behavior-api-4',
            method: 'GET',
            path: '/api/v1/report/finance/summary',
            count: 17,
            events: [
              createRiskEvent('behavior', 4, {
                time: '2026-04-21 20:16:22',
                level: '高',
                name: '跨终端访问高敏接口',
                method: 'GET',
                path: '/api/v1/report/finance/summary',
                client: '10.10.30.88:54012',
                server: '172.16.20.72:8443',
                requestTags: [],
                responseTags: ['银行卡号', '手机号'],
                detail: '在非常用终端访问财务汇总接口，返回包含敏感客户资金字段。'
              })
            ]
          }
        ]
      }
    ];

    return {
      accountName: conditions.account,
      department: appMeta.department,
      appInfo: {
        id: conditions.appId,
        name: appName,
        domain: appMeta.domain,
        importance: appMeta.importance
      },
      timeRange: conditions.timeRange,
      metrics: [
        { label: '总访问次数', value: '2,846', desc: '较账号历史基线 +37%' },
        { label: '命中数据标签', value: '164', desc: '请求 71 / 返回 93' },
        { label: '高风险事件', value: '44', desc: 'Web 与行为风险交叉命中' }
      ],
      ipTop10: [
        { name: '10.10.24.16', count: 634 },
        { name: '10.10.24.20', count: 512 },
        { name: '10.10.30.88', count: 423 },
        { name: '172.20.9.14', count: 315 },
        { name: '172.20.9.23', count: 272 },
        { name: '10.20.18.54', count: 206 },
        { name: '10.20.18.77', count: 184 },
        { name: '10.10.11.15', count: 169 },
        { name: '172.16.33.12', count: 121 },
        { name: '172.16.33.19', count: 98 }
      ],
      apiTop10: [
        { method: 'GET', path: '/api/v1/payment/order/detail', count: 421 },
        { method: 'POST', path: '/api/v1/customer/export', count: 376 },
        { method: 'POST', path: '/api/v1/payment/approve', count: 334 },
        { method: 'GET', path: '/api/v1/customer/detail', count: 288 },
        { method: 'GET', path: '/api/v1/account/query', count: 241 },
        { method: 'POST', path: '/api/v1/payment/export', count: 210 },
        { method: 'GET', path: '/api/v1/payment/audit/log', count: 187 },
        { method: 'GET', path: '/api/v1/report/finance/summary', count: 175 },
        { method: 'POST', path: '/api/v1/auth/login', count: 168 },
        { method: 'DELETE', path: '/api/v1/cache/order/flush', count: 92 }
      ],
      labelDistribution: [
        { name: '银行卡号', requestCount: 18, responseCount: 45, totalCount: 63 },
        { name: '手机号', requestCount: 9, responseCount: 36, totalCount: 45 },
        { name: '身份证号', requestCount: 6, responseCount: 29, totalCount: 35 },
        { name: '邮箱地址', requestCount: 4, responseCount: 22, totalCount: 26 },
        { name: '客户编号', requestCount: 27, responseCount: 8, totalCount: 35 },
        { name: '审批意见', requestCount: 15, responseCount: 2, totalCount: 17 }
      ],
      webAlertDistribution: [
        { level: '高', name: '敏感订单越权读取', count: 18 },
        { level: '高', name: '批量客户信息导出', count: 14 },
        { level: '中', name: '敏感报表导出', count: 12 },
        { level: '中', name: '账户信息读取偏离画像', count: 7 },
        { level: '低', name: '审计日志高频查看', count: 5 }
      ],
      behaviorAlertDistribution: [
        { level: '高', name: '访问频率突增', count: 19 },
        { level: '高', name: '跨终端访问高敏接口', count: 13 },
        { level: '中', name: '审批链路密集触发', count: 15 },
        { level: '中', name: '异常时段登录', count: 6 },
        { level: '低', name: '会话停留时长异常', count: 3 }
      ],
      webSummary: { total: 56, high: 32, medium: 19, low: 5 },
      behaviorSummary: { total: 56, high: 32, medium: 21, low: 3 },
      webTimeline,
      behaviorTimeline
    };
  };

  const taskFilterSummary = computed(() => {
    if (!task.value) {
      return { app: '-', account: '-', timeRange: '-' };
    }
    if (task.value.traceType === 'account') {
      const conditions = task.value.conditions as AccountTraceConditions;
      return {
        app: getAppName(conditions.appId),
        account: conditions.account || '-',
        timeRange: `${conditions.timeRange[0]} ~ ${conditions.timeRange[1]}`
      };
    }
    if (task.value.traceType === 'sensitive') {
      const conditions = task.value.conditions as SensitiveTraceConditions;
      const timeClue = conditions.clues?.find((clue) => clue.dimension === 'timeRange')?.timeRange;
      const tr =
        timeClue?.length === 2
          ? `${timeClue[0]} ~ ${timeClue[1]}`
          : conditions.timeRange?.length === 2
            ? `${conditions.timeRange[0]} ~ ${conditions.timeRange[1]}`
            : '-';
      return {
        app: conditions.appIds.length ? conditions.appIds.map(getAppName).join('、') : '-',
        account: conditions.loginAccount || '-',
        timeRange: tr
      };
    }
    const conditions = task.value.conditions as { clientIp?: string; timeRange?: [string, string] };
    return {
      app: (task.value.conditionTags ?? []).find((item) => item.startsWith('应用:'))?.replace(/^应用:/, '') || '-',
      account: conditions.clientIp || '-',
      timeRange:
        conditions.timeRange?.length === 2
          ? `${conditions.timeRange[0]} ~ ${conditions.timeRange[1]}`
          : (task.value.conditionTags ?? []).find((item) => item.startsWith('发生时间:'))?.replace(/^发生时间:/, '') ||
            '-'
    };
  });

  const accountInsight = computed(() => buildAccountInsight(task.value));

  const sensitiveAnalysisResult = computed(() => buildSensitiveTraceAnalysisResult(task.value));

  const selectedWebSlot = computed(
    () =>
      accountInsight.value?.webTimeline.find((item) => item.id === selectedWebSlotId.value) ||
      accountInsight.value?.webTimeline[0]
  );

  const selectedBehaviorSlot = computed(
    () =>
      accountInsight.value?.behaviorTimeline.find((item) => item.id === selectedBehaviorSlotId.value) ||
      accountInsight.value?.behaviorTimeline[0]
  );

  const webSummaryText = computed(() => {
    const insight = accountInsight.value;
    if (!insight) return '';
    return `该账号（${insight.accountName}）在 ${insight.timeRange[0]} ~ ${insight.timeRange[1]} 共触发Web安全告警${insight.webSummary.total}次（高:${insight.webSummary.high} 中:${insight.webSummary.medium} 低:${insight.webSummary.low}）。`;
  });

  const behaviorSummaryText = computed(() => {
    const insight = accountInsight.value;
    if (!insight) return '';
    return `该账号（${insight.accountName}）在 ${insight.timeRange[0]} ~ ${insight.timeRange[1]} 共触发异常行为告警${insight.behaviorSummary.total}次（高:${insight.behaviorSummary.high} 中:${insight.behaviorSummary.medium} 低:${insight.behaviorSummary.low}）。`;
  });

  const getIpTop10BarOption = (): EChartsOption => {
    const insight = accountInsight.value;
    if (!insight) return {};
    const items = insight.ipTop10;
    return {
      grid: { left: 4, right: 52, top: 8, bottom: 8, containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          const list = Array.isArray(params) ? params : [params];
          const p = list[0] as { name?: string; value?: number };
          const name = p?.name ?? '';
          const value = p?.value ?? 0;
          return `${name}<br/>访问次数：<strong>${value}</strong>`;
        }
      },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: 'rgba(0,0,0,0.06)' } },
        axisLabel: { color: 'rgba(0,0,0,0.45)', fontSize: 11 }
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: items.map((it) => it.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: 'rgba(0,0,0,0.85)',
          fontSize: 12,
          width: 128,
          overflow: 'truncate'
        }
      },
      series: [
        {
          type: 'bar',
          data: items.map((it) => it.count),
          barMaxWidth: 20,
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#1546D8' },
              { offset: 1, color: '#3B8CFF' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            color: 'rgba(0,0,0,0.45)',
            fontSize: 11
          }
        }
      ]
    };
  };

  const getApiTop10BarOption = (): EChartsOption => {
    const insight = accountInsight.value;
    if (!insight) return {};
    const items = insight.apiTop10;
    const labels = items.map((it) => `${it.method} ${it.path}`);
    return {
      grid: { left: 4, right: 52, top: 8, bottom: 8, containLabel: true },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params: unknown) => {
          const list = Array.isArray(params) ? params : [params];
          const p = list[0] as { dataIndex?: number };
          const idx = p?.dataIndex ?? 0;
          const item = items[idx];
          if (!item) return '';
          return [`<strong>${item.method} ${item.path}</strong>`, `访问次数：${item.count}`].join('<br/>');
        }
      },
      xAxis: {
        type: 'value',
        splitLine: { lineStyle: { type: 'dashed', color: 'rgba(0,0,0,0.06)' } },
        axisLabel: { color: 'rgba(0,0,0,0.45)', fontSize: 11 }
      },
      yAxis: {
        type: 'category',
        inverse: true,
        data: labels,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: 'rgba(0,0,0,0.85)',
          fontSize: 11,
          width: 200,
          overflow: 'truncate'
        }
      },
      series: [
        {
          type: 'bar',
          data: items.map((it) => it.count),
          barMaxWidth: 20,
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#0FAF9B' },
              { offset: 1, color: '#1B77E7' }
            ])
          },
          label: {
            show: true,
            position: 'right',
            color: 'rgba(0,0,0,0.45)',
            fontSize: 11
          }
        }
      ]
    };
  };

  const getLabelTreemapOption = () => {
    const insight = accountInsight.value;
    if (!insight) return {};

    return {
      tooltip: {
        formatter: (params: any) => {
          const { name, data } = params;
          return [
            `<strong>${name}</strong>`,
            `请求命中：${data.requestCount}`,
            `返回命中：${data.responseCount}`,
            `总次数：${params.value}`
          ].join('<br/>');
        }
      },
      series: [
        {
          type: 'treemap',
          roam: false,
          nodeClick: false,
          breadcrumb: { show: false },
          upperLabel: { show: false },
          label: {
            show: true,
            formatter: '{b}\n{c}',
            fontSize: 13,
            lineHeight: 18
          },
          itemStyle: {
            borderColor: 'rgba(255,255,255,0.75)',
            borderWidth: 4,
            gapWidth: 4
          },
          levels: [
            {
              color: ['#1546D8', '#1B77E7', '#0FAF9B', '#F6A11A', '#F06B4F', '#7A5AF8'],
              colorMappingBy: 'id'
            }
          ],
          data: insight.labelDistribution.map((item, index) => ({
            id: index,
            name: item.name,
            value: item.totalCount,
            requestCount: item.requestCount,
            responseCount: item.responseCount
          }))
        }
      ]
    };
  };

  const disposeLabelChart = () => {
    labelChartInstance?.dispose();
    labelChartInstance = null;
  };

  const disposeTop10Charts = () => {
    ipTop10ChartInstance?.dispose();
    ipTop10ChartInstance = null;
    apiTop10ChartInstance?.dispose();
    apiTop10ChartInstance = null;
  };

  const renderLabelChart = async () => {
    if (activeTab.value !== 'analysis' || !accountInsight.value || !labelTreemapRef.value) return;
    await nextTick();
    if (!labelTreemapRef.value) return;
    if (!labelChartInstance) {
      labelChartInstance = echarts.init(labelTreemapRef.value);
    }
    labelChartInstance.setOption(getLabelTreemapOption(), true);
  };

  const renderTop10Charts = async () => {
    if (activeTab.value !== 'analysis' || !accountInsight.value) return;
    await nextTick();
    if (!ipTop10ChartRef.value || !apiTop10ChartRef.value) return;
    if (!ipTop10ChartInstance) {
      ipTop10ChartInstance = echarts.init(ipTop10ChartRef.value);
    }
    if (!apiTop10ChartInstance) {
      apiTop10ChartInstance = echarts.init(apiTop10ChartRef.value);
    }
    ipTop10ChartInstance.setOption(getIpTop10BarOption(), true);
    apiTop10ChartInstance.setOption(getApiTop10BarOption(), true);
  };

  const resizeCharts = () => {
    labelChartInstance?.resize();
    ipTop10ChartInstance?.resize();
    apiTop10ChartInstance?.resize();
  };

  const loadTask = () => {
    task.value = getTraceTaskById(String(route.params.id));
  };

  watch(
    () => route.params.id,
    () => {
      loadTask();
      sensitiveEntityTab.value = 'api';
    },
    { immediate: true }
  );

  watch(
    accountInsight,
    async (value) => {
      selectedWebSlotId.value = value?.webTimeline[0]?.id || '';
      selectedBehaviorSlotId.value = value?.behaviorTimeline[0]?.id || '';
      if (value) {
        await renderLabelChart();
        await renderTop10Charts();
      } else {
        disposeLabelChart();
        disposeTop10Charts();
      }
    },
    { immediate: true }
  );

  watch(activeTab, async () => {
    await renderLabelChart();
    await renderTop10Charts();
  });

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', resizeCharts);
  }

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', resizeCharts);
    }
    disposeLabelChart();
    disposeTop10Charts();
  });

  const openEventDetail = (event: RiskEvent) => {
    currentEventDetail.value = event;
    detailModalOpen.value = true;
  };

  const goBack = () => {
    router.push('/trace-task');
  };
</script>

<style lang="less" scoped>
  .trace-task-detail-container {
    padding: 20px;
    height: 100%;
  }

  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .page-title {
    color: var(--color-text-primarys);
    font-size: 20px;
    font-weight: 600;
  }

  .page-subtitle {
    margin-top: 4px;
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .overview-panel {
    display: flex;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 16px;
    padding: 20px 24px;
    border: 1px solid rgba(21, 70, 216, 0.12);
    border-radius: 16px;
    background: linear-gradient(135deg, rgba(21, 70, 216, 0.12), rgba(15, 175, 155, 0.08)), var(--color-bg-container);
  }

  .overview-main {
    flex: 1;
    min-width: 0;
  }

  .overview-type {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    margin-bottom: 12px;
    color: var(--color-brand-normal);
    font-size: 12px;
    border-radius: 999px;
    background: rgba(19, 75, 234, 0.08);
  }

  .overview-name {
    color: var(--color-text-primarys);
    font-size: 24px;
    font-weight: 700;
    line-height: 1.3;
  }

  .overview-desc {
    margin-top: 10px;
    color: var(--color-text-secondary);
    line-height: 1.7;
  }

  .overview-side {
    min-width: 260px;
    padding: 8px 0 8px 24px;
    border-left: 1px dashed var(--color-component-stroke);
  }

  .overview-side-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    color: var(--color-text-primarys);

    &:last-child {
      margin-bottom: 0;
    }
  }

  .item-label {
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .info-section {
    margin-bottom: 16px;
  }

  .info-card,
  .condition-panel,
  .module-card {
    border: 1px solid var(--color-component-stroke);
    border-radius: 12px;
    background: var(--color-bg-container);
  }

  .info-card {
    height: 100%;
    padding: 16px 18px;
  }

  .info-label,
  .condition-label {
    margin-bottom: 8px;
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .info-value,
  .condition-value {
    color: var(--color-text-primarys);
    font-weight: 600;
    line-height: 1.7;
  }

  .condition-panel {
    margin-bottom: 16px;
    padding: 18px 20px;
  }

  .panel-title {
    margin-bottom: 14px;
    color: var(--color-text-primarys);
    font-size: 16px;
    font-weight: 600;
  }

  .condition-item {
    height: 100%;
    padding: 14px 16px;
    border-radius: 10px;
    background: var(--color-bg-page);
  }

  .detail-tabs {
    margin-top: 8px;
  }

  .tab-panel {
    padding-top: 8px;
  }

  .module-row,
  .timeline-section {
    margin-top: 16px;
  }

  .module-card {
    height: 100%;
    padding: 18px 20px;
  }

  .module-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
  }

  .module-title,
  .section-title {
    color: var(--color-text-primarys);
    font-size: 16px;
    font-weight: 600;
  }

  .module-extra {
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .profile-card {
    min-height: 220px;
  }

  .profile-top {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 20px;
  }

  .profile-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    color: #fff;
    font-size: 24px;
    font-weight: 700;
    border-radius: 18px;
    background: linear-gradient(135deg, #1546d8, #0faf9b);
  }

  .profile-name {
    color: var(--color-text-primarys);
    font-size: 20px;
    font-weight: 700;
  }

  .profile-sub {
    margin-top: 4px;
    color: var(--color-text-secondary);
  }

  .profile-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .profile-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px dashed var(--color-component-stroke);

    &:last-child {
      padding-bottom: 0;
      border-bottom: 0;
    }

    span {
      color: var(--color-text-secondary);
    }

    strong {
      color: var(--color-text-primarys);
      text-align: right;
    }
  }

  .metric-card {
    height: 100%;
    padding: 18px 16px;
    border-radius: 12px;
    background: var(--color-bg-page);
  }

  .metric-label {
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .metric-value {
    margin-top: 8px;
    color: var(--color-text-primarys);
    font-size: 28px;
    font-weight: 700;
  }

  .metric-desc {
    margin-top: 10px;
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .method-tag {
    flex-shrink: 0;
    margin-inline-end: 0;
  }

  .chart-card {
    min-height: 360px;
  }

  .chart-container {
    height: 300px;
  }

  .top10-chart-card {
    min-height: 400px;
  }

  .top10-chart-canvas {
    height: 320px;
  }

  .risk-distribution-grid {
    display: grid;
    grid-template-rows: repeat(2, minmax(0, 1fr));
    gap: 16px;
    height: 100%;
  }

  .distribution-card {
    min-height: 172px;
  }

  .distribution-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .distribution-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 10px;
    background: var(--color-bg-page);
  }

  .distribution-main {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .distribution-name {
    color: var(--color-text-primarys);
    word-break: break-all;
  }

  .narrative-card {
    margin-bottom: 16px;
  }

  .narrative-text {
    margin-bottom: 12px;
    color: var(--color-text-primarys);
    line-height: 1.8;

    &:last-child {
      margin-bottom: 0;
    }
  }

  .timeline-nav-card {
    padding: 12px;
  }

  .timeline-nav-item {
    padding: 12px 14px;
    margin-bottom: 10px;
    border: 1px solid transparent;
    border-radius: 10px;
    background: var(--color-bg-page);
    cursor: pointer;
    transition: all 0.2s ease;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover,
    &.active {
      border-color: rgba(19, 75, 234, 0.28);
      box-shadow: 0 8px 24px rgba(19, 75, 234, 0.08);
    }
  }

  .timeline-nav-time {
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .timeline-nav-name {
    margin-top: 6px;
    color: var(--color-text-primarys);
    font-weight: 600;
  }

  .timeline-nav-count {
    margin-top: 6px;
    color: var(--color-brand-normal);
    font-size: 12px;
  }

  .api-collapse {
    background: transparent;
  }

  .api-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 100%;
    padding-right: 12px;
  }

  .api-panel-main {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    color: var(--color-text-primarys);
    font-weight: 600;
  }

  .api-panel-count {
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .data-tag-cell {
    line-height: 1.7;
    color: var(--color-text-secondary);
  }

  .fallback-section {
    margin-top: 16px;
  }

  .generic-condition-card {
    margin-top: 16px;
  }

  .condition-tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .condition-tag {
    margin: 0;
  }

  .sensitive-trace-section .sensitive-result-card {
    margin-top: 16px;
  }

  .sensitive-stat-block {
    height: 100%;
    padding: 16px 18px;
    border-radius: 12px;
    background: var(--color-bg-page);
  }

  .sensitive-stat-label {
    margin-bottom: 8px;
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .sensitive-stat-value {
    color: var(--color-text-primarys);
    font-weight: 600;
    line-height: 1.5;
    word-break: break-all;
  }

  .sensitive-stat-number {
    font-size: 22px;
    font-weight: 700;
    color: var(--color-brand-normal);
  }

  .sensitive-block {
    margin-top: 20px;
  }

  .sensitive-block-title {
    margin-bottom: 10px;
    color: var(--color-text-primarys);
    font-weight: 600;
  }

  .sensitive-clue-list {
    margin: 0;
    padding-left: 20px;
    color: var(--color-text-primarys);
    line-height: 1.8;

    &.modal {
      padding-left: 18px;
    }
  }

  .sensitive-entity-row {
    margin-top: 16px;
  }

  .entity-count-pill {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 14px 8px;
    border-radius: 12px;
    background: var(--color-bg-page);
    text-align: center;
  }

  .entity-count {
    color: var(--color-brand-normal);
    font-size: 22px;
    font-weight: 700;
    line-height: 1.2;
  }

  .entity-label {
    margin-top: 6px;
    color: var(--color-text-secondary);
    font-size: 12px;
  }

  .sensitive-hint {
    margin: 16px 0 0;
    color: var(--color-text-secondary);
    font-size: 12px;
    line-height: 1.6;
  }

  .sensitive-desc {
    margin-bottom: 16px;
  }

  .sensitive-modal-section {
    margin-top: 20px;
  }

  .sensitive-modal-section-title {
    margin-bottom: 10px;
    color: var(--color-text-primarys);
    font-size: 14px;
    font-weight: 600;
  }

  .entity-tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .entity-tag {
    margin: 0;
    max-width: 100%;
    word-break: break-all;
  }

  .sensitive-entity-tabs {
    margin-top: 4px;

    :deep(.ant-table) {
      font-size: 13px;
    }
  }

  .entity-empty {
    color: var(--color-text-secondary);
    font-size: 13px;
  }
</style>
