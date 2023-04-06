import React, { useState, useEffect, useRef } from 'react'
import { Card, Row } from 'antd'
import * as echarts from "echarts";
import _ from 'lodash'
import SettingChart from './SettingChart'
import useStore from '../../store/index';
import ChooseData from './ChooseData';

interface ChartMakerProps {
    field: string
}

const ChartMaker: React.FC<ChartMakerProps> = ({
    field
}) => {
    const [chartContainer, setChartContainer] = useState<HTMLDivElement | null>(null);
    const store = useStore(state => state)
    const echartInstance = useRef<echarts.ECharts | null>(null)
    const chartConfig = store.chartPlaceholders[field]

    const setEchartOptions = () => {
        const cloneChartConfig = _.cloneDeep(chartConfig)
        const { chartType, title, xAxis, yAxis, grid, dataSource = [] } = cloneChartConfig
        if (!xAxis || !yAxis || !chartType || !title) return
        if (!title?.enableText && title?.text) {
            title.text = "" 
        }
        delete title?.enableText
        if (!title?.enableSubtext && title?.subtext) {
            title.subtext = "" 
        }
        delete title?.enableSubtext
        xAxis.type = (xAxis.type as string).toLowerCase()
        yAxis.type = (yAxis.type as string).toLowerCase()

        xAxis.data = dataSource?.length ? Object.keys(dataSource[0]).map(String) : []

        const options: Record<string, any> = {
            title,
            xAxis,
            yAxis,
            series: [],
            grid
        }
        if (chartType && dataSource?.length) {
            options.series = dataSource?.map((item: any, index: number) => {
                const result: any = {
                    type: chartType,
                    data: Object.keys(item).map(key => item[key])
                }
                return result
            });
            if (chartType === 'line') {
                // circle
                for (let i = 0; i < dataSource.length; i++) {
                    const circles = cloneChartConfig[`circles_${i}`]
                    if (!circles) {
                        continue
                    }
                    const record = options.series[i]
                    circles.forEach((circle: any) => {
                        const targetIndex = circle.targetData.split("_")[0]
                        const targetData = record.data[Number(targetIndex)]
                        record.data.splice(targetIndex, 1, {
                            value: targetData,
                            symbol: "circle",
                            symbolSize: circle.symbolSize,
                            itemStyle: {
                                color: "transparent",
                                borderColor: "black",
                                borderWidth: 1
                            },
                            label: {
                                show: !!circle?.label?.show,
                                formatter: circle?.label?.formatter,
                                color: circle?.label?.color,
                                fontSize: circle?.label?.fontSize || 12,
                                offset: [circle?.label?.['offsetX'] || 0, circle?.label?.['offsetY'] || 0],
                            }
                        })
                    })
                }

                // area
                for (let i = 0; i < dataSource.length; i++) {
                    const areas = cloneChartConfig[`areas_${i}`]
                    if (!areas) {
                        continue
                    }
                    const record = options.series[i]
                    record.markArea = {
                        ..._.omit(areas, ['label.text'])
                    }
                    if (areas.label.text) {
                        _.set(record, 'markArea.label.formatter', () => areas.label.text)
                    }
                }
            }
        }

        echartInstance.current?.setOption(options)
    }

    useEffect(() => {
        if (chartContainer) {
            echartInstance.current = echarts.init(chartContainer)
            setEchartOptions()
            store.uChartsInstanceMap({
                [field]: echartInstance.current
            })
        }
    }, [chartContainer])

    useEffect(() => {
        Object.keys(chartConfig || {}).length && setEchartOptions()
    }, [JSON.stringify(chartConfig)])

    return (
        <>
            <Row justify="center" align="top">
                {
                    (!chartConfig?.dataSource || !chartConfig?.dataSource?.length) ? <>
                        <ChooseData field={field}  />
                    </> : <>
                        <Card style={{flex: 1}} bodyStyle={{padding: '50px 0'}}>
                            <Row justify="center" align="middle">
                                <div ref={setChartContainer} style={{width: 800, height: 500}} />
                            </Row>
                        </Card>
                        <Card style={{flex: '0 0 400px', marginLeft: 20}} bodyStyle={{maxHeight: 600, overflowY: 'scroll'}}>
                            <SettingChart field={field} />
                        </Card> 
                    </> 
                }
                
            </Row>
        </>   
    );
}
 
export default ChartMaker;