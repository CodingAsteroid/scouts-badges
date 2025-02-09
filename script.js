// Data structure with separate arrays for activity and staged badges.
// For demonstration, "cubs" now includes a staged badge for "Air Activities".
const badgeData = {
  squirrels: {
    activity: ["Adventure Badge", "Exploration Badge", "Friendship Badge"],
    staged: [] 
  },
  beavers: {
    activity: ["Creative Badge", "Outdoor Challenge", "Camp Craft"],
    staged: []
  },
  cubs: {
    activity: ["Athlete Badge", "Hiking Badge", "Teamwork Badge"],
    staged: [
      { name: "Air Activities", stages: 6 } // staged badge example
    ]
  },
  scouts: {
    activity: ["Survival Skills", "Navigator Badge", "First Aid"],
    staged: []
  },
  explorers: {
    activity: ["Leadership Badge", "Expedition Challenge", "Volunteer Award"],
    staged: []
  },
  network: {
    activity: ["International Award", "Service Award", "Personal Development"],
    staged: []
  }
};

const sectionSelect = document.getElementById("section");
const homeScreen = document.getElementById("homeScreen");
const badgeScreen = document.getElementById("badgeScreen");
const badgeTitle = document.getElementById("badgeTitle");
const activityBadgeContainer = document.getElementById("activityBadgeContainer");
const stagedBadgeContainer = document.getElementById("stagedBadgeContainer");
const backBtn = document.getElementById("backBtn");

sectionSelect.addEventListener("change", function() {
  const section = this.value;
  if (section) {
    // Set the badge screen title based on selection.
    badgeTitle.innerText = `Badges for ${this.options[this.selectedIndex].text}`;
    
    // Clear any previous badges.
    activityBadgeContainer.innerHTML = "";
    stagedBadgeContainer.innerHTML = "";
    
    // Create and add activity badge boxes.
    badgeData[section].activity.forEach(badge => {
      const box = createActivityBadgeBox(badge);
      activityBadgeContainer.appendChild(box);
    });
    
    // Create and add staged badge boxes.
    badgeData[section].staged.forEach(badgeObj => {
      const box = createStagedBadgeBox(badgeObj);
      stagedBadgeContainer.appendChild(box);
    });
    
    // Slide transitions: slide home screen left and bring badge screen in.
    homeScreen.style.transform = "translateX(-100%)";
    badgeScreen.style.transform = "translateX(0)";
  }
});

// Back button functionality to return to home screen.
backBtn.addEventListener("click", function() {
  homeScreen.style.transform = "translateX(0)";
  badgeScreen.style.transform = "translateX(100%)";
});

// Create an activity badge box.
function createActivityBadgeBox(badge) {
  const box = document.createElement("div");
  box.className = "badge-box";
  box.dataset.badge = badge;
  if (localStorage.getItem(badge) === "true") {
    box.classList.add("completed");
  }
  
  const img = document.createElement("img");
  img.src = "https://via.placeholder.com/100";
  img.alt = badge;
  
  const span = document.createElement("span");
  span.className = "badge-name";
  span.innerText = badge;
  
  box.appendChild(img);
  box.appendChild(span);
  
  // Toggle completion on click.
  box.addEventListener("click", function() {
    this.classList.toggle("completed");
    const isCompleted = this.classList.contains("completed");
    localStorage.setItem(badge, isCompleted);
  });
  
  return box;
}

// Create a staged badge box with submenu for level selection.
function createStagedBadgeBox(badgeObj) {
  const badge = badgeObj.name;
  const maxStages = badgeObj.stages;
  const currentStage = parseInt(localStorage.getItem(badge)) || 0;
  
  const box = document.createElement("div");
  box.className = "badge-box staged";
  box.dataset.badge = badge;
  
  const img = document.createElement("img");
  img.src = "https://via.placeholder.com/100";
  img.alt = badge;
  
  const span = document.createElement("span");
  span.className = "badge-name";
  span.innerText = badge + (currentStage > 0 ? ` (Stage ${currentStage})` : "");
  
  box.appendChild(img);
  box.appendChild(span);
  
  // Create a submenu for selecting a stage.
  const submenu = document.createElement("div");
  submenu.className = "staged-submenu";
  
  // Create a button for each stage.
  for (let i = 1; i <= maxStages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    // Highlight buttons up to the current stage.
    if (i <= currentStage) {
      btn.classList.add("selected");
    }
    btn.addEventListener("click", function(e) {
      e.stopPropagation(); // Prevent toggling the submenu again.
      // Save the selected stage.
      localStorage.setItem(badge, i);
      span.innerText = badge + ` (Stage ${i})`;
      // Update submenu button highlights.
      Array.from(submenu.children).forEach((child, index) => {
        if (index < i) {
          child.classList.add("selected");
        } else {
          child.classList.remove("selected");
        }
      });
      box.classList.remove("show-submenu");
    });
    submenu.appendChild(btn);
  }
  
  box.appendChild(submenu);
  
  // Toggle submenu on box click.
  box.addEventListener("click", function(e) {
    this.classList.toggle("show-submenu");
  });
  
  return box;
}

// Export badge progress as CSV.
function exportCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Badge,Completed/Stage\n";
  // Activity badges.
  document.querySelectorAll("#activityBadgeContainer .badge-box").forEach(box => {
    const badge = box.dataset.badge;
    const completed = box.classList.contains("completed");
    csvContent += `${badge},${completed}\n`;
  });
  // Staged badges.
  document.querySelectorAll("#stagedBadgeContainer .badge-box").forEach(box => {
    const badge = box.dataset.badge;
    const stage = localStorage.getItem(badge) || 0;
    csvContent += `${badge},${stage}\n`;
  });
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "badge_progress.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Import badge progress from CSV.
function importCSV(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const rows = e.target.result.split("\n").slice(1);
    rows.forEach(row => {
      const [badge, value] = row.split(",");
      if (badge) {
        localStorage.setItem(badge, value.trim());
      }
    });
    // Refresh the badge screen if a section is selected.
    if (sectionSelect.value) {
      sectionSelect.dispatchEvent(new Event("change"));
    }
  };
  reader.readAsText(file);
}