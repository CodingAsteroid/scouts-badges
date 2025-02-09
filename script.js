const badges = {
  squirrels: ["Adventure Badge", "Exploration Badge", "Friendship Badge"],
  beavers: ["Creative Badge", "Outdoor Challenge", "Camp Craft"],
  cubs: ["Athlete Badge", "Hiking Badge", "Teamwork Badge"],
  scouts: ["Survival Skills", "Navigator Badge", "First Aid"],
  explorers: ["Leadership Badge", "Expedition Challenge", "Volunteer Award"],
  network: ["International Award", "Service Award", "Personal Development"]
};

const sectionSelect = document.getElementById("section");
const homeScreen = document.getElementById("homeScreen");
const badgeScreen = document.getElementById("badgeScreen");
const badgeTitle = document.getElementById("badgeTitle");
const badgeContainer = document.getElementById("badgeContainer");

sectionSelect.addEventListener("change", function() {
  const section = this.value;
  if (section) {
    // Set the badge screen title
    badgeTitle.innerText = `Badges for ${this.options[this.selectedIndex].text}`;
    
    // Build the badge boxes
    badgeContainer.innerHTML = ""; // Clear previous boxes
    badges[section].forEach(badge => {
      const badgeBox = document.createElement("div");
      badgeBox.className = "badge-box";
      badgeBox.dataset.badge = badge;
      
      // Load saved state from localStorage
      if (localStorage.getItem(badge) === "true") {
        badgeBox.classList.add("completed");
      }
      
      // Placeholder image (replace later if needed)
      const img = document.createElement("img");
      img.src = "https://via.placeholder.com/100";
      img.alt = badge;
      
      const span = document.createElement("span");
      span.className = "badge-name";
      span.innerText = badge;
      
      badgeBox.appendChild(img);
      badgeBox.appendChild(span);
      
      // Toggle the "completed" state on click
      badgeBox.addEventListener("click", function() {
        this.classList.toggle("completed");
        const isCompleted = this.classList.contains("completed");
        localStorage.setItem(badge, isCompleted);
      });
      
      badgeContainer.appendChild(badgeBox);
    });
    
    // Slide transitions:
    // Move the home screen to the left and bring in the badge screen.
    homeScreen.style.transform = "translateX(-100%)";
    badgeScreen.style.transform = "translateX(0)";
  }
});

function exportCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Badge,Completed\n";
  document.querySelectorAll(".badge-box").forEach(box => {
    const badge = box.dataset.badge;
    const completed = box.classList.contains("completed");
    csvContent += `${badge},${completed}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "badge_progress.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function importCSV(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const rows = e.target.result.split("\n").slice(1);
    rows.forEach(row => {
      const [badge, completed] = row.split(",");
      if (badge) {
        if (completed.trim() === "true") {
          localStorage.setItem(badge, "true");
        } else {
          localStorage.removeItem(badge);
        }
      }
    });
    // Refresh badge screen if visible
    if (sectionSelect.value) {
      sectionSelect.dispatchEvent(new Event("change"));
    }
  };
  reader.readAsText(file);
}