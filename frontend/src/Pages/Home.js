import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { Typography, Container, Button } from "@material-ui/core"
import Example1 from "../Components/example1"
import MaterialTable from "material-table"
const Home = () => {
  let parentNode = null

  useEffect(() => {}, [])

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
    <Container maxWidth='md'>
      {columns && data && (
        <MaterialTable
          title='Editable Preview'
          columns={columns}
          data={data}
          editable={{
            onRowAdd: (newData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  setData([...data, newData])
                  console.log(data)
                  resolve()
                }, 1000)
              }),
            onRowUpdate: (newData, oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataUpdate = [...data]
                  const index = oldData.tableData.id
                  dataUpdate[index] = newData
                  setData([...dataUpdate])
                  resolve()
                }, 1000)
              }),
            onRowDelete: (oldData) =>
              new Promise((resolve, reject) => {
                setTimeout(() => {
                  const dataDelete = [...data]
                  const index = oldData.tableData.id
                  dataDelete.splice(index, 1)
                  setData([...dataDelete])
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
          console.log(data)
        }}
      >
        SUBMIT2
      </Button>
    </Container>
  )
}

export default Home
