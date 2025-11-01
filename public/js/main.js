import { api } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const filterInStock = document.getElementById("filterInStock");
  const filterOverdue = document.getElementById("filterOverdue");
  const addBookForm = document.getElementById("addBookForm");
  const booksTable = document.getElementById("booksTable");

  function redrawTable(books) {
    const tbody = document.querySelector("#booksTable tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    books.forEach((book) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${book.id}</td>
        <td><a href="/book/${book.id}">${book.title}</a></td>
        <td>${book.author}</td>
        <td>${
          book.inStock
            ? "В наявності"
            : `У ${book.readerName} (до ${book.returnDate})`
        }</td>
        <td><button class="w3-button w3-red w3-small delete-btn" data-id="${
          book.id
        }">Видалити</button></td>
      `;
      tbody.appendChild(row);
    });
  }

  function applyFilters() {
    const filters = {
      inStock: filterInStock ? filterInStock.checked : false,
      overdue: filterOverdue ? filterOverdue.checked : false,
    };
    api.getBooks(filters, redrawTable);
  }

  if (filterInStock) {
    filterInStock.addEventListener("change", applyFilters);
  }
  if (filterOverdue) {
    filterOverdue.addEventListener("change", applyFilters);
  }

  if (addBookForm) {
    addBookForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        year: document.getElementById("year").value,
      };

      api.addBook(data, (newBook) => {
        applyFilters();
        addBookForm.reset();
      });
    });
  }

  if (booksTable) {
    booksTable.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const id = e.target.dataset.id;
        if (confirm("Точно видалити книгу?")) {
          api.deleteBook(id, (response) => {
            applyFilters();
          });
        }
      }
    });
  }

  const editBookForm = document.getElementById("editBookForm");
  const checkoutBtn = document.getElementById("checkout-btn");
  const returnBtn = document.getElementById("return-btn");

  const modal = document.getElementById("modal");
  const modalCancelBtn = document.getElementById("modal-cancel-btn");
  const modalSubmitBtn = document.getElementById("modal-submit-btn");

  if (editBookForm) {
    editBookForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const id = e.target.dataset.id;
      const data = {
        title: document.getElementById("title").value,
        author: document.getElementById("author").value,
        year: document.getElementById("year").value,
      };

      api.updateBook(id, data, (updatedBook) => {
        alert("Зміни збережено");
        window.location.reload();
      });
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      modal.style.display = "block";
    });
  }

  if (modalCancelBtn) {
    modalCancelBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  if (modalSubmitBtn) {
    modalSubmitBtn.addEventListener("click", () => {
      const id = checkoutBtn.dataset.id;
      const data = {
        readerName: document.getElementById("readerName").value,
        returnDate: document.getElementById("returnDate").value,
      };

      if (!data.readerName || !data.returnDate) {
        alert("Введіть ім'я та дату повернення");
        return;
      }

      api.checkoutBook(id, data, (updatedBook) => {
        window.location.reload();
      });
    });
  }

  if (returnBtn) {
    returnBtn.addEventListener("click", (e) => {
      const id = e.target.dataset.id;
      if (confirm("Повернути книгу в бібліотеку?")) {
        api.returnBook(id, (updatedBook) => {
          window.location.reload();
        });
      }
    });
  }
});
