import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Login from '@/pages/Login.vue'
import SignUp from '@/pages/SignUp.vue'
import Home from '@/pages/Home.vue'
import App from '@/pages/App.vue'
import About from '@/pages/About.vue'


describe('Login', () => {
  it('renders properly', () => {
    const wrapper = mount(Login)
    expect(wrapper.isVisible)
  })
})

describe('SignUp', () => {
  it('renders properly', () => {
    const wrapper = mount(SignUp)
    expect(wrapper.isVisible)
  })
})


describe('Home', () => {
  it('renders properly', () => {
    const wrapper = mount(Home)
    expect(wrapper.isVisible)
  })
})

describe('About', () => {
  it('renders properly', () => {
    const wrapper = mount(About)
    expect(wrapper.isVisible)
  })
})


describe('App', () => {
  it('renders properly', () => {
    const wrapper = mount(App)
    expect(wrapper.isVisible)
  })
})