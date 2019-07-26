import { stringify } from 'qs';
import request from '@/utils/request';

export async function reqList(params) {
  return request(`/operate/activity-page/list?${stringify(params)}`);
}

export async function reqConfig(params) {
  return request(`/operate/activity-page/view-config?${stringify(params)}`);
}


export async function reqConfim(url,params) {
    return request(url, {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }

  