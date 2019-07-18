import * as _ from 'lodash'
const BG_IMAGE_LIST = [
  'https://img.alicdn.com/tfs/TB1FrncarY1gK0jSZTEXXXDQVXa-4288-2848.jpg',
  'https://img.alicdn.com/tfs/TB1Xfrcaq61gK0jSZFlXXXDKFXa-5158-3434.jpg',
  'https://img.alicdn.com/tfs/TB1QZnbaEz1gK0jSZLeXXb9kVXa-4836-3372.jpg',
  'https://img.alicdn.com/tfs/TB1H22carr1gK0jSZR0XXbP8XXa-3468-2967.jpg',
  'https://img.alicdn.com/tfs/TB1eqYbauH2gK0jSZJnXXaT1FXa-5760-3840.jpg',
]
export const getBGImageUrl = () => {
  const n = BG_IMAGE_LIST.length
  const url = BG_IMAGE_LIST[_.random(0, n - 1)]
  return `url(${url}?x-oss-process=image/resize,w_2048) no-repeat center center fixed`
}
