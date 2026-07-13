import { getMockApiAssetReport } from './mock';
import type { ApiAssetReportData } from './types';

export async function fetchApiAssetReport(): Promise<ApiAssetReportData> {
  return getMockApiAssetReport();
}
