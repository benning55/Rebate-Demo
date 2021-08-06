import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { Typography, Container, Button, Grid } from "@material-ui/core"
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

const Home = () => {
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.vcReducers.isLoading)
  const classes = useStyles()

  const [fetchColumn, setFetchColumn] = useState([
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

  const [fetchRow, setFetchRow] = useState(null)

  const [name, setName] = useState(null)

  const [targetId, setTargetId] = useState(null)

  useEffect(() => {
    fetchDefault()
  }, [])

  const fetchDefault = async () => {
    const result = await dispatch(Action.getDefault())
    setFetchRow(result.target_type)
    setName(result.target_name.name)
    setTargetId(result.target_name.id)
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h4' component='h1' color='primary'>
            Default Target
          </Typography>
        </Grid>
        {fetchRow && (
          <Grid item xs={12}>
            <MaterialTable
              title={name}
              columns={fetchColumn}
              data={fetchRow}
              options={{
                paging: false,
                addRowPosition: "first",
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
                      setFetchRow([...fetchRow, newData])
                      resolve()
                    }, 1000)
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const dataUpdate = [...fetchRow]
                      const index = oldData.tableData.id
                      dataUpdate[index] = newData
                      setFetchRow([...dataUpdate])
                      resolve()
                    }, 1000)
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve, reject) => {
                    setTimeout(() => {
                      const dataDelete = [...fetchRow]
                      const index = oldData.tableData.id
                      dataDelete.splice(index, 1)
                      setFetchRow([...dataDelete])
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
              dispatch(Action.isLoading(true))
              setTimeout(() => {}, 1500)
              const data = {
                target_name_id: targetId,
                target_types: fetchRow,
              }
              const result = await dispatch(Action.editDefault(data))
              console.log(result)
              if (result.status === 200) {
                store.addNotification({
                  ...notification,
                  type: "success",
                  title: "Success",
                  message: "ss",
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

export default Home
