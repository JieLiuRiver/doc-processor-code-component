import React, { useRef } from 'react'
import { DatePicker, Input, Form, FormInstance, Row, Empty } from 'antd';
import useStore from '../../store';

const { RangePicker } = DatePicker;

let timer: any

const GenerateNumbers = () => {
    const store = useStore(state => state)
    const formRef = useRef<FormInstance<any>>(null);

    return <Row justify="center" align="middle"  style={{height: '100%'}}>
        <Form ref={formRef} initialValues={Object.keys(store.textPlaceholders).reduce((calc, cur) => {
            calc[cur] = store.textPlaceholders[cur]?.value || ''
            return calc
        }, {} as Record<string, any>)}>
            <Form.Item name="dateRange" label="Date Range">
                <RangePicker />
            </Form.Item>
            {
                Object.keys(store.textPlaceholders)
                    .map((field) => {
                        const record = store.textPlaceholders[field]
                        return (
                            <Form.Item key={field} name={field} label={field} >
                                <Input onChange={(event) => {
                                    const value = event.target.value;
                                    if (timer) clearTimeout(timer)
                                    timer = setTimeout(() => {
                                        store.textPlaceholders[field].value = value
                                        store.uTextPlaceholders(store.textPlaceholders)
                                    }, 100)
                                }} placeholder="Enter value" />
                            </Form.Item>    
                        )
                    })
            }
            {!Object.keys(store.textPlaceholders).length && <Empty description={<>
                <p>No number tag was matched after parsing the doc file</p>
                <p>Please check if you use the following <strong> {'{num_tag}'} </strong> tag correctly</p>
            </>} />}
        </Form>
    </Row>;
}
 
export default GenerateNumbers;