import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Row, Col, Divider } from 'antd';
import router from 'umi/router';
import Result from '@/components/Result';
import styles from './style.less';

@connect(({ markcenter }) => ({
  // data: markcenter.basicInfo,
  markcenter: markcenter,
}))

class Over extends React.PureComponent {
  componentWillMount() {
    const { dispatch } = this.props;
    if (this.props.match.params.id != '') {
      dispatch({
        type: 'markcenter/getActivityGoodsDetail',
        payload: {
          activityId: this.props.match.params.id,
          type:this.props.match.params.type,
        },
      });
    }
  }
  handleGoList(){
    router.push(`/markCenter/event-manage`);
  }
  render() {
    const {
      //  data ,
      markcenter: {
        hasChosedGoods,
        id,
        type,
      },
    } = this.props;
    const onFinish = () => {
      router.push(`/markCenter/step-form/confirm/${type}/${id}`);
    };
    return (
      <div>
        <p className={styles.tab}>
          <span>已参加活动的商品</span>
        </p>
        <Divider style={{ margin: '0px 0 20px' }} />
        <div className={styles.content}>
          {hasChosedGoods &&
            hasChosedGoods.map((item, index) => {
              return (
                <div className={styles.goodsdetail}>
                  <div className={styles.left}>
                    <div>
                      <img src={item.goodsImg} alt="" />
                      <div>
                        <h5>{item.goodsName}88</h5>
                        <p>
                          条码：<span>{item.goodsSn}</span>
                        </p>
                      </div>
                    </div>
                    <div className={styles.clearfix}>
                      <div>
                        <p>商品状态</p>
                        <b>{item.goodsStatus}</b>
                      </div>
                      <div>
                        <p>平台价</p>
                        <b>{item.shopPrice}</b>
                      </div>
                      <div>
                        <p>零售价</p>
                        <b>{item.marketPrice}</b>
                      </div>
                      <div>
                        <p>可用库存</p>
                        <b>{item.availableStock}</b>
                      </div>
                    </div>
                  </div>
                  <div className={styles.center}>
                    <div className={styles.uploadbox}>
                      <img src={item.showBannerUrl} alt="" />
                      {/* <img className={styles.overbiao} src={item.iconUrl} alt="" /> */}
                    </div>
                    <div className={styles.activityMessageOver}>
                      <p>
                        活动标题：<span>{item.goodsTitle}</span>
                      </p>
                      <p>
                        活动卖点：<span>{item.desc}</span>
                      </p>
                      <div className={styles.overPageMsg}>
                      {type ==3?([           <div>
           <p>成团人数</p>
             <span>{item.fullNum}</span>
           </div>,   <div>
             <p>拼团价</p>
             <span>{item.actPrice}</span>
           </div>])
                       
                      :([          <div>
                        <p>折扣</p>
                        <span>{item.actPriceDiscount}</span>
                      </div>,       <div>
                        <p>减价</p>
                        <span>{item.actPriceReduce}</span>
                      </div>,      <div>
                        <p>促销价</p>
                        <span>{item.actPrice}</span>
                      </div>,       <div>
                        <p>促销数量</p>
                        <span>{item.matchNum}</span>
                      </div>])
                      }
                        <div>
                          <p>限购数量</p>
                          <span>{item.limitNum}</span>
                        </div>
                        <div>
                          <p>起批量</p>
                          <span>{item.startNum}</span>
                        </div>
                        <div>
                          <p>按箱购买</p>
                          <span>{item.buyByBox?'是':'否'}</span>
                        </div>
                        {
                          item.buyByBox?(
                            <div>
                            <p>逻辑箱规</p>
                            <span>{item.numberPerBox}</span>
                          </div>
                          ):null
                        }
                      </div>
                    </div>
                  </div>
                  <div className={styles.right}>
                    {item.isHot ? <div> 主推</div> : ''}

                    {item.sortOrder != '' ? (
                      <div>
                        <div>排序值</div>
                        <p>{item.sortOrder}</p>
                      </div>
                    ) : (
                        ''
                      )}
                  </div>
                </div>
              );
            })}
        </div>
        <div className={styles.fixedBottom}>
          <div>
            <Button onClick={onFinish}>修改活动</Button>
            <Button
              type="primary"
              style={{ marginLeft: '20px' }}
            onClick={this.handleGoList.bind(this)}
            >
              返回列表
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default Over;
