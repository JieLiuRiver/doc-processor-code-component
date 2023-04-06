import React from 'react'
import { Table, Row, Button } from 'antd'
// import ReportEditor from '../ReportEditor'
import useStore from '../../store'

const ReportEditor = React.lazy(() => import(/* webpackChunkName: "report-editor" */'../ReportEditor'))

export default function ReportList() {
    const store = useStore(state => state)
    // const columns = [
    //     {
    //         title: 'Report Name',
    //         key: 'name',
    //         dataIndex: 'name'
    //     },
    //     {
    //         title: 'Status',
    //         key: 'status',
    //         dataIndex: 'status'
    //     },
    //     {
    //         title: 'Action',
    //         key: 'action',
    //         dataIndex: 'action'
    //     }
    // ]
    // const dataSource = [
    //     {
    //         id: 'id_1',
    //         name: 'Monthly Report',
    //         status: 'Draft',
    //     }
    // ]

    // const HeaderComponent = <Row justify="end" align="middle">
    //     <Button type="primary" onClick={() => store.uReportEditorOpen(true)}>New Report</Button>
    // </Row>

    // const FooterComponent = <Row justify="end" align="middle">
    //     Total Count: {dataSource.length}
    // </Row>

    return (
        <>
            {/* <Table
                style={{width: '100%'}}
                columns={columns}
                key="id"
                dataSource={dataSource}
                pagination={false}
                showHeader
                title={() => HeaderComponent}
                footer={() => FooterComponent}
                scroll={{
                    y: 400
                }}
            /> */}
            <React.Suspense fallback={<p>Loading...</p>}>
                <ReportEditor 
                    open={store.reportEditorOpen}
                    onClose={() => store.uReportEditorOpen(false)}
                />
            </React.Suspense>
        </>
    )
}
