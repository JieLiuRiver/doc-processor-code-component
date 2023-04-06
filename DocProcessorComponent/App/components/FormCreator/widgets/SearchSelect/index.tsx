import React, { memo, useState, useEffect, useCallback } from 'react'
import { Table, Popover, Select, Input, Tag } from 'antd'
import type { requestOptionsType, FormCreatorConfigItem } from '../../type'
import omit from 'lodash/omit'
import { useStore } from '../../FContext';

import './index.css'

interface SearchSelectProps extends Pick<FormCreatorConfigItem, 'requestOptions' | 'onSearchSelected' | 'getOptionById' | 'tableProps' | 'selectKey' | 'selectName'> {
  value?: any;
  onChange?: (value: any) => void;
}

let delayTimer: any
let idCount = 0
const DELAY_TIME = 500
const optionMap = new Map<string, string>()
export default memo<SearchSelectProps>(function SearchSelect(props) {
  const {
    value,
    onChange,
    requestOptions,
    onSearchSelected,
    getOptionById,
    tableProps,
    selectKey = 'id',
    selectName = selectKey,
    ...reset
  } = props
  const [options, setOptions] = useState<Record<string, any>[]>([])
  const [loading, setLoding] = useState(false)
  const [visible, setVisible] = useState(false)
  const [curKeyword, setCurKeyword] = useState('')
  const [inputWidth, setInputWidth] = useState(0)
  const [curRecord, setCurRecord] = useState<any>({})
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const { readonly } = useStore()
  // const forceUpdate = useState(0)[1];
  const id = `searchSelectInput${idCount++}`

  const loadData = useCallback(async (data: Parameters<requestOptionsType>[0]) => {
    try {
      setLoding(true)
      const res = await requestOptions?.(Object.assign({
        pageNo: 1,
      }, data))
      setLoding(false)
      if (res) {
        setOptions(Array.isArray(res.list) ? res.list : [])
        setTotal(res.total || 0)
        setCurrent(Number(res.current) || 1)
      }
    } catch (error) {
      setLoding(false)
      console.log(error)
    }
  }, [requestOptions])

  useEffect(() => {
    setInputWidth(document.querySelector(`#${id}`)?.clientWidth || 0)
  }, [id])

  useEffect(() => {
    (async () => {
      if (value) {
        if (typeof getOptionById === 'function') {
          const data = await getOptionById(value)
          if (data) {
            optionMap.set(value, data[selectName] || '')
            setCurRecord(data)
          }
        } else {
          const res = await requestOptions?.({
            pageNumber: 1,
            pageSize: 1,
            [selectKey]: value
          })
          if (res && res.list && res.list.length) {
            optionMap.set(value, res.list[0][selectName])
            setCurRecord(res.list[0])
            setCurRecord(res.list[0])
          }
        }
      }
    })()
  }, [value])

  return (
    <Popover
      trigger="click"
      placement="bottom"
      overlayStyle={{ width: inputWidth + 22 }}
      title={null}
      visible={visible}
      overlayInnerStyle={{ padding: 0 }}
      onVisibleChange={(val: boolean) => {
        setVisible(val)
        if (val && !readonly) {
          loadData({
            keyword: curKeyword
          })
        }
      }}
      content={() => readonly ? null : (
        <div style={{ width: '100%' }}>
          <Input
            placeholder="输入关键字"
            allowClear
            onChange={(event) => {
              const keyword = event.target.value
              if (delayTimer) {
                clearTimeout(delayTimer)
              }
              delayTimer = setTimeout(async () => {
                setCurKeyword(keyword)
                loadData({ keyword })
              }, DELAY_TIME)
            }}
          />
          <Table
            {...(tableProps || {})}
            loading={loading}
            className="ss-table"
            size="small"
            rowClassName="custom-row"
            pagination={{
              current,
              pageSize: 5,
              total,
              showQuickJumper: false,
              showSizeChanger: false,
              showTotal: (nums) => `共有 ${nums} 条`,
              onChange: (page, pageSize) => {
                loadData({
                  pageNo: page,
                  pageSize,
                  keyword: curKeyword
                })
              }
            }}
            dataSource={options}
            onRow={(record) => {
              return {
                onClick: () => {
                  optionMap.set(record[selectKey], record[selectName])
                  setCurRecord(record)
                  onChange?.(record[selectKey])
                  setVisible(false)
                  onSearchSelected?.(record)
                }
              }
            }}
          />
        </div>
      )}
    >
      <Select
        {...omit(reset as any, ['readonly'])}
        value={optionMap.get(value) || ''}
        id={id}
        dropdownRender={() => <div />}
        dropdownStyle={{ padding: 0 }}
      />
    </Popover>
  )
})
