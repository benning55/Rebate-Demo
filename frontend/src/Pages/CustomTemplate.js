import React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Typography, Button, Grid, Box, TextField } from "@material-ui/core"
import MaterialTable, { MTableToolbar } from "material-table"
import Action from "../Redux/Actions/Action"
import { makeStyles } from "@material-ui/core/styles"
import Loading from "../Components/Loading"
import { store } from "react-notifications-component"
import moment from "moment"
import { KeyboardDatePicker } from "@material-ui/pickers"
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
  const [target, setTarget] = useState(null)
  const [owner, setOwner] = useState("")
  const [startDate, setStartDate] = useState(moment())
  const [endDate, setEndDate] = useState(moment())
  const matches = useMediaQuery("(max-width:600px)")

  const [column, setColumn] = useState(null)
  const [rows, setRows] = useState(null)

  const [targetColumn, setTargetColumn] = useState([
    { title: "Name", field: "name", align: "center", editable: "never" },
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

  useEffect(() => {
    fetchCustom()
    fetchRebateDefault()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCustom = async () => {
    const result = await dispatch(Action.getCustomTemplate())
    if (result.status === 200) {
      setTarget(result.data.data.target)
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
      console.log(result.data.data.column)
      setColumn(result.data.data.column)
      setRows(result.data.data.rows)
    } else {
      store.addNotification({
        ...notification,
        type: "danger",
        title: "Fail",
        message: "Server Error",
      })
    }
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
          <Box display='flex' alignItems='center'>
            <Typography variant='h4' component='h1' color='primary'>
              Custom Rebate
            </Typography>
          </Box>
        </Grid>
        {column && rows && (
          <Grid item xs={12}>
            <MaterialTable
              title='Default Rebate'
              columns={column}
              data={rows}
              options={{
                paging: true,
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
                      setRows([...rows, newData])
                      resolve()
                    }, 1000)
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const dataUpdate = [...rows]
                      const index = oldData.tableData.id
                      dataUpdate[index] = newData
                      setRows([...dataUpdate])
                      resolve()
                    }, 1000)
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const dataDelete = [...rows]
                      const index = oldData.tableData.id
                      dataDelete.splice(index, 1)
                      setRows([...dataDelete])
                      resolve()
                    }, 1000)
                  }),
              }}
            />
          </Grid>
        )}
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
                  rebate: rows,
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
      <Loading loading={isLoading} />
    </div>
  )
}
