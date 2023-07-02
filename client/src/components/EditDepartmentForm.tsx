import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Fab, IconButton, MenuItem } from "@mui/material";
import { useForm } from "react-hook-form";
import { fetchAddDepartment, fetchUpdateDepartment } from "../utils/fetchData";
import { RootState, store } from "../redux/Store";
import { updateDepartmentAction } from "../redux/DepartmentReducer";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";

interface EditDepartmentFormDialogProps {
  departmentId: string;
}

const EditDepartmentFormDialog: React.FC<EditDepartmentFormDialogProps> = ({
  departmentId,
}) => {
  const [open, setOpen] = React.useState(false);
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const employees = useSelector(
    (state: RootState) => state.employees.employees
  );
  console.log("emp", employees);

  const departments = useSelector(
    (state: RootState) => state.departments.departments
  );
  console.log("dep", departments);
  const departmentToEdit = departments.find(
    (dep: any) => dep._id === departmentId
  );

  if (!departmentToEdit) return null;

  const handleClickOpen = () => {
    reset({
      _id: departmentToEdit?._id ?? "",
      name: departmentToEdit?.name ?? "",
    });

    setOpen(true);
  };

  const handleClose = () => {
    reset();
    setOpen(false);
  };

  const onSubmit = async (data: any) => {
    try {
      console.log(data._id);
      const response = await fetchUpdateDepartment(data._id, data.name);
      store.dispatch(updateDepartmentAction(response));

      handleClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color="primary" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Department</DialogTitle>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <DialogContentText>Edit the chosen department</DialogContentText>
            <TextField
              {...register("name", { required: true })}
              defaultValue={departmentToEdit?.name ?? ""} // set the default value
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
            <TextField
              sx={{ mt: 2 }}
              {...register("departmentId", { required: true })}
              id="department"
              select
              label="Department"
              fullWidth
              defaultValue=""
              error={errors.departmentId ? true : false}
              helperText={errors.departmentId && "Department is required"}>
              {employees.map((option: any) => (
                <MenuItem key={option.departmentId} value={option.departmentId}>
                  {option.departmentId}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button type="reset" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">edit</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </div>
  );
};

export default EditDepartmentFormDialog;
