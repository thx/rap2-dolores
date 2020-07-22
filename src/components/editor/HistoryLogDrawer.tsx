import React, { useEffect, useState } from 'react'
import { List, ListItem, ListItemText, Drawer, makeStyles, ListItemSecondaryAction, IconButton, TablePagination, Button } from '@material-ui/core'
import { ENTITY_TYPE, TablePaginationProps } from 'utils/consts'
import RepositoryService from '../../relatives/services/Repository'
import DateUtility from 'utils/DateUtility'
import Markdown from 'markdown-to-jsx'
import NoData from 'components/common/NoData'
import DownloadIcon from '@material-ui/icons/GetApp'
import { serve } from 'relatives/services/constant'

const useStyles = makeStyles({
  list: {
    width: 650,
    overflow: 'auto',
    height: 'calc(100% - 50px)',
  },
  fullList: {
    width: 'auto',
  },
  pager: {
    height: 50,
    marginBottom: 12,
  },
})

export interface HistoryLog {
  id: number
  user: {
    fullname: string
    id: number
    empId: number
  }
  entityId: number
  entityType: ENTITY_TYPE.INTERFACE | ENTITY_TYPE.REPOSITORY
  changeLog: string
  createdAt: string

  relatedJSONData?: string
  jsonDataIsNull?: boolean
}

export const LOG_SEPERATOR = '.|.'
export const LOG_SUB_SEPERATOR = '@|@'

const FormattedRow = ({ row }: { row: HistoryLog }) => {
  const [expanded, setExpanded] = useState(false)
  const [showBtn, setShowBtn] = useState(false)
  const formatter = () => row.changeLog
    .split(LOG_SEPERATOR)
    .map(x => x.split(LOG_SUB_SEPERATOR))
    .reduceRight((a, b) => [...a, ...b], [])
    .map(x => `* ${x}`)

  const list = formatter()

  if (list.length > 5 && !expanded) {
    list.length = 5
    if (!showBtn) {
      setShowBtn(true)
    }
  }

  return (
    <div>
      <Markdown>{list.join('\n')}</Markdown>
      {showBtn && (
        <Button
          color="primary"
          variant="outlined"
          onClick={() => setExpanded(!expanded)}
          size="small"
          className="mb1"
        >
          {expanded ? '折叠' : '展开更多'}
        </Button>
      )}
    </div>
  )
}

const EMPTY = { rows: [], count: 0 }

function HistoryLogDrawer({ entityId, entityType, open, onClose }:
  { entityId: number, entityType: ENTITY_TYPE.INTERFACE | ENTITY_TYPE.REPOSITORY, open: boolean, onClose: () => void }) {
  const classes = useStyles()
  const [result, setResult] = useState<IPagerList<HistoryLog>>(EMPTY)
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(0)
  useEffect(() => {
    if (open) {
      RepositoryService.fetchHistoryLogs({ entityId, entityType, limit, offset: page * limit }).then(res => {
        setResult(res)
      })
    }
    return () => {
      setResult(EMPTY)
    }
  }, [entityId, entityType, open, limit, page])
  return (
    <Drawer open={open} onClose={onClose}>
      {result.rows.length === 0 && <NoData />}
      <List className={classes.list}>
        {result.rows.map(row => (
          <ListItem key={row.id}>
            <ListItemText primary={<FormattedRow row={row} />} secondary={`${DateUtility.formatDate(row.createdAt)} by ${row.user.fullname}`} />
            {!row.jsonDataIsNull &&
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="download" onClick={() => window.open(`${serve}/interface/history/JSONData/${row.id}`)}>
                  <DownloadIcon />
                </IconButton>
              </ListItemSecondaryAction>
            }
          </ListItem>
        ))
        }
      </List>
      <TablePagination
        className={classes.pager}
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={result.count}
        rowsPerPage={limit}
        page={page}
        onChangePage={(_, val) => setPage(val)}
        onChangeRowsPerPage={e => { setLimit(parseInt(e.target.value, 10)); setPage(0) }}
        {...TablePaginationProps}
      />
    </Drawer>
  )
}

export default HistoryLogDrawer
