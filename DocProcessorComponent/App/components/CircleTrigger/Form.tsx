import React from 'react'
import _ from 'lodash'
import FormCreator, { EWidgetType } from '../FormCreator'
import useStore from '../../store'

interface EditorFormProps {
   field: string
   defaultValue?: any
   onFinish: (val: any) => void 
   circlesKey: string
}

const EditorForm: React.FC<EditorFormProps> = ({
    field,
    defaultValue,
    onFinish,
    circlesKey
}) => {
    const store = useStore(state => state)
    const chartPlaceholders = useStore(state => state.chartPlaceholders)
    const dataIndex = circlesKey.split('_')[1]
    const chartConfig = chartPlaceholders[field]
    const existDatas = (chartPlaceholders[field][circlesKey] || []).map((o: any) => o.targetData)
    const recordData = (chartConfig?.dataSource || [])[Number(dataIndex)]
    const targetDataOptions = Object.keys(recordData || {}).map((key, i) => ({
        label: recordData[key],
        value: `${i}_${recordData[key]}`,
        disabled: existDatas.includes(`${i}_${recordData[key]}`),
    }))
    
    const config = {
        "targetData": {
            label: "Target Data",
            fieldType: EWidgetType.Select,
            defaultValue: defaultValue?.targetData || "",
            extra: "Select a value on which the circle will be drawn",
            options: targetDataOptions,
            fieldProps: {
                disabled: !!defaultValue
            }
        },
        "symbolSize": {
            label: "Size",
            fieldType: EWidgetType.InputNumber,
            whenHidden: (formData: any) => _.isUndefined(formData?.targetData),
            extra: "the size of circle",
            defaultValue: defaultValue?.symbolSize || 50
        },
        "label.show": {
            label: "",
            fieldType: EWidgetType.Switch,
            fieldProps: {
                size: "small",
            },
            whenHidden: (formData: any) => _.isUndefined(formData?.targetData),
            defaultValue: _.isUndefined(defaultValue?.label?.show) ? true : defaultValue?.label?.show,
            extra: "show label or not"
        },
        "label.formatter": {
            label: "Label Text",
            fieldType: EWidgetType.Input,
            whenHidden: (formData: any) => _.isUndefined(formData?.targetData) || !formData?.label?.show,
            defaultValue: defaultValue?.label?.formatter || ""
        },
        "label.color": {
            label: "Label Color",
            fieldType: EWidgetType.ColorPicker,
            whenHidden: (formData: any) => _.isUndefined(formData?.targetData) || !formData?.label?.show,
            defaultValue: defaultValue?.label?.color || "black"
        },
        "label.fontSize": {
            label: "Label FontSize",
            fieldType: EWidgetType.InputNumber,
            whenHidden: (formData: any) => _.isUndefined(formData?.targetData) || !formData?.label?.show,
            defaultValue: defaultValue?.label?.fontSize || 12
        },
        "label.offsetX": {
            label: "Label Position",
            fieldType: EWidgetType.InputNumber,
            whenHidden: (formData: any) => _.isUndefined(formData?.targetData) || !formData?.label?.show,
            defaultValue: defaultValue?.label?.offsetX || 0,
            fieldProps: {
                addonBefore: "X"
            }
        },
        "label.offsetY": {
            label: "",
            fieldType: EWidgetType.InputNumber,
            whenHidden: (formData: any) => _.isUndefined(formData?.targetData) || !formData?.label?.show,
            defaultValue: defaultValue?.label?.offsetY|| 0,
            fieldProps: {
                addonBefore: "Y"
            }
        }
    }
    return (
        <div style={{maxHeight: 600, overflowY: 'scroll'}}>
            <FormCreator
                config={config}
                onFinish={async (formData) => {
                    // add
                    if (!defaultValue) {
                        if (_.isUndefined(chartPlaceholders[field][circlesKey])) {
                            chartPlaceholders[field][circlesKey] = []
                        } 
                        chartPlaceholders[field][circlesKey].push(formData)
                    } else {
                        const modifyIdx = chartPlaceholders[field][circlesKey].findIndex((o: any) => o.targetData === defaultValue.targetData)
                        chartPlaceholders[field][circlesKey].splice(modifyIdx, 1, formData)
                    }
                    store.uChartPlaceholders(_.cloneDeep(chartPlaceholders))
                    onFinish(formData)
                    return true
                }}
            />
        </div>
    );
}
 
export default EditorForm;