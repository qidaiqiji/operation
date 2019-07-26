import React, { Fragement } from 'react';
import { Card, Row, Col } from 'antd';
import Link from 'umi/link';
import icon from '@/../public/icons/icon.png';
import styles from './index.less';
const CardItem = ({ datasource, title }) => {
    return <div>
        <Row style={{ fontSize: 18, marginBottom: 20 }}>{title}</Row>
        <Row>
            {
                datasource.map((item, index) => {
                    return <Col span={5} style={{ marginRight: 20, marginBottom: 20 }} key={index}>
                        <Link to={item.linkUrl}>
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
                                <p className={styles.cardContent}>去创建</p>
                            </Card>
                        </Link>
                    </Col>
                })}
        </Row>
    </div>
}

export default CardItem;