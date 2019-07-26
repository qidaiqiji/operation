import { stringify } from 'qs';
import request from '../../../utils/request';

export async function reqList(params) {
  return request(`/operate/activity/list?${stringify(params)}`);
}
export async function reqConfig(params) {
  return request(`/operate/activity/config?${stringify(params)}`);
}
export async function reqOperation(reqUrl, params) {
  return request(`/${reqUrl}`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
