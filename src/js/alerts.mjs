export default async function loadAlerts() {

    try {
  
      const response = await fetch("/json/alerts.json");
  
      const alerts = await response.json();
  
      if (!alerts.length) return;
  
      const section = document.createElement("section");
      section.className = "alert-list";
  
      alerts.forEach(alert => {
  
        const message = document.createElement("p");
  
        message.textContent = alert.message;
  
        message.style.background = alert.background;
        message.style.color = alert.color;
  
        message.style.padding = "0.75em";
        message.style.margin = "0";
  
        section.appendChild(message);
  
      });
  
      const main = document.querySelector("main");
  
      main.prepend(section);
  
    } catch (error) {
      console.error("Error loading alerts:", error);
    }
  
  }