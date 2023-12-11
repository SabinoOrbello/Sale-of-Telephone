const resourceId = new URLSearchParams(window.location.search).get("resourceId");

const URL = resourceId
  ? "https://striveschool-api.herokuapp.com/api/product/" + resourceId
  : "https://striveschool-api.herokuapp.com/api/product/";

const method = resourceId ? "PUT" : "POST";
console.log(resourceId);
window.addEventListener("DOMContentLoaded", () => {
  fetchData();
  const submitBtn = document.querySelector("button[type='submit']");
  const deleteBtn = document.querySelector("button[type='button'].btn-danger");
  const subtitle = document.getElementById("subtitle");

  if (resourceId) {
    subtitle.innerText = "— Modifica Prodotto";

    submitBtn.classList.remove("btn-primary");
    submitBtn.classList.add("btn-success");
    submitBtn.innerText = "Modifica Prodotto";

    deleteBtn.classList.remove("d-none");

    isLoading(true);
    const token = fetch(URL, {
      method, 
      body: JSON.stringify(newTelephone),
      
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc1ZjBmYjNkYWRhMDAwMThhNjlmNmQiLCJpYXQiOjE3MDIyMjgyNjIsImV4cCI6MTcwMzQzNzg2Mn0.lKudBpCd6f0KiUHOR75MgFVhCZvRJdBmLXVV3srNDos",
      },
    })
      .then((resp) => resp.json())
      .then(({ name, description, img, price }) => {
        document.getElementById("name").value = name;
        document.getElementById("img").value = img;
        document.getElementById("description").value = description;
        document.getElementById("price").value = price;
      })
      .finally(() => isLoading(false));
  } else {
    subtitle.innerText = "— Crea Prodotto";
  }
});

const handleSubmit = (event) => {
  event.preventDefault();

  const form = event.target;

  const newTelephone = {
    name: document.getElementById("name").value,
    img: document.getElementById("img").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
  };

  isLoading(true);

  fetch(URL, {
    method, 
    body: JSON.stringify(newTelephone), 
    
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc1ZjBmYjNkYWRhMDAwMThhNjlmNmQiLCJpYXQiOjE3MDIyMjgyNjIsImV4cCI6MTcwMzQzNzg2Mn0.lKudBpCd6f0KiUHOR75MgFVhCZvRJdBmLXVV3srNDos",
    },
  })
    .then((resp) => resp.json())
    .then((createdObj) => {
     

      if (resourceId) {
        showAlert("Risorsa con id: " + createdObj._id + " modificato con successo!", "success");
      } else {
        showAlert("Risorsa con id: " + createdObj._id + " creato con successo!");

        
        form.reset();
      }
    })
    .finally(() => isLoading(false)); 
};

const isLoading = (boolean) => {
  
  const spinner = document.querySelector(".spinner-border");

  if (boolean) {
    spinner.classList.remove("d-none");
  } else {
    spinner.classList.add("d-none");
  }
};

const showAlert = (message, colorCode = "primary") => {
  

  const alertBox = document.getElementById("alert-box");
  alertBox.innerHTML = `<div class="alert alert-${colorCode}" role="alert">
                                ${message}
                                </div>`;

  
  setTimeout(() => {
    alertBox.innerHTML = "";
  }, 3000);
};

const handleDelete = () => {
  
  const hasConfirmed = confirm("sei sicuro di voler eliminare il prodotto?");

  if (hasConfirmed) {
    

    isLoading(true);

    fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc1ZjBmYjNkYWRhMDAwMThhNjlmNmQiLCJpYXQiOjE3MDIyMjgyNjIsImV4cCI6MTcwMzQzNzg2Mn0.lKudBpCd6f0KiUHOR75MgFVhCZvRJdBmLXVV3srNDos",
      },
    }) 
      .then((resp) => {
       
        if (resp.ok) {
          return resp.json();
        }
      })
      .then((deletedObj) => {
        showAlert("hai eliminato la risorsa " + deletedObj.name + " che aveva id: " + deletedObj._id, "danger");
        // un alert custom non fa attendere prima del cambio pagina con window.location assign,
        // abbiamo quindi bisogno di un setTimeout per forzare l'attesa per il tempo desiderato
        setTimeout(() => {
          window.location.assign("./index.html");
        }, 3000);
      })
      .finally(() => {
        isLoading(false); 
      });
  }
};

const fetchData = () => {
  fetch(URL, {
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc1ZjBmYjNkYWRhMDAwMThhNjlmNmQiLCJpYXQiOjE3MDIyMjgyNjIsImV4cCI6MTcwMzQzNzg2Mn0.lKudBpCd6f0KiUHOR75MgFVhCZvRJdBmLXVV3srNDos",
    },
  })
    .then((response) => {
      if (response.status === 404) throw new Error("Errore, risorsa non trovata");
      if (response.status >= 400 && response.status < 500) throw new Error("Errore  Client");
      if (response.status >= 500 && response.status < 600) throw new Error("Errore Server");
      if (!response.ok) throw new Error("Errore nel reperimento dei dati");

      
      return response.json();
    })
    .then((telephone) => {
      const ul = document.getElementById("list");

      telephone.forEach((telephone) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex align-items-center";

        li.innerHTML = ` <div class="row justify-content-center">
        <div class="col-10">
        <div class="card" ">
        <img src="${telephone.imageUrl}" class="card-img-top objet-fit w-25" alt="...">
        <div class="card-body">
          <h5 class="card-title">${telephone.name}</h5>
          <p class="card-text">${telephone.description}</p>
        </div>
      </div> <a href="./details.html?resourceId=${telephone._id}">DETTAGLI</a>;

        </div>
      </div>`;
        ul.appendChild(li);
        console.log(li);
      });
    })
    .catch((err) => {
      console.log("HUSTON ABBIAMO UN PROBLEMA: ", err);
      
    })
    .finally(() => document.querySelector(".spinner-border").classList.add("d-none"));
};

const params = new URLSearchParams(window.location.search);
const id = params.get("resourceId");

fetch(URL + id, {
  headers: {
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTc1ZjBmYjNkYWRhMDAwMThhNjlmNmQiLCJpYXQiOjE3MDIyMjgyNjIsImV4cCI6MTcwMzQzNzg2Mn0.lKudBpCd6f0KiUHOR75MgFVhCZvRJdBmLXVV3srNDos",
  },
})
  .then((resp) => resp.json())
  .then((telephone) => {
    const { name, description, imageUrl, price, _id, createdAt, updatedAt } = telephone;

    const container = document.getElementById("appointment-details");
    
    container.innerHTML = ` 
                    <h1 class="display-3 mb-4">${name}</h1>
                    <p class="font-monospace fs-5">${imageUrl}</p>
                    <p class="lead">${description}</p>
                    <h3 class="display-5 text-primary mb-4">${price}</h3>
                    <h6 class="bg-light p-3">Server Details</h6>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item"><strong>id:</strong> ${_id}</li>
                        <li class="list-group-item"><strong>createdAt:</strong> ${createdAt}</li>
                        <li class="list-group-item"><strong>updatedAt:</strong> ${updatedAt}</li>
                    </ul>
                    <button class="btn btn-success mt-4" onclick="handleEdit()">Modifica Appuntamento</button>
                    `;
  })
  .catch((err) => console.log(err));


const handleEdit = () => {
  window.location.assign("./backoffice.html?resourceId=" + id);
};
