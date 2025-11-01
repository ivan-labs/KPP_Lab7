export const api = {
  _sendRequest: function (method, url, data, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status >= 200 && this.status < 300) {
          callback(this.responseText ? JSON.parse(this.responseText) : null);
        } else {
          console.error("AJAX Error:", this.status, this.statusText);
          alert("Помилка сервера. " + (this.responseText || ""));
        }
      }
    };

    xhr.send(data ? JSON.stringify(data) : null);
  },

  getBooks: function (filters, callback) {
    let url = "/api/books?";
    const params = [];
    if (filters.inStock) {
      params.push("inStock=true");
    }
    if (filters.overdue) {
      params.push("overdue=true");
    }
    url += params.join("&");

    this._sendRequest("GET", url, null, callback);
  },

  addBook: function (bookData, callback) {
    this._sendRequest("POST", "/api/books", bookData, callback);
  },

  deleteBook: function (id, callback) {
    this._sendRequest("DELETE", `/api/books/${id}`, null, callback);
  },

  updateBook: function (id, bookData, callback) {
    this._sendRequest("PUT", `/api/books/${id}`, bookData, callback);
  },

  checkoutBook: function (id, checkoutData, callback) {
    this._sendRequest(
      "PUT",
      `/api/books/checkout/${id}`,
      checkoutData,
      callback
    );
  },

  returnBook: function (id, callback) {
    this._sendRequest("PUT", `/api/books/return/${id}`, null, callback);
  },
};
