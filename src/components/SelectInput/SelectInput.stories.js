import * as React from 'react'

import SelectInput from './SelectInput'

export default {
  title: 'Components/SelectInput',
  component: SelectInput,
}

const Template = (args) => <SelectInput {...args} />

export const Default = Template.bind({})
Default.args = {}
