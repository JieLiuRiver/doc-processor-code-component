import React, { useRef, useEffect } from 'react'
import type { ProFormInstance } from '@ant-design/pro-form'
import { ALIGN_TYPES, AXIS_TYPES, CHART_HEIGHT, CHART_WIDTH, EChartTypes, FONT_WEIGHTS, LINE_TYPES } from '../../../constants/index';
import { CaretRightOutlined } from '@ant-design/icons'
import _ from 'lodash'
import { Collapse, Row, Typography } from 'antd';
import FormCreator, { EWidgetType } from '../../FormCreator'
import ConfigCircles from './ConfigCircles'
import { upperFirst } from '../../../utils/index';
import useStore from '../../../store/index';
import ConfigArea from './ConfigArea';

const { Panel } = Collapse;

interface SettingChartProps {
    field: string
}

const SettingChart: React.FC<SettingChartProps> = ({
    field
}) => {
    const regularFormRef = useRef<ProFormInstance<any>>()
    const titleFormRef = useRef<ProFormInstance<any>>()
    const xAxisFormRef = useRef<ProFormInstance<any>>()
    const yAxisFormRef = useRef<ProFormInstance<any>>()
    const store = useStore(state => state)
    const chartPlaceholders = useStore(state => state.chartPlaceholders)
    const chartConfig = chartPlaceholders[field]

    useEffect(() => {
        const regularValues = regularFormRef.current?.getFieldsValue()  
        const titleValues = titleFormRef.current?.getFieldsValue()  
        const xAxisValues = xAxisFormRef.current?.getFieldsValue()  
        const yAxisValues = yAxisFormRef.current?.getFieldsValue()  
        store.chartPlaceholders[field] = _.merge(store.chartPlaceholders[field] || {}, {
            ...regularValues,
            ...titleValues,
            ...xAxisValues,
            ...yAxisValues,
        })
        store.uChartPlaceholders(store.chartPlaceholders)
    }, [])

    const withoutSubmitter = {
        submitter: { render: () => null }
    }
    const colorPickerFieldProps = {
        fieldProps: {
            inputProps: {
                size: 'small'
            }
        }
    }
    const handleValuesChange = (x: any, allValuesChanges: any) => {
        store.chartPlaceholders[field] = _.merge(
            store.chartPlaceholders[field],
            allValuesChanges
        )
        store.uChartPlaceholders(store.chartPlaceholders)
    }
    const panels: any[] = [
        {
            title: 'Regular',
            form: <FormCreator 
                {...withoutSubmitter}
                onValuesChange={_.debounce(handleValuesChange, 800)} 
                onMounted={(ref) => regularFormRef.current = ref} 
                config={{
                    chartType: {
                        label: "Chart Type",
                        fieldType: EWidgetType.Select,
                        defaultValue: EChartTypes[0].value,
                        options: EChartTypes
                    },
                    dateDateRange: {
                        label: "Data Date Range",
                        fieldType: EWidgetType.RangePicker,
                    },
                    "grid.left": {
                        label: "Grid Left",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: 100,
                        fieldProps: {
                            max: CHART_WIDTH
                        },
                    },
                    "grid.right": {
                        label: "Grid Right",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: 100,
                        fieldProps: {
                            max: CHART_WIDTH,
                        },
                    },
                    "grid.top": {
                        label: "Grid Top",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: 100,
                        fieldProps: {
                            max: CHART_HEIGHT
                        },
                    },
                    "grid.bottom": {
                        label: "Grid Bottom",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: 100,
                        fieldProps: {
                            max: CHART_HEIGHT
                        },
                    },
                }}  
            />
        },
        {
            title: 'Title',
            form: <FormCreator 
                {...withoutSubmitter}
                onMounted={(ref) => titleFormRef.current = ref} 
                onValuesChange={_.debounce(handleValuesChange, 800)} 
                config={{
                    "title.text": {
                        label: "Title",
                        fieldType: EWidgetType.Input,
                        defaultValue: "Title"
                    },
                    "title.enableText": {
                        label: "",
                        fieldType: EWidgetType.Switch,
                        defaultValue: true,
                        fieldProps: {
                            size: "small",
                            checkedChildren: "Open",
                            unCheckedChildren: "Close"
                        }
                    },
                    "title.subtext": {
                        label: "Sub Title",
                        fieldType: EWidgetType.Input,
                        defaultValue: "SubTitle"
                    },
                    "title.enableSubtext": {
                        label: "",
                        fieldType: EWidgetType.Switch,
                        defaultValue: true,
                        fieldProps: {
                            size: "small",
                            checkedChildren: "Open",
                            unCheckedChildren: "Close"
                        }
                    },
                    "title.left": {
                        label: "Title Position",
                        fieldType: EWidgetType.Select,
                        defaultValue: "center",
                        options: ALIGN_TYPES.map(o => ({label: o, value: o}))
                    },
                    "title.top": {
                        label: "Title Top",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: "0",
                        fieldProps: {
                            min: -Infinity
                        }
                },
                }} 
            />
        },
        {
            title: 'X-Axis',
            form: <FormCreator 
                onValuesChange={_.debounce(handleValuesChange, 800)} 
                {...withoutSubmitter} 
                onMounted={(ref) => xAxisFormRef.current = ref}
                config={{
                    "xAxis.type": {
                        label: "Type",
                        fieldType: EWidgetType.Select,
                        defaultValue: upperFirst(AXIS_TYPES[0]),
                        options: AXIS_TYPES.map(o => ({label: upperFirst(o), value: upperFirst(o)})),
                        extra: <>
                            <p><strong>Category</strong> axis is used for discrete data with a certain order, such as dates or categories. </p>
                            <p><strong>Value</strong> axis is used for continuous numerical data.</p>
                        </>
                    },
                    // TODO: use custom form
                    "xAxis.data": {
                        label: "Data",
                        fieldType: EWidgetType.Select,
                        defaultValue: "",
                        options: []
                    },
                    "xAxis.placholder1": {
                        label: "Axis Label Setting",
                        fieldType: EWidgetType.Title,
                    },
                    "xAxis.axisLabel.formatter": {
                        label: "Axis Label Formatter",
                        fieldType: EWidgetType.Input,
                        defaultValue: "{value}",
                        extra: "formatter is used to customize the format of axis labels, like: {value} ¥"
                    },
                    "xAxis.axisLabel.color": {
                        label: "Axis Label Color",
                        fieldType: EWidgetType.ColorPicker,
                        defaultValue: "black",
                        ...colorPickerFieldProps
                    },
                    "xAxis.axisLabel.fontSize": {
                        label: "Axis Label FontSize",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: 12,
                    },
                    "xAxis.axisLabel.margin": {
                        label: "Axis Label Margin",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: 8,
                        extra: "The distance between the scale label and the axis"
                    },
                    "xAxis.axisLabel.fntWeight": {
                        label: "Axis Label FontWeight",
                        fieldType: EWidgetType.Select,
                        defaultValue: "normal",
                        options: FONT_WEIGHTS.map(o => ({label: o, value: o}))
                    },
                    "xAxis.axisLabel.align": {
                        label: "Axis Label Align",
                        fieldType: EWidgetType.Select,
                        defaultValue: "center",
                        extra: "Horizontal alignment of axes scale labels",
                        options: ALIGN_TYPES.map(o => ({label: o, value: o}))
                    },
                    "xAxis.placholder2": {
                        label: "Axis Line Setting",
                        fieldType: EWidgetType.Title,
                    },
                    "xAxis.axisLine.show": {
                        label: "",
                        fieldType: EWidgetType.Switch,
                        fieldProps: {
                            size: "small",
                        },
                        defaultValue: false,
                        extra: "show line or not"
                    },
                    "xAxis.axisLine.onZero": {
                        label: "",
                        fieldType: EWidgetType.Switch,
                        fieldProps: {
                            size: "small",
                        },
                        defaultValue: false,
                        whenHidden: (formData: any) => !formData?.xAxis?.axisLine?.show,
                        extra: "Whether the coordinate axis is on the 0 scale of the other axis."
                    },
                    "xAxis.axisLine.lineStyle.color": {
                        label: "Line Color",
                        fieldType: EWidgetType.ColorPicker,
                        defaultValue: "black",
                        whenHidden: (formData: any) => !formData?.xAxis?.axisLine?.show,
                        extra: "The color of the coordinate axis",
                        ...colorPickerFieldProps
                    },
                    "xAxis.axisLine.lineStyle.width": {
                        label: "Line Width",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: 1,
                        whenHidden: (formData: any) => !formData?.xAxis?.axisLine?.show,
                        extra: "The width of the axis of the coordinate"
                    },
                    "xAxis.axisLine.lineStyle.type": {
                        label: "Line Type",
                        fieldType: EWidgetType.Select,
                        defaultValue: "solid",
                        whenHidden: (formData: any) => !formData?.xAxis?.axisLine?.show,
                        options: LINE_TYPES.map(o => ({label: o, value: o})),
                    },
                    "xAxis.axisLine.lineStyle.opacity": {
                        label: "Line Opacity",
                        fieldType: EWidgetType.InputNumber,
                        whenHidden: (formData: any) => !formData?.xAxis?.axisLine?.show,
                        defaultValue: 1,
                        fieldProps: {
                            min: 0,
                            max: 1
                        }
                    },
                    "xAxis.placholder3": {
                        label: "Axis Split Line Setting",
                        fieldType: EWidgetType.Title,
                    },
                    "xAxis.splitLine.show": {
                        label: "",
                        fieldType: EWidgetType.Switch,
                        fieldProps: {
                            size: "small",
                        },
                        defaultValue: false,
                        extra: "show splitLine or not"
                    },
                    "xAxis.splitLine.lineStyle.color": {
                        label: "Line Color",
                        fieldType: EWidgetType.ColorPicker,
                        whenHidden: (formData: any) => !formData.xAxis?.splitLine?.show,
                        defaultValue: "black",
                        ...colorPickerFieldProps
                    },
                    "xAxis.splitLine.lineStyle.width": {
                        label: "Line Width",
                        fieldType: EWidgetType.InputNumber,
                        whenHidden: (formData: any) => !formData.xAxis?.splitLine?.show,
                        defaultValue: 1,
                    },
                    "xAxis.splitLine.lineStyle.type": {
                        label: "Line Type",
                        whenHidden: (formData: any) => !formData.xAxis?.splitLine?.show,
                        fieldType: EWidgetType.Select,
                        defaultValue: "dashed",
                        options: LINE_TYPES.map(o => ({label: o, value: o})),
                    },
                    "xAxis.splitLine.lineStyle.opacity": {
                        label: "Line Opacity",
                        fieldType: EWidgetType.InputNumber,
                        whenHidden: (formData: any) => !formData.xAxis?.splitLine?.show,
                        defaultValue: 1,
                        fieldProps: {
                            min: 0,
                            max: 1
                        }
                    },
                    "xAxis.placholder4": {
                        label: "Axis Name Setting",
                        fieldType: EWidgetType.Title,
                    },
                    "xAxis.name": {
                        label: "Axis Name",
                        fieldType: EWidgetType.Input,
                        defaultValue: "",
                    },
                    "xAxis.nameLocation": {
                        label: "Axis Name Location",
                        fieldType: EWidgetType.Select,
                        defaultValue: "end",
                        options: ["start", "middle", "end"].map(o => ({label: o, value: o})),
                    },
                    "xAxis.nameGap": {
                        label: "Axis Name Gap",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: 10,
                        extra: "Sets the distance between the axis name and the axes of the axes",
                        // options: ["start", "middle", "end"].map(o => ({label: o, value: o})),
                    },
                    "xAxis.nameTextStyle.color": {
                        label: "Axis Name Color",
                        fieldType: EWidgetType.ColorPicker,
                        defaultValue: "black",
                        ...colorPickerFieldProps
                    },
                    "xAxis.nameTextStyle.fontSize": {
                        label: "Axis Name FontSize",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: 15,
                    },
                    "xAxis.nameTextStyle.fontWeight": {
                        label: "Axis Name FontWeight",
                        fieldType: EWidgetType.Select,
                        defaultValue: "normal",
                        options: FONT_WEIGHTS.map(o => ({label: o, value: o})),
                    },
                }} 
            />
        },
        {
            title: 'Y-Axis',
            form: <FormCreator 
                onValuesChange={_.debounce(handleValuesChange, 800)} 
                onMounted={(ref) => yAxisFormRef.current = ref}
                {...withoutSubmitter} 
                config={{
                    "yAxis.type": {
                        label: "Type",
                        fieldType: EWidgetType.Select,
                        defaultValue: upperFirst(AXIS_TYPES[1]),
                        options: AXIS_TYPES.map(o => ({label: upperFirst(o), value: upperFirst(o)})),
                        extra: <>
                            <p><strong>Category</strong> axis is used for discrete data with a certain order, such as dates or categories. </p>
                            <p><strong>Value</strong> axis is used for continuous numerical data.</p>
                        </>
                    },
                    // TODO: use custom form
                    "yAxis.data": {
                        label: "Data",
                        fieldType: EWidgetType.Select,
                        defaultValue: "",
                        options: []
                    },
                    "yAxis.placholder1": {
                        label: "Axis Label Setting",
                        fieldType: EWidgetType.Title,
                    },
                    "yAxis.axisLabel.formatter": {
                        label: "Axis Label Formatter",
                        fieldType: EWidgetType.Input,
                        defaultValue: "{value}",
                        extra: "formatter is used to customize the format of axis labels, like: {value} ¥"
                    },
                    "yAxis.axisLabel.color": {
                        label: "Axis Label Color",
                        fieldType: EWidgetType.ColorPicker,
                        defaultValue: "black",
                        ...colorPickerFieldProps
                    },
                    "yAxis.axisLabel.fontSize": {
                        label: "Axis Label FontSize",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: 12,
                    },
                    "yAxis.axisLabel.margin": {
                        label: "Axis Label Margin",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: 8,
                        extra: "The distance between the scale label and the axis"
                    },
                    "yAxis.axisLabel.fontWeight": {
                        label: "Axis Label FontWeight",
                        fieldType: EWidgetType.Select,
                        defaultValue: "normal",
                        options: FONT_WEIGHTS.map(o => ({label: o, value: o}))
                    },
                    "yAxis.axisLabel.align": {
                        label: "Axis Label Align",
                        fieldType: EWidgetType.Select,
                        defaultValue: "center",
                        extra: "Horizontal alignment of axes scale labels",
                        options: ALIGN_TYPES.map(o => ({label: o, value: o}))
                    },
                    "yAxis.placholder2": {
                        label: "Axis Line Setting",
                        fieldType: EWidgetType.Title,
                    },
                    "yAxis.axisLine.show": {
                        label: "",
                        fieldType: EWidgetType.Switch,
                        fieldProps: {
                            size: "small",
                        },
                        defaultValue: false,
                        extra: "show line or not"
                    },
                    "yAxis.axisLine.onZero": {
                        label: "",
                        fieldType: EWidgetType.Switch,
                        fieldProps: {
                            size: "small",
                        },
                        whenHidden: (formData: any) => !formData?.yAxis?.axisLine?.show,
                        defaultValue: false,
                        extra: "Whether the coordinate axis is on the 0 scale of the other axis."
                    },
                    "yAxis.axisLine.lineStyle.color": {
                        label: "Line Color",
                        fieldType: EWidgetType.ColorPicker,
                        whenHidden: (formData: any) => !formData?.yAxis?.axisLine?.show,
                        ...colorPickerFieldProps,
                        defaultValue: "black",
                        extra: "The color of the coordinate axis"
                    },
                    "yAxis.axisLine.lineStyle.width": {
                        label: "Line Width",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: 1,
                        whenHidden: (formData: any) => !formData?.yAxis?.axisLine?.show,
                        extra: "The width of the axis of the coordinate"
                    },
                    "yAxis.axisLine.lineStyle.type": {
                        label: "Line Type",
                        fieldType: EWidgetType.Select,
                        whenHidden: (formData: any) => !formData?.yAxis?.axisLine?.show,
                        defaultValue: "solid",
                        options: LINE_TYPES.map(o => ({label: o, value: o})),
                    },
                    "yAxis.axisLine.lineStyle.opacity": {
                        label: "Line Opacity",
                        fieldType: EWidgetType.InputNumber,
                        whenHidden: (formData: any) => !formData?.yAxis?.axisLine?.show,
                        defaultValue: 1,
                        fieldProps: {
                            min: 0,
                            max: 1
                        }
                    },
                    "yAxis.placholder3": {
                        label: "Axis Split Line Setting",
                        fieldType: EWidgetType.Title,
                    },
                    "yAxis.splitLine.show": {
                        label: "",
                        fieldType: EWidgetType.Switch,
                        fieldProps: {
                            size: "small",
                        },
                        defaultValue: true,
                        extra: "show splitLine or not"
                    },
                    "yAxis.splitLine.lineStyle.color": {
                        label: "Line Color",
                        fieldType: EWidgetType.ColorPicker,
                        whenHidden: (formData: any) => !formData?.yAxis?.splitLine?.show,
                        ...colorPickerFieldProps,
                        defaultValue: "black",
                    },
                    "yAxis.splitLine.lineStyle.width": {
                        label: "Line Width",
                        fieldType: EWidgetType.InputNumber,
                        whenHidden: (formData: any) => !formData?.yAxis?.splitLine?.show,
                        defaultValue: 1,
                    },
                    "yAxis.splitLine.lineStyle.type": {
                        label: "Line Type",
                        fieldType: EWidgetType.Select,
                        whenHidden: (formData: any) => !formData?.yAxis?.splitLine?.show,
                        defaultValue: "dashed",
                        options: LINE_TYPES.map(o => ({label: o, value: o})),
                    },
                    "yAxis.splitLine.lineStyle.opacity": {
                        label: "Line Opacity",
                        fieldType: EWidgetType.InputNumber,
                        whenHidden: (formData: any) => !formData?.yAxis?.splitLine?.show,
                        defaultValue: 1,
                        fieldProps: {
                            min: 0,
                            max: 1
                        }
                    },
                    "yAxis.placholder4": {
                        label: "Axis Name Setting",
                        fieldType: EWidgetType.Title,
                    },
                    "yAxis.name": {
                        label: "Axis Name",
                        fieldType: EWidgetType.Input,
                        defaultValue: "",
                    },
                    "yAxis.nameLocation": {
                        label: "Axis Name Location",
                        fieldType: EWidgetType.Select,
                        defaultValue: "end",
                        options: ["start", "middle", "end"].map(o => ({label: o, value: o})),
                    },
                    "yAxis.nameGap": {
                        label: "Axis Name Gap",
                        fieldType: EWidgetType.Select,
                        defaultValue: "",
                        extra: "Sets the distance between the axis name and the axes of the axes",
                        options: ["start", "middle", "end"].map(o => ({label: o, value: o})),
                    },
                    "yAxis.nameTextStyle.color": {
                        label: "Axis Name Color",
                        fieldType: EWidgetType.ColorPicker,
                        ...colorPickerFieldProps,
                        defaultValue: "black",
                    },
                    "yAxis.nameTextStyle.fontSize": {
                        label: "Axis Name FontSize",
                        fieldType: EWidgetType.InputNumber,
                        defaultValue: 15,
                    },
                    "yAxis.nameTextStyle.fontWeight": {
                        label: "Axis Name FontWeight",
                        fieldType: EWidgetType.Select,
                        defaultValue: "bold",
                        options: FONT_WEIGHTS.map(o => ({label: o, value: o})),
                    },
                }} 
            />
        }
    ].filter(Boolean);

    return (
        <>
            <Collapse
                accordion
                bordered={false}
                // defaultActiveKey={panels[0].title}
                expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
            >
                {panels.map((item => {
                    return (
                        <Panel forceRender header={<Typography.Text strong>{item.title}</Typography.Text>} key={item.title}>
                            {item.form}
                        </Panel>
                    )
                }))}
                {(chartConfig.dataSource || [])?.map((_: any, index: number) => <Panel
                    forceRender
                    key={`draw_circles_${index}`}
                    header={<Typography.Text strong>Add Circle for ({index + 1}th data)</Typography.Text>}
                >
                    <ConfigCircles field={field} circlesKey={`circles_${index}`} /> 
                </Panel>)}
                {(chartConfig.dataSource || [])?.map((_: any, index: number) => <Panel
                    forceRender
                    key={`draw_areas_${index}`}
                    header={<Typography.Text strong>Add Area for ({index + 1}th data)</Typography.Text>}
                >
                    <ConfigArea field={field} areasKey={`areas_${index}`} /> 
                </Panel>)}
            </Collapse>
        </>
    );
}
 
export default SettingChart;
