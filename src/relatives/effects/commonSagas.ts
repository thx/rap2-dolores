import { IRSAA } from 'redux-api-middleware'
import { put, take } from 'redux-saga/effects'
import { AnyAction } from 'redux'
import { MSG_TYPE, showMessage } from 'actions/common'

export function createCommonDoActionSaga(
  fetchActionCreator: (params: object) => { [x: string]: IRSAA },
  fetchSuccessActionType: string,
  _fetchErrorActionType?: string,
  hideSuccessMsg?: boolean,
  msg?: string
) {
  return function*(action: AnyDoAction) {
    const { cb, params } = action.payload
    yield put(fetchActionCreator(params) as AnyAction)
    const retAction: TCommonDoAction = yield take(fetchSuccessActionType)
    if (retAction.payload.isOk) {
      if (!hideSuccessMsg || retAction.payload.errMsg) {
        yield put(showMessage(`${msg || '操作成功！'}${retAction.payload.errMsg || ''}`, MSG_TYPE.SUCCESS))
      }
    } else {
      yield put(showMessage(`操作失败: ${retAction.payload.errMsg}`, MSG_TYPE.ERROR))
    }
    cb && cb(retAction.payload.isOk, retAction.payload.isOk ? retAction.payload.data : null)
  }
}
