import axios from "axios";
import { DeleteAlert, ErrorToast, SuccessToast } from "../../helper/helper";

let baseURL = "http://localhost:5000/api";

class ApiCall {
  async register(reqBody) {
    let result = await axios.post(`${baseURL}/register`, reqBody);
    if (result.data.status === true) {
      SuccessToast(result.data.msg);
      return true;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }

  async login(reqBody) {
    let result = await axios.post(`${baseURL}/login`, reqBody, {withCredentials: true})
    if (result.data.status === true) {
      SuccessToast(result.data.msg);
      return true;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }
  async logout() {
    let result = await axios.get(`${baseURL}/logout`, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      SuccessToast(result.data.msg);
      return true;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }

  async fileUpload(reqBody) {
    let result = await axios.post(`${baseURL}/file-upload`, reqBody, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (result.data.status === true) {
      SuccessToast(result.data.msg);
      return result;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }
  

  async createBlog(reqBody) {
    let result = await axios.post(`${baseURL}/create-blog`, reqBody, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      SuccessToast(result.data.msg);
      return true;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }

  async getAllBlog() {
    let result = await axios.get(`${baseURL}/get-all-blog`, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      return result?.data?.data;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }


  async updateBlog(id, reqBody) {
    let result = await axios.post(`${baseURL}/update-blog/`+id, reqBody, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      return result?.data?.data;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }

  async getBlogByID(id) {
      let result = await axios.get(`${baseURL}/get-blog/` + id, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        return result?.data?.data;
      } else {
        ErrorToast(result.data.msg);
        return false;
      
    }
  }
  async deleteBlog(id) {
    let isConfirmed = await DeleteAlert();

    console.log(isConfirmed);

    if (isConfirmed) {
      let result = await axios.delete(`${baseURL}/delete-blog/` + id, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        SuccessToast(result.data.msg);
        return true;
      } else {
        ErrorToast(result.data.msg);
        return false;
      }
    }
  }

  async createService(reqBody) {
    let result = await axios.post(`${baseURL}/add-service`, reqBody, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      SuccessToast(result.data.msg);
      return true;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }

  async getAllService() {
    let result = await axios.get(`${baseURL}/get-all-service`, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      return result?.data?.data;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }

  async updateService(id, reqBody) {
    let result = await axios.post(`${baseURL}/update-service/`+id, reqBody, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      return result?.data?.data;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }

  async deleteService(id) {
    let isConfirmed = await DeleteAlert();

    if (isConfirmed) {
      let result = await axios.delete(`${baseURL}/delete-service/`+id, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        SuccessToast(result.data.msg);
        return true;
      } else {
        ErrorToast(result.data.msg);
        return false;
      }
    }
  }

  async createContact(reqBody) {
    let result = await axios.post(`${baseURL}/submit-contact-form`, reqBody, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      SuccessToast(result.data.msg);
      return true;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }

  async getAllContact() {
    let result = await axios.get(`${baseURL}/get-all-contact`, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      return result?.data?.data;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }

  async updateContact(id, reqBody) {
    let result = await axios.post(`${baseURL}/update-contact/`+id, reqBody, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      return result?.data?.data;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }

  async deleteContact(id) {
    let isConfirmed = await DeleteAlert();

    console.log(isConfirmed);

    if (isConfirmed) {
      let result = await axios.delete(`${baseURL}/delete-contact/` + id, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        SuccessToast(result.data.msg);
        return true;
      } else {
        ErrorToast(result.data.msg);
        return false;
      }
    }
  }

  async createTeamMember(reqBody) {
    let result = await axios.post(`${baseURL}/add-member`, reqBody, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      SuccessToast(result.data.msg);
      return true;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }

  async getAllTeamMembers() {
    let result = await axios.get(`${baseURL}/get-all-member`, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      return result?.data?.data;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }

  async updateTeamMember(id, reqBody) {
    let result = await axios.post(`${baseURL}/update-member/`+id, reqBody, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      return result?.data?.data;
    } else {
      ErrorToast(result.data.msg);
      return false;
    }
  }

  async deleteTeamMember(id) {
    let isConfirmed = await DeleteAlert();

    console.log(isConfirmed);

    if (isConfirmed) {
      let result = await axios.delete(`${baseURL}/delete-member/` + id, {
        withCredentials: true,
      });
      if (result.data.status === true) {
        SuccessToast(result.data.msg);
        return true;
      } else {
        ErrorToast(result.data.msg);
        return false;
      }
    }
  }

  async getTeamMemberById(id) {
    let result = await axios.get(`${baseURL}/get-a-member/`+id, {
      withCredentials: true,
    });
    if (result.data.status === true) {
      return result?.data?.data;
    } else {
      ErrorToast(result.data.msg);
      return false;
    
  }
}

}



export const { register, 
  login, 
  logout, 

  fileUpload,

  createBlog,
  getAllBlog,
  updateBlog,
  deleteBlog,
  getBlogByID,

  createService,
  getAllService,
  updateService,
  deleteService,

  createContact,
  getAllContact,
  deleteContact,
  updateContact,

  createTeamMember,
  getAllTeamMembers,
  updateTeamMember,
  deleteTeamMember,
  getTeamMemberById,
  } = new ApiCall();
