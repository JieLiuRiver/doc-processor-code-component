import React from 'react'
import { Collapse, Space, Empty, Typography } from 'antd';
import useStore from '../../store';
import ChartMaker from '../ChartMaker/index';
import DisplayChartData from './DisplayChartData'

const CustomizeChart = () => {
    const store = useStore(state => state)
    return <>
        {<>
            <Space direction="vertical" style={{width: '100%'}}>
                {Object.keys(store.chartPlaceholders).map((field, index) => {
                    return (
                        <Collapse bordered={false} key={field} defaultActiveKey={index == 0 ? field : undefined}>
                            <Collapse.Panel forceRender key={field} header={<Typography.Text strong>{field}</Typography.Text>}>
                                <ChartMaker field={field} />
                            </Collapse.Panel>
                        </Collapse>
                    )
                })}
                {!Object.keys(store.chartPlaceholders).length && <Empty description={<>
                    <p>No chart tag was matched after parsing the doc file.</p>
                    <p>Please check if you use the following <strong> {'{%chart_tag}'} </strong>  tag correctly.</p>
                </>} />}
            </Space>
            
            <DisplayChartData />
        </>}
        <div style={{height: 20}} />
    </>;    
}
 
export default CustomizeChart;