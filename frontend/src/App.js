import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import ReactNotification from "react-notifications-component"
import Home from "./Pages/Home"
import { createTheme, ThemeProvider } from "@material-ui/core"
import { orange } from "@material-ui/core/colors"
import Layout from "./Components/Layout"
import RebateDefault from "./Pages/RebateDefault"
import CustomTemplate from "./Pages/CustomTemplate"
import { MuiPickersUtilsProvider } from "@material-ui/pickers"
import MomentUtils from "@date-io/moment"
import Calculate from "./Pages/Calculate"

const theme = createTheme({
  palette: {
    primary: {
      dark: "#2962ff",
      main: "#2979ff",
      light: "#448aff",
      contrastText: "#e8f5e9",
    },
    secondary: orange,
  },
})

function App() {
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <ThemeProvider theme={theme}>
        <Router>
          <ReactNotification />
          <Layout>
            <Switch>
              <Route exact path='/'>
                <Home />
              </Route>
              <Route exact path='/rebate-default'>
                <RebateDefault />
              </Route>
              <Route exact path='/custom-template'>
                <CustomTemplate />
              </Route>
              <Route exact path='/calculate'>
                <Calculate />
              </Route>
            </Switch>
          </Layout>
        </Router>
      </ThemeProvider>
    </MuiPickersUtilsProvider>
  )
}

export default App
