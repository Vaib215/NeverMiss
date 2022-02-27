// Idea Class: Represents an idea
class Idea {
  constructor(topic, content) {
    this.topic = topic;
    this.content = content;
  }
}
// UI Class: Handle UI Tasks
class UI {
  static displayIdea() {
    const Ideas = Store.getIdeas();

    Ideas.forEach(idea => UI.addIdeaToList(idea));
  }
  static deleteIdea(element) {
    if (element.classList.contains("delete")) {
      element.parentElement.parentElement.remove();
    }
  }
  static addIdeaToList(idea) {
    const list = document.querySelector("#idea-list");
    const row = document.createElement("tr");

    row.innerHTML = `
            <td class="border-2 pl-2">${idea.topic}</td>
            <td class="border-2 pl-2">${idea.content}</td>
            <td class="border-2 text-center"><a href="#form" class="btn btn-danger btn-sm delete">X</a></td>
        `;
    list.append(row);
  }
  static clearFields() {
    document.querySelector("#topic").value = "";
    document.querySelector("#content").value = "";
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const main = document.querySelector("main");
    const form = document.querySelector("form");
    main.insertBefore(div, form);
    setTimeout(() => {
      main.removeChild(document.querySelector(".alert"));
    }, 3000);
  }
}
// Store Class: Handles Storage
class Store {
  static getIdeas() {
    let ideas;
    if (localStorage.getItem("ideas") === null) {
      ideas = [];
    } else {
      ideas = JSON.parse(localStorage.getItem("ideas"));
    }
    return ideas;
  }
  static addIdea(idea) {
    const ideas = Store.getIdeas();
    ideas.push(idea);
    localStorage.setItem("ideas", JSON.stringify(ideas));
  }
  static removeIdea(topic) {
    const ideas = Store.getIdeas();

    ideas.forEach((idea,index) => {
        if(idea.topic===topic){
            ideas.splice(index,1)
        }
    });

    localStorage.setItem('ideas',JSON.stringify(ideas))
  }
}

// Event: Display Ideas
document.addEventListener("DOMContentLoaded", UI.displayIdea);
// Event: Add an Idea
document.querySelector("#submit").addEventListener("click", e => {
  // Prevent actual submit
  e.preventDefault();
  // Get form values
  const topic = document.querySelector("#topic").value;
  const content = document.querySelector("#content").value;
  if (topic === "" || content === "") {
    UI.showAlert("Please fill all fields.", "danger");
  } else {
    const idea = new Idea(topic, content);
    // Add idea to UI
    UI.addIdeaToList(idea);
    // Add idea to store
    Store.addIdea(idea)
    // Show Success Message
    UI.showAlert("Idea has been successfully added to the list.", "success");
    // Clear Fields
    UI.clearFields();
  }
});
// Event: Remove an Idea

document.querySelector("#idea-list").addEventListener("click", e => {
  UI.deleteIdea(e.target);
  let data = e.target.parentElement.parentElement.children
  Store.removeIdea(data[0].textContent)
  UI.showAlert("The idea has been removed from the list.", "success");
});
