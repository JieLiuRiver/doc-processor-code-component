import React, { useState } from "react";
import { Popover } from "antd";
import EditorForm from "./Form";

const AreaItemTrigger: React.FC<{
    areasKey: string;
    field: string
    onChange?: (val: any) => void
    value?: any,
    children: React.ReactNode
}> = (props) => {
    const { value, children, field, areasKey, onChange } = props;
    const [open, setOpen] = useState(false);

    if (open) {
        return <>{children}</>;
    }
    return (
        <Popover
            title={null}
            trigger="click"
            placement="left"
            destroyTooltipOnHide
            content={
                <>
                    <EditorForm
                        field={field}
                        defaultValue={value}
                        areasKey={areasKey}
                        onFinish={(data) => {
                            onChange?.(data)
                            setOpen(true);
                            setTimeout(() => setOpen(false), 16);
                        }}
                    />
                </>
            }
        >
            <span>{children}</span>
        </Popover>
    );
}
 
export default AreaItemTrigger;