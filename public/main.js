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
            ul.innerHTML += `<li class="m-status">"${message}"</li>`;
            break;
        case "message":
            ul.innerHTML += `<li class="m-txt"><span>${user}</span>"${message}"</li>`;
            break;
    }
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
