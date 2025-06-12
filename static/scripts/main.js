const newUserBtn = document.getElementById("newUserBtn");
const registrationModal = document.getElementById("registrationModal");
const closeBtn = document.querySelector(".close-btn");
const registrationForm = document.getElementById("registrationForm");
const roleSelect = document.getElementById("role");
const otherRoleGroup = document.getElementById("otherRoleGroup");
const otherRoleInput = document.getElementById("otherRole");
const profilesContainer = document.getElementById("profilesContainer");
const filterButtons = document.querySelectorAll(".filter-btn");

let profiles = [];

// Event Listeners
newUserBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", outsideClick);
registrationForm.addEventListener("submit", handleFormSubmit);
roleSelect.addEventListener("change", handleRoleChange);
filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterProfiles(button.dataset.filter));
});

// Init app
function init() {
  fetchProfilesFromBackend();
}

// Fetch from backend
async function fetchProfilesFromBackend() {
  try {
    const res = await fetch("http://127.0.0.1:5000/profiles");
    const data = await res.json();
    profiles = data.profiles || [];
    renderProfiles();
  } catch (err) {
    console.error("Error fetching profiles:", err);
    showNotification("Error loading profiles.");
  }
}

// Handle form submit
async function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const photo = document.getElementById("photo").value;
  const portfolio = document.getElementById("portfolio").value;
  const skills = document
    .getElementById("skills")
    .value.split(",")
    .map((skill) => skill.trim());

  let role = roleSelect.value;
  if (role === "Other") {
    role = otherRoleInput.value;
  }

  const profile = {
    name,
    phone,
    email,
    photo,
    portfolio,
    skills,
    role,
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/verify-and-add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    });

    const result = await response.json();

    if (response.ok) {
      showNotification("✔ Profile verified and added!");
      fetchProfilesFromBackend(); // reload profiles
    } else {
      showNotification(
        `✖ Verification failed: ${result.reason || "Try again"}`
      );
    }

    closeModal();
  } catch (err) {
    showNotification("✖ Network error. Try again.");
    console.error(err);
  }
}

// Other UI functions below...

function openModal() {
  registrationModal.style.display = "block";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  registrationModal.style.display = "none";
  registrationForm.reset();
  otherRoleGroup.classList.add("hidden");
  document.body.style.overflow = "";
}

function outsideClick(e) {
  if (e.target === registrationModal) {
    closeModal();
  }
}

function handleRoleChange() {
  if (roleSelect.value === "Other") {
    otherRoleGroup.classList.remove("hidden");
    otherRoleInput.setAttribute("required", true);
  } else {
    otherRoleGroup.classList.add("hidden");
    otherRoleInput.removeAttribute("required");
  }
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.style.position = "fixed";
  notification.style.bottom = "20px";
  notification.style.right = "20px";
  notification.style.backgroundColor = "#4caf50";
  notification.style.color = "white";
  notification.style.padding = "1rem 2rem";
  notification.style.borderRadius = "4px";
  notification.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
  notification.style.zIndex = "1000";
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}

function renderProfiles(filter = "all") {
  profilesContainer.innerHTML = "";

  let filteredProfiles = profiles;
  if (filter !== "all") {
    if (filter === "other") {
      const standardRoles = [
        "Full Stack Developer",
        "Cloud Engineer",
        "UI/UX Developer",
      ];
      filteredProfiles = profiles.filter(
        (profile) => !standardRoles.includes(profile.role)
      );
    } else {
      filteredProfiles = profiles.filter((profile) => profile.role === filter);
    }
  }

  if (filteredProfiles.length === 0) {
    profilesContainer.innerHTML = `
      <div class="empty-state">
        <h3>No profiles found</h3>
        <p>Be the first to add your profile or try a different filter.</p>
      </div>
    `;
    return;
  }

  filteredProfiles.forEach((profile) => {
    const profileCard = document.createElement("div");
    profileCard.className = "profile-card";

    profileCard.innerHTML = `
      <img src="${profile.photo}" alt="${profile.name}" class="profile-image">
      <div class="profile-info">
        <h3 class="profile-name">${profile.name}</h3>
        <span class="profile-role">${profile.role}</span>
        <div class="profile-skills">
          ${profile.skills
            .map((skill) => `<span class="skill-tag">${skill}</span>`)
            .join("")}
        </div>
        <div class="profile-contact">
          <a href="mailto:${profile.email}" class="contact-btn">Email</a>
          <a href="tel:${profile.phone}" class="contact-btn">Call</a>
          <a href="${
            profile.portfolio
          }" target="_blank" class="contact-btn portfolio-btn">Portfolio</a>
        </div>
      </div>
    `;

    profilesContainer.appendChild(profileCard);
  });
}

function filterProfiles(filter) {
  filterButtons.forEach((button) => {
    if (button.dataset.filter === filter) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  renderProfiles(filter);
}

init();
