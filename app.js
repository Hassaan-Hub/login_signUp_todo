// ---------- ARRAYS (database) ----------
let users = [];
let posts = [];
let currentUser = null;

// ---------- DOM ELEMENTS ----------
const authSection = document.getElementById("authSection");
const postSection = document.getElementById("postSection");
const postsDiv = document.getElementById("posts");
const userInfo = document.getElementById("userInfo");
const userAvatar = document.getElementById("userAvatar");
const userName = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");
const toast = document.getElementById("toast");

// ---------- TOAST NOTIFICATION ----------
function showToast(msg, color = "#6c63ff") {
  toast.innerText = msg;
  toast.style.background = color;
  toast.className = "show";
  setTimeout(() => { toast.className = toast.className.replace("show", ""); }, 2000);
}

// ---------- PASSWORD TOGGLE ----------
function togglePassword(id) {
  const input = document.getElementById(id);
  input.type = input.type === "password" ? "text" : "password";
}

// ---------- SIGNUP ----------
function signup() {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const pass = document.getElementById("pass");

  if (!name.value.trim() || !email.value.trim() || !pass.value.trim()) {
    showToast("Please fill all fields", "#ff5858");
    return;
  }
  if (!validateEmail(email.value.trim())) {
    showToast("Invalid email format", "#ff5858");
    return;
  }
  if (pass.value.length < 6) {
    showToast("Password must be at least 6 characters", "#ff5858");
    return;
  }
  let existingUser = users.find(u => u.email === email.value.trim());
  if (existingUser) {
    showToast("Email already registered", "#ff5858");
    return;
  }
  users.push({
    name: name.value.trim(),
    email: email.value.trim(),
    password: pass.value
  });
  showToast("Signup success! Please login.", "#43e97b");
  name.value = "";
  email.value = "";
  pass.value = "";
}

// ---------- LOGIN ----------
function login() {
  const lEmail = document.getElementById("lEmail");
  const lPass = document.getElementById("lPass");
  let user = users.find(s =>
    s.email === lEmail.value.trim() && s.password === lPass.value
  );
  if (user) {
    currentUser = user;
    authSection.style.display = "none";
    postSection.style.display = "block";
    userInfo.style.display = "flex";
    userAvatar.innerText = getInitials(user.name);
    userName.innerText = user.name;
    showToast("Login success!", "#43e97b");
    showPosts();
  } else {
    showToast("Wrong email or password", "#ff5858");
  }
  lEmail.value = "";
  lPass.value = "";
}

// ---------- LOGOUT ----------
logoutBtn.onclick = function () {
  currentUser = null;
  authSection.style.display = "flex";
  postSection.style.display = "none";
  userInfo.style.display = "none";
  showToast("Logged out", "#6c63ff");
};

// ---------- EMAIL VALIDATION ----------
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ---------- GET INITIALS ----------
function getInitials(name) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

// ---------- GET DATETIME ----------
function getDateTime() {
  let now = new Date();
  let day = String(now.getDate()).padStart(2, '0');
  let month = String(now.getMonth() + 1).padStart(2, '0');
  let year = now.getFullYear();
  let hours = now.getHours();
  let minutes = String(now.getMinutes()).padStart(2, '0');
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day}-${month}-${year} ${hours}:${minutes} ${ampm}`;
}

// ---------- ADD POST ----------
function addPost() {
  const postInput = document.getElementById("postInput");
  if (!currentUser) {
    showToast("Please login first", "#ff5858");
    return;
  }
  if (postInput.value.trim() === "") {
    showToast("Write something first", "#ff5858");
    return;
  }
  posts.unshift({
    id: Date.now() + Math.random().toString(36).slice(2),
    text: postInput.value.trim(),
    date: getDateTime(),
    user: currentUser
  });
  postInput.value = "";
  showPosts();
  showToast("Post added!", "#43e97b");
}

// ---------- SHOW POSTS ----------
function showPosts() {
  postsDiv.innerHTML = "";
  if (posts.length === 0) {
    postsDiv.innerHTML = `<div style="text-align:center;color:#bfc9d1;">No posts yet.</div>`;
    return;
  }
  posts.forEach((p, idx) => {
    let box = document.createElement("div");
    box.className = "post-card";

    // Header
    let header = document.createElement("div");
    header.className = "post-header";
    let avatar = document.createElement("span");
    avatar.className = "post-avatar";
    avatar.innerText = getInitials(p.user.name);
    let meta = document.createElement("span");
    meta.className = "post-meta";
    meta.innerText = `${p.user.name} • ${p.date}`;
    header.appendChild(avatar);
    header.appendChild(meta);

    // Text
    let text = document.createElement("div");
    text.className = "post-text";
    text.innerText = p.text;

    // Actions
    let actions = document.createElement("div");
    actions.className = "post-actions";

    // Delete
    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";
    delBtn.onclick = function () {
      if (p.user.email !== currentUser.email) {
        showToast("You can only delete your own posts", "#ff5858");
        return;
      }
      if (confirm("Delete this post?")) {
        posts = posts.filter(x => x.id !== p.id);
        showPosts();
        showToast("Post deleted", "#ff5858");
      }
    };

    // Edit
    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.onclick = function () {
      if (p.user.email !== currentUser.email) {
        showToast("You can only edit your own posts", "#ff5858");
        return;
      }
      let editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = p.text;
      editInput.className = "edit-input";
      let saveBtn = document.createElement("button");
      saveBtn.innerText = "Save";
      saveBtn.onclick = function () {
        if (editInput.value.trim() === "") {
          showToast("Post cannot be empty", "#ff5858");
          return;
        }
        p.text = editInput.value.trim();
        p.date = getDateTime();
        showPosts();
        showToast("Post updated!", "#43e97b");
      };
      let cancelBtn = document.createElement("button");
      cancelBtn.innerText = "Cancel";
      cancelBtn.onclick = showPosts;
      // Replace text with edit field
      box.replaceChild(editInput, text);
      actions.innerHTML = "";
      actions.appendChild(saveBtn);
      actions.appendChild(cancelBtn);
    };

    actions.appendChild(delBtn);
    actions.appendChild(editBtn);

    box.appendChild(header);
    box.appendChild(text);
    box.appendChild(actions);

    postsDiv.appendChild(box);
  });
}

// ---------- CLEAR ALL POSTS ----------
function clearAllPosts() {
  if (!currentUser) {
    showToast("Please login first", "#ff5858");
    return;
  }
  if (posts.length === 0) {
    showToast("No posts to clear", "#ff5858");
    return;
  }
  if (confirm("Are you sure you want to delete all posts?")) {
    posts = [];
    showPosts();
    showToast("All posts cleared", "#ff5858");
  }
}

// ---------- INITIAL STATE ----------
authSection.style.display = "flex";
postSection.style.display = "none";
userInfo.style.display = "none";
showPosts();
