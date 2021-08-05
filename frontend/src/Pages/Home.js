import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { Typography, Container, Button } from "@material-ui/core"
import Example1 from "../Components/example1"
import MaterialTable, { MTableToolbar } from "material-table"
import Action from "../Redux/Actions/Action"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => {
  return {
    thader: {
      background: theme.palette.primary.light,
    },
  }
})

const Home = () => {
  let parentNode = null
  const dispatch = useDispatch()
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

  useEffect(() => {
    fetchDefault()
  }, [])

  const fetchDefault = async () => {
    const result = await dispatch(Action.getDefault())
    setFetchRow(result.target_type)
    setName(result.target_name.name)
  }

  const [columns, setColumns] = useState([
    { title: "Name", field: "name" },
    {
      title: "Surname",
      field: "surname",
      initialEditValue: "initial edit value",
    },
    { title: "Birth Year", field: "birthYear", type: "date" },
    {
      title: "Birth Place",
      field: "birthCity",
      lookup: { 34: "İstanbul", 63: "Şanlıurfa" },
    },
  ])

  const [data, setData] = useState([
    { name: "Mehmet", surname: "Baran", birthYear: 1987, birthCity: 63 },
    { name: "Zerya Betül", surname: "Baran", birthYear: 2017, birthCity: 34 },
  ])

  return (
    <div>
      {fetchRow && (
        <MaterialTable
          title={name}
          columns={fetchColumn}
          data={fetchRow}
          style={{ marginBottom: "1rem" }}
          options={{
            paging: false,
            addRowPosition: "first",
          }}
          components={{
            Toolbar: (props) => (
              <div className={classes.thader}>
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
      )}
      <Button
        variant='contained'
        color='primary'
        onClick={() => {
          console.log(fetchRow)
        }}
      >
        Submit
      </Button>
    </div>
  )
}

export default Home
