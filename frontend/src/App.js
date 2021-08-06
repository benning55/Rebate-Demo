import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import ReactNotification from "react-notifications-component"
import Home from "./Pages/Home"
import { createTheme, ThemeProvider } from "@material-ui/core"
import { grey } from "@material-ui/core/colors"
import Layout from "./Components/Layout"

const theme = createTheme({
  palette: {
    primary: {
      dark: "#1b5e20",
      main: "#2e7d32",
      light: "#388e3c",
      contrastText: "#e8f5e9",
    },
    secondary: grey,
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
          </Switch>
        </Layout>
      </Router>
    </ThemeProvider>
  )
}

export default App
