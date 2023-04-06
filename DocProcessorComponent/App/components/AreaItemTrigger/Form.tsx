import React from 'react'
import _ from 'lodash'
import FormCreator, { EWidgetType, FCRules } from '../FormCreator'
import useStore from '../../store'

interface EditorFormProps {
   field: string
   defaultValue?: any
   onFinish: (val: any) => void 
   areasKey: string
}

const EditorForm: React.FC<EditorFormProps> = ({
    defaultValue,
    onFinish,
    areasKey,
    field
}) => {
    const store = useStore(state => state)
    const chartPlaceholders = useStore(state => state.chartPlaceholders)
    const dataIndex = areasKey.split('_')[1]
    const chartConfig = chartPlaceholders[field]
    const xAxisOptions = Object.keys(chartConfig?.dataSource?.[Number(dataIndex)] || {}).map((o) => ({
        label: String(o),
        value: String(o),
    }))
    const [{name, xAxis: firstXAxis, yAxis: firstYAxis}, {xAxis: secondXAxis, yAxis: secondYAxis}] = defaultValue || [{}, {}]
    return (
        <div style={{maxHeight: 600, overflowY: 'scroll', width: 250}}>
            <FormCreator
                config={{
                    name: {
                        label: "name",
                        fieldType: EWidgetType.Input,
                        defaultValue: name || ''
                    },
                    placeholder1: {
                        label: "Start Point",
                        fieldType: EWidgetType.Title,
                    },
                    "start.xAxis": {
                        label: "xAxis",
                        fieldType: EWidgetType.Select,
                        defaultValue: firstXAxis || '',
                        rules: [
                            FCRules.Required()
                        ],
                        options: xAxisOptions
                    },
                    "start.yAxis": {
                        label: "yAxis",
                        fieldType: EWidgetType.InputNumber,
                        rules: [
                            FCRules.Required()
                        ],
                        defaultValue: firstYAxis|| '0'
                    },
                    placeholder2: {
                        label: "End Point",
                        fieldType: EWidgetType.Title
                    },
                    "end.xAxis": {
                        label: "xAxis",
                        fieldType: EWidgetType.Select,
                        rules: [
                            FCRules.Required()
                        ],
                        defaultValue: secondXAxis || '',
                        options: xAxisOptions
                    },
                    "end.yAxis": {
                        label: "yAxis",
                        fieldType: EWidgetType.InputNumber,
                        rules: [
                            FCRules.Required()
                        ],
                        defaultValue: secondYAxis || '0'
                    }
                }}
                onFinish={async (formData) => {
                    onFinish(formData)
                    return true
                }}
            />
        </div>
    );
}
 
export default EditorForm;