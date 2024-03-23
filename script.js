  const bookShelf = [];
  const RENDER_EVENT = 'render-todo';
  const SAVED_EVENT = 'saved-todo';
  const STORAGE_KEY = 'TODO_APPS';

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        bookShelf.push(book);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
  
function addTodo() {
      const title = document.getElementById('inputBookTitle').value;
      const author = document.getElementById('inputBookAuthor').value;
      const year = parseInt(document.getElementById('inputBookYear').value);
      const isCompleted = document.getElementById('inputBookIsComplete').checked;
     
      const generatedID = generateId();
      const bookObject = generateBookObject(generatedID, title, author, year, isCompleted);
      bookShelf.push(bookObject);

      if (isCompleted) {
        addTaskToCompleted(generatedID); // Jika buku telah dibaca, tambahkan langsung ke daftar buku yang telah selesai dibaca
      }
     
      document.dispatchEvent(new Event(RENDER_EVENT));

      saveData();
  }

  function makeTodo(bookObject) {
      const container = document.createElement('article');
      container.classList.add('book_item');
      
      const textTitle = document.createElement('h3');
      textTitle.innerText = bookObject.title;

      const textAuthor = document.createElement('p');
      textAuthor.innerText = 'Penulis: ' + bookObject.author;
     
      const textyear = document.createElement('p');
      textyear.innerText = 'Tahun: ' + bookObject.year;
     
      const actionDiv = document.createElement('div');
      actionDiv.classList.add('action');
      
      if (bookObject.isCompleted) {
        const completeButton = document.createElement('button');
        completeButton.innerText = 'Belum dibaca';
        completeButton.classList.add('green');
        completeButton.addEventListener('click', function () {
          undoTaskFromCompleted(bookObject.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Hapus buku';
        deleteButton.classList.add('red');
        deleteButton.addEventListener('click', function () {
          removeTaskFromCompleted(bookObject.id);
        });

        actionDiv.appendChild(completeButton);
        actionDiv.appendChild(deleteButton);
        
        container.appendChild(textTitle);
        container.appendChild(textAuthor);
        container.appendChild(textyear);
        container.appendChild(actionDiv);
      } else {
        const completeButton = document.createElement('button');
        completeButton.innerText = 'Selesai dibaca';
        completeButton.classList.add('green');
        completeButton.addEventListener('click', function () {
          addTaskToCompleted(bookObject.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Hapus buku';
        deleteButton.classList.add('red');
        deleteButton.addEventListener('click', function () {
          removeTaskFromCompleted(bookObject.id);
        });

        actionDiv.appendChild(completeButton);
        actionDiv.appendChild(deleteButton);
        
        container.appendChild(textTitle);
        container.appendChild(textAuthor);
        container.appendChild(textyear);
        container.appendChild(actionDiv);
      }
      
      return container;
  }

  function addTaskToCompleted (bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBook(bookId) {
    for (const bookItem of bookShelf) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

  function removeTaskFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
   
    if (bookTarget === -1) return;
   
    bookShelf.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function undoTaskFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findBookIndex(bookId) {
    for (const index in bookShelf){
      if (bookShelf[index].id === bookId) {
        return index;
      }
    }
   
    return -1;
  }

  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(bookShelf);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }
  
  function isStorageExist(){
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

  function generateId() {
      return Date.now();
  }

  function generateBookObject(id, title, author, year, isCompleted) {
      return {
          id,
          title,
          author,
          year,
          isCompleted
      };
  }
 
document.addEventListener('DOMContentLoaded', function () {
  const submitForm = document.getElementById('inputBook');
  const searchForm = document.getElementById('searchBook');
  
  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addTodo();
  });
  
  searchForm.addEventListener('submit', function (event) {
    event.preventDefault(); 

    const searchTitle = document.getElementById('searchBookTitle').value;

    searchBookByTitle(searchTitle);
  });
  
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  document.addEventListener(RENDER_EVENT, function () {
      const uncompletedBookList = document.getElementById('incompleteBookshelfList');
      uncompletedBookList.innerHTML = '';

      const completedBookList = document.getElementById('completeBookshelfList');
      completedBookList.innerHTML = '';
      
      for (const bookItem of bookShelf) {
          const bookElement = makeTodo(bookItem);
          if (!bookItem.isCompleted)
            uncompletedBookList.append(bookElement);
          else
            completedBookList.append(bookElement);
          }
  });
  
   function searchBookByTitle(title) {
  const searchResult = bookShelf.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  // Tampilkan hasil pencarian ke dalam daftar buku yang sesuai
  renderSearchResult(searchResult);
}

function renderSearchResult(results) {
  const searchResultContainer = document.getElementById('searchResultList');
  searchResultContainer.innerHTML = ''; // Kosongkan kontainer pencarian sebelum menampilkan hasil

  if (results.length === 0) {
    const noResultMessage = document.createElement('p');
    noResultMessage.textContent = 'Tidak ada hasil yang ditemukan';
    searchResultContainer.appendChild(noResultMessage);
  } else {
    results.forEach(book => {
      const bookElement = makeTodo(book);
      searchResultContainer.appendChild(bookElement);
    });
  }
}

