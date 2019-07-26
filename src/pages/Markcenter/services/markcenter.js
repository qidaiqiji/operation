import { stringify } from 'qs';
import request from '../../../utils/request';

export async function reqList(params) {
  return request(`/operate/goods/list?${stringify(params)}`);
}
// 创建秒杀活动
export async function creatActivity(params) {
  return request(`/operate/goods-activity/create`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
//添加秒杀商品

export async function createMiaoShaGoods(params) {
  return request(`/operate/goods-activity/add-goods`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
//添加拼团商品

export async function createPinTuanGoods(params) {
  return request(`/operate/group-shopping/add-goods`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 创建拼团
export async function creatPinTuan(params) {
  return request(`/operate/group-shopping/create`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 修改创建拼团
export async function reqGroupShopView(params) {
  return request(`/operate/group-shopping/view?${stringify(params)}`);
}
//修改创建秒杀
export async function reqGoodsActView(params) {
  return request(`/operate/goods-activity/view?${stringify(params)}`);
}
// 更新创建拼团
export async function updateGroupShop(params) {
  return request(`/operate/group-shopping/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
//更新创建秒杀
export async function updateGoodsAct(params) {
  return request(`/operate/goods-activity/update`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 活动可叠加列表
export async function reqCompositionList(params) {
  return request(`/operate/activity/composition-list?${stringify(params)}`);
}

//删除拼团活动商品
export async function deleteGroupShop(params) {
  return request(`/operate/group-shopping/delete`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 设置拼团主推
export async function setGroupShopHot(params) {
  return request(`/operate/group-shopping/set-hot`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 取消拼团主推
export async function unsetGroupShopHot(params) {
  return request(`/operate/group-shopping/unset-hot`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
// 设置秒杀主推

export async function setGoodsActHot(params) {
  return request(`/operate/goods-activity/set-hot`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}

// 取消秒杀主推
export async function unsetGoodsActHot(params) {
  return request(`/operate/goods-activity/unset-hot`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}



export async function updataActivity(params) {
  return request(`/operate/goods-activity/create`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function askActMes(params) {
  return request(`/operate/activity/view?${stringify(params)}`);
}
// 已添加秒杀活动商品列表信息
export async function askActGoodDetail(params) {
  return request(`/operate/goods-activity/list?${stringify(params)}`);
}
// 已添加拼团活动商品列表信息
export async function reqGroupShopList(params) {
  return request(`/operate/group-shopping/list?${stringify(params)}`);
}

export async function reqDeleteActGoods(params) {
  return request(`/operate/goods-activity/delete`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
export async function reqConfig(params) {
  return request(`/operate/activity/config?${stringify(params)}`);
}
export async function reqExcelInfo(params) {
  console.log('hhhhhhhhhh');
  return request(`/operate/goods-activity/import`, {
    method: 'POST',
    body: {
      ...params,
    },
  });
}
