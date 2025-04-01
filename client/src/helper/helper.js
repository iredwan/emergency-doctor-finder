import toast from "react-hot-toast";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)

class FormHelper {
  IsEmpty(value) {
    return value.length === 0; // true if get empty
  }

  validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  validatePassword = (password) => {
    return password.length >= 6;
  };

  validatePhone = (phone) => {
    // Basic phone validation
    const re = /^[0-9]{10,15}$/;
    return re.test(String(phone).replace(/[^0-9]/g, ''));
  };

  SuccessToast(msg) {
    toast.success(msg);
  }
  
  ErrorToast(msg) {
    toast.error(msg);
  }

  async DeleteAlert() {
    const result = await MySwal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted!",
        text: "Your file has been deleted.",
        icon: "success"
      });
      return true;
    }
    return false;
  }

  async ConfirmAlert(title, text, confirmButtonText = "Yes, continue!") {
    const result = await MySwal.fire({
      title: title,
      text: text,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmButtonText,
    });
    return result.isConfirmed;
  }
  

}

export const {
  SuccessToast, 
  ErrorToast, 
  IsEmpty, 
  validateEmail, 
  validatePassword,
  validatePhone,
  DeleteAlert,
  ConfirmAlert
} = new FormHelper();
