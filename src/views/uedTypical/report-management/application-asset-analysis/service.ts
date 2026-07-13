import { getMockAppDetail, getMockOverview } from './mock';
import type { AppDetailBundle } from './types';

export interface DateRangeQuery {
  startDate?: string;
  endDate?: string;
}

export async function fetchAppOverviewStats(_query?: DateRangeQuery) {
  return getMockOverview().stats;
}

export async function fetchDefectTopApps(_query?: DateRangeQuery) {
  return getMockOverview().defectTopApps;
}

export async function fetchAttackTopApps(_query?: DateRangeQuery) {
  return getMockOverview().attackTopApps;
}

export async function fetchBehaviorTopApps(_query?: DateRangeQuery) {
  return getMockOverview().behaviorTopApps;
}

export async function fetchSupplementaryTops(_query?: DateRangeQuery) {
  const data = getMockOverview();
  return {
    appDefectTop10Dist: data.appDefectTop10Dist,
    defectApiTop: data.defectApiTop,
    attackIpTop: data.attackIpTop,
    behaviorSubjectTop: data.behaviorSubjectTop
  };
}

export async function fetchAppAssetDetail(appId: string): Promise<AppDetailBundle | null> {
  return getMockAppDetail(appId);
}

export async function fetchAppDefects(appId: string) {
  const detail = await fetchAppAssetDetail(appId);
  return detail?.defects ?? [];
}

export async function fetchAppAttacks(appId: string) {
  const detail = await fetchAppAssetDetail(appId);
  return detail?.attacks ?? [];
}

export async function fetchAppBehaviors(appId: string) {
  const detail = await fetchAppAssetDetail(appId);
  return detail?.behaviors ?? [];
}
