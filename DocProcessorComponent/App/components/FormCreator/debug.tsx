import React, { memo } from 'react'

export default memo<{
  data: Record<string, any>
}>(function Debug({
  data
}) {
  return  <>
    <details>
      <summary>Form Data</summary>
      <pre
        style={{
          color: '#333',
          position: 'relative',
          padding: 10,
          fontSize: 12,
          fontWeight: 700,
          backgroundColor: '#f8f8f8',
          borderRadius: 2,
          marginLeft: 10,
          width: 1000,
        }}
      >
        {JSON.stringify(data || {}, null, 2)}
      </pre>
    </details>
  </>
})
