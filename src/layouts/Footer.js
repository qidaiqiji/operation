import React, { Fragment } from 'react';
import { Layout, Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';

const { Footer } = Layout;
const FooterView = () => (
  <Footer style={{ padding: 0 }}>
    <GlobalFooter
      links={[
        {
          key: '首页',
          title: '首页',
          href: 'http://oa.xiaomei360.com/dashboard/analysis',
          blankTarget: true,
        },
        {
          key: '小美诚品',
          title: '小美诚品',
          href: 'https://github.com/ant-design/ant-design-pro',
          blankTarget: true,
        },
      ]}
      copyright={
        <Fragment>
          Copyright <Icon type="copyright" /> 2016 深圳小美网络科技有限公司
        </Fragment>
      }
    />
  </Footer>
);
export default FooterView;
