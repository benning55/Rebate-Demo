import React from "react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  Typography,
  Button,
  Grid,
  Box,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Container,
} from "@material-ui/core"
import MaterialTable from "material-table"
import Action from "../Redux/Actions/Action"
import { makeStyles } from "@material-ui/core/styles"
import Loading from "../Components/Loading"
import { store } from "react-notifications-component"
import moment from "moment"
import { KeyboardDatePicker } from "@material-ui/pickers"

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
    order1: null,
    order2: null,
    order3: null,
    order4: null,
  })

  const [resp, setResp] = useState(null)
  const [respColumn, setRespColumn] = useState(null)

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
        <Grid item xs={12}>
          <Grid container spacing={3}>
            <Grid item xs={3}>
              <TextField
                required={true}
                label='Order1'
                variant='outlined'
                className={classes.textField}
                type='number'
                value={values.order1}
                onChange={(value) => {
                  const oldValue = { ...values }
                  oldValue.order1 = value.target.value
                  setValues(oldValue)
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label='Order2'
                variant='outlined'
                className={classes.textField}
                value={values.order2}
                onChange={(value) => {
                  const oldValue = { ...values }
                  oldValue.order2 = value.target.value
                  setValues(oldValue)
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label='Order3'
                variant='outlined'
                className={classes.textField}
                value={values.order3}
                onChange={(value) => {
                  const oldValue = { ...values }
                  oldValue.order3 = value.target.value
                  setValues(oldValue)
                }}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label='Order4'
                variant='outlined'
                className={classes.textField}
                value={values.order4}
                onChange={(value) => {
                  const oldValue = { ...values }
                  oldValue.order4 = value.target.value
                  setValues(oldValue)
                }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {respColumn && resp && (
              <Grid item xs={12}>
                <MaterialTable
                  title='dd'
                  columns={respColumn}
                  data={resp}
                  options={{
                    paging: false,
                    showTitle: false,
                    search: false,
                    toolbar: false,
                    rowStyle: {
                      backgroundColor: "#EEE",
                    },
                  }}
                  // components={{
                  //   Toolbar: (props) => (
                  //     <Container maxWidth='md' style={{ padding: "1.5rem" }}>
                  //       <Typography
                  //         variant='h4'
                  //         component='h1'
                  //         color='primary'
                  //       >
                  //         {res.title} ({res.target})
                  //       </Typography>
                  //       <Box display='flex' justifyContent='space-between'>
                  //         <Typography
                  //           variant='h6'
                  //           component='h3'
                  //           color='primary'
                  //         >
                  //           Range: {res.min_rate} -{" "}
                  //           {res.max_rate === null ? "♾️" : res.max_rate}
                  //         </Typography>
                  //         <Typography
                  //           variant='h6'
                  //           component='h3'
                  //           color='primary'
                  //         >
                  //           From: {res.start_date} - {res.end_date}
                  //         </Typography>
                  //       </Box>
                  //     </Container>
                  //   ),
                  // }}
                />
              </Grid>
            )}
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
                    setRespColumn(result.data.data.column)
                    setResp(result.data.data.rows)
                    console.log(result.data.data.rows)
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
