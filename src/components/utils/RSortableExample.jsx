import React from 'react'
import RSortable from './RSortable'
import { Random } from 'mockjs'

const RandomBackground = () => ({ background: Random.color() })

export default () => (
  <RSortable group='depth-0'>
    <ul>
      <li className='sortable p6' style={RandomBackground()}>
        <div className='flex-row'>
          <div className='flex-col flex-col-40'>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
          <div className='flex-col flex-col-30'>bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</div>
          <div className='flex-col flex-col-30'>ccccccccccccccccccccccccccccccccccccc</div>
        </div>
        <div className='flex-row'>
          <div className='flex-col flex-col-40'>aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa</div>
          <div className='flex-col flex-col-30'>bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb</div>
          <div className='flex-col flex-col-30'>ccccccccccccccccccccccccccccccccccccc</div>
        </div>
        <span>仓库1</span>
        <RSortable group='depth-1.1'>
          <ul>
            <li className='sortable p6' style={RandomBackground()}>
              <span>模块1.1</span>
              <RSortable group='depth-1.2'>
                <ul>
                  <li className='sortable p6' style={RandomBackground()}>接口1.1.1</li>
                  <li className='sortable p6' style={RandomBackground()}>接口1.1.2</li>
                  <li className='sortable p6' style={RandomBackground()}>接口1.1.3</li>
                </ul>
              </RSortable>
            </li>
            <li className='sortable p6' style={RandomBackground()}>模块1.2</li>
            <li className='sortable p6' style={RandomBackground()}>模块1.3</li>
          </ul>
        </RSortable>
      </li>
      <li className='sortable p6' style={RandomBackground()}>
        <span>仓库2</span>
        <RSortable group='depth-2.1'>
          <ul>
            <li className='sortable p6' style={RandomBackground()}>
              <span>模块2.1</span>
              <RSortable group='depth-2.2'>
                <ul>
                  <li className='sortable p6' style={RandomBackground()}>接口2.1.1</li>
                  <li className='sortable p6' style={RandomBackground()}>接口2.2.2</li>
                  <li className='sortable p6' style={RandomBackground()}>接口2.2.3</li>
                </ul>
              </RSortable>
            </li>
            <li className='sortable p6' style={RandomBackground()}>模块2.2</li>
            <li className='sortable p6' style={RandomBackground()}>模块2.3</li>
          </ul>
        </RSortable>
      </li>
      <li className='sortable p6' style={RandomBackground()}>团队</li>
      <li className='sortable p6' style={RandomBackground()}>用户</li>
    </ul>
  </RSortable>
)
