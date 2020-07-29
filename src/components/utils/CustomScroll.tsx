import React from 'react'
import 'react-custom-scroll/dist/customScroll.css'
const CustomScroll = require('react-custom-scroll/dist/reactCustomScroll').default

function getOS() {
  const userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod']
  let os = ''

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS'
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS'
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux'
  }

  return os
}

const os = getOS()

export default function Scroll(props: { children: React.ReactNode }) {
  return os === 'Windows' || os === 'Linux' ? (
    <CustomScroll>{props.children}</CustomScroll>
  ) : (
    <div style={{ overflowY: 'auto' }}>{props.children}</div>
  )
}
