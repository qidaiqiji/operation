import { stringify } from 'qs';
import request from '../../../utils/request';
export async function reqList(params) {
    return request(`/operate/activity/list?${stringify(params)}`);
  }