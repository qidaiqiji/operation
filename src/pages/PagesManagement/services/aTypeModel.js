import { stringify } from 'qs';
import request from '@/utils/request';

export async function reqList(params) {
  return request(`/operate/goods/list?${stringify(params)}`);
}

export async function reqDetail(params) {
  return request(`/operate/activity-page/view-config-a?${stringify(params)}`);
}

export async function reqConfig(params) {
  return request(`/operate/activity/config?${stringify(params)}`);
}

export async function reqCouponList(params) {
  return request(`/operate/coupon/list?${stringify(params)}`);
}

export async function reqActList(params) {
  return request(`/operate/act-page/list?${stringify(params)}`);
}

export async function reqSubmit(params) {
  return request(`/operate/activity-page/create-info`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqEditSubmit(params) {
  return request(`/operate/activity-page/update-config-a`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqCreateSubmit(params) {
  return request(`/operate/activity-page/create-config-a`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

  