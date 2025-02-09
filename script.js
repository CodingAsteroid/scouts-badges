const badges = {
    squirrels: ["Adventure Badge", "Exploration Badge", "Friendship Badge"],
    beavers: ["Creative Badge", "Outdoor Challenge", "Camp Craft"],
    cubs: ["Athlete Badge", "Hiking Badge", "Teamwork Badge"],
    scouts: ["Survival Skills", "Navigator Badge", "First Aid"],
    explorers: ["Leadership Badge", "Expedition Challenge", "Volunteer Award"],
    network: ["International Award", "Service Award", "Personal Development"]
};

document.getElementById("section").addEventListener("change", function() {
    const section = this.value;
    const badgeContainer = document.getElementById("badgeContainer");
    const badgeTitle = document.getElementById("badgeTitle");
    const badgeList = document.getElementById("badgeList");

    if (section) {
        badgeContainer.classList.remove("hidden");
        badgeTitle.innerText = `Badges for ${this.options[this.selectedIndex].text}`;
        badgeList.innerHTML = "";

        badges[section].forEach(badge => {
            let li = document.createElement("li");
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = badge;
            checkbox.checked = localStorage.getItem(badge) === "true";
            checkbox.addEventListener("change", () => {
                localStorage.setItem(badge, checkbox.checked);
            });

            let label = document.createElement("label");
            label.htmlFor = badge;
            label.innerText = badge;

            li.appendChild(checkbox);
            li.appendChild(label);
            badgeList.appendChild(li);
        });
    } else {
        badgeContainer.classList.add("hidden");
    }
});

function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,Badge,Completed\n";
    document.querySelectorAll("#badgeList li").forEach(li => {
        let checkbox = li.querySelector("input");
        csvContent += `${checkbox.id},${checkbox.checked}\n`;
    });

    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
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
            if (badge && completed.trim() === "true") {
                localStorage.setItem(badge, "true");
            }
        });

        document.getElementById("section").dispatchEvent(new Event("change"));
    };

    reader.readAsText(file);
}
