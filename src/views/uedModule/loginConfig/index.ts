import login from './login.png'

export type FormUploadType = 'bgImage' | 'logoUrl' | 'bgVideo' | 'bgPoster';

export const format = ['.jpg', '.png'];
export const videoFormat = ['.mp4', '.webm'];
export const [bgSize, bgSizeText] = [1024 * 1024 * 1, '1MB']; // 1MB
export const [logoSize, logoSizeText] = [1024 * 500, '500KB']; // 500KB
export const [videoSize, videoSizeText] = [1024 * 1024 * 5, '5MB']; // 5MB
export const languages = [
  { label: '中文', value: 'zh' },
  { label: '英文', value: 'en' }
];

export const formatValid: Record<FormUploadType, string[]> = {
  bgImage: format,
  bgPoster: format,
  bgVideo: videoFormat,
  logoUrl: format
};

export const formatValidFull: Record<FormUploadType, string[]> = {
  bgImage: ['image/jpeg', 'image/png'],
  bgPoster: ['image/jpeg', 'image/png'],
  bgVideo: ['video/mp4', 'video/webm'],
  logoUrl: ['image/jpeg', 'image/png']
};

export const limitValid: Record<FormUploadType, number> = {
  bgImage: bgSize,
  bgPoster: bgSize,
  bgVideo: videoSize,
  logoUrl: logoSize
};

export const limitText: Record<FormUploadType, string> = {
  bgImage: bgSizeText,
  bgPoster: bgSizeText,
  bgVideo: videoSizeText,
  logoUrl: logoSizeText
};

/** 空图片 */
export const fallbackImg = login