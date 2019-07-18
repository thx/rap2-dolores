export const FORM = {
  RADIO_LIST_DATA_VISIBILITY: [
    { 'label': '私有', 'value': false },
    { 'label': '公开', 'value': true },
  ],
}

export const YUP_MSG = {
  REQUIRED: '必填项',
  MAX_LENGTH: (n: number) => `长度不能超过${n}`,
  MIN_LENGTH: (n: number) => `长度不能少于${n}`,
  PHOTO_REQUIRED: '请选择图片',
}
