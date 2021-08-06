import React from "react"
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles"
import MuiDialog from "@material-ui/core/Dialog"
import ClipLoader from "react-spinners/ClipLoader"

const useStyles = makeStyles((theme) =>
  createStyles({
    override: {
      "& span": {
        opacity: "unset",
        "& span": {
          opacity: "unset",
        },
      },
    },
  })
)

const Dialog = withStyles({
  paper: {
    backgroundColor: "unset",
    boxShadow: "unset",
    overflowY: "unset",
  },
})(MuiDialog)

export default function Loading({ loading }) {
  const classes = useStyles()
  return (
    <div>
      <Dialog open={loading} aria-labelledby='form-dialog-title'>
        <ClipLoader
          color='white'
          loading={true}
          size={150}
          css={classes.override}
        />
      </Dialog>
    </div>
  )
}
