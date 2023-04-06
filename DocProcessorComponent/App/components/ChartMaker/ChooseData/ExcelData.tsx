import { UploadProps, Upload, Image, Space } from 'antd';
import React, { useState } from 'react'
import { read, utils } from 'xlsx';

const { Dragger } = Upload;

interface ExcelDataProps {
    onGetSheetData: (info: {
        sheetData: any[],
    }) => void
}

const ExcelData: React.FC<ExcelDataProps> = ({
    onGetSheetData
}) => {
    const [loading, setLoading] = useState(false)
    const handleFile = async (file: File) => {
        setLoading(true)
        const reader = new FileReader();
        reader.onload = (event: any) => {
            const data = new Uint8Array(event?.target?.result);
            const workbook = read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheetData = utils.sheet_to_json(workbook.Sheets[sheetName])
            onGetSheetData?.({
                sheetData,
            })
            setLoading(false)
        };
        reader.readAsArrayBuffer(file);
    }

    const props: UploadProps = {
        accept: '.xlsx',
        multiple: false,
        onChange(info) {
          const { status } = info.file;
          if (status === 'error' || status === 'done') {
            if (info.file.originFileObj) handleFile(info.file.originFileObj)
          }
        },
        onDrop(e) {
          const hasLen = !!e.dataTransfer?.files?.length
          const file: File | null = hasLen ? e.dataTransfer?.files[0] : null
          if (file) handleFile(file)
        },
        maxCount: 1,
        showUploadList: false,
        style: {
            width: 400,
        }
    };

    if (loading) return <p>Loading...</p>

    return <>
        <Dragger {...props}>
            <p className="ant-upload-text">Click or drag excel file to this area to upload</p>
            <p className="ant-upload-hint">
                Support for a single <strong>.xlsx</strong> file
            </p>
        </Dragger>
        <div style={{height: 20}} />
        <Space>
            <strong>Example:</strong>
            <Image width={550} src="data:image/png;base64,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" />
        </Space>
    </>;
}
 
export default ExcelData;