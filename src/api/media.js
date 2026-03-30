import { apiRequestFormData } from './config.js';

export async function uploadMedia(file, folder = 'nadoumi/assets') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  return apiRequestFormData('media/upload', formData, { method: 'POST' });
}
