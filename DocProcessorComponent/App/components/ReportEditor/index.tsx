import React, { useMemo } from 'react'
import { Drawer, DrawerProps, Steps, Card, Row, Button, Space, Typography } from 'antd'
import { GENERATE_REPORT_STEPS } from '../../constants';
import useStore, { EStepValue } from '../../store'
import UploadTemplate from './UploadTemplate';
import CustomizeChart from './CustomizeChart';
import GenerateNumbers from './GenerateNumbers';
import PreviewReport from './PreviewReport';
import SaveAndExport from './SaveAndExport';

interface ReportEditorProps extends DrawerProps {

}

const ReportEditor: React.FC<ReportEditorProps> = ({
    ...drawerProps
}) => {
    const store = useStore(state => state)

    const NextButton = useMemo(() => {
        const renderNextButton = (
            <Button type="primary" onClick={() => {
                store.uCurrentStep(store.currentStep + 1)
            }}>Next</Button>
        )
        if (store.currentStep === EStepValue.UploadReport && !!store.docFile) return renderNextButton
        if (![EStepValue.SaveAndExport, EStepValue.UploadReport].includes(store.currentStep)) return renderNextButton
       return null
    }, [store.currentStep, store.docFile])

    const centerStyle = {
        display: 'flex', justifyContent: 'center', alignItems: 'center'
    }

    return (
        <>
            <Drawer 
                {...drawerProps} 
                width="100%"
                height="100%"
                placement="top"
                title={<Row justify='space-between' align="middle">
                    <div />
                    <Typography.Title style={{marginBottom: 0}} level={4}>{store.docFile?.name || "New Report"}</Typography.Title>
                    <Row justify="center" align="middle">
                        <Space>
                            {store.currentStep !== EStepValue.UploadReport && <Button onClick={() => {
                                store.uCurrentStep(store.currentStep - 1)
                            }}>Prev</Button>}
                            {NextButton}
                            {store.currentStep === EStepValue.SaveAndExport && <Button type="primary" onClick={() => {
                                store.saveAndExport()
                            }}>Save & Export</Button>}
                        </Space>
                    </Row>
                </Row>}
            >
                <Steps
                    type="navigation"
                    current={store.currentStep}
                    items={GENERATE_REPORT_STEPS.map(o => ({title: o.name}))}
                    // onChange={(step) => {
                    //     store.uCurrentStep(step)
                    // }}
                />
                <Card 
                    bodyStyle={{width: '100%', height: '100%', padding: store.currentStep === EStepValue.PreviewReport ? 0 : 20}} 
                    style={{marginTop: 20, overflowY: 'scroll', height: `calc(100% - 40px)`, ...centerStyle }}
                >
                    {store.currentStep === EStepValue.UploadReport && <UploadTemplate />}
                    {store.currentStep === EStepValue.CustomizeChart && <CustomizeChart />}
                    {store.currentStep === EStepValue.GenerateNumbers && <GenerateNumbers />}
                    {store.currentStep === EStepValue.PreviewReport && <PreviewReport />}
                    {store.currentStep === EStepValue.SaveAndExport && <SaveAndExport />}
                </Card>
            </Drawer>
        </>
    );
}
 
export default ReportEditor;