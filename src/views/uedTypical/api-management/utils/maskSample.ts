import type { ApiParameterRow } from '../types';

function maskMiddle(value: string, head = 2, tail = 2) {
  if (value.length <= head + tail) return '*'.repeat(value.length);
  return `${value.slice(0, head)}${'*'.repeat(Math.max(4, value.length - head - tail))}${value.slice(-tail)}`;
}

export function shouldMaskSample(sample: string) {
  return Boolean(sample && sample !== '-');
}

export function maskSampleValue(sample: string, record: Pick<ApiParameterRow, 'name' | 'dataTag' | 'sensitive'>) {
  if (!shouldMaskSample(sample)) return sample;

  const tag = record.dataTag || '';
  const field = record.name.toLowerCase();

  if (tag === '手机号' || /mobile|phone/.test(field)) {
    return sample.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  }

  if (tag === '身份证号' || /idcard|id_card|idcardno/.test(field)) {
    if (sample.length >= 10) return `${sample.slice(0, 6)}********${sample.slice(-4)}`;
    return maskMiddle(sample, 2, 2);
  }

  if (tag === '邮箱地址' || sample.includes('@')) {
    const [local, domain] = sample.split('@');
    if (local && domain) return `${local[0]}***@${domain}`;
  }

  if (tag === '姓名' || /name|realname|nickname/.test(field)) {
    if (sample.length <= 1) return '*';
    return `${sample[0]}${'*'.repeat(Math.min(sample.length - 1, 2))}`;
  }

  if (tag === '银行卡号' || /cardno|card_no|card/.test(field)) {
    return sample.replace(/(\d{4})\d+(\d{4})/, '$1****$2');
  }

  if (record.sensitive === '是' || ['L3', 'L4'].includes(record.level || '')) {
    return maskMiddle(sample);
  }

  return maskMiddle(sample, 2, 2);
}
