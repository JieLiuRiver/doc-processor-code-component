import React, { useState } from "react";
import { Popover } from "antd";
import EditorForm from "./Form";

const CircleTrigger: React.FC<{
    field: string
    onChange?: (val: any) => void
    value?: any,
    children: React.ReactNode
    circlesKey: string
}> = (props) => {
    const { value, children, field, circlesKey } = props;
    const [open, setOpen] = useState(false);

    if (open) {
        return <>{children}</>;
    }
    return (
        <Popover
            title={null}
            trigger="click"
            placement="left"
            content={
                <EditorForm
                    field={field}
                    defaultValue={value}
                    circlesKey={circlesKey}
                    onFinish={(value) => {
                        setOpen(true);
                        setTimeout(() => setOpen(false), 16);
                    }}
                />
            }
            destroyTooltipOnHide
        >
            <span>{children}</span>
        </Popover>
    );
}
 
export default CircleTrigger;