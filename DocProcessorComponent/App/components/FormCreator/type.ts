import type {
  TableProps,
  InputProps,
  SelectProps,
  InputNumberProps,
  CheckboxProps,
  SwitchProps,
  UploadProps,
} from 'antd';
import React from 'react'
import type { TextAreaProps } from 'antd/lib/input/TextArea';
import type { TitleProps } from 'antd/lib/typography/Title';
import type { CheckboxGroupProps } from 'antd/lib/checkbox/Group';
// import type { FormItemProps } from 'antd/lib/form/FormItem'
import type { ProFormInstance } from '@ant-design/pro-form';

// 控件类型
export enum EWidgetType {
  // 普通输入框
  Input = 'Input',
  // 文本输入框
  TextArea = 'TextArea',
  // 数字输入框
  InputNumber = 'InputNumber',
  // 下拉选择
  Select = 'Select',
  // 单选框
  RadioGroup = 'RadioGroup',
  // 复选框
  Checkbox = 'Checkbox',
  // 复选框
  CheckboxGroup = 'CheckboxGroup',
  // 开关
  Switch = 'Switch',
  // 上传
  Upload = 'Upload',
  // 日期选择器
  DatePicker = 'DatePicker',
  // 日期范围选择器
  RangePicker = 'RangePicker',
  // 自定义控件
  CustomWidget = 'CustomWidget',
  // 搜索Select
  SearchSelect = 'SearchSelect',
  // 标题
  Title = 'Title',
  // 文案
  Text = 'Text',
  // 富文本
  RichText = 'RichText',
  // color
  ColorPicker = 'ColorPicker',
}

export interface SelectOption {
  label: string;
  value: string;
}

type FieldItem = Partial<
  InputProps &
    SelectProps<any> &
    InputNumberProps &
    TextAreaProps &
    CheckboxProps &
    CheckboxGroupProps &
    SwitchProps &
    UploadProps &
    TitleProps &
    Record<string, any>
>;

export type requestOptionsType = (data: {
  pageNumber?: number;
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
}) => Promise<
  | {
      total?: number;
      current?: number;
      list: Record<string, any>[];
    }
  | undefined
>;

export interface FormCreatorConfigItem extends Partial<any> {
  /** 默认值 */
  defaultValue?: any;
  /** 控件类型 */
  fieldType: EWidgetType;
  /** 异步获取options */
  requestOptions?: requestOptionsType;
  getOptionById?: (id: string) => Promise<any>;
  onSearchSelected?: (record: Record<string, any>) => void;
  /** 用于SearchSelect时，下拉面板表格配置 */
  tableProps?: TableProps<any>;
  /** 用于SearchSelect时，控制选哪个key， 默认id */
  selectKey?: string;
  selectName?: string;

  /** 自定义控件 */
  custom?: React.ComponentType<{
    formData?: any;
    readOnly?: boolean;
    field?: FormCreatorConfigItem;
  }>;

  /** 控制隐藏，返回true即隐藏 */
  whenHidden?: (formData: Record<string, any>) => boolean;
}

export type FormCreatorConfig = Record<string, any>; // FormCreatorConfigItem

export interface ContextStore<T = Record<string, any>> {
  form?: ProFormInstance<T>;
  setFormData: React.Dispatch<T>;
  formData: Record<string, any>;
  readonly?: boolean;
}
