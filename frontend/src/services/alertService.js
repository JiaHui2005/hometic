const alertService = {
  success: (title, message, autoClose = 3000) => {
    if (window.showAlert) {
      window.showAlert("success", title, message, autoClose);
    }
  },

  error: (title, message, autoClose = 3000) => {
    if (window.showAlert) {
      window.showAlert("error", title, message, autoClose);
    }
  },

  warning: (title, message, autoClose = 3000) => {
    if (window.showAlert) {
      window.showAlert("warning", title, message, autoClose);
    }
  },

  info: (title, message, autoClose = 3000) => {
    if (window.showAlert) {
      window.showAlert("info", title, message, autoClose);
    }
  }
};

export default alertService;
