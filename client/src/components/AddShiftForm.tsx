import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {
  Box,
  Checkbox,
  Fab,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState, store } from "../redux/Store";
import { fetchAddShift } from "../utils/fetchData";
import { addShiftAction } from "../redux/ShiftReducer";

export default function AddShiftFormDialog() {
  const employees = useSelector(
    (state: RootState) => state.employees.employees
  );

  const [open, setOpen] = React.useState(false);
  const {
    reset,
    control,
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

  const onSubmit = async (data: any) => {
    const formData = {
      ...data,
      date: new Date(data.date),
    };
    try {
      const response = await fetchAddShift(formData);
      console.log(response);
      store.dispatch(addShiftAction(response));
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const employeeIdNameMap: { [key: string]: string } = {};
  employees.forEach((employee) => {
    employeeIdNameMap[
      employee._id
    ] = `${employee.firstName} ${employee.lastName}`;
  });

  return (
    <div>
      <Fab
        variant="extended"
        size="medium"
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}>
        <AddIcon sx={{ mr: 1 }} />
        Add Shift
      </Fab>
      <Dialog
        sx={{
          mb: 20,
        }}
        open={open}
        onClose={handleClose}>
        <DialogTitle>Add Shift</DialogTitle>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ width: 500 }}>
          <DialogContent>
            <DialogContentText>Add new Shift to the factory</DialogContentText>
            <InputLabel
              htmlFor="data"
              sx={{ display: "flex", justifyContent: "start", mt: 2 }}>
              Date
            </InputLabel>
            <TextField
              {...register("date", { required: true })}
              error={errors.date ? true : false}
              helperText={errors.date && "Date is required"}
              autoFocus
              margin="dense"
              id="date"
              type="date"
              fullWidth
              variant="standard"
            />
            <InputLabel
              htmlFor="startTime"
              sx={{ display: "flex", justifyContent: "start", mt: 2 }}>
              Start time
            </InputLabel>
            <TextField
              {...register("startTime", { required: true })}
              error={errors.startTime ? true : false}
              helperText={errors.startTime && "Start time is required"}
              autoFocus
              margin="dense"
              id="startTime"
              type="time"
              fullWidth
              variant="standard"
            />
            <InputLabel
              htmlFor="endTime"
              sx={{ display: "flex", justifyContent: "start", mt: 2 }}>
              End time
            </InputLabel>
            <TextField
              {...register("endTime", { required: true })}
              error={errors.endTime ? true : false}
              helperText={errors.endTime && "End time is required"}
              autoFocus
              margin="dense"
              id="endTime"
              type="time"
              fullWidth
              variant="standard"
            />
            <InputLabel
              htmlFor="endTime"
              sx={{ display: "flex", justifyContent: "start", mt: 2 }}>
              Pick employees
            </InputLabel>
            <Controller
              name="employeeIds"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  {...register("employeeIds", { required: true })}
                  id="employeeIds"
                  error={errors.employeeIds ? true : false}
                  multiple
                  fullWidth
                  value={field.value}
                  onChange={field.onChange}
                  input={<OutlinedInput />}
                  renderValue={(selected) =>
                    selected
                      .map((value: string) => employeeIdNameMap[value])
                      .join(", ")
                  }>
                  {employees.map((employee) => (
                    <MenuItem key={employee._id} value={employee._id}>
                      <Checkbox
                        checked={field.value.indexOf(employee._id) > -1}
                      />
                      <ListItemText
                        primary={`${employee.firstName} ${employee.lastName}`}
                      />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.employeeIds && (
              <Typography
                variant="body2"
                color="error"
                sx={{ display: "flex", justifyContent: "start", fontSize: 12 }}>
                Choose at least one employee
              </Typography>
            )}
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
