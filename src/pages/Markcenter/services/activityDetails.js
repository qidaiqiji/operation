import { stringify } from 'qs';
import request from '../../../utils/request';

// 活动上部基础信息

export async function reqViewActInfo(params) {
  return request(`/operate/activity/view-activity-info?${stringify(params)}`);
}

  // 拼团活动商品列表
  export async function reqViewList(params) {
    return request(`/operate/group-shopping/view-list?${stringify(params)}`);
  }
//秒杀活动商品列表
  export async function reqGoodsActList(params) {
    return request(`/operate/goods-activity/view-list?${stringify(params)}`);
  }
//设置显示
export async function setGoodsActShow(params) {
  return request(`/operate/goods-activity/set-show`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

//设置不显示
export async function unsetGoodsActShow(params) {
  return request(`/operate/goods-activity/unset-show`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
  // 新增拼团数
  
  export async function updateGroupNumb(params) {
    return request(`/operate/group-shopping/create-group`, {
      method: 'POST',
      body: {
        ...params,
      },
    });
  }
  