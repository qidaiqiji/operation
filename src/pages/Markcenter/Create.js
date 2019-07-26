import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Link from 'umi/link';
import icon from '../../../public/icons/icon.png';
import { Button, Icon, Card, Row, Col, Affix } from 'antd';
import styles from './index.less';
const ButtonGroup = Button.Group;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
class Create extends PureComponent {
  render() {
    const cardList1 = [
      {
        title: '单品直降',
        linkUrl: '/markCenter/step-form/info/5',
      },
      {
        title: '限时特供',
        linkUrl: '/markCenter/step-form/info/1',
      },
      {
        title: '拼团',
        linkUrl: '/markCenter/step-form/info/3',
      },
      {
        title: '巨划算',
        linkUrl: '/markCenter/step-form/info/4',
      },
      {
        title: '优惠券',
        linkUrl: '',
      },
      {
        title: '满赠',
        linkUrl: '',
      },
      {
        title: '满减',
        linkUrl: '',
      },
      {
        title: '满返',
        linkUrl: '',
      },
      {
        title: '套餐组合',
        linkUrl: '',
      },
      {
        title: '赠品',
        linkUrl: '',
      },
    ];
    const cardList2 = [
      {
        title: '新客促活',
        linkUrl: '',
      },
      {
        title: '累积返利',
        linkUrl: '',
      },
      {
        title: '签到有礼',
        linkUrl: '',
      },
    ];
    const cardList3 = [
      {
        title: '集贴纸',
        linkUrl: '',
      },
      {
        title: '九宫格抽奖',
        linkUrl: '',
      },
      {
        title: '口令',
        linkUrl: '',
      },
      {
        title: '拆福袋',
        linkUrl: '',
      },
      {
        title: '答题',
        linkUrl: '',
      },
      {
        title: '刮刮乐',
        linkUrl: '',
      },
      {
        title: '爆品红包',
        linkUrl: '',
      },
      {
        title: '助力砍价',
        linkUrl: '',
      },
      {
        title: '邀请有礼',
        linkUrl: '',
      },
    ];
    return (
      <PageHeaderWrapper title="创建促销">
        <Affix>
          <Row
            type="flex"
            justify="center"
            style={{ height: 70, background: '#ffffff' }}
            align="middle"
          >
            <ButtonGroup>
              <Button size="large" href="#card1">
                提升客单
              </Button>
              <Button size="large" href="#card2">
                潜客促活
              </Button>
              <Button size="large" href="#card3">
                互动引流
              </Button>
            </ButtonGroup>
          </Row>
        </Affix>
        <Card style={{ margin: '20px 0' }} id="card1">
          <Row style={{ fontSize: 18, marginBottom: 20 }}>提升客单</Row>
          <Row>
            {cardList1.map((item, index) => {
              return (
                <Col span={5} style={{ marginRight: 20, marginBottom: 20 }} key={index}>
                  <Card
                    title={
                      <Row type="flex" align="middle">
                        <img src={icon} />
                        <span style={{ display: 'inline-block', fontSize: 30, marginLeft: 20 }}>
                          {item.title}
                        </span>
                      </Row>
                    }
                    hoverable={true}
                    className={styles.customCardStyle}
                  >
                    <p className={styles.cardContent}>
                      <Link
                        to={{
                          pathname: item.linkUrl,
                          state: { title: item.title },
                        }}
                      >
                        去创建
                      </Link>
                    </p>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
        <Card style={{ margin: '20px 0' }} id="card2">
          <Row style={{ fontSize: 18, marginBottom: 20 }}>潜客促活</Row>
          <Row>
            {cardList2.map((item, index) => {
              return (
                <Col span={5} style={{ marginRight: 20, marginBottom: 20 }} key={index}>
                  <Card
                    title={
                      <Row type="flex" align="middle">
                        <img src={icon} />
                        <span style={{ display: 'inline-block', fontSize: 30, marginLeft: 20 }}>
                          {item.title}
                        </span>
                      </Row>
                    }
                    hoverable={true}
                    className={styles.customCardStyle}
                  >
                    <p className={styles.cardContent}>
                      <Link to={item.linkUrl}>去创建</Link>
                    </p>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
        <Card style={{ margin: '20px 0' }} id="card3">
          <Row style={{ fontSize: 18, marginBottom: 20 }}>互动引流</Row>
          <Row>
            {cardList3.map((item, index) => {
              return (
                <Col span={5} style={{ marginRight: 20, marginBottom: 20 }} key={index}>
                  <Card
                    title={
                      <Row type="flex" align="middle">
                        <img src={icon} />
                        <span style={{ display: 'inline-block', fontSize: 30, marginLeft: 20 }}>
                          {item.title}
                        </span>
                      </Row>
                    }
                    hoverable={true}
                    className={styles.customCardStyle}
                  >
                    <p className={styles.cardContent}>
                      <Link to={item.linkUrl}>去创建</Link>
                    </p>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

Create.propTypes = {};

export default Create;
