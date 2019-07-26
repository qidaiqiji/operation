import {stringify} from 'qs';
import request from '../../../utils/request';

export async function activityGoodsList(params) {
  return request(`/operate/activity/goods-list?${stringify(params)}`);
}
export async function activityconfig(params) {
  return request(`/operate/activity/config?${stringify(params)}`);
}
