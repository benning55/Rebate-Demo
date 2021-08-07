import React from "react"
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@material-ui/core"
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles"
import MuiDialog from "@material-ui/core/Dialog"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"

const useStyles = makeStyles((theme) =>
  createStyles({
    paper: {
      padding: "8px 24px",
    },
    resetBtn: {
      backgroundColor: "#6C757D",
      color: theme.palette.error.contrastText,
      "&:hover": {
        backgroundColor: "#8d98a1",
      },
    },
    deleteBtn: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
      "&:hover": {
        backgroundColor: theme.palette.error.light,
      },
    },
  })
)

const Dialog = withStyles({
  paper: {
    padding: "1rem",
  },
})(MuiDialog)

export default function ConfirmDialog({
  index,
  deleteDialogOpen,
  handleDeleteDialogClose,
  deleteConfirm,
}) {
  const classes = useStyles()

  const onConfirmClick = async () => {
    deleteConfirm(index)
    handleDeleteDialogClose()
  }

  return (
    <div>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        aria-labelledby='form-dialog-title'
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='center'
          paddingTop='1rem'
        >
          <DeleteForeverIcon htmlColor='#832838' style={{ fontSize: "4rem" }} />
        </Box>
        <DialogTitle id='form-dialog-title' style={{ textAlign: "center" }}>
          Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this table ?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            padding: "8px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            onClick={onConfirmClick}
            className={classes.deleteBtn}
            variant='contained'
          >
            Confirm
          </Button>
          <Button
            onClick={handleDeleteDialogClose}
            className={classes.resetBtn}
            variant='contained'
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
