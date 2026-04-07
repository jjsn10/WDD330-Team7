import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import { jwtDecode } from "jwt-decode";

const COMMENTS_KEY = "so-comments";

function getCommentsForProduct(productId) {
  const all = getLocalStorage(COMMENTS_KEY) || {};
  return all[productId] || [];
}

function saveComment(productId, comment) {
  const all = getLocalStorage(COMMENTS_KEY) || {};
  if (!all[productId]) all[productId] = [];
  all[productId].unshift(comment); // newest first
  setLocalStorage(COMMENTS_KEY, all);
}

function getCurrentUser() {
  const token = getLocalStorage("so_token");
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) return null;
    return decoded;
  } catch {
    return null;
  }
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function renderComments(productId) {
  const list = document.getElementById("comments-list");
  if (!list) return;

  const comments = getCommentsForProduct(productId);

  if (comments.length === 0) {
    list.innerHTML = '<p class="comments__empty">No comments yet. Be the first to share your thoughts!</p>';
    return;
  }

  list.innerHTML = comments
    .map(
      (c) => `
    <article class="comment-card">
      <div class="comment-card__header">
        <span class="comment-card__author">${c.author}</span>
        <span class="comment-card__date">${formatDate(c.date)}</span>
      </div>
      <p class="comment-card__body">${c.text}</p>
    </article>`
    )
    .join("");
}

function renderCommentForm(productId, user) {
  const formContainer = document.getElementById("comment-form-container");
  if (!formContainer) return;

  if (!user) {
    formContainer.innerHTML = `
      <p class="comments__login-prompt">
        <a href="/login/index.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}">Log in</a>
        to leave a comment.
      </p>`;
    return;
  }

  const displayName =
    user.name || user.email?.split("@")[0] || "Customer";

  formContainer.innerHTML = `
    <form id="comment-form" class="comment-form" novalidate>
      <p class="comment-form__greeting">Commenting as <strong>${displayName}</strong></p>
      <label for="comment-text" class="sr-only">Your comment</label>
      <textarea
        id="comment-text"
        class="comment-form__textarea"
        placeholder="Share your thoughts about this product..."
        rows="3"
        maxlength="500"
        required
      ></textarea>
      <div class="comment-form__footer">
        <span class="comment-form__char-count"><span id="char-remaining">500</span> characters remaining</span>
        <button type="submit" class="comment-form__submit">Post Comment</button>
      </div>
      <p id="comment-error" class="comment-form__error" hidden></p>
    </form>`;

  const textarea = document.getElementById("comment-text");
  const charRemaining = document.getElementById("char-remaining");

  textarea.addEventListener("input", () => {
    charRemaining.textContent = 500 - textarea.value.length;
  });

  document.getElementById("comment-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = textarea.value.trim();
    const errorEl = document.getElementById("comment-error");

    if (!text) {
      errorEl.textContent = "Please write something before posting.";
      errorEl.hidden = false;
      return;
    }

    errorEl.hidden = true;

    const comment = {
      author: displayName,
      text,
      date: new Date().toISOString(),
    };

    saveComment(productId, comment);
    textarea.value = "";
    charRemaining.textContent = "500";
    renderComments(productId);

    // scroll to the new comment
    document.getElementById("comments-list")?.scrollIntoView({ behavior: "smooth" });
  });
}

export function initComments(productId) {
  const user = getCurrentUser();
  renderCommentForm(productId, user);
  renderComments(productId);
}
