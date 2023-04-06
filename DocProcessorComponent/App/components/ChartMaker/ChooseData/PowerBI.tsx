import React from "react";
import { useEffect } from "react";
import dayjs from 'dayjs'
import useStore from "../../../store/";
import FormCreator, { EWidgetType, FCRules } from "../../FormCreator";
import { Button } from "antd";

interface PowerBIClientProps {
   onGetSheetData: (info: {
      sheetData: any[],
  }) => void
}

const FORMAT_DATE = 'YYYY,MM,DD'

const PowerBIClient: React.FC<PowerBIClientProps> = ({
   onGetSheetData
}) => {
   const store = useStore(state => state)

   useEffect(() => {
      if (!store.powerbiResponse) return
      const chartData: any[] = PowerBIHelper.getPriceDateChartData(store.powerbiResponse);
      store.uPowerBIResponse('')
      onGetSheetData({sheetData: chartData || []});
   }, [store.powerbiResponse])

   return <>
      <FormCreator 
         config={{
            dateRange: {
               label: 'Date Range',
               fieldType: EWidgetType.RangePicker,
               fieldProps: {
                  showTime: false,
                  format: FORMAT_DATE
               },
               rules: [FCRules.Required("please select date range")]
            }
         }} 
         submitter={{
            render: (props: any) => <Button onClick={props.submit} type="primary">Get Chart Data</Button>
         }}
         onFinish={async (formData) => {
            const [from, to] = formData.dateRange
            const request = PowerBIHelper.createRequestQuery("stock_price", dayjs(from).format(FORMAT_DATE), dayjs(to).format(FORMAT_DATE))
            store.triggerNotifyOutputChanged?.({
               powerbiRequest: request,
               reportName: '',
               docHtml: '',
               docBase64: '',
               isEditorClosed: "No"
            });
            return true 
         }}
      />
   </>

}

const PowerBIHelper = {
   //Required Date Format: "YYYY,MM,DD"
   createRequestQuery: (tableName: string, fromDate: string, toDate: string): string => {
      const query =
         `EVALUATE 
            SELECTCOLUMNS ( 
               FILTER ( 
                  ${tableName}, 
                  ${tableName}[Date] >= DATE(${fromDate}) && 
                  ${tableName}[Date] <= DATE(${toDate}) 
               ),
               "Date", Format(${tableName}[Date], "dd/MM/yyyy"),
               "Value", ${tableName}[Close Price]
            )
         `;
      console.log('query', query)
      //Remove all extra blank spaces
      return query.replace(/\s+/g, ' ');
   },

   /*
   sample response:
   {
      "results": [
         {
               "tables": [
                  {
                     "rows": [
                           {
                              "[Date]": "10/01/2022",
                              "[Value]": 57.28
                           }
                        ]
                  } 
               ]
            }
         ]
   }

   sample chartData: [{"2022-01-01": 51.22, "2022-01-02": 51.22, ...}]
   */
   getPriceDateChartData: (response: string): any[] => {

      if (!response) return []

      const chartData: any = {};
      let data = []
      try {
         data = JSON.parse(response);
         const rows = data.results[0].tables[0].rows;
         //convert rows to chartData
         rows.forEach((row: any) => {
            const date = row["[Date]"];
            const value = row["[Value]"];
            chartData[date] = value;
         });
      } catch (error) {
         console.log(error)
      }
      return Object.keys(chartData).length ? [chartData] : [];
   }
}

export default PowerBIClient;