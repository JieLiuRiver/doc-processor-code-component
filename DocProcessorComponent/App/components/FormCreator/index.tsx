
import type { ForwardRefRenderFunction } from 'react';
import React from 'react'
import { Form } from 'antd'
import { useImperativeHandle, forwardRef, useState, useRef, useEffect } from 'react'
import type { ProFormProps, ProFormInstance } from '@ant-design/pro-form';
import ProForm from '@ant-design/pro-form'
import _ from 'lodash'
import FormCreatorContext from './FContext'
import type { FormCreatorConfig } from './type'
import Debug from './debug'
import FieldItem from './FieldItem'

import {
  validateInputCount,
  validateInputSpecialStr,
  validateRequired,
  validateInputMaxNum,
  validateUrl,
  validateInputMinNum,
  validateInt,
  validatePosInt,
  validateReg,
  validateMaxSelectedCount,
  validateDecimal
} from './helper'

interface IFormCreatorProps extends ProFormProps {
  config?: FormCreatorConfig;
  onMounted?: (formRef?: ProFormInstance<Record<string, any>>) => void;
  debug?: boolean;
  readonly?: boolean;
}

export type FormCreatorHandle = {
  /** 数据恢复，通常用于编辑时回选数据 */
  restore: (values: Record<string, any>) => void,
  // 刷新
  forceUpdate: () => void
}

const FormCreator: ForwardRefRenderFunction<FormCreatorHandle, IFormCreatorProps> = (
  props,
  ref,
) => {
  const [, forceUpdate] = useState(1)
  const { config = {}, onMounted, debug, readonly = false, ...proFormProps } = props
  const [form] = Form.useForm()
  const formRef = useRef<
    ProFormInstance<Record<keyof typeof config, any>>
  >();
  const initialValues = Object.keys(config).reduce((acc, fieldName) => {
    const data = config[fieldName]
    if (data?.defaultValue) {
      _.set(acc, fieldName, data.defaultValue)
    }
    return acc
  }, {} as Record<keyof typeof config, any>)
  const [formData, setFormData] = useState<Record<keyof typeof config, any>>(initialValues)

  useImperativeHandle(ref, () => ({
    restore: (values: Record<keyof typeof config, any>) => {
      form.setFieldsValue(values)
      setFormData(values)
    },
    forceUpdate: () => {
      forceUpdate((count) => count + 1)
    }
  }))

  useEffect(() => {
    if (formRef.current) {
      onMounted?.(formRef.current)
    }
  }, [])

  return (
    <>
      {debug && <Debug data={formData} />}
      <FormCreatorContext.Provider value={{
        form: formRef.current,
        setFormData,
        formData,
        readonly
      }}>
        <ProForm
          {...proFormProps}
          form={form}
          formRef={formRef}
          initialValues={initialValues}
          onValuesChange={(changedValues: any, allValues: any) => {
            setFormData(allValues)
            if (proFormProps.onValuesChange) {
              proFormProps.onValuesChange(changedValues, allValues)
            }
          }}
        >
          {
            Object.keys(config).map((fieldName) => {
              if (config[fieldName]) {
                if (!config[fieldName].fieldProps) {
                  config[fieldName].fieldProps = {}
                }
                config[fieldName].fieldProps!.disabled = readonly ? true : !!config[fieldName].fieldProps?.disabled
              }
              return <FieldItem key={fieldName} {...config[fieldName]} fieldName={fieldName} />
            })
          }
        </ProForm>
      </FormCreatorContext.Provider>
    </>
  )
}

export { EWidgetType } from './type'

export const FCRules = {
  Count: validateInputCount,
  SpecialStr: validateInputSpecialStr,
  Required: validateRequired,
  MaxNum: validateInputMaxNum,
  MinNum: validateInputMinNum,
  Url: validateUrl,
  Int: validateInt,
  PosInt: validatePosInt,
  Reg: validateReg,
  MaxSelectedCount: validateMaxSelectedCount,
  Decimal: validateDecimal,
}

export default React.memo(forwardRef(FormCreator));

export const FormCreatorNoReRender = React.memo(forwardRef(FormCreator), () => true)
