const urlNow = "http://localhost:3000/posts";
const postList = document.getElementById("post-list");
const postsInfo = document.getElementById("post-detail");
const newPostForm = document.getElementById("new-post-form");
const editPostForm = document.getElementById("edit-post-form");
const cancelEditButton = document.getElementById("cancel-edit");

let currentPostId = null;

function displayPosts() {
  fetch(urlNow)
    .then((response) => response.json())
    .then((data) => {
      postList.innerHTML = "";
      data.forEach((post) => addPostToDom(post));
    });
}

function addPostToDom(post) {
  const div = document.createElement("div");

  const title = document.createElement("h4");
  title.textContent = post.title;
  title.setAttribute("data-id", post.id);

  const image = document.createElement("img");
  image.src = post.image || "";

  div.appendChild(title);
  div.appendChild(image);

  postList.appendChild(div);
}

function handlePostClick(postId) {
  fetch(`${urlNow}/${postId}`)
    .then((response) => response.json())
    .then((post) => {
      currentPostId = post.id;
      postsInfo.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.body}</p>
        <p><strong>Author:</strong> ${post.author}</p>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      `;

      document.getElementById("edit-btn").addEventListener("click", () => {
        editPostForm.classList.remove("hidden");
        document.getElementById("edit-title").value = post.title;
        document.getElementById("edit-content").value = post.body;
      });

      document.getElementById("delete-btn").addEventListener("click", () => {
        fetch(`${urlNow}/${post.id}`, {
          method: "DELETE"
        }).then(() => {
          displayPosts();
          postsInfo.innerHTML = "<p>Post deleted.</p>";
          editPostForm.classList.add("hidden");
        });
      });
    });
}

function addNewPostListener() {
  newPostForm.addEventListener("submit", function (event) {
    event.preventDefault(); 

    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const author = document.getElementById("author").value;

    const newPost = {
      title,
      body: content,
      author,
    };

    fetch(urlNow, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    })
      .then((response) => response.json())
      .then((savedPost) => {
        addPostToDom(savedPost);
        newPostForm.reset();
      });
  });
}

function addEditPostListener() {
  editPostForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const updatedTitle = document.getElementById("edit-title").value;
    const updatedContent = document.getElementById("edit-content").value;

    const updatedPost = {
      title: updatedTitle,
      body: updatedContent,
    };

    fetch(`${urlNow}/${currentPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost),
    })
      .then((response) => response.json())
      .then((post) => {
        displayPosts();
        handlePostClick(post.id);
        editPostForm.classList.add("hidden");
      });
  });

  cancelEditButton.addEventListener("click", () => {
    editPostForm.classList.add("hidden");
  });
}

postList.addEventListener("click", function (event) {
  if (event.target.tagName === "H4") {
    const postId = event.target.dataset.id;
    handlePostClick(postId);
  }
});

function main() {
  displayPosts();
  addNewPostListener();
  addEditPostListener();
}

window.addEventListener("DOMContentLoaded", main);




