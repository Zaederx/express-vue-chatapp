import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import Banner from '@/components/Banner.vue'

describe('Banner', () => {
    it('renders properly', () => {
      const wrapper = mount(Banner, 
        {props:{
            heading1:'TEST',
            heading2:'TEST'
        }})
      expect(wrapper.isVisible)
      expect(wrapper.text()).toContain('TEST')
    })
})