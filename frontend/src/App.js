import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import ReactNotification from "react-notifications-component"
import Home from "./Pages/Home"
import { createTheme, ThemeProvider } from "@material-ui/core"
import { grey, orange } from "@material-ui/core/colors"
import Layout from "./Components/Layout"
import RebateDefault from "./Pages/RebateDefault"

const theme = createTheme({
  palette: {
    primary: {
      dark: "#1b5e20",
      main: "#2e7d32",
      light: "#388e3c",
      contrastText: "#e8f5e9",
    },
    secondary: orange,
  },
})

function App() {
  return (
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
          </Switch>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
