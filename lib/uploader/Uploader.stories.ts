import type { Meta, StoryObj } from '@storybook/react';

import { default as Uploader, type Props } from './Uploader';

const meta = {
  title: 'Uploader',
  component: Uploader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // color: {
    //   options: ['primary', 'success', 'info', 'warning', 'error'],
    //   control: { type: 'select' },
    // },
    // size: {
    //   options: ['small', 'medium', 'large'],
    //   control: { type: 'select' },
    // },
  },
} satisfies Meta<typeof Uploader>;

export default meta;

type Story = StoryObj<typeof meta>;

const defaultProps: Props = {};

export const DefaultButton: Story = {
  args: {
    ...defaultProps,
    children: 'Click Me!',
  },
};

// export const DisabledButton: Story = {
//   args: {
//     ...defaultProps,
//     children: 'Click Me!',
//     disabled: true,
//   },
// };
