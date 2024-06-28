// Define necessary variables
let userAuthToken = null;
let userId = null;

// Add event listener to the login button
document.getElementById('login-button').addEventListener('click', loginUser);

// Function to login the user
function loginUser() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('https://json-with-auth.onrender.com/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            userAuthToken = data.token;
            userId = data.userId;
            localStorage.setItem('localAccessToken', userAuthToken);
            localStorage.setItem('userId', userId);

            displayWelcomeMessage(username);
        } else {
            alert('Login failed!');
        }
    })
    .catch(error => console.error('Error:', error));
}

// Function to display welcome message
function displayWelcomeMessage(username) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('welcome-section').style.display = 'block';
    document.getElementById('welcome-message').textContent = `Hey ${username}, welcome back!`;

    document.getElementById('fetch-todos-button').addEventListener('click', fetchTodos);
}

// Function to fetch todos
function fetchTodos() {
    fetch(`https://json-with-auth.onrender.com/todos?userId=${userId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${userAuthToken}`
        }
    })
    .then(response => response.json())
    .then(todos => displayTodos(todos))
    .catch(error => console.error('Error:', error));
}

// Function to display todos
function displayTodos(todos) {
    const todoList = document.getElementById('todo-list');
    todoList.innerHTML = ''; // Clear the current list

    todos.forEach(todo => {
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodoCompletion(todo.id, checkbox.checked));

        listItem.textContent = todo.title;
        listItem.prepend(checkbox);
        todoList.appendChild(listItem);
    });
}

// Function to toggle todo completion status
function toggleTodoCompletion(todoId, completed) {
    fetch(`https://json-with-auth.onrender.com/todos/${todoId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userAuthToken}`
        },
        body: JSON.stringify({ completed })
    })
    .then(response => response.json())
    .then(data => console.log('Todo updated:', data))
    .catch(error => console.error('Error:', error));
}
