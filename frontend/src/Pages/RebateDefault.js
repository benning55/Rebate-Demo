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

export default function RebateDefault() {
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.vcReducers.isLoading)
  const classes = useStyles()

  const [tables, setTables] = useState(null)
  const [onEdit, setOnEdit] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState(null)

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
  }, [])

  const fetchRebateDefault = async () => {
    const result = await dispatch(Action.getDefaultRebate())
    setTables(result)
    console.log(result)
  }

  const fetchNameColumn = async () => {
    const result = await dispatch(Action.getNameColumn())
    const newColumn = [...fetchColumn]
    newColumn[0] = result
    setFetchColumn(newColumn)
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
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='h4' component='h1' color='primary'>
              Default Rebate
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
              dispatch(Action.isLoading(true))
              const result = await dispatch(Action.editDefaultRebate(tables))
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
