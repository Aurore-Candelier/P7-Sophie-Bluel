
// URL de l'api du serveur BACKEND
const apiUrl = 'http://localhost:5678/api/';


// Fonction pour récupérer la liste des oeuvres
async function fetchWorks() {
    const worksResponse = await fetch(`${apiUrl}works`, {method: "GET" });
    const works = await worksResponse.json();
    return works;
}

// Fonction pour filtrer les oeuvres
async function fillWorks(works) {
    let worksFiltered;
    if (works == undefined) {
        worksFiltered = await fetchWorks();
    } else {
        worksFiltered = works;
    }

    // Récupère la class gallery
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = ""
    // boucle sur chaque élément présent dans la galerie
    for ( let i=0; i < worksFiltered.length; i++){
        // création de la balise figure et image
        const figure = document.createElement("figure");
        const img = document.createElement("img");
        // Ajout des attributs src et alt à l'image
        img.setAttribute("src", worksFiltered[i].imageUrl);
        img.setAttribute("alt", worksFiltered[i].title);
        // Création de la balise figcaption et ajout du texte
        const figcaption = document.createElement("figcaption");
        figcaption.textContent = worksFiltered[i].title;
        // rattachement des enfants à leurs parents
        figure.appendChild(img);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }
}

// Exécute la récupération des oeuvres
fillWorks();

// Fonction pour récupérer la liste des catégories
async function fetchCategories() {
    const categoriesResponse = await fetch(`${apiUrl}categories`, {method: "GET" });
    const categories = await categoriesResponse.json();
    return categories;
}

// fonction pour remplir les catégories
async function fillCategories(categories) {
    let categoriesFiltered;
    if (categories == undefined) {
        categoriesFiltered = await fetchCategories() 
    } else {
        categoriesFiltered = categories;
    }
    
    // Récupère l'ID filters
    const filters = document.getElementById("filters");
    // Crée le bouton "Tous"
    const allButton = document.createElement("button");
    allButton.type = "button";
    allButton.textContent = "Tous"; 
    // Déclenche la fonction fillworks au clic
    allButton.addEventListener('click', function() {
        fillWorks()
    });
    
    filters.appendChild(allButton);

    // Boucle sur chaque élément dans la catégorie filtrée
    for (let i = 0; i < categoriesFiltered.length; i++) {
        // Creation des boutons
        const buttonsFilter = document.createElement("button");
        buttonsFilter.type = "button";
        buttonsFilter.textContent = categoriesFiltered[i].name;
        // Déclenche le filtre des oeuvres en fonction du bouton cliqué et de sa catégorie
        buttonsFilter.addEventListener('click', async function() {
            const allWorks = await fetchWorks()
            const filterWorks = allWorks.filter(function(element){
                return element.categoryId == categoriesFiltered[i].id
            })
            fillWorks(filterWorks)
        });
        filters.appendChild(buttonsFilter);
    }
}

// Exécute la récupération des catégories
fillCategories();

// Fonction qui vérifie si l'utilisateur est connecté
function isConnected() {
    return localStorage.getItem("token") !== null;
}

// Fonction qui mets à jour le lien d'authentification en fonction de l'état de connexion de l'utilisateur
function updateAuthLink() {
    const authLink = document.getElementById("auth-link");

    // Cas 1 : utilisateur connecté
    // le bouton devient "logout" et au clic déconnecte l'utilisateur
    if (isConnected()) {
        authLink.innerText = "logout";
        authLink.href = "#";
        authLink.addEventListener('click', function(event) {
            event.preventDefault();
            logout();
        });
    // Cas 2 :  utilisateur déconnecté
    // le bouton devient "login" et au clic redirige vers la page de connexion
    } else {
        authLink.innerText = "login";
        authLink.href = "./connexion.html";
    }
}

// Fonction pour déconnecter l'utlisateur
function logout() {
    //Supressoin du token depuis le localStorage
    localStorage.removeItem("token");
    // Redirection vers la page d'accueil
    window.location.href = "index.html";
}

// Affiche ou masque les éléments de la vue administrateur en fonction de l'état de connexion
function handleAdminElements() {
    const checkIfConnected = isConnected(); 
    let adminBoxes = document.querySelectorAll(".admin-element");

    if (checkIfConnected) {
        for (const element of adminBoxes) {
            element.classList.remove("hidden");
        }
        // Masquer la section "filters" si l'utilisateur est connecté
        const filtersSection = document.getElementById("filters");
        if (filtersSection) {
            filtersSection.classList.add("hidden");
        }
    } else {
        for (const element of adminBoxes) {
            element.classList.add("hidden");
        }
    }
}

// Met en mémoire l'ensemble de ces fonctions une fois le chargement du contenu du DOM terminé
document.addEventListener('DOMContentLoaded', function() {
    handleAdminElements();
    updateAuthLink();
    openMainModal();
    fillModalGalery();
    openSecondModalAddPhoto();
    closeModalListeners();
    backToMainModal();
    uploadBtnListener();
    fileBtnListener();
    hydrateSelectCategory();
    checkFormValidation();
    addProjectListener();
});

// Ouvre la modale principale
function openMainModal() {
    const linkModify= document.querySelector(".modify")
    linkModify.addEventListener("click", function() {
        const modal= document.querySelector(".modal");
        modal.classList.remove("hidden");
    })
}

// Ferme la modale lorsque le bouton fermeture est cliqué
function closeModal(e) {
    const target= e.target
    // Récupère le plus proche parent qui a la class "modal"
    const parent= target.closest(".modal");
    if (parent) {
        parent.classList.add("hidden");
    }
}

const galleryModal = document.querySelector(".gallery-modal");

//  Remplit la gallerie avec les oeuvres
async function fillModalGalery() {
    let worksFiltered;
    worksFiltered = await fetchWorks();

    // Récupère la class modal-galery
    const modalGalery = document.querySelector(".modal-galery");
    modalGalery.innerHTML = "";
    
    // boucle sur chaque élément présent dans la galerie modale
    for (let i = 0; i < worksFiltered.length; i++) {
        // création de la balise figure et image
        const figure = document.createElement("figure");
        figure.classList.add("image-container");
        const img = document.createElement("img");
        // Ajout des attributs src à l'image
        img.setAttribute("src", worksFiltered[i].imageUrl);
        // Création de l'icône poubelle
        const icon = document.createElement("i");
        icon.classList.add("fa-solid", "fa-trash-can", "icon");
        icon.setAttribute("aria-hidden", "true");
        // rattachement des enfants à leurs parents
        figure.appendChild(img);
        figure.appendChild(icon);
        modalGalery.appendChild(figure);

        icon.addEventListener("click", function() {
            deleteWork(worksFiltered[i].id);
        });
    }
}

// Supprime une oeuvre en utilisant l'API
async function deleteWork(id) {
    try {
        const response = await fetch(`${apiUrl}works/${id}`, { method: "DELETE", headers: { "Authorization": "Bearer " + localStorage.getItem("token")}, });
        if (response.ok) {
            fillWorks();
            fillModalGalery();
            console.log("Photo supprimé avec succès");
        } else {
            console.error("Échec de la suppression de la photo");
        }
    } catch (error) {
        console.error("Une erreur s'est produite lors de la suppression de la photo :", error);
    }
}

// Ouvre une seconde modale pour ajouter une photo
function openSecondModalAddPhoto() {
    const addPhotoButton = document.getElementById("addPhotoButton");  
    addPhotoButton.addEventListener("click", function() {
        const secondModal = document.getElementById("secondModal");
        secondModal.classList.remove("hidden");
    });
}

// Gestion de l'ouverture des modales
function openModalListeners() {
    const openMainModalButton = document.getElementById("openMainModal");
    openMainModalButton.addEventListener("click", function() {
        const mainModal = document.getElementById("mainModal");
        mainModal.classList.remove("hidden");
    });
}

// Gestion de la fermeture des modales
function closeModalListeners() {
    const closeButtons = document.querySelectorAll(".modal-close");
    closeButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            const modal = e.target.closest(".modal");
            if (modal) {
                modal.classList.add("hidden");
            }
        });
    });
}

// Ferme la  seconde modale lorsque le bouton fermeture est cliqué
const closeSecondModalButton = document.getElementById("closeSecondModal");
if (closeSecondModalButton) {
    closeSecondModalButton.addEventListener("click", function() {
        const secondModal = document.getElementById("secondModal");
        secondModal.classList.add("hidden");
    });
}

// Retourne à la modale principale depuis la seconde modale
function backToMainModal() {
    const backButton = document.getElementById("backToMainModal");

    backButton.addEventListener("click", function() {
        const secondModal = document.getElementById("secondModal");
        const mainModal = document.getElementById("mainModal");
        secondModal.classList.add("hidden");
        mainModal.classList.remove("hidden");

        //Supprime le fichier initialement sélectionné
        const fileInput = document.getElementById("fileInput");
        fileInput.value = "";

        // Masque la prévisualisation du fichier
        const previewImg = document.getElementById("previewImage");
        previewImg.style.display = "none";

        // Réaffiche le conteneur pour ajouter un nouveau fichier
        const addFileDiv = document.querySelector(".add-file-container");
        addFileDiv.classList.remove("hidden");
    });
}
// Permet de fermer la modale en cliquant à l'extérieur
document.addEventListener('DOMContentLoaded', (event) => {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                console.log(e)
                closeModal(document.getElementById('mainModal'));
                closeModal(document.getElementById('secondModal'));
            }
        });
    });
    const closeModal = (modal) => {
        modal.classList.add('hidden');
    };
});

// Ouvre la boite de dialogue pour selectionner un fichier lorsque le bouton est cliqué
function uploadBtnListener() {
    const updloadBtn = document.querySelector(".upload-button");
    const fileInput = document.getElementById("fileInput");
    updloadBtn.addEventListener("click", function() {
        fileInput.click();
    })
}
// Fonction qui permet d'afficher la photo
function fileBtnListener() {
    const fileInput = document.getElementById("fileInput");
    fileInput.addEventListener("change", function() {

        if (fileInput.files && fileInput.files.length > 0 ) {
            const file = fileInput.files[0];
            const previewImg = document.getElementById("previewImage");
            const reader = new FileReader();

            reader.onload = function(e) {
                previewImg.src = e.target.result; // Définit l'URL de l'image
                previewImg.style.display = "block";
            }
            const addFileDiv = document.querySelector(".add-file-container");
            addFileDiv.classList.add("hidden");
            reader.readAsDataURL(file);
        }
    })
}

// Liste déroulante des catégories dans la seconde modale d'ajout de projet
async function hydrateSelectCategory() {
    const selectElement = document.getElementById("category");
    const categories = await fetchCategories();

    for (let i = 0; i < categories.length; i++) {
        const option = new Option(categories[i].name, categories[i].id);
        selectElement.appendChild(option);
    }
}

// Ajoute un nouveau projet en utilisant l'API
async function addProject() {
    const fileInput = document.getElementById("fileInput");
    const selectElement = document.getElementById("category");
    const titleElement = document.getElementById("title");


    if (fileInput.files && fileInput.files.length > 0 && selectElement.value != "" && titleElement.value != "") {
        const formData= new FormData()
        formData.append("title", titleElement.value)
        formData.append("category", selectElement.value)
        formData.append("image", fileInput.files[0])
        try {
            let addProjectResponse = await fetch(`${apiUrl}works`, {
            method: "POST",
            headers: { "Authorization": "Bearer " + localStorage.getItem("token")},
            body: formData})
            if (addProjectResponse.ok) {
                fillWorks();
                fillModalGalery();
                document.getElementById('secondModal').classList.add("hidden");
                console.log("Photo ajoutée avec succès");
            } else {
                console.error("Échec de l'ajout de la photo");
            }
        } catch (error) {
            console.error("Une erreur s'est produite lors de l'ajout de la photo :", error);
        }        
    }
}

// Verifie la validité du formulaire avant l'ajout du projet
function checkFormValidation() {
    const titleInput = document.getElementById('title');
    const categorySelect = document.getElementById('category');
    const fileInput = document.getElementById('fileInput');
    const submitButton = document.getElementById('submit-project');
    const validateForm = () => {
        if (titleInput.value && categorySelect.value && fileInput.files.length > 0) {

            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    };

    titleInput.addEventListener('input', validateForm);
    categorySelect.addEventListener('change', validateForm);
    fileInput.addEventListener('change', validateForm);

    validateForm();
}

// Permet la soumission du formulaire
function addProjectListener () {
    const submitBtn = document.getElementById("submit-project");
    submitBtn.addEventListener("click", function(){
        addProject();
    })
}