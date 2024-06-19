const apiUrlConnex = 'http://localhost:5678/api/users/login';

async function fetchConnexion(email, password) {
    const connexionReponse = await fetch(apiUrlConnex, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });
    return connexionReponse.json();
}

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", async function(event) {
    event.preventDefault(); // Désactivation du comportement par défaut du navigateur

    // Récupère les valeurs des champs de formulaire
    const email = document.getElementById("email").value;
    const password = document.getElementById("mdp").value;
    const errorMessage = document.getElementById("errorMessage");


    const connexion = await fetchConnexion(email, password);
    console.log(connexion)

        if (connexion.token) {
            localStorage.setItem("token", connexion.token);
        // Redirige vers la page d'accueil en cas de succès
            window.location.href = "index.html";
        } else {
        // Affiche un message d'erreur en cas d'échec
            errorMessage.textContent = "Erreur dans l'identifiant ou le mot de passe";
        }
});