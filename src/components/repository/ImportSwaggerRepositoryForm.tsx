import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { FormControlLabel, RadioGroup, Radio } from '@material-ui/core'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import {
  Button,
  Theme,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogContent,
  DialogTitle,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { SlideUp } from 'components/common/Transition'
import { ImportSwagger } from '../../actions/types'
import RepositoryService from '../../relatives/services/Repository'
import './ImportSwaggerRepositoryForm.css'
import { importSwaggerRepository } from '../../actions/repository'

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {},
  form: {
    minWidth: 500,
    minHeight: 160,
  },
  alert: {
    minWidth: 500,
    minHeight: 7,
  },
  formItem: {
    marginBottom: spacing(1),
  },
  ctl: {
    marginTop: spacing(3),
  },
  section: {
    display: 'inline',
  },
}))

const schema = Yup.object().shape<Partial<ImportSwagger>>({
  docUrl: Yup.string(),
  swagger: Yup.string(),
})

const FORM_STATE_INIT: ImportSwagger = {
  version: 1,
  docUrl: '',
  orgId: 0,
  mode: 'manual',
  swagger: '',
  repositoryId: 0,
}

interface Props {
  open: boolean
  onClose: (isOk?: boolean) => void
  orgId?: number
  repositoryId?: number
  mode: string
  modId?: number
}

export enum IMPORT_TYPE {
  /** 从Swagger 2.0 URL 或 JSON 文件导入 */
  SWAGGER_2_0 = 1,
  /** 从RAP2改动时系统生成的备份JSON文件导入 */
  RAP2_ITF_BACKUP = 2,
}

function ImportSwaggerRepositoryForm(props: Props) {
  const { open, onClose, orgId, mode, repositoryId, modId } = props
  const classes = useStyles()
  const dispatch = useDispatch()
  const [alertOpen, setAlertOpen] = useState({ op: false, msg: '' })

  return (
    <section className={classes.section}>
      <Dialog
        open={open}
        onClose={(_event, reason) => reason !== 'backdropClick' && onClose()}
        TransitionComponent={SlideUp}
      >
        <DialogTitle>导入仓库</DialogTitle>
        <DialogContent dividers={true}>
          <div className={classes.form}>
            <Formik
              initialValues={{
                ...FORM_STATE_INIT,
              }}
              validationSchema={schema}
              onSubmit={async (values, actions) => {
                let swagger = values.swagger
                if (!swagger) {
                  try {
                    swagger = await RepositoryService.getSwaggerRepository({
                      docUrl: values.docUrl,
                    })
                  } catch (error) {
                    setAlertOpen({
                      op: true,
                      msg:
                        '无法获取 Swagger 数据,请检查您的 Swagger 服务是否允许 CORS，或者使用直接粘贴 JSON 导入',
                    })
                    actions.setSubmitting(false)
                    return
                  }
                } else {
                  try {
                    swagger = JSON.parse(swagger)
                  } catch (error) {
                    setAlertOpen({
                      op: true,
                      msg: '解析失败，不是有效的JSON，请检查 JSON 格式',
                    })
                    actions.setSubmitting(false)
                    return
                  }
                }
                const importSwagger: ImportSwagger = {
                  ...values,
                  mode,
                  swagger,
                  orgId,
                  repositoryId,
                  modId,
                }

                dispatch(
                  importSwaggerRepository(importSwagger, (res: any) => {
                    if (res.isOk === 'success') {
                      setAlertOpen({ op: true, msg: '导入成功' })
                      window.location.reload()
                    } else {
                      setAlertOpen({ op: true, msg: `导入失败，请检查文件格式，详细错误：${res.message}.` })
                    }
                    onClose(true)
                  }),
                )
              }}
              render={({ isSubmitting, setFieldValue, values }) => {
                return (
                  <Form>
                    <div className="rmodal-body">
                      <div className={classes.formItem}>
                        <RadioGroup
                          name="radioListOp"
                          value={values.version}
                          onChange={e => {
                            setFieldValue('version', +e.target.value)
                          }}
                          row={true}
                        >
                          <FormControlLabel value={IMPORT_TYPE.SWAGGER_2_0} control={<Radio />} label="Swagger 2.0" />
                          <FormControlLabel value={IMPORT_TYPE.RAP2_ITF_BACKUP} control={<Radio />} label="RAP2接口备份JSON" />
                        </RadioGroup>
                      </div>
                      {values.version === IMPORT_TYPE.SWAGGER_2_0 &&
                        <div className={classes.formItem}>
                          <Field
                            placeholder=""
                            name="docUrl"
                            label="从 Swagger URL 获取"
                            component={TextField}
                            fullWidth={true}
                            variant="outlined"
                          />
                        </div>
                      }
                      <div className={classes.formItem}>
                        <Field
                          placeholder=""
                          name="swagger"
                          label={values.version === IMPORT_TYPE.SWAGGER_2_0 ? '或者直接粘贴 Swagger JSON' : '粘贴RAP2接口备份JSON'}
                          component={TextField}
                          fullWidth={true}
                          multiline={true}
                          rows="4"
                          variant="outlined"
                        />
                      </div>
                    </div>
                    <div className={classes.ctl}>
                      <Button
                        type="submit"
                        variant="contained"
                        color={isSubmitting ? 'inherit' : 'primary'}
                        className="mr1"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? '导入中，由于批量导入数据量较大请耐心稍等...' : '提交'}
                      </Button>
                      {!isSubmitting && (
                        <Button onClick={() => onClose()} disabled={isSubmitting}>
                          取消
                        </Button>
                      )}
                    </div>
                  </Form>
                )
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={alertOpen.op}
        onClose={() => setAlertOpen({ op: false, msg: '' })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">提示</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className={classes.alert}>
            {alertOpen.msg}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAlertOpen({ op: false, msg: '' })} color="primary">
            确认
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  )
}

export default ImportSwaggerRepositoryForm
