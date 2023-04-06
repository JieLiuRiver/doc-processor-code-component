import React, { useEffect } from 'react'
import Docxtemplater from 'docxtemplater';
import ImageModule from 'docxtemplater-image-module-free'
import PizZip from 'pizzip';
import { Row } from 'antd';
import useStore from '../../store';
import { readFileAsArrayBuffer } from '../../utils';
import { CHART_PIXEL_RATIO, CHART_WIDTH, MAMMOTH_STYLE_MAP } from '../..//constants';
import './PreviewReport.css'

const PreviewReport = () => {
    const store = useStore(state => state)

    const replaceAllPlacholders = async () => {
        const doc = new Docxtemplater(new PizZip(await readFileAsArrayBuffer(store.docFile!)), {
            paragraphLoop: true,
            linebreaks: true,
            modules: [new ImageModule({
                fileType: "docx",
                centered: true,
                getImage(dataURL: any) {
                    const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
                    if (!base64Regex.test(dataURL)) {
                        return false;
                    }
                    const stringBase64 = dataURL.replace(base64Regex, "");
                    let binaryString = window.atob(stringBase64);
                    const len = binaryString.length;
                    const bytes = new Uint8Array(len);
                    for (let i = 0; i < len; i++) {
                        const ascii = binaryString.charCodeAt(i);
                        bytes[i] = ascii;
                    }
                    return bytes.buffer;
                },
                getSize(img: ArrayBuffer, tagValue: string, tagName: string) {
                    return new Promise((resolve, reject) => {
                        const blob = new Blob([img], { type: 'image/jpeg' });
                        const image = new Image();
                        image.src = URL.createObjectURL(blob);
                        image.onload = () => {
                            resolve([image.width, image.height])
                        };
                        image.onerror = function (e: any) {
                            reject(e);
                        }
                    })
                },
            })],
        })
        const textFields = Object.keys(store.textPlaceholders).reduce((calc, cur) => {
            calc[cur] = store.textPlaceholders[cur]?.value || ''
            return calc
        }, {} as Record<string, any>)
        const imageFields = Object.keys(store.chartsInstanceMap).map(async (field) => {
            const chartInstance = store.chartsInstanceMap[field]
            const base64 = await chartInstance?.getDataURL({
                pixelRatio: CHART_PIXEL_RATIO,
                width: CHART_WIDTH / CHART_PIXEL_RATIO,
                height: "auto"
            })
            return {
                field,
                base64
            }
        })
        const imageFieldsResults = await Promise.all(imageFields)
        const finalImageFields = imageFieldsResults.reduce((calc, cur) => {
            calc[cur.field] = cur.base64
            return calc
        }, {} as Record<string, any>)

        const data = {
            ...textFields,
            ...finalImageFields
        }
        await doc.resolveData(data);
        try {
            doc.render()
            store.uFinalDocxtemplaterInstance(doc)
            const docOutput = doc.getZip().generate({
                type: 'uint8array',
                mimeType: '.docx',
            });
            const htmlResult = await window.mammoth.convertToHtml({ arrayBuffer: docOutput.buffer } as any, {
                styleMap: MAMMOTH_STYLE_MAP
            });
            store.uPreviewReportHtml(htmlResult.value)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!store.docFile) return
        replaceAllPlacholders()
    }, [])
    
    return <Row justify="center" align="top" style={{backgroundColor: '#eee'}}>
        <div className="review-container" style={{ }}>
            {store.previewReportHtml && <div 
                dangerouslySetInnerHTML={{
                    __html: store.previewReportHtml
                }}
            />}
        </div>
        <div style={{height: 50}} />
    </Row>;
}
 
export default PreviewReport;