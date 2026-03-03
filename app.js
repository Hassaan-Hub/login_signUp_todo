// ---------- ARRAYS (database) ----------
let users = JSON.parse(localStorage.getItem("users")) || [];
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let currentUser = null;


// ---------- SIGNUP ----------
function signup(){  
  users.push({
    name: name.value,
    email: email.value,
    password: pass.value
  });

  localStorage.setItem("users", JSON.stringify(users)); // SAVE USERS

  alert("Signup success");
}


// ---------- LOGIN ----------
function login(){
  let user = users.find(s => 
    s.email === lEmail.value && s.password === lPass.value
  );

  if(user){
    currentUser = user;
    postSection.style.display = "block";
    alert("Login success");
    showPosts();
  }else{
    alert("Wrong email or password");
  }
}


// ---------- DATE TIME FUNCTION ----------
function getDateTime(){

  let now = new Date();

  let day = String(now.getDate()).padStart(2,'0');
  let month = String(now.getMonth()+1).padStart(2,'0');
  let year = now.getFullYear();

  let hours = now.getHours();
  let minutes = String(now.getMinutes()).padStart(2,'0');

  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return `${day}-${month}-${year} TIME ${hours}:${minutes} ${ampm}`;
}


// ---------- ADD POST ----------
function addPost(){
  posts.push({
    id: getDateTime(),   // tumhara same logic
    text: postInput.value
  });

  localStorage.setItem("posts", JSON.stringify(posts)); // SAVE POSTS

  postInput.value = "";
  showPosts();
}


// ---------- SHOW POSTS ----------
function showPosts(){

  let postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";

  posts.forEach(p => {

    // container
    let box = document.createElement("div");

    // post DATETIME
    let id = document.createElement("p");
    id.innerText = p.id;
    
    // post TEXT
    let text = document.createElement("p");
    text.innerText = p.text;

    // delete button
    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";

    delBtn.onclick = function(){
      posts = posts.filter(x => x.id !== p.id);

      localStorage.setItem("posts", JSON.stringify(posts)); // SAVE AFTER DELETE

      showPosts();
    }

    // edit button
    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";

    editBtn.onclick = function(){
      let newText = prompt("Edit post:");
      if(newText){
        p.text = newText;

        localStorage.setItem("posts", JSON.stringify(posts)); // SAVE AFTER EDIT

        showPosts();
      }
    }

    // append
    box.appendChild(id);
    box.appendChild(text);
    box.appendChild(delBtn);
    box.appendChild(editBtn);

    postsDiv.appendChild(box);
  });
}