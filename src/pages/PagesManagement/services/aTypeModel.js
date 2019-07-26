import { stringify } from 'qs';
import request from '@/utils/request';

export async function reqList(params) {
  return request(`/operate/goods/list?${stringify(params)}`);
}

export async function reqSubmit(params) {
  return request(`/operate/activity-page/create-info`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

  