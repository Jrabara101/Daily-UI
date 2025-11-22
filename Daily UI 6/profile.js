// Avatar upload preview
document.getElementById('avatar-upload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (evt) {
    document.getElementById('profile-img').src = evt.target.result;
    document.querySelectorAll('.post-avatar').forEach(img => img.src = evt.target.result);
  };
  reader.readAsDataURL(file);
});

// Edit Profile Modal
function showEditForm() {
  document.getElementById('edit-modal').style.display = "flex";
  document.getElementById('edit-name').value = document.querySelector('.profile-name').textContent;
  document.getElementById('edit-bio').value = document.getElementById('profile-bio').textContent;
}
function hideEditForm() {
  document.getElementById('edit-modal').style.display = "none";
}
document.getElementById('edit-profile-form').addEventListener('submit', function(e) {
  e.preventDefault();
  document.querySelector('.profile-name').textContent = document.getElementById('edit-name').value;
  document.getElementById('profile-bio').textContent = document.getElementById('edit-bio').value;
  hideEditForm();
});

// Dark mode toggle
document.getElementById('dark-toggle').addEventListener('click', function() {
  document.body.classList.toggle('dark');
});

// Timeline new post
document.getElementById('new-post-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('new-post-input');
  const text = input.value.trim();
  if (!text) return;
  const postsList = document.getElementById('posts-list');
  const post = document.createElement('div');
  post.className = "post";
  post.innerHTML = `
    <div class="post-header">
      <img src="${document.getElementById('profile-img').src}" class="post-avatar">
      <span class="post-author">${document.querySelector('.profile-name').textContent}</span>
      <span class="post-date">Now</span>
    </div>
    <div class="post-content">${text}</div>
  `;
  postsList.insertBefore(post, postsList.firstChild);
  input.value = "";
});
