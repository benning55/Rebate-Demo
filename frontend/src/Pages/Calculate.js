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
  InputLabel,
  Select,
  MenuItem,
  Container,
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
    formControl: {
      marginRight: theme.spacing(1),
      backgroundColor: "white",
      minWidth: 150,
    },
    calenderField: {
      marginRight: theme.spacing(1),
      backgroundColor: "white",
      width: 200,
    },
    textField: {
      backgroundColor: "white",
      width: "100%",
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

export default function Calculate() {
  const dispatch = useDispatch()
  const isLoading = useSelector((state) => state.vcReducers.isLoading)
  const classes = useStyles()
  const [owners, setOwners] = useState(null)
  const [selectedOwner, setSelectedOwner] = useState("")
  const [selectedDate, setSelectedDate] = useState(moment())
  const [values, setValues] = useState({
    value1: null,
    value2: null,
    value3: null,
    value4: null,
  })

  const [resp, setResp] = useState(null)
  const [respColumn, setRespColumn] = useState([
    { title: "Rebate Name", field: "rebate_name", align: "center" },
    { title: "Type", field: "type_name", align: "center" },
    {
      title: "Value",
      field: "value",
      type: "numeric",
      align: "center",
    },
  ])

  useEffect(() => {
    fetchOwners()
  }, [])

  const fetchOwners = async () => {
    const result = await dispatch(Action.getOwners())
    if (result.status === 200) {
      setOwners(result.data.data)
    } else {
      store.addNotification({
        ...notification,
        type: "danger",
        title: "Fail",
        message: "Server Error",
      })
    }
  }

  const handleOwnerChange = (event) => {
    setSelectedOwner(event.target.value)
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant='h4' component='h1' color='primary'>
            Calculate
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant='h4' component='h1' color='primary'>
            <Box display='flex'>
              <FormControl
                variant='outlined'
                size='medium'
                className={classes.formControl}
              >
                <InputLabel>Name</InputLabel>
                <Select
                  value={selectedOwner}
                  onChange={handleOwnerChange}
                  label='Name'
                >
                  <MenuItem value=''>
                    <em>Name</em>
                  </MenuItem>
                  {owners &&
                    owners.map((item) => (
                      <MenuItem key={item.id} value={item.name}>
                        {item.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <KeyboardDatePicker
                autoOk
                variant='inline'
                inputVariant='outlined'
                invalidDateMessage
                label='Date'
                format='YYYY/MM/DD'
                value={selectedDate}
                className={classes.calenderField}
                InputAdornmentProps={{ position: "start" }}
                onChange={(date) => {
                  setSelectedDate(date)
                }}
              />
            </Box>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required={true}
                label='Value1'
                variant='outlined'
                className={classes.textField}
                type='number'
                value={values.value1}
                onChange={(value) => {
                  const oldValue = { ...values }
                  oldValue.value1 = value.target.value
                  setValues(oldValue)
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Value2'
                variant='outlined'
                className={classes.textField}
                value={values.value2}
                onChange={(value) => {
                  const oldValue = { ...values }
                  oldValue.value2 = value.target.value
                  setValues(oldValue)
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Value3'
                variant='outlined'
                className={classes.textField}
                value={values.value3}
                onChange={(value) => {
                  const oldValue = { ...values }
                  oldValue.value3 = value.target.value
                  setValues(oldValue)
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label='Value4'
                variant='outlined'
                className={classes.textField}
                value={values.value4}
                onChange={(value) => {
                  const oldValue = { ...values }
                  oldValue.value4 = value.target.value
                  setValues(oldValue)
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={9}>
          <Grid container spacing={3}>
            {resp &&
              resp.map((res, index) => (
                <Grid item xs={12}>
                  <MaterialTable
                    title='dd'
                    columns={respColumn}
                    data={res.rebate}
                    options={{
                      paging: false,
                      addRowPosition: "first",
                      showTitle: false,
                      search: false,
                    }}
                    components={{
                      Toolbar: (props) => (
                        <Container maxWidth='md'>
                          <Typography
                            variant='h4'
                            component='h1'
                            color='primary'
                          >
                            {res.title} ({res.target})
                          </Typography>
                          <Box display='flex' justifyContent='space-between'>
                            <Typography
                              variant='h6'
                              component='h3'
                              color='primary'
                            >
                              Range: {res.min_rate} -{" "}
                              {res.max_rate === null ? "♾️" : res.max_rate}
                            </Typography>
                            <Typography
                              variant='h6'
                              component='h3'
                              color='primary'
                            >
                              From: {res.start_date} - {res.end_date}
                            </Typography>
                          </Box>
                        </Container>
                      ),
                    }}
                  />
                </Grid>
              ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant='contained'
            color='primary'
            onClick={async () => {
              let errorCount = 0
              if (selectedOwner === "") {
                store.addNotification({
                  ...notification,
                  type: "danger",
                  title: "Name Error",
                  message: "Name cannot be empty!",
                  dismiss: {
                    duration: 0,
                    click: true,
                    showIcon: true,
                  },
                })
                errorCount += 1
              }

              if (errorCount < 1) {
                dispatch(Action.isLoading(true))
                const data = {
                  owner_name: selectedOwner,
                  date: selectedDate.format("YYYY/MM/DD"),
                  values: values,
                }
                const result = await dispatch(Action.getCalculate(data))
                setTimeout(() => {
                  if (result.status === 200) {
                    store.addNotification({
                      ...notification,
                      type: "success",
                      title: "Success",
                      message: "Update success",
                    })
                    console.log(result.data.data)
                    setResp(result.data.data)
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
