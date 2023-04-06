import React, { memo } from 'react'
import { Typography, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'

interface IHelpTextProps {
  toolTip?: string | React.ReactNode;
  iconColor?: string
}

const HelpText = memo<React.PropsWithChildren<IHelpTextProps>>(
  function HelpText({
    toolTip,
    children,
    iconColor
  }) {
    return (
      <Tooltip title={toolTip || ''}>
        <Typography.Text>
          {children}
          <QuestionCircleOutlined style={{ marginLeft: 2, color: iconColor || undefined }} />
        </Typography.Text>
      </Tooltip>
    )
  }
)
export default HelpText
