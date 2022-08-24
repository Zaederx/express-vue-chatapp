import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Home from '../../../pages/Home.vue'

describe('Home', () => {
  it('renders properly', () => {
    const wrapper = mount(Home)
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
