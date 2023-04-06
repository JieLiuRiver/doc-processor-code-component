import React, { useState } from 'react'
import { Upload, UploadProps, Row, Space, Typography, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons'
import useStore, { EStepValue } from '../../store';
import { getPlacholdersFromDoc } from '../../utils';

const { Dragger } = Upload;

const UploadTemplate = () => {
    const [handling, setHandling] = useState(false);
    const store = useStore(state => state)

    const saveFile = async (file: File) => {
      setHandling(true)
      const { textEntries, imageEntries } = await getPlacholdersFromDoc(file)
      store.uTextPlaceholders(textEntries.reduce((calc, cur) => {
        calc[cur] = {}
        return calc
      }, {} as Record<string,any>))
      store.uChartPlaceholders(imageEntries.reduce((calc, cur) => {
        calc[cur] = {}
        return calc
      }, {} as Record<string,any>))
      store.uFile(file)
      store.uCurrentStep(EStepValue.CustomizeChart)
      setHandling(false)
    }

    const props: UploadProps = {
        accept: '.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        fileList: store.docUploadFile ? [store.docUploadFile] : undefined,
        multiple: false,
        onChange(info) {
          const { status } = info.file;
          if (status === 'done') {
            if (info.file) store.uDocUploadFile(info.file)
            if (info.file.originFileObj) saveFile(info.file.originFileObj)
          } 
          else if (status === 'error') {
            if (info.file) store.uDocUploadFile(info.file)
            if (info.file.originFileObj) saveFile(info.file.originFileObj)
          }
        },
        onDrop(e) {
          const hasLen = !!e.dataTransfer?.files?.length
          const file: File | null = hasLen ? e.dataTransfer?.files[0] : null
          if (file) saveFile(file)
        },
        onRemove() {
          return true
        },
        maxCount: 1,
        showUploadList: false,
        style: {
            width: 400,
            top: -50
        }
    };

    if (handling) return <Row justify="center" align="middle" style={{height: '100%'}}>Loading...</Row>

    return <Row justify="center" align="middle" style={{height: '100%'}}>
      {store.docFile ? (
        <Space>
          <Typography.Title level={3}>{store.docFile.name}</Typography.Title>
          <DeleteOutlined onClick={() => {
            store.uTextPlaceholders({})
            store.uChartPlaceholders({})
            store.uDocUploadFile(null)
            store.uFile(null)
          }} />
        </Space>
      ) : (
        <Dragger {...props}>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a single <strong>.doc/.docx</strong> file
            </p>
        </Dragger>
      )}
    </Row>;
}
 
export default UploadTemplate;