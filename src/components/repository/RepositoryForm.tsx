import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { YUP_MSG } from '../../family/UIConst'
import { Formik, Field, Form } from 'formik'
import { TextField } from 'formik-material-ui'
import * as Yup from 'yup'
import { Button, Theme, Dialog, DialogContent, DialogTitle } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { RepositoryFormData, RootState, Repository } from '../../actions/types'
import UserList from '../common/UserList'
import Select from '../common/Select'
import AccountService from '../../relatives/services/Account'
import * as _ from 'lodash'
import { updateRepository, addRepository } from '../../actions/repository'
import { fetchOwnedOrganizationList, fetchJoinedOrganizationList } from '../../actions/organization'
import { refresh } from '../../actions/common'
import { SlideUp } from 'components/common/Transition'

const useStyles = makeStyles(({ spacing }: Theme) => ({
  root: {},
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

const schema = Yup.object().shape<Partial<Repository>>({
  name: Yup.string()
    .required(YUP_MSG.REQUIRED)
    .max(20, YUP_MSG.MAX_LENGTH(20)),
  description: Yup.string().max(1000, YUP_MSG.MAX_LENGTH(1000)),
})

const FORM_STATE_INIT: RepositoryFormData = {
  id: 0,
  name: '',
  description: '',
  members: [],
  organizationId: undefined,
  collaborators: [],
  collaboratorIdstring: '',
}
interface Props {
  title?: string
  open: boolean
  onClose: (isOk?: boolean) => void
  repository?: Repository
  organizationId?: number
}

function RepositoryForm(props: Props) {
  const { open, onClose, title, organizationId } = props
  let repository = props.repository as RepositoryFormData
  if (repository) {
    repository.collaboratorIdstring = repository.collaborators!.map(x => { return x.id }).join(',')
  }
  const auth = useSelector((state: RootState) => state.auth)
  const organizations = useSelector((state: RootState) => {
    return _.uniqBy([...state.ownedOrganizations.data, ...state.joinedOrganizations.data], 'id')
  }).map(org => ({
    label: org.name,
    value: org.id,
  }))

  const classes = useStyles()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchJoinedOrganizationList())
    dispatch(fetchOwnedOrganizationList())
  }, [dispatch])

  if (repository) {
    repository = { ...FORM_STATE_INIT, ...repository }
    repository.collaboratorIdstring = repository
      .collaborators!.map(x => {
        return x.id
      })
      .join(',')
  } else {
    repository = { ...FORM_STATE_INIT }
    if (organizationId !== undefined) {
      repository.organizationId = organizationId
    }
  }

  return (
    <Dialog
      open={open}
      onClose={(_event, reason) => reason !== 'backdropClick' && onClose()}
      TransitionComponent={SlideUp}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers={true}>
        <div className={classes.form}>
          <Formik
            initialValues={repository}
            validationSchema={schema}
            onSubmit={values => {
              const addOrUpdateRepository = values.id ? updateRepository : addRepository
              const repository: RepositoryFormData = {
                ...values,
                memberIds: (values.members || []).map((user: any) => user.id),
                collaboratorIds: (values.collaboratorIdstring || '').split(','),
              }
              const { owner, newOwner } = values
              if (newOwner && newOwner.id !== owner!.id) {
                repository.ownerId = newOwner.id
              }
              dispatch(
                addOrUpdateRepository(repository, () => {
                  dispatch(refresh())
                  onClose(true)
                }),
              )
            }}
            render={({ isSubmitting, setFieldValue, values }) => {
              function loadUserOptions(
                input: string,
              ): Promise<{ label: string; value: number }[]> {
                return new Promise(async resolve => {
                  const users = await AccountService.fetchUserList({ name: input })
                  const options = _.differenceWith(users.data, values.members || [], _.isEqual)
                  resolve(
                    options.map(x => ({
                      label: `${x.fullname} ${x.empId || x.email}`,
                      value: x.id,
                    })),
                  )
                })
              }

              const selectOrganization = organizations.find(
                (x: any) => x.value === values.organizationId,
              )
              return (
                <Form>
                  <div className="rmodal-body">
                    {values.id > 0 && (
                      <div className={classes.formItem}>
                        <div className={classes.formTitle}>拥有者</div>

                        {values.owner && values.owner.id === auth.id ? (
                          <UserList
                            isMulti={false}
                            loadOptions={loadUserOptions}
                            selected={
                              values.owner
                                ? [
                                    {
                                      label: values.owner.fullname,
                                      value: values.owner.id,
                                    },
                                  ]
                                : []
                            }
                            onChange={(users: any) => setFieldValue('newOwner', users[0])}
                          />
                        ) : (
                          <div className="pt7 pl9">{values.owner!.fullname}</div>
                        )}
                      </div>
                    )}
                    <div className={classes.formItem}>
                      <Field name="name" label="仓库名称" component={TextField} fullWidth={true} />
                    </div>
                    <div className={classes.formItem}>
                      <Field
                        name="description"
                        label="说明(多行，支持Markdown)"
                        multiline={true}
                        component={TextField}
                        fullWidth={true}
                        rowsMax={8}
                      />
                    </div>
                    <div className={classes.formItem}>
                      <div className={classes.formTitle}>成员</div>
                      <UserList
                        isMulti={true}
                        loadOptions={loadUserOptions}
                        selected={values.members!.map(x => ({
                          label: x.fullname,
                          value: x.id,
                        }))}
                        onChange={selected => setFieldValue('members', selected)}
                      />
                    </div>
                    <div className={classes.formItem}>
                      <div className={classes.formTitle}>团队</div>
                      <Select
                        isMulti={false}
                        isClearable={true}
                        options={organizations}
                        value={selectOrganization}
                        onChange={val => {
                          if (!Array.isArray(val)) {
                            setFieldValue('organizationId', val && val.value)
                          }
                        }}
                      />
                    </div>
                    <div className={classes.formItem}>
                      <Field
                        name="collaboratorIdstring"
                        label="协同仓库ID"
                        component={TextField}
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
                    <Button onClick={() => onClose()} disabled={isSubmitting}>
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

export default RepositoryForm
