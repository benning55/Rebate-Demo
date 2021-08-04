import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import ReactNotification from "react-notifications-component"
import Home from "./Pages/Home"
import { createTheme, ThemeProvider } from "@material-ui/core"
import { purple, red, lightBlue } from "@material-ui/core/colors"

const theme = createTheme({
  palette: {
    primary: lightBlue,
    secondary: purple,
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className='content'>
          <ReactNotification />
          <Switch>
            <Route exact path='/'>
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
