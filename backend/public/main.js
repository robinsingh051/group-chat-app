const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const userList = document.getElementById("users");
const groupList = document.getElementById("groups");
const addGroupBtn = document.getElementById("add-group");
const addUserBtn = document.getElementById("add-user");
const logoutbtn = document.getElementById("logoutbtn");
const localStorageKey = "chatMessages";
const socket = io("http://localhost:5000");
socket.on("data", (data) => {
  console.log(data);
});

let groupId = -1;

//retrieving token from local storage
const token = localStorage.getItem("token");
//user not logged in
if (!token) {
  window.location.href = "login.html";
}
// console.log(token);
axios.defaults.headers.common["Authorization"] = `${token}`;

logoutbtn.addEventListener("click", logout);
addGroupBtn.addEventListener("click", addGroup);
addUserBtn.addEventListener("click", addUser);

async function fetchGroupList() {
  try {
    const groups = await axios.get("http://localhost:4000/groups/all");
    //console.log("groups", groups.data);
    for (let i = 0; i < groups.data.length; i++) {
      outputGroups(groups.data[i]);
    }
  } catch (err) {
    console.log(err);
  }
}

// Load messages from local storage when the page is refreshed
window.addEventListener("load", fetchGroupList);

//message submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (groupId !== -1) {
    const msg = e.target.elements.msg.value;
    //console.log(msg);

    const response = await axios.post(
      `http://localhost:4000/groups/${groupId}/msgs`,
      {
        msg: msg,
      }
    );
    //console.log(response.data);
    //outputMessage(response.data.msg);

    //clear input
    e.target.elements.msg.value = "";
    e.target.elements.msg.focus();
    getMessages();
  } else {
    alert("Please select the group first");
  }
});

//output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");

  // Extract the file extension from the URL
  const fileExtension = message.msg.split(".").pop().toLowerCase();
  const isImage = ["jpg", "jpeg", "png", "gif"].includes(fileExtension);
  const isAudio = ["mp3", "wav", "ogg"].includes(fileExtension);
  const isVideo = ["mp4", "webm"].includes(fileExtension);

  if (isImage) {
    // If it's an image, create an image element
    const img = document.createElement("img");
    img.src = message.msg;
    img.style.maxHeight = "200px";
    img.style.maxWidth = "200px";
    div.appendChild(img);

    // Create a download link for the image
    const downloadLink = document.createElement("a");
    downloadLink.href = message.msg;
    downloadLink.download = `image.${fileExtension}`;
    downloadLink.textContent = "Download Image";
    div.appendChild(downloadLink);
  } else if (isAudio) {
    // If it's audio, create an audio element
    const audio = document.createElement("audio");
    audio.controls = true;
    audio.src = message.msg;
    div.appendChild(audio);

    // Create a download link for the audio
    const downloadLink = document.createElement("a");
    downloadLink.href = message.msg;
    downloadLink.download = `audio.${fileExtension}`;
    downloadLink.textContent = "Download Audio";
    div.appendChild(downloadLink);
  } else if (isVideo) {
    // If it's a video, create a video element
    const video = document.createElement("video");
    video.controls = true;
    video.src = message.msg;
    video.style.maxHeight = "200px";
    video.style.maxWidth = "200px";
    div.appendChild(video);

    // Create a download link for the video
    const downloadLink = document.createElement("a");
    downloadLink.href = message.msg;
    downloadLink.download = `video.${fileExtension}`;
    downloadLink.textContent = "Download Video";
    div.appendChild(downloadLink);
  } else {
    // If it's not a recognized media type, display it as a text message
    div.innerHTML = `<p class="meta">${message.name} <span>${message.createdAt}</span></p>
      <p class="text">
          ${message.msg}
      </p>`;
  }

  chatMessages.appendChild(div);
}

//Add users to dom
function outputUsersFromGroup(userData) {
  //console.log(userData);
  const user = document.createElement("li");
  if (userData.UserGroups[0].isadmin === true) {
    user.innerHTML = `<li id='${userData.id}'>${userData.name} (Admin)</li><i class="fas fa-minus" id="${userData.id}"></i>`;
  } else {
    user.innerHTML = `<li id='${userData.id}'>${userData.name}</li><i class="fas fa-minus" id="${userData.id}"></i>`;
  }
  var iElement = user.getElementsByTagName("i");
  var liElement = user.getElementsByTagName("li");
  //console.log(iElement[0]);
  iElement[0].addEventListener("click", removeUser);
  liElement[0].addEventListener("click", makeadmin);
  userList.appendChild(user);
}

// after adding user to group
function outputUsers(userData) {
  console.log(userData);
  const user = document.createElement("li");
  user.innerHTML = `<li id='${userData.id}'>${userData.name}</li><i class="fas fa-minus" id="${userData.id}"></i>`;
  var iElement = user.getElementsByTagName("i");
  var liElement = user.getElementsByTagName("li");
  console.log(iElement[0]);
  iElement[0].addEventListener("click", removeUser);
  liElement[0].addEventListener("click", makeadmin);
  userList.appendChild(user);
}

function outputGroups(groupData) {
  const group = document.createElement("li");
  group.innerHTML = `<li id='${groupData.UserGroups[0].groupId}'>${groupData.name}</li>`;
  group.addEventListener("click", loadUserForGroup);
  groupList.appendChild(group);
}

function outputGroup(groupData) {
  const group = document.createElement("li");
  group.innerHTML = `<li id='${groupData.id}'>${groupData.name}</li>`;
  group.addEventListener("click", loadUserForGroup);
  groupList.appendChild(group);
}

// add group
async function addGroup() {
  const groupname = prompt("Please enter the name of group:");
  if (groupname !== null) {
    const newGroup = await axios.post(`http://localhost:4000/groups/addgroup`, {
      groupname: groupname,
    });
    console.log(newGroup.data);
    outputGroup(newGroup.data);
  } else {
    console.log("User canceled the input");
  }
}

// add user to group
async function addUser() {
  if (groupId !== -1) {
    const userEmail = prompt("Please enter the email id of user:");
    if (userEmail !== null) {
      try {
        const newUser = await axios.post(
          `http://localhost:4000/groups/${groupId}/user`,
          {
            userEmail: userEmail,
          }
        );
        alert("User added successfully");
        outputUsers(newUser.data.user);
      } catch (err) {
        alert("user does not exists");
      }
    } else {
      console.log("User canceled the input");
    }
  } else {
    alert("please select the group first");
  }
}

const loadUserForGroup = async (e) => {
  localStorage.removeItem(localStorageKey);
  chatMessages.innerHTML = "";
  userList.innerHTML = "";
  if (groupId !== -1)
    document.getElementById(groupId).classList.remove("selected");
  groupId = e.target.id;
  e.target.classList.add("selected");
  try {
    const users = await axios.get(
      `http://localhost:4000/groups/${groupId}/users`
    );
    for (let i = 0; i < users.data.length; i++)
      outputUsersFromGroup(users.data[i]);
  } catch (err) {
    console.log(err);
  }
  getMessages();
};

//logout function
function logout() {
  axios.defaults.headers.common["Authorization"] = `${token}`;
  localStorage.removeItem("token");
  alert("You are logged out successfully");
  window.location.href = "login.html";
}

async function removeUser(e) {
  const confirmation = confirm("Are you sure to remove the selected user");
  if (confirmation) {
    try {
      const result = await axios.delete(
        `http://localhost:4000/groups/${groupId}/user`,
        {
          params: {
            userId: e.target.id,
          },
        }
      );
      if (result.status === 200) e.target.parentNode.remove();
    } catch (err) {
      if (err.response && err.response.status === 406) {
        alert("You can not remove yourself");
      } else if (err.response && err.response.status === 405) {
        alert("You are not an admin");
      } else {
        console.error("An error occurred:", err);
      }
    }
  }
}

async function makeadmin(e) {
  const confirmation = confirm("Are you sure to make the selected user Admin");
  if (confirmation) {
    try {
      const result = await axios.patch(
        `http://localhost:4000/groups/${groupId}/makeadmin`,
        {
          userId: e.target.id,
        }
      );
      if (result.status === 200) {
        userList.innerHTML = "";
        for (let i = 0; i < result.data.length; i++)
          outputUsersFromGroup(result.data[i]);
      }
    } catch (err) {
      if (err.response && err.response.status === 406) {
        alert("You can not remove yourself");
      } else if (err.response && err.response.status === 405) {
        alert("You are not an admin");
      } else {
        console.error("An error occurred:", err);
      }
    }
  }
}

async function getMessages() {
  if (groupId !== -1) {
    socket.emit("getMessages", groupId);
    socket.on("messages", (messages) => {
      chatMessages.innerHTML = "";
      messages.forEach((message) => {
        outputMessage(message);
      });
    });
  }
}

const fileInput = document.getElementById("fileInput");

// Trigger file input when the anchor tag is clicked
document.querySelector(".attach").addEventListener("click", () => {
  if (groupId !== -1) {
    fileInput.click();
  } else {
    alert("please select the group first");
  }
});

// Handle selected files and send them to the server
fileInput.addEventListener("change", async () => {
  const files = fileInput.files;

  // Check if files were selected
  if (files.length > 0) {
    const formData = new FormData();

    formData.append("media", files[0]);
    try {
      const response = await axios.post(
        `http://localhost:4000/groups/${groupId}/media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type explicitly for FormData
          },
        }
      );

      // Handle the response as needed
      console.log(response.data);
      getMessages();
    } catch (error) {
      // Handle errors
      console.error("Error uploading file:", error);
    }
  }
});
