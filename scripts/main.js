// DOM Elements
const newUserBtn = document.getElementById("newUserBtn");
const registrationModal = document.getElementById("registrationModal");
const closeBtn = document.querySelector(".close-btn");
const registrationForm = document.getElementById("registrationForm");
const roleSelect = document.getElementById("role");
const otherRoleGroup = document.getElementById("otherRoleGroup");
const otherRoleInput = document.getElementById("otherRole");
const profilesContainer = document.getElementById("profilesContainer");
const filterButtons = document.querySelectorAll(".filter-btn");

// Sample data for initial profiles
let profiles = [
  {
    name: "Jane Doe",
    phone: "+1 (555) 123-4567",
    email: "jane.doe@example.com",
    photo: "https://randomuser.me/api/portraits/women/1.jpg",
    portfolio: "https://janedoe.portfolio.dev",
    skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
    role: "Full Stack Developer",
  },
  {
    name: "John Smith",
    phone: "+1 (555) 987-6543",
    email: "john.smith@example.com",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
    portfolio: "https://johnsmith.cloud",
    skills: ["AWS", "Azure", "Docker", "Kubernetes", "Terraform"],
    role: "Cloud Engineer",
  },
  {
    name: "Emily Chen",
    phone: "+1 (555) 456-7890",
    email: "emily.chen@example.com",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    portfolio: "https://emilychen.design",
    skills: ["Figma", "Adobe XD", "Sketch", "UI Design", "User Research"],
    role: "UI/UX Developer",
  },
];

// Check if profiles exist in localStorage
const storedProfiles = localStorage.getItem("portfolioProfiles");
if (storedProfiles) {
  profiles = JSON.parse(storedProfiles);
}

// Event Listeners
newUserBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", outsideClick);
registrationForm.addEventListener("submit", handleFormSubmit);
roleSelect.addEventListener("change", handleRoleChange);
filterButtons.forEach((button) => {
  button.addEventListener("click", () => filterProfiles(button.dataset.filter));
});

// Initialize the app
function init() {
  renderProfiles();
}

// Open the registration modal
function openModal() {
  registrationModal.style.display = "block";
  document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
}

// Close the registration modal
function closeModal() {
  registrationModal.style.display = "none";
  registrationForm.reset();
  otherRoleGroup.classList.add("hidden");
  document.body.style.overflow = ""; // Re-enable scrolling
}

// Close modal if clicked outside
function outsideClick(e) {
  if (e.target === registrationModal) {
    closeModal();
  }
}

// Handle role selection change
function handleRoleChange() {
  if (roleSelect.value === "Other") {
    otherRoleGroup.classList.remove("hidden");
    otherRoleInput.setAttribute("required", true);
  } else {
    otherRoleGroup.classList.add("hidden");
    otherRoleInput.removeAttribute("required");
  }
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();

  // Get form values
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const photo = document.getElementById("photo").value;
  const portfolio = document.getElementById("portfolio").value;
  const skills = document
    .getElementById("skills")
    .value.split(",")
    .map((skill) => skill.trim());

  // Determine role
  let role = roleSelect.value;
  if (role === "Other") {
    role = otherRoleInput.value;
  }

  // Create new profile
  const newProfile = {
    name,
    phone,
    email,
    photo,
    portfolio,
    skills,
    role,
  };

  // Add to profiles array
  profiles.push(newProfile);

  // Save to localStorage
  localStorage.setItem("portfolioProfiles", JSON.stringify(profiles));

  // Render profiles
  renderProfiles();

  // Close modal
  closeModal();

  // Show success message
  showNotification("Profile added successfully!");
}

// Show notification
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

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.5s ease";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 3000);
}

// Render profiles
function renderProfiles(filter = "all") {
  profilesContainer.innerHTML = "";

  // Filter profiles
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

  // Check if there are no profiles
  if (filteredProfiles.length === 0) {
    profilesContainer.innerHTML = `
      <div class="empty-state">
        <h3>No profiles found</h3>
        <p>Be the first to add your profile or try a different filter.</p>
      </div>
    `;
    return;
  }

  // Render each profile
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

// Filter profiles
function filterProfiles(filter) {
  // Update active button
  filterButtons.forEach((button) => {
    if (button.dataset.filter === filter) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  // Render filtered profiles
  renderProfiles(filter);
}

// Initialize the app
init();
