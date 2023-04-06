import React, { memo } from 'react'

interface RichTextProps {
  value?: any;
  onChange?: (value: any) => void;
}

const RichText = memo<RichTextProps>(({
  value,
  onChange
}) => {
  return (
    <>
      developing...
    </>
  )
})

export default RichText
