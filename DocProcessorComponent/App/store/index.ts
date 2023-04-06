import { UploadFile } from 'antd';
import Docxtemplater from 'docxtemplater';
import { create } from 'zustand';
import { saveAs } from 'file-saver'
import { blobToBase64 } from '../utils';
import _ from 'lodash'

type CommonUpdateType = (...args: any[]) => void;

export enum EStepValue {
  UploadReport,
  CustomizeChart,
  GenerateNumbers,
  PreviewReport,
  SaveAndExport
}

interface StoreType {
  docFile: File | null;
  uFile: CommonUpdateType

  docUploadFile: UploadFile | null;
  uDocUploadFile: CommonUpdateType

  docHtmlString: string;
  uDocHtmlString: CommonUpdateType

  triggerNotifyOutputChanged: ((metaInfo: {
    reportName?: string, 
    docHtml?: string, 
    docBase64?: string,
    isEditorClosed?: "Yes" | "No",
    powerbiRequest?: string
  }) => void) | null;
  uTriggerNotifyOutputChanged:CommonUpdateType
  
  reportEditorOpen: boolean
  uReportEditorOpen: CommonUpdateType

  currentStep: EStepValue
  uCurrentStep: CommonUpdateType

  textPlaceholders: Record<string,any>
  uTextPlaceholders: CommonUpdateType

  chartPlaceholders: Record<string,any>
  uChartPlaceholders: CommonUpdateType

  previewReportHtml: string
  uPreviewReportHtml: CommonUpdateType

  finalDocxtemplaterInstance: Docxtemplater | null
  uFinalDocxtemplaterInstance: CommonUpdateType

  chartsInstanceMap: Record<string, any>
  uChartsInstanceMap: CommonUpdateType

  powerbiResponse: string
  uPowerBIResponse: CommonUpdateType

  reset: CommonUpdateType

  saveAndExport: CommonUpdateType
}

const useStore = create<StoreType>((set, get) => ({
  docFile: null,
  uFile: (file: File) => set(() => ({ docFile: file })),

  docUploadFile: null,
  uDocUploadFile: (file: UploadFile) => set(() => ({ docUploadFile: file })),

  docHtmlString: '',
  uDocHtmlString: (docHtmlString: string) => set(() => ({ docHtmlString })),

  triggerNotifyOutputChanged: null,
  uTriggerNotifyOutputChanged: (triggerNotifyOutputChanged: () => void) => set(() => ({ triggerNotifyOutputChanged })),
  
  reportEditorOpen: false,
  uReportEditorOpen: (value: boolean) => set(() => ({ reportEditorOpen: value })),

  currentStep: 1,
  uCurrentStep:  (value: EStepValue) => set(() => ({ currentStep: value })),

  textPlaceholders: {},
  uTextPlaceholders:  (values: Record<string,any>) => set(() => ({ textPlaceholders: values })),
  
  chartPlaceholders: {
    // TODO: 333
    chart1: {}
  },
  uChartPlaceholders:  (values: Record<string,any>) => set(() => ({ chartPlaceholders: values })),

  previewReportHtml: '',
  uPreviewReportHtml:  (value: string) => set(() => ({ previewReportHtml: value })),

  finalDocxtemplaterInstance: null,
  uFinalDocxtemplaterInstance:  (value: Docxtemplater | null) => set(() => ({ finalDocxtemplaterInstance: value })),
  
  chartsInstanceMap: {},
  uChartsInstanceMap: (value) => set(() => ({chartsInstanceMap: _.merge(get().chartsInstanceMap, value)})),

  powerbiResponse: '',
  uPowerBIResponse: (value: string) => set(() => ({ powerbiResponse: value })),

  reset: () => set(() => ({
    docFile: null,
    docUploadFile: null,
    docHtmlString: '',
    reportEditorOpen: false,
    currentStep: 0,
    textPlaceholders: {},
    chartsInstanceMap: {},
    chartPlaceholders: {
      // TODO: 333
      chart1: {}
    },
    dataSource: [],
    previewReportHtml: '',
    finalDocxtemplaterInstance: null,
    powerbiResponse: ''
  })),

  saveAndExport: async () => {
    const store = get();
    if (!store.finalDocxtemplaterInstance) return 
    const blob = store.finalDocxtemplaterInstance.getZip().generate({
      type: 'blob',
      mimeType: '.docx',
    });
    saveAs(blob, store.docFile?.name || 'output.docx');
    store.triggerNotifyOutputChanged?.({
      reportName: store.docFile?.name || 'output.doxc', 
      docHtml: store.previewReportHtml, 
      docBase64: await blobToBase64(blob) || '',
      isEditorClosed: "Yes"
    })
    store.reset()
  }
}));

export default useStore;