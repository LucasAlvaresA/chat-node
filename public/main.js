const socket = io();
let username = "";
let userList = [];

let loginPage = document.querySelector("#loginPage");
let chatPage = document.querySelector("#chatPage");

let loginInput = document.querySelector("#loginNameInput");
let textInput = document.querySelector("#chatTextInput");

loginPage.style.display = "flex";
chatPage.style.display = "none";

function renderUserList() {
    let ul = document.querySelector(".userList");
    ul.innerHTML = "";
    userList.forEach((i) => {
        ul.innerHTML += "<li>" + i + "</li>";
    });
}

function addMessage(type, user, message) {
    let ul = document.querySelector(".chatList");
    switch (type) {
        case "status":
            ul.innerHTML += `<li class="m-status">${message}</li>`;
            break;
        case "message":
            if (username == user) {
                ul.innerHTML += `<li class="m-txt"><span class="me">${user}</span>${" "} ${message}</li>`;
            } else {
                ul.innerHTML += `<li class="m-txt"><span>${user}</span>${" "} ${message}</li>`;
            }
            break;
    }

    ul.scrollTop = ul.scrollHeight;
}

loginInput.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        let name = loginInput.value.trim();
        if (name != "") {
            username = name;
            document.title = "Chat (" + username + ")";
            socket.emit("joinRequest", username);
        }
    }
});

textInput.addEventListener("keyup", (e) => {
    if (e.keyCode === 13) {
        let text = textInput.value.trim();
        textInput.value = "";

        if (text != "") {
            addMessage("message", username, text);
            socket.emit("sendMessage", text);
        }
    }
});

socket.on("userOk", (list) => {
    loginPage.style.display = "none";
    chatPage.style.display = "flex";
    textInput.focus();

    addMessage("status", null, "Connected!");

    userList = list;
    renderUserList();
});

socket.on("listUpdate", (data) => {
    if (data.joined) {
        addMessage("status", null, data.joined + " joined the chat!");
    }
    if (data.left) {
        addMessage("status", null, data.left + " lefted the chat!");
    }
    userList = data.list;
    renderUserList();
});

socket.on("showMessage", (data) => {
    addMessage("message", data.username, data.message);
});

socket.on("disconnect", () => {
    addMessage("status", null, "You have been disconnected");
    userList = [];
    renderUserList();
});

socket.on("connect_error", () => {
    addMessage("status", null, "Trying to reconnect...");
});

socket.on("reconnect", () => {
    addMessage("status", null, "Reconnect!");
    if (username != "") {
        socket.emit("joinRequest", username);
    }
});
