import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import Link from 'umi/link';
import { Button, Icon, Card, Row, Col, Affix } from 'antd';
const ButtonGroup = Button.Group;
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CardItem from '@/components/CardItem'
class Create extends PureComponent {
  render() {
    const cardList1 = [
      {
        title: '页面配置',
        linkUrl: '',
      }
    ];
    const cardList2 = [
      {
        title: 'A级活动模板',
        linkUrl: '/pages-management/create-pages/1',
      },
      {
        title: 'B级活动模板',
        linkUrl: '/pages-management/create-pages/2',
      },
    ];
    const cardList3 = [
      {
        title: '选聘专辑',
        linkUrl: '',
      }
    ];
    const cardList4 = [
      {
        title: '名品专区',
        linkUrl: '',
      },
      {
        title: '超级品牌日',
        linkUrl: '',
      },
      {
        title: '合资品',
        linkUrl: '',
      },
      {
        title: '品类页',
        linkUrl: '',
      },

    ];
    const cardList5 = [
      
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
                首页
              </Button>
              <Button size="large" href="#card2">
                活动页
              </Button>
              <Button size="large" href="#card3">
                选品专辑
              </Button>
              <Button size="large" href="#card4">
                频道页
              </Button>
              <Button size="large" href="#card5">
                文章
              </Button>
            </ButtonGroup>
          </Row>
        </Affix>
        <Card style={{ margin: '20px 0' }} id="card1">
            <CardItem
            datasource={cardList1}
            title="首页"
            />
        </Card>
        <Card style={{ margin: '20px 0' }} id="card2">
            <CardItem
            datasource={cardList2}
            title="活动页"
            />
        </Card>
        <Card style={{ margin: '20px 0' }} id="card3">
            <CardItem
            datasource={cardList3}
            title="选品专辑"
            />
        </Card>
        <Card style={{ margin: '20px 0' }} id="card4">
            <CardItem
            datasource={cardList4}
            title="频道页"
            />
        </Card>
        <Card style={{ margin: '20px 0' }} id="card5">
            <CardItem
            datasource={cardList5}
            title="文章"
            />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

Create.propTypes = {};

export default Create;
