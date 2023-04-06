import React, { memo } from 'react'
import { Form, Typography } from 'antd'
import { pickWidget } from './helper'
import omit from 'lodash/omit'
import { EWidgetType } from './type';
import type { FormCreatorConfigItem } from './type'
import HelpText from '../HelpText';
import WidgetItem from './WidgetItem';
import { useStore } from './FContext';
// 
export default memo<FormCreatorConfigItem & { fieldName: string }>(function FieldItem(props) {
  const { formData, readonly } = useStore()
  const { fieldName, fieldType, defaultValue, custom, whenHidden, ...formItemProps } = props
  const WidgetComponent: any = pickWidget(fieldType)
  const isHide = typeof whenHidden === 'function' ? whenHidden(formData) : false
  const exclueSearchSelectkeysProps = omit(formItemProps, ['requestOptions', 'onSearchSelected', 'getOptionById', 'tableProps', 'selectKey', 'selectName'])

  const name = fieldName.split('.')

  if (WidgetComponent) {
    const props = isHide ? omit(formItemProps, ['rules']) : formItemProps
    return (
      <WidgetComponent
        {...omit(props, ['requestOptions', 'onSearchSelected', 'getOptionById', 'tableProps', 'selectKey', 'selectName'])}
        key={fieldName}
        name={name}
        hidden={isHide}
        {...fieldType === EWidgetType.ColorPicker ? {
          popup: true
        } : {}}
      />
    )
  } else {
    if (fieldType === EWidgetType.Title) {
      return <Typography.Title
        level={5}
        {...formItemProps.fieldProps}
        style={{
          borderBottom: '1px solid #ccc',
          padding: '10px 0',
          marginBottom: 20
        }}
      >
        {formItemProps.label || 'Title'} {formItemProps.tooltip && <HelpText toolTip={formItemProps.tooltip} />}
      </Typography.Title>
    }
    if (fieldType === EWidgetType.Text) {
      return <Form.Item {...omit(exclueSearchSelectkeysProps, ['fieldProps'])}>
        <Typography.Text
          {...formItemProps.fieldProps}
        >
          {defaultValue || 'description'}
        </Typography.Text>
      </Form.Item>
    }
    const Widget: any = custom ? custom : null
    return <Form.Item
      {...omit(exclueSearchSelectkeysProps, ['fieldProps'])}
      key={fieldName}
      name={name}
      hidden={isHide}
    >
      {
        [
          EWidgetType.Title,
          EWidgetType.RichText,
          EWidgetType.ColorPicker
        ].includes(fieldType)
          ? <WidgetItem {...formItemProps} fieldType={fieldType} />
          : Widget
            ? (
              <Widget
                {...exclueSearchSelectkeysProps}
                readOnly={readonly}
                formData={formData}
              />
            )
            : null
      }
    </Form.Item>
  }
})
