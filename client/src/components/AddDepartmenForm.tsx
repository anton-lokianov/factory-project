import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Department } from "../models/Department";
import { useForm } from "react-hook-form";
import { fetchAddDepartment } from "../utils/fatchData";

export default function FormDialog() {
  const [open, setOpen] = React.useState(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = (data: any) => {
    fetchAddDepartment(data);
    console.log(data);
    handleClose();
  };

  return (
    <div>
      <Fab
        variant="extended"
        size="medium"
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}>
        <AddIcon sx={{ mr: 1 }} />
        Add Department
      </Fab>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Department</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <DialogContentText>
              Add new department to the factory
            </DialogContentText>
            <TextField
              {...register("name", { required: true })}
              error={errors.name ? true : false}
              helperText={errors.name && "Department name is required"}
              autoFocus
              margin="dense"
              id="name"
              label="Department Name"
              type="Text"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button type="reset" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Add</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
}
