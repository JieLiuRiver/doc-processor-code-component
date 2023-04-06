import React, { memo } from 'react';
import omit from 'lodash/omit'
import type { FormCreatorConfigItem } from './type';
import { EWidgetType } from './type';
import SearchSelect from './widgets/SearchSelect/index';
import RichText from './widgets/RichText'
import ColorPicker from './widgets/ColorPicker'

export default memo<FormCreatorConfigItem>(function WidgetItem(props) {
  const { fieldType, ...formItemProps } = props;
  switch (fieldType) {
    case EWidgetType.SearchSelect:
      return (
        <SearchSelect {...formItemProps.fieldProps} {...omit(formItemProps, ['fieldProps'])} />
      );
    case EWidgetType.RichText:
      return (
        <RichText {...formItemProps.fieldProps} {...omit(formItemProps, ['fieldProps'])} />
      );
    case EWidgetType.ColorPicker:
      return (
        <ColorPicker {...formItemProps.fieldProps} {...omit(formItemProps, ['fieldProps'])} />
      );
    default:
      return null;
  }
});
