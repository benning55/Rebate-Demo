import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import ReactNotification from "react-notifications-component"
import Home from "./Pages/Home"
import { createTheme, ThemeProvider } from "@material-ui/core"
import {
  purple,
  red,
  lightBlue,
  blueGrey,
  grey,
} from "@material-ui/core/colors"
import Layout from "./Components/Layout"

const theme = createTheme({
  palette: {
    primary: {
      dark: "#1b5e20",
      main: "#388e3c",
      light: "#81c784",
      contrastText: "#e8f5e9",
    },
    secondary: grey,
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Layout>
          <ReactNotification />
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
          </Switch>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
