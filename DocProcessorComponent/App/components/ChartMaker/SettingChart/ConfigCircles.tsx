import React from 'react'
import { Table, Space } from 'antd'
import _ from 'lodash'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import ConfigTrigger from '../../CircleTrigger'
import useStore from '../../../store'


interface ConfigCirclesProps {
    field: string
    circlesKey: string
}

const ConfigCircles: React.FC<ConfigCirclesProps> = ({
    field,
    circlesKey
}) => {
    const store = useStore(state => state)
    return (
        <>
            <Table 
                size="small"
                bordered={false}
                key="targetData"
                dataSource={store.chartPlaceholders[field]?.[circlesKey] || []}
                pagination={false}
                title={() => (
                    <>
                      <ConfigTrigger field={field} circlesKey={circlesKey}>
                        <PlusCircleOutlined />
                      </ConfigTrigger>
                    </>
                )}
                columns={[
                    {
                        dataIndex: 'targetData',
                        key: 'targetData',
                        render: (_, record) => `${record.targetData}`
                    },
                    {
                        fixed: 'right',
                        key: 'fixed',
                        width: 80,
                        render: (x, record, index) => {
                            return <Space>
                                <ConfigTrigger value={record} field={field} circlesKey={circlesKey}>
                                    <EditOutlined />
                                </ConfigTrigger>
                                
                                <DeleteOutlined onClick={() => {
                                    store.chartPlaceholders[field][circlesKey].splice(index, 1)
                                    store.uChartPlaceholders(_.cloneDeep(store.chartPlaceholders))
                                }} />
                            </Space>
                        }
                    }
                ]}
            />
        </>
    );
}
 
export default ConfigCircles;