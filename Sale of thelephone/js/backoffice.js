const URL = "https://striveschool-api.herokuapp.com/api/product/";
const params = new URLSearchParams(window.location.search);
const id = params.get("resourceId");

const fetchData = () => {
  fetch(URL, {
    headers: {
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc1ZjBmYjNkYWRhMDAwMThhNjlmNmQiLCJpYXQiOjE3MDIyMjgyNjIsImV4cCI6MTcwMzQzNzg2Mn0.lKudBpCd6f0KiUHOR75MgFVhCZvRJdBmLXVV3srNDos",
    },
  })
    .then((response) => {
      console.log(response);
      // controlli di guardia (guard clauses)
      if (response.status === 404) throw new Error("Errore, risorsa non trovata");
      if (response.status >= 400 && response.status < 500) throw new Error("Errore lato Client");
      if (response.status >= 500 && response.status < 600) throw new Error("Errore lato Server");
      if (!response.ok) throw new Error("Errore nel reperimento dei dati");

      return response.json();
    })
    .then((telephone) => {
      const container = document.getElementById("list");

      telephone.forEach((telephone) => {
        const div = document.createElement("div");
        div.className = "col-12";

        div.innerHTML = `
        <div class="card m-2 p-2 w-100">
        <img src="${telephone.imageUrl}" class="card-img-top" style="width: 200px; alt="...">
        <div class="card-body">
          <h5 class="card-title">${telephone.name}</h5>
          <p class="card-text">${telephone.brand}</p>
          <p class="card-text">${telephone.description}</p>
          <div class = "d-flex justify-content-between align-items-center">
          <p class="btn btn-success m-0 p-1">${telephone.price} $</p>
          <<a href="./details.html?resourceId=${telephone._id}">Scopri di più</a>
          </div>
        </div>`;

        container.appendChild(div);
      });
    })
    .catch((err) => {
      console.log("HUSTON ABBIAMO UN PROBLEMA: ", err);
    })
    .finally(() => document.querySelector(".spinner-border").classList.add("d-none"));
};
function preventDefaultForm(event) {
  event.preventDefault();

  const newTelephone = {
    name: document.getElementById("name").value,
    description: document.getElementById("description").value,
    brand: document.getElementById("brand").value,
    imageUrl: document.getElementById("img").value,
    price: document.getElementById("price").value,
  };

  fetch("https://striveschool-api.herokuapp.com/api/product/", {
    method: "POST",
    body: JSON.stringify(newTelephone),
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc1ZjBmYjNkYWRhMDAwMThhNjlmNmQiLCJpYXQiOjE3MDIyMjgyNjIsImV4cCI6MTcwMzQzNzg2Mn0.lKudBpCd6f0KiUHOR75MgFVhCZvRJdBmLXVV3srNDos",
    },
  })
    .then((resp) => resp.json())
    .then((createObj) => {
      console.log(createObj);
      alert("Risposta con id: " + createObj._id + "creata con successo!");

      document.getElementById("name").value = "";
      document.getElementById("description").value = "";
      document.getElementById("brand").value = "";
      document.getElementById("img").value = "";
      document.getElementById("price").value = "";
    });
}
const fetchDetails = () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("resourceId");

  fetch("https://striveschool-api.herokuapp.com/api/product/" + id, {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc1ZjBmYjNkYWRhMDAwMThhNjlmNmQiLCJpYXQiOjE3MDIyMjgyNjIsImV4cCI6MTcwMzQzNzg2Mn0.lKudBpCd6f0KiUHOR75MgFVhCZvRJdBmLXVV3srNDos",
    },
  })
    .then((resp) => resp.json())
    .then((telephone) => {
      console.log(telephone);
      const { name, description, brand, imageUrl, price, _id, userId, createdAt, updatedAt } = telephone;

      const container = document.getElementById("appointment-details");
      // svuotiamo il contenitore (togliendo anche lo spinner di conseguenza) e creiamo la struttura già con i dati ottenuti dal server
      container.innerHTML = ` 
                    <h1 class="display-3 mb-4">${name}</h1>
                    <p class="font-monospace fs-5">${description}</p>
                    <p class="lead">${brand}</p>
                    <img src="${imageUrl}" class="card-img-top" style="width: 200px; alt="...">
                    <h3 class="display-5 text-primary mb-4">${price}</h3>
                    <h6 class="bg-light p-3">Server Details</h6>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>id:</strong> ${_id}</li>
                        <li class="list-group-item"><strong>user_id:</strong> ${userId}</li>
                        <li class="list-group-item"><strong>createdAt:</strong> ${createdAt}</li>
                        <li class="list-group-item"><strong>updatedAt:</strong> ${updatedAt}</li>
                    </ul>
                    <button class="btn btn-success mt-4" onclick="handleEdit()">Modifica Prodotto</button>
                    `;
    })
    .catch((err) => console.log(err));
};

// questo è un metodo alternativo ad una <a href=""> per gestire il cambio pagina in maniera programmatica (es. da una funzione)
const handleEdit = () => {
  window.location.assign("./backoffice.html?resourceId=" + id);
};

window.addEventListener("DOMContentLoaded", () => {
  fetchData();
  fetchDetails();
});
