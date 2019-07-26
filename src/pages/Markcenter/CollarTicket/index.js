import React, { PureComponent, Fragment } from 'react';
import { Card, Steps, Icon ,Spin} from 'antd';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './style.less';

const { Step } = Steps;
@connect(state => ({
  markcenter: state.markcenter,
}))
export default class StepForm extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 3]) {
      case 'info':
        return 0;
      case 'confirm':
        return 1;
      case 'over':
        return 2;
      default:
        return 0;
    }
  }
  render() {
    const {
      location,
      children,
      markcenter: {
        basicInfo,
        activityStartTime,
        activityEndTime,
        timeLength,
        activityName,
      },
    } = this.props;
    const { pathname } = location;

    const pathList = pathname.split('/');
    return (
      <PageHeaderWrapper
        title="口令领券"
        tabActiveKey={location.pathname}
        // content="将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。"
      >
        <Card bordered={false}>
          <Fragment>
            <Steps current={this.getCurrentStep()} className={styles.steps}>
              <Step title="活动基础信息" />
              <Step title="添加活动奖品" />
              <Step title="完成" />
            </Steps>
            {pathList.length > 4 && pathList[pathList.length - 3] != 'info'&& pathList[pathList.length - 2] != 'info' ? (
              <div className={styles.remindModal}>
                <Icon
                  style={{ fontSize: '20px', marginRight: '10px' }}
                  type="check-circle"
                  theme="twoTone"
                  twoToneColor="#52c41a"
                />
                {pathList[pathList.length - 3] == 'confirm' ? <span>活动创建成功！</span> : ''}
                {pathList[pathList.length - 3] == 'over' ? <span>活动成功发布！</span> : ''}
                {activityName? <div>活动名称：<span style={{ color: '#000' }}>{activityName}</span>
                </div>:(<Spin size="large" />)}
                {                
                  <div>
                    活动时间：
                    <span style={{ color: '#000' }}>
                      <span style={{ paddingRight: '10px' }}>{activityStartTime}</span> -
                      <span style={{ paddingLeft: '10px' }}>{activityEndTime}</span>
                    </span>
                    <span style={{ paddingLeft: '20px', color: '#000' }}>{timeLength}</span>
                  </div>
                  // ) : ''
                }
              </div>
            ) : (
              ''
            )}
            {children}
          </Fragment>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
