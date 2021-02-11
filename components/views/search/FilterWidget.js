import { Button, Input, Select } from 'antd';

function FilterWidget({
  text,
  states,
  tags,
  name,
  setName,
  state,
  setState,
  tagss,
  setTags,
  cb,
  searching,
}) {
  const { Option } = Select;
  return (
    <>
      <p className="text-lg font-semibold mb-3">Filters</p>
      <div className="w-full flex justify-between space-x-5 phone:space-x-0 smallTablet:flex-wrap">
        <div className="w-full mb-4">
          <Input
            className="w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={text}
          />
        </div>
        <div className="w-full mb-4">
          <Select
            name="state"
            className="w-full"
            placeholder="Select State"
            allowClear
            value={state}
            onChange={(value) => setState(value)}
            showSearch
            filterOption
          >
            {states?.map((ste, index) => (
              <Option key={ste.name + index} value={ste.name}>
                {ste.name}
              </Option>
            ))}
          </Select>
        </div>
        <div className="w-full mb-4">
          <Select
            name="tags"
            mode="multiple"
            className="w-full"
            placeholder="Select Tags"
            value={tagss}
            onChange={(value) => setTags(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {tags?.map((tag, index) => (
              <Option key={tag.name + index} value={tag._id}>
                {tag.name}
              </Option>
            ))}
          </Select>
        </div>
        <Button type="primary" onClick={() => cb()} disabled={searching}>
          {searching ? 'Applying...' : 'Apply'}
        </Button>
      </div>
    </>
  );
}

export default FilterWidget;
