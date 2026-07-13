<template>
  <div class="sd-screen-root">
    <div class="sd-scale-slot" :style="slotStyle">
      <div
        class="sd-design"
        :style="{
          transform: `scale(${scale})`,
          width: designW + 'px',
          height: designH + 'px'
        }"
      >
      <div v-if="dataStaleTip" class="sd-stale-banner">{{ dataStaleTip }}</div>

      <header class="sd-header">
        <div class="sd-header-left">
          <span class="sd-product">AAS · API 与应用系统安全审计 V5.0</span>
          <span class="sd-sub">安全态势大屏总览</span>
        </div>
        <div class="sd-header-center">{{ clockText }}</div>
        <div class="sd-header-right">
          <span class="sd-engine-label">检测引擎</span>
          <span :class="['sd-engine-dot', engineOnline ? 'on' : 'off']" />
          <span class="sd-engine-text">{{ engineOnline ? '在线' : '异常' }}</span>
        </div>
      </header>

      <div class="sd-body">
        <aside class="sd-col-left">
          <div class="sd-kpi-stack">
            <div v-for="card in kpiCards" :key="card.key" class="sd-kpi-card">
              <div class="sd-kpi-label">{{ card.label }}</div>
              <div class="sd-kpi-value">{{ card.display }}</div>
              <div class="sd-kpi-hint">{{ card.hint }}</div>
            </div>
          </div>
          <div class="sd-panel sd-panel--small">
            <div class="sd-panel-title">API 生命周期分布</div>
            <div ref="lifeRef" class="sd-chart sd-chart-pie"></div>
          </div>
        </aside>

        <main class="sd-col-main">
          <div class="sd-panel sd-panel--hero">
            <div class="sd-panel-title">API 访问量趋势（近 7 天）</div>
            <div ref="visitRef" class="sd-chart sd-chart-hero"></div>
          </div>
        </main>

        <aside class="sd-col-right">
          <div class="sd-panel sd-panel--trend">
            <div class="sd-panel-title">新增风险趋势（近 7 天）</div>
            <div ref="logTrendRef" class="sd-chart sd-chart-trend"></div>
          </div>
          <div class="sd-panel sd-panel--alarm">
            <div class="sd-panel-title">最新告警日志</div>
            <div class="sd-alarm-scroll">
              <div class="sd-alarm-inner" :style="{ animationDuration: alarmAnimSec + 's' }">
                <div v-for="(row, idx) in alarmDupList" :key="idx" class="sd-alarm-row">
                  <span class="sd-alarm-time">{{ row.time }}</span>
                  <span :class="['sd-alarm-badge', row.levelClass]">{{ row.levelText }}</span>
                  <span class="sd-alarm-name">{{ row.name }}</span>
                  <span class="sd-alarm-ip">{{ row.sip }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <footer class="sd-footer">
        <div class="sd-panel sd-panel--foot">
          <div class="sd-panel-title">API 风险类型分布（Top 8）</div>
          <div ref="policyRef" class="sd-chart sd-chart-bar"></div>
        </div>
        <div class="sd-panel sd-panel--foot">
          <div class="sd-panel-title">API 资产关联脆弱性风险 Top 5</div>
          <div ref="topApiRef" class="sd-chart sd-chart-bar"></div>
        </div>
      </footer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import { storeToRefs } from 'pinia';
  import * as echarts from 'echarts';
  import type { ECharts, EChartsOption } from 'echarts';
  import { useUserStore } from '@/store';
  import {
    fetchAlarmLogLatest,
    fetchApiLifeCycleDistribution,
    fetchApiRiskFragilityTop5,
    fetchEngineStatus,
    fetchFragilityPolicyAggregation,
    fetchFragilityRiskTotal,
    fetchLogsTrend,
    fetchResApiTotal,
    fetchResAppTotal,
    fetchRiskBehaviorTotal,
    fetchVisitNumTrend,
    getSecurityDashboardMock,
    type AlarmLogItem,
    type LogsTrendResult,
    type VisitTrendPoint
  } from '@/api/securityDashboard';

  const designW = 1920;
  const designH = 1080;
  const scale = ref(1);

  const slotStyle = computed(() => {
    const s = scale.value;
    return {
      width: `${Math.round(designW * s)}px`,
      height: `${Math.round(designH * s)}px`
    };
  });
  const userStore = useUserStore();
  const { token } = storeToRefs(userStore);

  const clockText = ref('');
  const engineOnline = ref(true);
  const dataStaleTip = ref('');

  const kpiDisplay = ref({ apps: 0, apis: 0, fragile: 0, behavior: 0 });
  const kpiTarget = ref({ apps: 0, apis: 0, fragile: 0, behavior: 0 });

  const alarmRows = ref<
    { time: string; levelText: string; levelClass: string; name: string; sip: string }[]
  >([]);

  let life: ECharts | null = null;
  let visit: ECharts | null = null;
  let logTrend: ECharts | null = null;
  let policy: ECharts | null = null;
  let topApi: ECharts | null = null;

  const lifeRef = ref<HTMLDivElement>();
  const visitRef = ref<HTMLDivElement>();
  const logTrendRef = ref<HTMLDivElement>();
  const policyRef = ref<HTMLDivElement>();
  const topApiRef = ref<HTMLDivElement>();

  let visitData: VisitTrendPoint[] = [];
  let trendData: LogsTrendResult = { alarmLogTrend: [], auditLogTrend: [] };

  const range7d = () => {
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
    return { startMs: start.getTime(), endMs: end.getTime() };
  };

  function updateClock() {
    const n = new Date();
    clockText.value = n.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  function animateKpiTo(target: typeof kpiTarget.value, ms = 900) {
    const from = { ...kpiDisplay.value };
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const ease = 1 - Math.pow(1 - t, 3);
      kpiDisplay.value = {
        apps: Math.round(from.apps + (target.apps - from.apps) * ease),
        apis: Math.round(from.apis + (target.apis - from.apis) * ease),
        fragile: Math.round(from.fragile + (target.fragile - from.fragile) * ease),
        behavior: Math.round(from.behavior + (target.behavior - from.behavior) * ease)
      };
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const kpiCards = computed(() => [
    {
      key: 'apps',
      label: '应用数量',
      display: formatInt(kpiDisplay.value.apps),
      hint: 'DescribeResApp · 5min'
    },
    {
      key: 'apis',
      label: 'API 数量',
      display: formatInt(kpiDisplay.value.apis),
      hint: 'DescribeResApi · 5min'
    },
    {
      key: 'fragile',
      label: '脆弱性风险',
      display: formatInt(kpiDisplay.value.fragile),
      hint: 'FragilityRisk · 5min'
    },
    {
      key: 'behavior',
      label: '行为风险',
      display: formatInt(kpiDisplay.value.behavior),
      hint: 'RiskBehavior · 5min'
    }
  ]);

  function formatInt(n: number) {
    if (n === undefined || n === null || Number.isNaN(n)) return '--';
    return n.toLocaleString('zh-CN');
  }

  function levelMap(lv?: string): { text: string; cls: string } {
    const x = (lv || '').toLowerCase();
    if (x === 'critical' || x === 'high') return { text: '高危', cls: 'lv-high' };
    if (x === 'medium') return { text: '中危', cls: 'lv-mid' };
    return { text: '低危', cls: 'lv-low' };
  }

  function applyAlarms(list: AlarmLogItem[]) {
    alarmRows.value = list.map((a) => {
      const m = levelMap(a.alarmLevel);
      return {
        time: a.alarmTime || '-',
        levelText: m.text,
        levelClass: m.cls,
        name: a.alarmName || '-',
        sip: a.sip || '-'
      };
    });
  }

  const alarmDupList = computed(() => {
    const a = alarmRows.value;
    if (!a.length) return [];
    return a.length < 8 ? [...a, ...a] : [...a, ...a];
  });

  const alarmAnimSec = computed(() => Math.max(18, alarmRows.value.length * 2.2));

  const chartText = 'rgba(210, 226, 255, 0.92)';
  const chartMuted = 'rgba(148, 168, 210, 0.55)';
  const chartLine = 'rgba(58, 88, 160, 0.5)';

  const baseChartOption = (): EChartsOption => ({
    backgroundColor: 'transparent',
    textStyle: { color: chartText, fontSize: 11 }
  });

  function setLifeChart(items: { name: string; value: number }[]) {
    if (!life) return;
    life.setOption(
      {
        ...baseChartOption(),
        tooltip: { trigger: 'item' },
        series: [
          {
            type: 'pie',
            radius: ['38%', '68%'],
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 4, borderColor: '#0a1024', borderWidth: 2 },
            label: { color: chartText, fontSize: 11 },
            data: items.length ? items : [{ name: '暂无', value: 1 }],
            color: ['#3b8cff', '#00c9b5', '#f6a11a', '#a86ffe', '#7183a6']
          }
        ]
      },
      true
    );
  }

  function setVisitChart(points: VisitTrendPoint[]) {
    if (!visit) return;
    const sorted = [...points].sort((a, b) => a.time - b.time);
    const fmt = (t: number) => {
      const d = new Date(t);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    };
    visit.setOption(
      {
        ...baseChartOption(),
        grid: { left: 48, right: 24, top: 32, bottom: 28 },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: sorted.map((p) => fmt(p.time)),
          axisLine: { lineStyle: { color: chartLine } },
          axisLabel: { color: chartMuted }
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: chartLine, type: 'dashed' } },
          axisLabel: { color: chartMuted }
        },
        series: [
          {
            type: 'line',
            smooth: true,
            showSymbol: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(59, 140, 255, 0.45)' },
                { offset: 1, color: 'rgba(59, 140, 255, 0.02)' }
              ])
            },
            lineStyle: { width: 2, color: '#3b8cff' },
            data: sorted.map((p) => p.count)
          }
        ]
      },
      true
    );
  }

  function setLogTrendChart(t: LogsTrendResult) {
    if (!logTrend) return;
    const alarm = [...(t.alarmLogTrend || [])].sort((a, b) => (a.time || 0) - (b.time || 0));
    const audit = [...(t.auditLogTrend || [])].sort((a, b) => (a.time || 0) - (b.time || 0));
    const fmt = (ms?: number) => {
      if (!ms) return '';
      const d = new Date(ms);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    };
    const cats = (alarm.length ? alarm : audit).map((x) => fmt(x.time));
    logTrend.setOption(
      {
        ...baseChartOption(),
        legend: { data: ['脆弱性新增', '告警新增'], textStyle: { color: chartMuted }, top: 4 },
        grid: { left: 44, right: 20, top: 36, bottom: 28 },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: cats.length ? cats : ['—'],
          axisLine: { lineStyle: { color: chartLine } },
          axisLabel: { color: chartMuted }
        },
        yAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: chartLine, type: 'dashed' } },
          axisLabel: { color: chartMuted }
        },
        series: [
          {
            name: '脆弱性新增',
            type: 'line',
            smooth: true,
            data: audit.map((x) => x.count ?? 0),
            lineStyle: { color: '#00c9b5' }
          },
          {
            name: '告警新增',
            type: 'line',
            smooth: true,
            data: alarm.map((x) => x.count ?? 0),
            lineStyle: { color: '#f66b4f' }
          }
        ]
      },
      true
    );
  }

  function setHBar(el: ECharts | null, items: { name: string; value: number }[]) {
    if (!el) return;
    const sorted = [...items].sort((a, b) => a.value - b.value);
    const names = sorted.map((x) => (x.name.length > 36 ? x.name.slice(0, 36) + '…' : x.name));
    el.setOption(
      {
        ...baseChartOption(),
        grid: { left: 8, right: 48, top: 8, bottom: 8, containLabel: true },
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'value',
          splitLine: { lineStyle: { color: chartLine, type: 'dashed' } },
          axisLabel: { color: chartMuted }
        },
        yAxis: {
          type: 'category',
          data: names.length ? names : ['暂无'],
          axisLine: { show: false },
          axisLabel: { color: chartText, fontSize: 11, width: 200, overflow: 'truncate' }
        },
        series: [
          {
            type: 'bar',
            data: sorted.length ? sorted.map((x) => x.value) : [0],
            barMaxWidth: 14,
            itemStyle: {
              borderRadius: [0, 6, 6, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#1a4fd4' },
                { offset: 1, color: '#3b8cff' }
              ])
            },
            label: { show: true, position: 'right', color: chartMuted, fontSize: 10 }
          }
        ]
      },
      true
    );
  }

  let cache = getSecurityDashboardMock(range7d());
  let loadFail = false;

  async function loadKpiAndTrends(tkn?: string) {
    const { startMs, endMs } = range7d();
    try {
      const [apps, apis, fragile, behavior, vTrend, lTrend] = await Promise.all([
        fetchResAppTotal(tkn),
        fetchResApiTotal(tkn),
        fetchFragilityRiskTotal(tkn),
        fetchRiskBehaviorTotal(tkn),
        fetchVisitNumTrend(startMs, endMs, tkn),
        fetchLogsTrend(startMs, endMs, tkn)
      ]);
      kpiTarget.value = { apps, apis, fragile, behavior };
      animateKpiTo(kpiTarget.value);
      visitData = vTrend;
      trendData = lTrend;
      setVisitChart(visitData);
      setLogTrendChart(trendData);
      cache.kpi = { apps, apis, fragile, behavior };
      cache.visit = vTrend;
      cache.logsTrend = lTrend;
      loadFail = false;
      dataStaleTip.value = '';
    } catch {
      loadFail = true;
      dataStaleTip.value = '数据更新失败，已显示上次成功/演示数据';
      kpiTarget.value = cache.kpi;
      animateKpiTo(kpiTarget.value);
      setVisitChart(cache.visit);
      setLogTrendChart(cache.logsTrend);
    }
  }

  async function loadSlowCharts(tkn?: string) {
    try {
      const [lifeD, pol, top5] = await Promise.all([
        fetchApiLifeCycleDistribution(tkn),
        fetchFragilityPolicyAggregation(tkn),
        fetchApiRiskFragilityTop5(tkn)
      ]);
      setLifeChart(lifeD);
      setHBar(policy, pol);
      setHBar(topApi, top5);
      cache.lifeCycle = lifeD;
      cache.policies = pol;
      cache.apiTop5 = top5;
    } catch {
      if (!loadFail) dataStaleTip.value = '数据更新失败，已显示上次成功/演示数据';
      setLifeChart(cache.lifeCycle);
      setHBar(policy, cache.policies);
      setHBar(topApi, cache.apiTop5);
    }
  }

  async function loadAlarms(tkn?: string) {
    try {
      const list = await fetchAlarmLogLatest(tkn);
      applyAlarms(list);
      cache.alarms = list;
    } catch {
      applyAlarms(cache.alarms);
    }
  }

  async function loadEngine(tkn?: string) {
    try {
      const st = await fetchEngineStatus(tkn);
      engineOnline.value = st === 'online';
    } catch {
      engineOnline.value = true;
    }
  }

  function readViewportSize() {
    const vv = window.visualViewport;
    if (vv) return { w: vv.width, h: vv.height };
    return {
      w: document.documentElement.clientWidth || window.innerWidth,
      h: document.documentElement.clientHeight || window.innerHeight
    };
  }

  function updateScale() {
    const { w, h } = readViewportSize();
    if (!w || !h) return;
    const sw = w / designW;
    const sh = h / designH;
    /** 留边避免贴边裁切；略小于 1 保证整块进入视口 */
    scale.value = Math.min(sw, sh) * 0.96;
  }

  let tClock: ReturnType<typeof setInterval>;
  let tKpi: ReturnType<typeof setInterval>;
  let tSlow: ReturnType<typeof setInterval>;
  let tAlarm: ReturnType<typeof setInterval>;
  let tEngine: ReturnType<typeof setInterval>;

  function initCharts() {
    if (lifeRef.value && !life) life = echarts.init(lifeRef.value);
    if (visitRef.value && !visit) visit = echarts.init(visitRef.value);
    if (logTrendRef.value && !logTrend) logTrend = echarts.init(logTrendRef.value);
    if (policyRef.value && !policy) policy = echarts.init(policyRef.value);
    if (topApiRef.value && !topApi) topApi = echarts.init(topApiRef.value);
    setLifeChart(cache.lifeCycle);
    setVisitChart(cache.visit);
    setLogTrendChart(cache.logsTrend);
    setHBar(policy, cache.policies);
    setHBar(topApi, cache.apiTop5);
    applyAlarms(cache.alarms);
    kpiTarget.value = cache.kpi;
    kpiDisplay.value = { ...cache.kpi };
  }

  const resizeAll = () => {
    updateScale();
    life?.resize();
    visit?.resize();
    logTrend?.resize();
    policy?.resize();
    topApi?.resize();
  };

  const onViewportResize = () => resizeAll();

  onMounted(async () => {
    updateScale();
    window.addEventListener('resize', resizeAll);
    window.visualViewport?.addEventListener('resize', onViewportResize);
    window.visualViewport?.addEventListener('scroll', onViewportResize);
    updateClock();
    tClock = setInterval(updateClock, 1000);

    await nextTick();
    initCharts();
    resizeAll();

    const tkn = token.value;
    await loadEngine(tkn);
    await loadKpiAndTrends(tkn);
    await loadSlowCharts(tkn);
    await loadAlarms(tkn);

    tKpi = setInterval(() => {
      dataStaleTip.value = '';
      loadKpiAndTrends(token.value);
    }, 5 * 60 * 1000);
    tSlow = setInterval(() => loadSlowCharts(token.value), 10 * 60 * 1000);
    tAlarm = setInterval(() => loadAlarms(token.value), 30 * 1000);
    tEngine = setInterval(() => loadEngine(token.value), 60 * 1000);
  });

  watch(token, (v) => {
    loadEngine(v);
    loadKpiAndTrends(v);
    loadSlowCharts(v);
    loadAlarms(v);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeAll);
    window.visualViewport?.removeEventListener('resize', onViewportResize);
    window.visualViewport?.removeEventListener('scroll', onViewportResize);
    clearInterval(tClock);
    clearInterval(tKpi);
    clearInterval(tSlow);
    clearInterval(tAlarm);
    clearInterval(tEngine);
    life?.dispose();
    visit?.dispose();
    logTrend?.dispose();
    policy?.dispose();
    topApi?.dispose();
  });
</script>

<style lang="less" scoped>
  .sd-screen-root {
    min-height: 100vh;
    min-height: 100dvh;
    width: 100%;
    overflow: auto;
    background: radial-gradient(ellipse 120% 80% at 50% -20%, #1a2b6e 0%, #060b18 45%, #030509 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    box-sizing: border-box;
  }

  .sd-scale-slot {
    position: relative;
    flex-shrink: 0;
    overflow: hidden;
  }

  .sd-design {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: 0 0;
    color: #e8efff;
    font-family:
      'Plus Jakarta Sans',
      'Segoe UI',
      'Microsoft YaHei',
      system-ui,
      sans-serif;
    box-sizing: border-box;
    padding: 10px 14px 8px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .sd-stale-banner {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    padding: 6px 18px;
    border-radius: 999px;
    font-size: 13px;
    color: #ffd0c8;
    background: rgba(246, 107, 79, 0.2);
    border: 1px solid rgba(246, 107, 79, 0.45);
  }

  .sd-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    padding: 0 6px 0 2px;
    border-bottom: 1px solid rgba(80, 120, 220, 0.25);
    flex-shrink: 0;
  }

  .sd-header-left {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .sd-product {
    font-size: 20px;
    font-weight: 700;
    letter-spacing: 0.02em;
    text-shadow: 0 0 24px rgba(80, 140, 255, 0.35);
  }

  .sd-sub {
    font-size: 12px;
    color: rgba(180, 200, 245, 0.65);
  }

  .sd-header-center {
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 0.06em;
    color: #7eb8ff;
  }

  .sd-header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }

  .sd-engine-label {
    color: rgba(180, 200, 245, 0.7);
  }

  .sd-engine-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    flex-shrink: 0;
    &.on {
      background: #2ee6a8;
      box-shadow: 0 0 10px #2ee6a8;
    }
    &.off {
      background: #f66b4f;
      box-shadow: 0 0 10px #f66b4f;
    }
  }

  .sd-engine-text {
    color: rgba(220, 235, 255, 0.95);
    font-weight: 500;
  }

  .sd-body {
    flex: 1;
    min-height: 0;
    display: grid;
    grid-template-columns: 258px 1fr 372px;
    gap: 8px;
  }

  .sd-col-left {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
  }

  .sd-kpi-stack {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .sd-kpi-card {
    background: linear-gradient(135deg, rgba(25, 45, 110, 0.55) 0%, rgba(12, 24, 56, 0.85) 100%);
    border: 1px solid rgba(90, 130, 230, 0.28);
    border-radius: 10px;
    padding: 8px 12px;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.35);
  }

  .sd-kpi-label {
    font-size: 13px;
    color: rgba(180, 205, 255, 0.75);
    margin-bottom: 8px;
  }

  .sd-kpi-value {
    font-size: 30px;
    font-weight: 800;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
    color: #fff;
    text-shadow: 0 0 20px rgba(100, 160, 255, 0.3);
  }

  .sd-kpi-hint {
    margin-top: 6px;
    font-size: 11px;
    color: rgba(140, 165, 220, 0.45);
  }

  .sd-col-main {
    min-height: 0;
    display: flex;
    flex-direction: column;
  }

  .sd-col-right {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-height: 0;
  }

  .sd-panel {
    background: rgba(10, 18, 42, 0.72);
    border: 1px solid rgba(75, 115, 210, 0.22);
    border-radius: 10px;
    padding: 8px 10px;
    display: flex;
    flex-direction: column;
    min-height: 0;
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.03);
  }

  .sd-panel-title {
    font-size: 13px;
    font-weight: 600;
    color: rgba(220, 232, 255, 0.92);
    margin-bottom: 4px;
    flex-shrink: 0;
  }

  .sd-panel--small {
    flex: 1;
    min-height: 156px;
  }

  .sd-panel--hero {
    flex: 1;
  }

  .sd-panel--trend {
    flex: 1;
    min-height: 168px;
  }

  .sd-panel--alarm {
    flex: 1;
    min-height: 196px;
  }

  .sd-chart {
    flex: 1;
    min-height: 120px;
  }

  .sd-chart-pie {
    min-height: 148px;
  }

  .sd-chart-hero {
    min-height: 248px;
  }

  .sd-chart-trend {
    min-height: 156px;
  }

  .sd-alarm-scroll {
    flex: 1;
    overflow: hidden;
    position: relative;
    mask-image: linear-gradient(to bottom, transparent 0%, #000 8%, #000 92%, transparent 100%);
  }

  .sd-alarm-inner {
    animation: sd-scroll linear infinite;
  }

  @keyframes sd-scroll {
    0% {
      transform: translateY(0);
    }
    100% {
      transform: translateY(-50%);
    }
  }

  .sd-alarm-row {
    display: grid;
    grid-template-columns: 148px 52px 1fr 120px;
    gap: 8px;
    align-items: center;
    padding: 8px 6px;
    font-size: 12px;
    border-bottom: 1px solid rgba(60, 90, 160, 0.2);
  }

  .sd-alarm-time {
    color: rgba(160, 185, 235, 0.8);
    font-family: ui-monospace, monospace;
    font-size: 11px;
  }

  .sd-alarm-badge {
    text-align: center;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    &.lv-high {
      background: rgba(246, 80, 80, 0.25);
      color: #ff9a9a;
    }
    &.lv-mid {
      background: rgba(246, 167, 50, 0.22);
      color: #ffcb78;
    }
    &.lv-low {
      background: rgba(59, 140, 255, 0.22);
      color: #9dc4ff;
    }
  }

  .sd-alarm-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #e8f0ff;
  }

  .sd-alarm-ip {
    color: rgba(150, 175, 230, 0.85);
    text-align: right;
    font-family: ui-monospace, monospace;
    font-size: 11px;
  }

  .sd-footer {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    height: 192px;
    flex-shrink: 0;
  }

  .sd-panel--foot {
    min-height: 0;
  }

  .sd-chart-bar {
    min-height: 132px;
  }
</style>
