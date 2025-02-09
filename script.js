const badges = {
  squirrels: ["Adventure Badge", "Exploration Badge", "Friendship Badge"],
  beavers: ["Creative Badge", "Outdoor Challenge", "Camp Craft"],
  cubs: ["Athlete Badge", "Hiking Badge", "Teamwork Badge"],
  scouts: ["Survival Skills", "Navigator Badge", "First Aid"],
  explorers: ["Leadership Badge", "Expedition Challenge", "Volunteer Award"],
  network: ["International Award", "Service Award", "Personal Development"]
};

const sectionSelect = document.getElementById("section");
const badgeContainer = document.getElementById("badgeContainer");
const badgeTitle = document.getElementById("badgeTitle");
const badgeList = document.getElementById("badgeList");

sectionSelect.addEventListener("change", function () {
  const section = this.value;
  if (section) {
    // Set up the badge list content
    badgeTitle.innerText = `Badges for ${this.options[this.selectedIndex].text}`;
    badgeList.innerHTML = "";
    badges[section].forEach(badge => {
      const li = document.createElement("li");
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = badge;
      checkbox.checked = localStorage.getItem(badge) === "true";
      checkbox.addEventListener("change", () => {
        localStorage.setItem(badge, checkbox.checked);
      });
      const label = document.createElement("label");
      label.htmlFor = badge;
      label.innerText = badge;
      li.appendChild(checkbox);
      li.appendChild(label);
      badgeList.appendChild(li);
    });
    
    // Activate the container with a slight delay to trigger the CSS transition
    setTimeout(() => badgeContainer.classList.add("active"), 10);
  } else {
    // Remove the active class to hide the container
    badgeContainer.classList.remove("active");
  }
});

function exportCSV() {
  let csvContent = "data:text/csv;charset=utf-8,Badge,Completed\n";
  document.querySelectorAll("#badgeList li").forEach(li => {
    const checkbox = li.querySelector("input");
    csvContent += `${checkbox.id},${checkbox.checked}\n`;
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
  reader.onload = function (e) {
    const rows = e.target.result.split("\n").slice(1);
    rows.forEach(row => {
      const [badge, completed] = row.split(",");
      if (badge && completed.trim() === "true") {
        localStorage.setItem(badge, "true");
      }
    });
    // Refresh the badge list to show updated progress
    sectionSelect.dispatchEvent(new Event("change"));
  };
  reader.readAsText(file);
}
