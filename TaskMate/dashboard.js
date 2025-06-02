// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
// import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
// import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// const firebaseConfig = {
//   apiKey: "AIzaSyAFwEzrXSh22xunFLnt5jxJ7C8OxvDkQAw",
//   authDomain: "taskmate-144ec.firebaseapp.com",
//   projectId: "taskmate-144ec",
//   storageBucket: "taskmate-144ec.firebasestorage.app",
//   messagingSenderId: "154379008228",
//   appId: "1:154379008228:web:ba36f944b939a3d6bf94f1",
//   measurementId: "G-E4CPZENJX4"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// // Greet user & load their tasks
// onAuthStateChanged(auth, async (user) => {
//   if (user) {
//     document.getElementById("greeting").innerText = `Welcome, ${user.displayName || user.email}!`;

//     // Task display logic (we will enhance this later)
//     const taskRef = collection(db, "tasks");
//     const q = query(taskRef, where("uid", "==", user.uid));
//     const snapshot = await getDocs(q);

//     const taskContainer = document.getElementById("taskContainer");
//     if (snapshot.empty) {
//       taskContainer.innerHTML = "<p>No tasks yet.</p>";
//     } else {
//       snapshot.forEach(doc => {
//         const task = doc.data();
//         taskContainer.innerHTML += `<div><strong>${task.title}</strong> - ${task.status}</div>`;
//       });
//     }

//   } else {
//     window.location.href = "index.html"; // redirect to login if not logged in
//   }
// });

// // Logout
// document.getElementById("logoutBtn").addEventListener("click", () => {
//   signOut(auth).then(() => {
//     window.location.href = "index.html";
//   });
// });

// // modal for create task button
// const createTaskBtn = document.querySelector(".create-task-btn");
// const taskTypeModal = document.getElementById("taskTypeModal");
// const individualForm = document.getElementById("individualForm");
// const teamForm = document.getElementById("teamForm");
// const individualBtn = document.getElementById("individualBtn");
// const teamBtn = document.getElementById("teamBtn");
// const closeModal = document.getElementById("closeModal");

// // Show modal when 'Create Task' is clicked
// createTaskBtn.addEventListener("click", () => {
//   taskTypeModal.style.display = "flex";
// });

// // Close modal on clicking '×'
// closeModal.addEventListener("click", () => {
//   taskTypeModal.style.display = "none";
// });
// // Task Data
// const individualTasks = [
//   { id: "ind1", title: "Create Personal Daily Planner", skills: ["HTML", "CSS", "JavaScript"] },
//   { id: "ind2", title: "Set Task Reminders", skills: ["JavaScript", "Notifications"] },
//   { id: "ind3", title: "Color Tag for Priorities", skills: ["CSS", "DOM Manipulation"] }
// ];

// const teamTasks = [
//   { id: "team1", title: "Assign Tasks to Members", skills: ["JavaScript", "Firebase"] },
//   { id: "team2", title: "Real-Time Sync", skills: ["Firebase Realtime DB"] },
//   { id: "team3", title: "Add Team Chat", skills: ["Firebase", "JS"] }
// ];

// // Render Function
// function renderTasks(tasks, label) {
//   const completed = JSON.parse(localStorage.getItem("completedTasks")) || [];
//   taskContainer.innerHTML = `
//     <div class="task-category">
//       <h2>${label} Tasks</h2>
//       <div class="task-list">
//         ${tasks.map(task => `
//           <div>
//             <label>
//               <input type="checkbox" data-id="${task.id}" ${completed.includes(task.id) ? "checked" : ""}/>
//               <strong>${task.title}</strong>
//             </label>
//             <p style="font-size: 12px; color: #555;">Skills: ${task.skills.join(", ")}</p>
//           </div>
//         `).join("")}
//       </div>
//     </div>
//   `;

//   document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
//     cb.addEventListener("change", e => {
//       const id = e.target.dataset.id;
//       let stored = JSON.parse(localStorage.getItem("completedTasks")) || [];

//       if (e.target.checked) {
//         if (!stored.includes(id)) stored.push(id);
//       } else {
//         stored = stored.filter(t => t !== id);
//       }

//       localStorage.setItem("completedTasks", JSON.stringify(stored));
//     });
//   });
// }
// // Handle Individual
// individualBtn.addEventListener("click", () => {
//   taskTypeModal.style.display = "none";
//   window.location.href = "createtask.html";
// });

// // Handle Team
// teamBtn.addEventListener("click", () => {
//   taskTypeModal.style.display = "none";
//   window.location.href = "createtask.html";
// });


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAFwEzrXSh22xunFLnt5jxJ7C8OxvDkQAw",
  authDomain: "taskmate-144ec.firebaseapp.com",
  projectId: "taskmate-144ec",
  storageBucket: "taskmate-144ec.firebasestorage.app",
  messagingSenderId: "154379008228",
  appId: "1:154379008228:web:ba36f944b939a3d6bf94f1",
  measurementId: "G-E4CPZENJX4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const taskContainer = document.getElementById("taskContainer");
const taskDetailPanel = document.getElementById("taskDetailPanel");
const taskDetailTitle = document.getElementById("taskDetailTitle");
const taskDetailSkills = document.getElementById("taskDetailSkills");

// Greet and load user tasks
onAuthStateChanged(auth, async (user) => {
  if (user) {
    document.getElementById("greeting").innerText = `Welcome, ${user.displayName || user.email}!`;

    const taskRef = collection(db, "tasks");
    const q = query(taskRef, where("uid", "==", user.uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      taskContainer.innerHTML = "<p>No tasks yet.</p>";
    } else {
      const tasks = [];
      snapshot.forEach(doc => tasks.push({ id: doc.id, ...doc.data() }));
      renderTasks(tasks, "Your");
    }

  } else {
    window.location.href = "index.html";
  }
});

// Logout logic
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

// Modal elements
const createTaskBtn = document.querySelector(".create-task-btn");
const taskTypeModal = document.getElementById("taskTypeModal");
const individualBtn = document.getElementById("individualBtn");
const teamBtn = document.getElementById("teamBtn");
const closeModal = document.getElementById("closeModal");

// Show modal on Create Task click
createTaskBtn.addEventListener("click", () => {
  taskTypeModal.style.display = "flex";
});

// Close modal
closeModal.addEventListener("click", () => {
  taskTypeModal.style.display = "none";
});

// Local sample tasks (optional fallback)
const individualTasks = [
  { id: "ind1", title: "Create Personal Daily Planner", skills: ["HTML", "CSS", "JavaScript"] },
  { id: "ind2", title: "Set Task Reminders", skills: ["JavaScript", "Notifications"] },
  { id: "ind3", title: "Color Tag for Priorities", skills: ["CSS", "DOM Manipulation"] }
];

const teamTasks = [
  { id: "team1", title: "Assign Tasks to Members", skills: ["JavaScript", "Firebase"] },
  { id: "team2", title: "Real-Time Sync", skills: ["Firebase Realtime DB"] },
  { id: "team3", title: "Add Team Chat", skills: ["Firebase", "JS"] }
];

// Handle Individual Task Creation
individualBtn.addEventListener("click", () => {
  taskTypeModal.style.display = "none";
  window.location.href = "createtask.html";
});

// Handle Team Task Creation
teamBtn.addEventListener("click", () => {
  taskTypeModal.style.display = "none";
  window.location.href = "createtask.html";
});

// Render task list and set up click behavior
function renderTasks(tasks, label) {
  const completed = JSON.parse(localStorage.getItem("completedTasks")) || [];
  taskContainer.innerHTML = `
    <div class="task-category">
      <h2>${label} Tasks</h2>
      <div class="task-list">
        ${tasks.map(task => `
          <div class="task-item" data-id="${task.id}" style="cursor: pointer; margin-bottom: 10px;">
            <label>
              <input type="checkbox" data-id="${task.id}" ${completed.includes(task.id) ? "checked" : ""}/>
              <strong>${task.title}</strong>
            </label>
            <p style="font-size: 12px; color: #555;">Skills: ${task.skills?.join(", ") || "N/A"}</p>
          </div>
        `).join("")}
      </div>
    </div>
  `;

  // Checkbox event
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener("change", e => {
      const id = e.target.dataset.id;
      let stored = JSON.parse(localStorage.getItem("completedTasks")) || [];

      if (e.target.checked) {
        if (!stored.includes(id)) stored.push(id);
      } else {
        stored = stored.filter(t => t !== id);
      }

      localStorage.setItem("completedTasks", JSON.stringify(stored));
    });
  });

  // Show task detail on click
  document.querySelectorAll(".task-item").forEach(item => {
    item.addEventListener("click", e => {
      const taskId = item.dataset.id;
      const task = tasks.find(t => t.id === taskId);
      if (task) showTaskDetail(task);
    });
  });
}

// Show task detail in the panel
function showTaskDetail(task) {
  taskDetailTitle.innerText = task.title;
  taskDetailSkills.innerText = `Skills: ${task.skills?.join(", ") || "N/A"}`;
  taskDetailPanel.style.display = "block";
}


