import React, { useRef } from 'react'
import { Table, Space } from 'antd'
import _ from 'lodash'
import type { ProFormInstance } from '@ant-design/pro-form'
import { DeleteOutlined, EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import AreaItemTrigger from '../../AreaItemTrigger'
import FormCreator, { EWidgetType } from '../../FormCreator'
import useStore from '../../../store'

interface ConfigAreaProps {
    field: string
    areasKey: string
}

const ConfigArea: React.FC<ConfigAreaProps> = ({
    field,
    areasKey
}) => {
    const store = useStore(state => state)
    const info = store.chartPlaceholders?.[field]?.[areasKey] || {}
    const formRef = useRef<ProFormInstance<any>>()
    const withoutSubmitter = {
        submitter: { render: () => null }
    }

    const handleValuesChange = (x: any, allValuesChanges: any) => {
        store.chartPlaceholders[field][areasKey] = _.merge((store.chartPlaceholders[field][areasKey] || {}), {
            ...allValuesChanges
        })
        store.uChartPlaceholders(_.cloneDeep(store.chartPlaceholders))
        return true
    }

    const config = {
        "placeholder1": {
            label: "Label",
            fieldType: EWidgetType.Title,
        },
        "label.show": {
            label: "",
            fieldType: EWidgetType.Switch,
            defaultValue: _.isUndefined(info?.label?.show) ? true : info?.label?.show,
            extra: "show label or not",
            fieldProps: {
                size: "small",
            }
        },
        "label.text": {
            label: "Label Text",
            fieldType: EWidgetType.Input,
            whenHidden: (formData: any) =>  !formData?.label?.show,
            defaultValue: info?.label?.text || ""
        },
        "label.position": {
            label: "Label Position",
            fieldType: EWidgetType.Select,
            whenHidden: (formData: any) =>  !formData?.label?.show,
            defaultValue: info?.label?.position || "top",
            options: [
                "top", "left", " bottom", "right", "inside", "insideLeft", "insideRight",
                "insideTop", "insideBottom", "insideTopLeft", "insideBottomLeft", "insideTopRight", "insideBottomRight"
            ]
        },
        "label.distance": {
            label: "Label Distance",
            fieldType: EWidgetType.InputNumber,
            whenHidden: (formData: any) =>  !formData?.label?.show,
            defaultValue: info?.label?.distance || 5
        },
        "label.color": {
            label: "Label Color",
            fieldType: EWidgetType.ColorPicker,
            whenHidden: (formData: any) =>  !formData?.label?.show,
            defaultValue: info?.label?.color || "black"
        },
        "label.fontSize": {
            label: "Label FontSize",
            fieldType: EWidgetType.InputNumber,
            whenHidden: (formData: any) =>  !formData?.label?.show,
            defaultValue: info?.label?.fontSize || 12
        },
        "placeholder2": {
            label: "Area Style",
            fieldType: EWidgetType.Title,
        },
        "itemStyle.color": {
            label: "Area Color",
            fieldType: EWidgetType.ColorPicker,
            defaultValue: info?.label?.color || "rgba(128, 128, 128, 0.5)"
        },
    }
    return (
        <>
            <Table 
                size="small"
                bordered={false}
                rowKey={(record, index) => JSON.stringify(record) + index}
                dataSource={info?.data || []}
                pagination={false}
                title={() => (
                    <>
                      <AreaItemTrigger field={field} areasKey={areasKey} onChange={(data) => {
                        const { name, start, end } = data;
                        const item = [{
                            name,
                            xAxis: start.xAxis,
                            yAxis: start.yAxis,
                        }, {
                            xAxis: end.xAxis,
                            yAxis: end.yAxis,
                        }]
                        store.chartPlaceholders[field][areasKey] = _.merge((store.chartPlaceholders[field][areasKey] || {}), {
                            ...(formRef.current?.getFieldsValue() || {}),
                            data: [...info?.data || [], item]
                        })
                        store.uChartPlaceholders(_.cloneDeep(store.chartPlaceholders))
                      }}>
                        <PlusCircleOutlined />
                      </AreaItemTrigger>
                    </>
                )}
                columns={[
                    {render: (_, record, index) => `${index + 1}`},
                    {
                        fixed: 'right',
                        key: 'fixed',
                        width: 80,
                        render: (x, record, index) => {
                            return <Space>
                                <AreaItemTrigger value={record} field={field} areasKey={areasKey} onChange={(data) => {
                                    const { name, start, end } = data;
                                    const curItem = info.data[index]
                                    curItem[0].anme = name
                                    curItem[0].xAxis = start.xAxis
                                    curItem[0].yAxis = start.yAxis
                                    curItem[1].xAxis = end.xAxis
                                    curItem[1].yAxis = end.yAxis
                                    store.chartPlaceholders[field][areasKey] = _.merge((store.chartPlaceholders[field][areasKey] || {}), {
                                        ...(formRef.current?.getFieldsValue() || {}),
                                        data: _.cloneDeep(info.data)
                                    })
                                    store.uChartPlaceholders(_.cloneDeep(store.chartPlaceholders))
                                }}>
                                    <EditOutlined />
                                </AreaItemTrigger>
                                
                                <DeleteOutlined onClick={() => {
                                    store.chartPlaceholders[field][areasKey]?.data?.splice(index, 1)
                                    store.uChartPlaceholders(_.cloneDeep(store.chartPlaceholders))
                                }} />
                            </Space>
                        }
                    }
                ]}
            />
            <FormCreator
                {...withoutSubmitter}
                onMounted={(ref) => formRef.current = ref} 
                onValuesChange={_.debounce(handleValuesChange, 800)} 
                config={config}
            />
        </> 
    );
}
 
export default ConfigArea;