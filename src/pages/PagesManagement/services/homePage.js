import { stringify } from 'qs';
import request from '@/utils/request';

export async function reqList(params) {
  return request(`/operate/goods/list?${stringify(params)}`);
}

export async function reqPageConfig(params) {
  return request(`/operate/index/config?${stringify(params)}`);
}
export async function reqConfig(params) {
  return request(`/operate/activity/config?${stringify(params)}`);
}
export async function reqDetail(params) {
  return request(`/operate/index/detail?${stringify(params)}`);
}
export async function reqCreate(params) {
  console.log("params",params)
    return request(`/operate/index/edit`, {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }

  