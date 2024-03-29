import { stringify } from 'qs';
import request from '@/utils/request';

// 活动上部基础信息

export async function reqViewActInfo(params) {
  return request(`/operate/activity/view-activity-info?${stringify(params)}`);
}

export async function reqInfo(params) {
  return request(`/operate/activity-page/view-info?${stringify(params)}`);
}

//设置不显示
export async function reqSubmit(params) {
  return request(`/operate/activity-page/create-info`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

export async function reqCorrect(params) {
  return request(`/operate/activity-page/update-info`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}


  