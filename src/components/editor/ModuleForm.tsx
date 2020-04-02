import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { YUP_MSG } from '../../family/UIConst'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import { Button, Theme, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { SlideUp } from 'components/common/Transition'
import { Module, Repository, RootState } from '../../actions/types'
import { updateModule, addModule } from '../../actions/module'

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: spacing(2),
    flex: 1,
  },
  preview: {
    marginTop: spacing(1),
  },
  form: {
    minWidth: 500,
  },
  formTitle: {
    color: 'rgba(0, 0, 0, 0.54)',
    fontSize: 9,
  },
  formItem: {
    marginBottom: spacing(1),
  },
  ctl: {
    marginTop: spacing(3),
  },
}))

const schema = Yup.object().shape<Partial<Module>>({
  name: Yup.string().required(YUP_MSG.REQUIRED).max(20, YUP_MSG.MAX_LENGTH(20)),
  description: Yup.string().max(1000, YUP_MSG.MAX_LENGTH(1000)),
})

const FORM_STATE_INIT: Module = {
  id: 0,
  name: '',
  description: '',
  repositoryid: 0,
  priority: 1,
}

interface Props {
  title?: string
  open: boolean
  onClose: (isOk?: boolean) => void
  module?: Module
  repository?: Repository
}

function ModuleForm(props: Props) {
  const auth = useSelector((state: RootState) => state.auth)
  const { open, onClose, module, title, repository } = props
  const classes = useStyles()
  const dispatch = useDispatch()

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => (reason !== 'backdropClick' && onClose())}
      TransitionComponent={SlideUp}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <div className={classes.form}>
          <Formik
            initialValues={{
              ...FORM_STATE_INIT,
              ...(module || {}),
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              const addOrUpdateModule = values.id ? updateModule : addModule
              const module: Module = {
                ...values,
                creatorId: auth.id,
                repositoryId: repository!.id,
              }
              dispatch(addOrUpdateModule(module, () => {
                onClose(true)
              }))
            }}
            render={({ isSubmitting }) => {
              return (
                <Form>
                  <div className="rmodal-body">
                    <div className={classes.formItem}>
                      <Field
                        name="name"
                        label="模块名称"
                        component={TextField}
                        fullWidth={true}
                      />
                    </div>
                    <div className={classes.formItem}>
                      <Field
                        name="description"
                        label="模块简介"
                        component={TextField}
                        multiline={true}
                        fullWidth={true}
                      />
                    </div>
                  </div>
                  <div className={classes.ctl}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      className="mr1"
                      disabled={isSubmitting}
                    >
                      提交
                    </Button>
                    <Button
                      onClick={() => onClose()}
                      disabled={isSubmitting}
                    >
                      取消
                    </Button>
                  </div>
                </Form>
              )
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ModuleForm
