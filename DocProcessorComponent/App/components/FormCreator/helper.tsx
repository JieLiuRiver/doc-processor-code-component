import {
  ProFormText,
  ProFormDigit,
  ProFormTextArea,
  ProFormDatePicker,
  ProFormDateTimeRangePicker,
  ProFormSelect,
  ProFormCheckbox,
  ProFormRadio,
  ProFormSwitch,
  ProFormUploadButton
} from '@ant-design/pro-form'
import React from 'react'
import { EWidgetType } from './type'

export const pickWidget = (fieldType: EWidgetType): React.ComponentType<any> | null => {
  switch (fieldType) {
    case EWidgetType.Input:
      return ProFormText
    case EWidgetType.TextArea:
      return ProFormTextArea
    case EWidgetType.InputNumber:
      return ProFormDigit
    case EWidgetType.Select:
      return ProFormSelect
    case EWidgetType.RadioGroup:
      return ProFormRadio.Group
    case EWidgetType.CheckboxGroup:
      return ProFormCheckbox.Group
    case EWidgetType.Checkbox:
      return ProFormCheckbox
    case EWidgetType.Switch:
      return ProFormSwitch
    case EWidgetType.Upload:
      return ProFormUploadButton
    case EWidgetType.DatePicker:
      return ProFormDatePicker
    case EWidgetType.RangePicker:
      return ProFormDateTimeRangePicker
    default:
      return null
  }
}

// String extraction regularization
export const parseRegStr = (str: string) => {
  const begin = str.indexOf('/');
  const end = str.lastIndexOf('/');
  const flags = (str as any).match(/\/([igm]{0,3})$/i)[1];
  return new RegExp(str.substring(begin + 1, end), flags);
}

/**
 * Required
 * @returns
 */
export const validateRequired = (errMsg?: string) => ({
  required: true, message: errMsg || 'Please enter'
})

/**
 * Check the maximum input length
 * @param maxLength
 * @returns
 */
export const validateInputCount = (maxLength: number, message?: string) => ({
  validator: (_: any, value: string) => {
    return value?.length > maxLength ? Promise.reject(message || `Limit ${maxLength} characters`) : Promise.resolve()
  }
})

/**
 * Check the maximum number entered
 * @param maxLength
 * @returns
 */
export const validateInputMaxNum = (max: number, errMsg?: string) => ({
  validator: (_: any, value: any) => {
    return Number(value) > max ? Promise.reject(errMsg || `The maximum cannot exceed ${max}`) : Promise.resolve()
  }
})

/**
 * Check the input digit minimum
 * @param minLength
 * @returns
 */
export const validateInputMinNum = (min: number, errMsg?: string) => ({
  validator: (_: any, value: any) => {
    return Number(value) < min ? Promise.reject(errMsg || `The maximum cannot exceed ${min}`) : Promise.resolve()
  }
})

/**
 * int Validator
 * @param minLength
 * @returns
 */
export const validateInt = (errMsg?: string) => ({
  validator: (_: any, value: any) => {
    return !/^-?[1-9]+[0-9]*$/.test(value) ? Promise.reject(errMsg || `Please enter a positive integer`) : Promise.resolve()
  }
})

/**
 * Positive integer check
 * @param minLength
 * @returns
 */
export const validatePosInt = (errMsg?: string) => ({
  validator: (_: any, value: any) => {
    return !/^\+?[1-9][0-9]*$/.test(value) ? Promise.reject(errMsg || `Please enter a positive integer`) : Promise.resolve()
  }
})

/**
 * Decimal point check
 * @param maxDecimal
 * @returns
 */
export const validateDecimal = (maxDecimal: number, errMsg?: string) => ({
  validator: (_: any, value: any) => {
    const reg = parseRegStr(`/^-?\\d+(\\.\\d{1,${maxDecimal}})?$/`)
    return value && !reg.test(value) ? Promise.reject(errMsg || `Decimal reserved ${maxDecimal} place`) : Promise.resolve()
  }
})

/**
 * Check input special symbol
 * @returns
 */
export const validateInputSpecialStr = (errMsg?: string) => ({
  validator: (_: any, value: string) => {
    const reg = /[`~!@#$%^&*()+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im
    return reg.test(value) ? Promise.reject(errMsg || 'Please enter Chinese, English and numbers') : Promise.resolve()
  }
})

/**
 * Regular check
 * @returns
 */
export const validateReg = (reg: string, errMsg?: string) => ({
  validator: (_: any, value: string) => {
    const result = parseRegStr(reg)
    return !result.test(value) ? Promise.reject(errMsg || 'Regex check failed') : Promise.resolve()
  }
})

/**
 * Verify a valid URL
 * @returns
 */
export const validateUrl = (errMsg?: string) => ({
  validator: (_: any, value: string) => {
    const reg = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/
    return value && !reg.test(value) ? Promise.reject(errMsg || 'Please enter a valid url') : Promise.resolve()
  }
})

/**
 * Check box, drop-down multiple options, check can be selected at most
 * @returns
 */
export const validateMaxSelectedCount = (maxCount: number) => ({
  validator: (_: any, value: any[]) => {
    return value?.length > maxCount ? Promise.reject(`You can choose a maximum of ${maxCount}`) : Promise.resolve()
  }
})
