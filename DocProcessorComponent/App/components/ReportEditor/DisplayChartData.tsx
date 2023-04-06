import React from 'react'
import { CaretRightOutlined } from '@ant-design/icons';
import { Collapse,Table, Row } from 'antd';
import useStore from '../../store';

const DisplayChartData = () => {
    const chartPlaceholders = useStore(state => state.chartPlaceholders)
    return <>
        <div style={{position: 'fixed', bottom: 0, left: 0, right: 0}}>
            <Collapse
                size="small"
                bordered={false}
                style={{backgroundColor: '#fff'}}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            >
                {Object.keys(chartPlaceholders).filter(field => !!chartPlaceholders[field]?.dataSource?.length).map((field) => {
                    const record = chartPlaceholders[field]
                    return (
                        <Collapse.Panel header={<Row justify="start" align="middle"><span>{field}'s Data</span></Row>} key={field}>
                            <Table
                                size="small"
                                pagination={false}
                                bordered={false}
                                rowKey={(item, idx) => JSON.stringify(item) + idx}
                                columns={Object.keys(record?.dataSource[0]).map(o => ({
                                    dataIndex: o,
                                    title: o
                                }))}
                                dataSource={record?.dataSource}
                            />
                        </Collapse.Panel>
                    )
                })}
            </Collapse>
        </div>
    </>;
}
 
export default DisplayChartData;