import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import RadioList from '../utils/RadioList'
import { FORM, YUP_MSG } from '../../family/UIConst'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import { Button, Theme, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { SlideUp } from 'components/common/Transition'
import { Organization, RootState } from '../../actions/types'
import UserList from '../common/UserList'
import AccountService from '../../relatives/services/Account'
import * as _ from 'lodash'
import { updateOrganization, addOrganization } from '../../actions/organization'
import { refresh } from '../../actions/common'

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
    minHeight: 300,
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

const schema = Yup.object().shape<Partial<Organization>>({
  name: Yup.string().required(YUP_MSG.REQUIRED).max(20, YUP_MSG.MAX_LENGTH(20)),
  description: Yup.string().max(1000, YUP_MSG.MAX_LENGTH(1000)),
})

const FORM_STATE_INIT: Organization = {
  id: 0,
  name: '',
  description: '',
  members: [],
  visibility: false,
}

interface Props {
  open: boolean
  onClose: (isOk?: boolean) => void
  organization?: Organization
}

function OrganizationForm(props: Props) {
  const { open, onClose, organization } = props
  const auth = useSelector((state: RootState) => state.auth)
  const classes = useStyles()
  const dispatch = useDispatch()

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => (reason !== 'backdropClick' && onClose())}
      TransitionComponent={SlideUp}
    >
      <DialogTitle>新建团队</DialogTitle>
      <DialogContent dividers={true}>
        <div className={classes.form}>
          <Formik
            initialValues={{
              ...FORM_STATE_INIT,
              ...(organization || {}),
            }}
            validationSchema={schema}
            onSubmit={(values) => {
              const addOrUpdateOrganization = values.id ? updateOrganization : addOrganization
              const organization: Organization = {
                ...values,
                memberIds: (values.members || []).map(user => user.id),
              }
              const { owner, newOwner } = values
              if (newOwner && newOwner.id !== owner!.id) { organization.ownerId = newOwner.id }
              dispatch(addOrUpdateOrganization(organization, () => {
                dispatch(refresh())
                onClose(true)
              }))
            }}
            render={({ isSubmitting, setFieldValue, values }) => {
              function loadUserOptions(input: string): Promise<{ label: string, value: number }[]> {
                return new Promise(async (resolve) => {
                  const users = await AccountService.fetchUserList({ name: input })
                  const options = _.differenceWith(users.data, values.members || [], _.isEqual)
                  resolve(options.map(x => ({ label: `${x.fullname} ${x.empId || x.email}`, value: x.id })))
                })
              }
              const newOwner = values.newOwner
                ? [{ label: values.newOwner.fullname, value: values.newOwner.id }]
                : values.owner
                ? [{ label: values.owner.fullname, value: values.owner.id }]
                : []
              return (
                <Form>
                  <div className="rmodal-body">
                    {values.id > 0 &&
                      <div className={classes.formItem}>
                        <div className={classes.formTitle}>项目Owner</div>
                        {values.owner && (values.owner.id === auth.id)
                          ? <UserList
                            isMulti={false}
                            value={newOwner}
                            loadOptions={loadUserOptions}
                            onChange={(users: any) => {
                            setFieldValue('newOwner', users[0])
                          }}
                          />
                          : <div className="pt7 pl9">{values.owner!.fullname}</div>
                        }
                      </div>
                    }
                    <div className={classes.formItem}>
                      <RadioList
                        data={FORM.RADIO_LIST_DATA_VISIBILITY}
                        curVal={values.visibility}
                        name="visibility"
                        onChange={(val: any) => setFieldValue('visibility', val)}
                      />
                    </div>
                    <div className={classes.formItem}>
                      <Field
                        name="name"
                        label="团队名称"
                        component={TextField}
                        fullWidth={true}
                      />
                    </div>
                    <div className={classes.formItem}>
                      <Field
                        name="description"
                        label="描述"
                        component={TextField}
                        fullWidth={true}
                      />
                    </div>
                    <div className={classes.formItem}>
                      <div className={classes.formTitle}>团队成员</div>
                      <UserList
                        isMulti={true}
                        loadOptions={loadUserOptions}
                        selected={values.members!.map(x => ({ label: x.fullname, value: x.id }))}
                        onChange={selected => setFieldValue('members', selected)}
                      />
                    </div>
                  </div>
                  <div className={classes.ctl}>
                    <Button type="submit" variant="contained" color="primary" className="mr1" disabled={isSubmitting}>提交</Button>
                    <Button onClick={() => onClose()} disabled={isSubmitting}>取消</Button>
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

export default OrganizationForm
