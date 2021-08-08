import React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Typography,
  Button,
  Grid,
  Box,
  IconButton,
  FormControl,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@material-ui/core"
import MaterialTable, { MTableToolbar } from "material-table"
import Action from "../Redux/Actions/Action"
import { makeStyles } from "@material-ui/core/styles"
import Loading from "../Components/Loading"
import { store } from "react-notifications-component"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import CheckIcon from "@material-ui/icons/Check"
import EditIcon from "@material-ui/icons/Edit"
import ConfirmDialog from "../Components/ConfirmDialog"
import moment from "moment"
import { DatePicker, Day, KeyboardDatePicker } from "@material-ui/pickers"
import useMediaQuery from "@material-ui/core/useMediaQuery"

const useStyles = makeStyles((theme) => {
  return {
    thader: {
      background: theme.palette.primary.light,
    },
    margin: {
      margin: theme.spacing(1),
    },
    btnCol: {
      color: "white",
    },
    calenderField: {
      marginRight: theme.spacing(1),
      backgroundColor: "white",
      width: 200,
    },
  }
})

let tmp = ""
const notification = {
  title: "Wonderful!",
  message: "Configurable",
  type: "success",
  insert: "top",
  container: "top-right",
  animationIn: ["animate__animated animate__fadeIn"], // `animate.css v4` classes
  animationOut: ["animate__animated animate__fadeOut"],
  dismiss: {
    duration: 1500,
    onScreen: true,
  }, // `animate.css v4` classes
}

export default function CustomTemplate() {
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.vcReducers.isLoading)
  const classes = useStyles()

  const [tables, setTables] = useState(null)
  const [onEdit, setOnEdit] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(null)
  const [target, setTarget] = useState(null)
  const [owner, setOwner] = useState("")
  const [startDate, setStartDate] = useState(moment())
  const [endDate, setEndDate] = useState(moment())
  const matches = useMediaQuery("(max-width:600px)")

  const [targetColumn, setTargetColumn] = useState([
    { title: "Name", field: "name", align: "center" },
    {
      title: "Min Rate",
      field: "min_rate",
      type: "numeric",
      align: "center",
      validate: (rowData) => rowData.min_rate > -1,
    },
    {
      title: "Max Rate",
      field: "max_rate",
      type: "numeric",
      align: "center",
      initialEditValue: null,
      render: (rowData) => {
        return (
          <div>{rowData.max_rate == null ? <p>♾️</p> : rowData.max_rate}</div>
        )
      },
    },
  ])

  const [fetchColumn, setFetchColumn] = useState([
    { title: "Name", field: "name", align: "center" },
    {
      title: "Rate",
      field: "rate",
      type: "numeric",
      align: "center",
      validate: (rowData) => rowData.rate > -1,
    },
  ])

  useEffect(() => {
    // fetchRebateDefault()
    fetchNameColumn()
    fetchCustom()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCustom = async () => {
    const result = await dispatch(Action.getCustomTemplate())
    if (result.status === 200) {
      setTarget(result.data.data.target)
      setTables(result.data.data.rebate)
      // setTables(result.data.data)
    } else {
      store.addNotification({
        ...notification,
        type: "danger",
        title: "Fail",
        message: "Server Error",
      })
    }
  }

  const fetchRebateDefault = async () => {
    const result = await dispatch(Action.getDefaultRebate())
    if (result.status === 200) {
      setTables(result.data.data)
    } else {
      store.addNotification({
        ...notification,
        type: "danger",
        title: "Fail",
        message: "Server Error",
      })
    }
  }

  const fetchNameColumn = async () => {
    const result = await dispatch(Action.getNameColumn())
    if (result.status === 200) {
      const newColumn = [...fetchColumn]
      newColumn[0] = result.data.data
      setFetchColumn(newColumn)
    } else {
      store.addNotification({
        ...notification,
        type: "danger",
        title: "Fail",
        message: "Server Error",
      })
    }
  }

  const deleteRebate = (index) => {
    const newTables = [...tables]
    newTables.splice(index, 1)
    setTables(newTables)
  }

  const addBtnClick = () => {
    const obj = {
      name: "...Type to Change",
      rebate_type: [],
    }
    setTables([...tables, obj])
  }

  const onNameChange = (index) => {
    if (tmp !== "") {
      const newTables = [...tables]
      newTables[index].name = tmp
      setTables(newTables)
    }
    tmp = ""
    setOnEdit(!onEdit)
  }

  const handleDeleteDialogClose = () => {
    setDeleteDialog(false)
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h4' component='h1' color='primary'>
            Custom
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box
            display='flex'
            alignItems='center'
            flexDirection={matches ? "column" : null}
          >
            <TextField
              label='Name'
              variant='outlined'
              className={classes.calenderField}
              value={owner}
              onChange={(value) => setOwner(value.target.value)}
            />
            <KeyboardDatePicker
              autoOk
              variant='inline'
              inputVariant='outlined'
              invalidDateMessage
              label='Start Date'
              format='YYYY/MM/DD'
              value={startDate}
              className={classes.calenderField}
              InputAdornmentProps={{ position: "start" }}
              onChange={(date) => {
                console.log(date)
                setStartDate(date)
              }}
            />
            <KeyboardDatePicker
              autoOk
              variant='inline'
              inputVariant='outlined'
              invalidDateMessage
              label='End Date'
              format='YYYY/MM/DD'
              value={endDate}
              className={classes.calenderField}
              InputAdornmentProps={{ position: "start" }}
              onChange={(date) => {
                setEndDate(date)
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h4' component='h1' color='primary'>
            Custom Target
          </Typography>
        </Grid>
        {target && (
          <Grid item xs={12}>
            <MaterialTable
              title={target.name}
              columns={targetColumn}
              data={target.target_type}
              options={{
                paging: false,
                addRowPosition: "first",
                showTitle: false,
              }}
              components={{
                Toolbar: (props) => (
                  <div>
                    <MTableToolbar {...props} />
                  </div>
                ),
              }}
              editable={{
                onRowAdd: (newData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const new_target = { ...target }
                      const new_target_type = [...target.target_type, newData]
                      new_target.target_type = new_target_type
                      setTarget(new_target)
                      resolve()
                    }, 1000)
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const new_target = { ...target }
                      const new_target_type = [...target.target_type]
                      const index = oldData.tableData.id
                      new_target_type[index] = newData
                      new_target.target_type = new_target_type
                      setTarget(new_target)
                      resolve()
                    }, 1000)
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const new_target = { ...target }
                      const new_target_type = [...target.target_type]
                      const index = oldData.tableData.id
                      new_target_type.splice(index, 1)
                      new_target.target_type = new_target_type
                      setTarget(new_target)
                      resolve()
                    }, 1000)
                  }),
              }}
            />
          </Grid>
        )}
        <Grid item xs={12}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='h4' component='h1' color='primary'>
              Custom Rebate
            </Typography>
            <Button
              variant='contained'
              color='secondary'
              size='large'
              classes={{ label: classes.btnCol }}
              onClick={addBtnClick}
            >
              Add Rebate
            </Button>
          </Box>
        </Grid>
        {tables &&
          tables.map((table, index) => (
            <Grid item xs={12} md={6} key={index}>
              <MaterialTable
                title={table.name}
                columns={fetchColumn}
                data={table.rebate_type}
                options={{
                  paging: false,
                  addRowPosition: "first",
                  showTitle: false,
                }}
                components={{
                  Toolbar: (props) => (
                    <div>
                      <Box>
                        <IconButton
                          aria-label='delete'
                          className={classes.margin}
                          onClick={() => {
                            setDeleteIndex(index)
                            setDeleteDialog(true)
                          }}
                        >
                          <DeleteForeverIcon
                            fontSize='large'
                            style={{ color: "#b71c1c" }}
                          />
                        </IconButton>
                      </Box>
                      <Box
                        display='flex'
                        alignItems='center'
                        justifyContent='space-between'
                      >
                        <div
                          className={classes.margin}
                          style={{ display: "flex" }}
                        >
                          <FormControl
                            className={classes.margin}
                            variant='outlined'
                          >
                            <OutlinedInput
                              disabled={!onEdit}
                              type='text'
                              id={`comp-${index}`}
                              defaultValue={table.name}
                              onChange={(value) => {
                                tmp = value.target.value
                              }}
                              style={{ color: "black" }}
                              endAdornment={
                                onEdit ? (
                                  <InputAdornment position='end'>
                                    <IconButton
                                      onClick={() => onNameChange(index)}
                                      edge='end'
                                    >
                                      <CheckIcon />
                                    </IconButton>
                                  </InputAdornment>
                                ) : (
                                  false
                                )
                              }
                            />
                          </FormControl>
                          {onEdit ? null : (
                            <IconButton
                              onClick={() => {
                                setOnEdit(!onEdit)
                              }}
                            >
                              <EditIcon style={{ color: "black" }} />
                            </IconButton>
                          )}
                        </div>
                        <MTableToolbar {...props} />
                      </Box>
                    </div>
                  ),
                }}
                editable={{
                  onRowAdd: (newData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        // console.log(newData)
                        const new_current_table = { ...table } // Get current table
                        const new_rebate_type = [...table.rebate_type, newData] // add new row to rebate_type
                        const newTable = [...tables] // copy tables
                        new_current_table.rebate_type = new_rebate_type // assign current table to change to new rebate_type
                        newTable[index] = new_current_table // assign new current table to tables object
                        setTables(newTable) // save
                        resolve()
                      }, 1000)
                    }),
                  onRowUpdate: (newData, oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        const newTable = [...tables]
                        const new_current_table = { ...table }
                        const new_rebate_type = [...table.rebate_type]
                        const position = oldData.tableData.id

                        new_rebate_type[position] = newData

                        new_current_table.rebate_type = new_rebate_type
                        newTable[index] = new_current_table
                        setTables(newTable)
                        resolve()
                      }, 1000)
                    }),
                  onRowDelete: (oldData) =>
                    new Promise((resolve, reject) => {
                      setTimeout(() => {
                        const newTable = [...tables]
                        const new_current_table = { ...table }
                        const new_rebate_type = [...table.rebate_type]

                        const position = oldData.tableData.id
                        new_rebate_type.splice(position, 1)

                        new_current_table.rebate_type = new_rebate_type
                        newTable[index] = new_current_table
                        setTables(newTable)
                        resolve()
                      }, 1000)
                    }),
                }}
              />
            </Grid>
          ))}
        <Grid item xs={12}>
          <Button
            variant='contained'
            color='primary'
            onClick={async () => {
              let errorCount = 0
              if (owner === "") {
                store.addNotification({
                  ...notification,
                  type: "danger",
                  title: "Name Error",
                  message: "Name of custom cannot be empty!",
                  dismiss: {
                    duration: 0,
                    click: true,
                    showIcon: true,
                  },
                })
                errorCount += 1
              }

              if (endDate < startDate) {
                store.addNotification({
                  ...notification,
                  type: "danger",
                  title: "Date Error",
                  message: "End Date cannot be less than Start Date",
                  dismiss: {
                    duration: 0,
                    showIcon: true,
                    click: true,
                  },
                })
                errorCount += 1
              }
              if (errorCount < 1) {
                dispatch(Action.isLoading(true))
                const data = {
                  owner: {
                    name: owner,
                    start_date: startDate.format("YYYY/MM/DD"),
                    end_date: endDate.format("YYYY/MM/DD"),
                  },
                  target: target,
                  rebate: tables,
                }
                const result = await dispatch(Action.createCustom(data))
                setTimeout(() => {
                  if (result.status === 200) {
                    store.addNotification({
                      ...notification,
                      type: "success",
                      title: "Success",
                      message: "Update success",
                    })
                  } else {
                    store.addNotification({
                      ...notification,
                      type: "danger",
                      title: "Fail",
                      message: result.data.detail,
                    })
                  }
                  dispatch(Action.isLoading(false))
                }, 1000)
              }
            }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
      <ConfirmDialog
        index={deleteIndex}
        deleteDialogOpen={deleteDialog}
        handleDeleteDialogClose={handleDeleteDialogClose}
        deleteConfirm={deleteRebate}
      />
      <Loading loading={isLoading} />
    </div>
  )
}
