import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const MultiSelect = React.forwardRef(
  ({ options = [], value = [], onChange, placeholder = "Select options" }, ref) => {
    return (
      <Select
        ref={ref}
        mode="multiple"
        style={{ width: '100%' }}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        optionLabelProp="label"
      >
        {options.map((option) => (
          <Option key={option.value} value={option.value} label={option.label}>
            {option.label}
          </Option>
        ))}
      </Select>
    );
  }
);

export default MultiSelect;
