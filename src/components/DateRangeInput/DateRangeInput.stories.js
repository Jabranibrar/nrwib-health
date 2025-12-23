import * as React from 'react'

import DateRangeInput from "./DateRangeInput";

export default {
  title: 'Components/DateRangeInput',
  component: DateRangeInput,
}

const Template = (args) => <DateRangeInput {...args} />

export const Default = Template.bind({})
Default.args = {}
