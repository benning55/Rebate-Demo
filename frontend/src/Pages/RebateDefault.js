import React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Typography, Button, Grid, Box } from "@material-ui/core"
import MaterialTable, { MTableToolbar } from "material-table"
import Action from "../Redux/Actions/Action"
import { makeStyles } from "@material-ui/core/styles"
import Loading from "../Components/Loading"
import { store } from "react-notifications-component"

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

export default function RebateDefault() {
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.vcReducers.isLoading)
  const classes = useStyles()

  const [column, setColumn] = useState(null)
  const [rows, setRows] = useState(null)

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
    fetchRebateDefault()
    fetchNameColumn()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='h4' component='h1' color='primary'>
              Default Rebate
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
              console.log(rows)
              dispatch(Action.isLoading(true))
              const result = await dispatch(Action.editDefaultRebate(rows))
              console.log(result.status)
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
                    message: result.data.detail ?? "Server Error",
                  })
                }
                dispatch(Action.isLoading(false))
              }, 1000)
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
