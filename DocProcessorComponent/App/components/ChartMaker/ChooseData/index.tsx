import React from 'react'
import { Row, Tabs, Typography } from 'antd';
import _ from 'lodash'
import useStore from '../../../store/index';
import ExcelData from './ExcelData';
import PowerBIClient from './PowerBI';

interface ChooseDataProps {
    field: string
}

const ChooseData: React.FC<ChooseDataProps> = ({
    field
}) => {
    const store = useStore(state => state)

    const onGetSheetData = ({sheetData}: any) => {
        store.chartPlaceholders[field] = _.merge(
            store.chartPlaceholders[field],
            { dataSource: sheetData }
        )
        store.uChartPlaceholders(store.chartPlaceholders)
    }

    return <Row justify="center" align="middle">
        <Tabs
            defaultActiveKey="excel"
            items={[
               {
                    label: "PowerBi API",
                    key: "powerbi",
                    children: <PowerBIClient onGetSheetData={onGetSheetData} />
               },
               {
                    label: "Excel File",
                    key: "excel",
                    children: <ExcelData onGetSheetData={onGetSheetData} />
               }
            ]}
        />
    </Row>;
}
 
export default ChooseData;