import React from 'react'
import { Input } from 'antd'

const InputC = ({
    label = '',
    name = '',
    type = 'text',
    className = '',
    inputClassName = '',
    isRequired = true,
    placeholder = '',
    value = '',
    onChange = () => {},
}) => {
  return (
    <div className={`${className}`}>
        <label for={name} className="block text-sm font-medium text-gray-800 pb-2">{label}</label>
        <Input type={type} id={name} className={`border border-gray-300 text-gray-900 input-main text-sm  block w-full p-1.5 ${inputClassName}`} placeholder={placeholder} required={isRequired} value={value} onChange={onChange} />
    </div>
  )
}

export default InputC