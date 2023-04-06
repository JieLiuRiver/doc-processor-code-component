import React, { memo } from 'react'
import { Input, Dropdown, Button, InputProps } from 'antd'
import Panel from "rc-color-picker/lib/Panel";
import "rc-color-picker/assets/index.css";

interface ColorPickerProps {
  inputProps?: InputProps
  value?: any;
  onChange?: (value: any) => void;
}

const ColorPicker = memo<ColorPickerProps>(({
  value,
  onChange,
  inputProps,
}) => {
    const [internalColor, setInternalColor] = React.useState(value);

    const handleChange = (color: any) => {
        setInternalColor(color.color);
        if (onChange) {
          onChange(color.color);
        }
    };
    const overlay = (
        <div>
            <Panel
                color={internalColor}
                enableAlpha={false}
                onChange={handleChange}
            />
        </div>
  );
  return (
    <>
      <Input
        {...(inputProps || {})}
        value={internalColor || ""}
        onChange={(e) => setInternalColor(e.target.value)}
        suffix={
          <Dropdown trigger={["click"]} dropdownRender={() => overlay}>
            <Button shape='circle' size="small" style={{ background: internalColor }}> </Button>
          </Dropdown>
        }
      />
    </>
  )
})

export default ColorPicker
