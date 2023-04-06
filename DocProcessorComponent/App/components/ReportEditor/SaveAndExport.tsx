import React from 'react'
import { Typography, Row, Button, Space } from 'antd'
import useStore from '../../store';

const SaveAndExport = () => {
    const store = useStore(state => state)
    return <Row justify="center" align="middle"  style={{height: '100%'}}>
        <Space direction='vertical'>
            <Typography.Text>Click the below button to save this template and export docx file.</Typography.Text>
            <Row justify="center" align="middle">
                <Button type="primary" size="large" onClick={() => {
                    store.saveAndExport()
                }}>Save & Export</Button>
            </Row>
        </Space>
    </Row>;
}
 
export default SaveAndExport;