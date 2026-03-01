// ---------- ARRAYS (database) ----------
let users = [];
let posts = [];
let currentUser = null;


// ---------- SIGNUP ----------
function signup(){
  users.push({
    name: name.value,
    email: email.value,
    password: pass.value
  });
  alert("Signup success");
}


// ---------- LOGIN ----------
function login(){
  let user = users.find(findsignup => 
    findsignup.email === lEmail.value && findsignup.password === lPass.value
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
    id: getDateTime(),
    text: postInput.value
  });

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

    // post DATETIME and TEXT
    let id = document.createElement("p");
    id.innerText = p.id;
    
    let text = document.createElement("p");
    text.innerText = p.text;

    // delete button
    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";

    delBtn.onclick = function(){
      posts = posts.filter(x => x.id !== p.id);
      showPosts();
    }

    // edit button
    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";

    editBtn.onclick = function(){
      let newText = prompt("Edit post:");
      if(newText){
        p.text = newText;
        // p.id = getDateTime(); // update id to reflect change
        showPosts();
      }
    }

    // append sab box mein
    box.appendChild(id);
    box.appendChild(text);
    box.appendChild(delBtn);
    box.appendChild(editBtn);

    // screen pe lagao
    postsDiv.appendChild(box);
  });
}