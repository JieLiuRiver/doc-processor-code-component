import React, { useEffect, useMemo } from 'react';
import { ConfigProvider } from 'antd'
import enUS from 'antd/lib/locale/en_US'
import {IInputs} from "../generated/ManifestTypes";
import 'antd/dist/reset.css';
import useStore from './store';
import useScript from './hooks/useScript';
import { MAMMOTH_URL } from './constants';
import { EStatus } from './hooks/useScript';

const ReportEditor = React.lazy(() => import(/* webpackChunkName: "report-editor" */'./components/ReportEditor'))

export type MetaInfo = {
    reportName: string, 
    docHtml: string, 
    docBase64: string,
    isEditorClosed: "Yes" | "No",
    powerbiRequest: string
}

const App = (props: {
    contextParameters: IInputs,
    triggerNotifyOutputChanged: (metaInfo: MetaInfo) => void
}) => {
    const isOpen = props.contextParameters.Open.raw
    const powerbiResponse = props.contextParameters.PowerBIResponse.raw
    const mammothStatus = useScript(MAMMOTH_URL)
    const store = useStore(state => state)
    console.log('============  store  =========', store)

    useEffect(() => {
        store.uTriggerNotifyOutputChanged(props.triggerNotifyOutputChanged)
    }, [])

    const ready = useMemo(() => 
        mammothStatus === EStatus.Ready,
    [mammothStatus])

    useEffect(() => {
        const open = isOpen === 'true'
        if (open) {
           store.reset() 
        }
        store.uReportEditorOpen(open)
    }, [isOpen])

    useEffect(() => {
        store.uPowerBIResponse(powerbiResponse)
    }, [powerbiResponse])
    
    return (
        <ConfigProvider locale={enUS}>
            {ready && <>
                <React.Suspense fallback={<p>Loading...</p>}>
                    <ReportEditor 
                        open={store.reportEditorOpen}
                        onClose={() => {
                            store.uReportEditorOpen(false)
                            store.triggerNotifyOutputChanged?.({
                                isEditorClosed: "Yes",
                                reportName: '', 
                                docHtml: '',
                                docBase64: ''
                            })
                        }}
                    />
                </React.Suspense>
            </>}
        </ConfigProvider>
    )
};

export default App;
