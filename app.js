// INITIALISATION VARIABLES
// Objets et tableaux
var joueurs = new Array({'nom':"Vous", 'nb_touche':0}, {'nom':"Ordinateur", 'nb_touche':0});
var jeu = new Array({"joueur":joueurs[0], "grille":new Array()},{"joueur":joueurs[1],"grille":new Array()});
var list_orientations = new Array('Horizontal','Vertical');
var bateaux = new Array(
    {
        'nom' : 'Porte-avion',
        'longueur' : 5,
        'restant' : new Array(5,5),
        'etat' : new Array("",""),
        'couleur' : 'brown'
    },
    {
        'nom' : 'Croiseur',
        'longueur' : 4,
        'restant' : new Array(4,4),
        'etat' : new Array("",""),
        'couleur' : 'cyan'
    },
    {
        'nom' : 'Contre-torpilleurs',
        'longueur' : 3,
        'restant' : new Array(3,3),
        'etat' : new Array("",""),
        'couleur' : 'black'
    },
    {
        'nom' : 'Sous-marin',
        'longueur' : 3,
        'restant' : new Array(3,3),
        'etat' : new Array("",""),
        'couleur' : 'yellow'
    },
    {
        'nom' : 'Torpilleur',
        'longueur' : 2,
        'restant' : new Array(2,2),
        'etat' : new Array("",""),
        'couleur' : 'pink'
    }
);

// Joueur en cours
var currentJ = 0;

// Saisie du nombre de cases du plateau et du nom du joueur
var nb_cases = prompt("Entrer le nombre de case (11 <= X <= 26) - 15 par défaut");
nb_cases = (nb_cases != "" ? nb_cases : 15)
var nom_joueur = prompt("Quel est votre nom ?");
joueurs[0].nom = (nom_joueur != "" ? nom_joueur : "Vous");

// Vérif saisie et initialisation du jeu
if(nb_cases < 11 || nb_cases > 26){
    alert('Le nombre de case doit être supérieur à 11 et inférieur à 26');
    $('#tableau-J0').html('Veuillez recharger la page');
}else{
    for(J=0; J<2; J++){
        initialisationGrille();
        for(var B=0; B<bateaux.length; B++){
            bateauHasard(B);
        }
        constructionCssGrille();
        changeUser();
    }
    changeUser();
}

// Au click sur une case
$(document).on('click', '.case', function(){
    // Si c'est pas une case du jeu, on ne fait rien
    if($(this).parent().hasClass('desactived') || $(this).parent().hasClass('coordonnees')){
        return false;
    }
    // Si ça en est une, on récupère les coordonnees de la case et on vérifie
    var data_x = $(this).attr('data-x');
    var data_y = $(this).attr('data-y');
    if(verifTouche(data_x, data_y)){
        changeUser();
    }
});

function changeUser(){
    if(currentJ == 0){
        currentJ = 1;
        $('#tableau-J0 .ligne').addClass('desactived');
        $('#tableau-J1 .ligne').removeClass('desactived');
    }else{
        currentJ = 0;
        $('#tableau-J0 .ligne').removeClass('desactived');
        $('#tableau-J1 .ligne').addClass('desactived');
    }
    $('#consignes').html("A " + joueurs[currentJ].nom + " de jouer !");
}

// Initialisation des deux grilles du jeu
function initialisationGrille(){
    for(var i=1; i<=nb_cases; i++){
        jeu[currentJ].grille[i] = new Array();
        for(var j=1; j<=nb_cases; j++){
            jeu[currentJ].grille[i][j] = new Object({'etat':null, 'bateau':null});
        }
    }
}

// Vérification d'une case touché
function verifTouche(x,y){
    // Si il y a un bateau
    if(jeu[currentJ].grille[x][y].etat == "bateau"){
        jeu[currentJ].grille[x][y].bateau.restant[currentJ]--;  // On décrémente le nombre de touché du joueur qu'il doit y avoir pour gagner
        if(jeu[currentJ].grille[x][y].bateau.restant[currentJ] == 0){
            jeu[currentJ].grille[x][y].bateau.etat[currentJ] = "coule";
            jeu[currentJ].grille[x][y].etat = "coule";
            jeu[currentJ].joueur.nb_touche++;
        }else{
            jeu[currentJ].grille[x][y].etat = "touche";
            jeu[currentJ].joueur.nb_touche++;
            jeu[currentJ].grille[x][y].etat = "clique";
        }
    // Case déjà cliqué
    }else if(jeu[currentJ].grille[x][y].etat == "clique"){
        alert("déjà touché !");
        return false;
    } // Bateau raté
    else{
        jeu[currentJ].grille[x][y].etat = "clique";
    }
    // On reconstruit le tableau en HTML CSS
    constructionCssGrille();
    // On vérifie si un joueur a gagné
    checkGagnant();
    return true;
}

function constructionCssGrille(){
    var tableau_html = "";
    tableau_html += '<div class="ligne coordonnees">';
    tableau_html += '<div class="case"></div>';
    // On crée la ligne des lettres
    for (var i = 65; i < (65+parseInt(nb_cases)); i++) {
        tableau_html += '<div class="case">'+String.fromCharCode(i)+'</div>'
    }
    tableau_html += '</div>';

    // On crée les cases du plateau de jeu
    for(var i=1; i<=nb_cases; i++){
        tableau_html += '<div class="ligne">';
        tableau_html += '<div class="case coordonnees">'+i+'</div>';
        for(var j=1; j<=nb_cases; j++){
            var clique = (jeu[currentJ].grille[i][j].etat == "clique" || jeu[currentJ].grille[i][j].etat == "coule")?true:false;
            // Si on reconstruit le style du plateau de l'ordi
            if(currentJ == 1){
              if(jeu[currentJ].grille[i][j].bateau){
                  var coule = (jeu[currentJ].grille[i][j].bateau.etat[currentJ] == "coule")?true:false;
                  tableau_html += '<div class="case '+((coule)?jeu[currentJ].grille[i][j].bateau.couleur:"")+' '+jeu[currentJ].grille[i][j].bateau.etat[currentJ]+' '+jeu[currentJ].grille[i][j].etat+'" data-x="'+i+'" data-y="'+j+'">'+((clique||coule)?"X":"")+'</div>';
              }else{
                  tableau_html += '<div class="case" data-x="'+i+'" data-y="'+j+'">'+((clique)?"X":"")+'</div>';
              }
            }else{
              if(jeu[currentJ].grille[i][j].bateau){
                  tableau_html += '<div class="case '+jeu[currentJ].grille[i][j].bateau.couleur+' '+jeu[currentJ].grille[i][j].bateau.etat[currentJ]+' '+jeu[currentJ].grille[i][j].etat+'" data-x="'+i+'" data-y="'+j+'">'+((clique||coule)?"X":"")+'</div>';
              }else{
                  tableau_html += '<div class="case" data-x="'+i+'" data-y="'+j+'">'+((clique)?"X":"")+'</div>';
              }
            }
        }
        tableau_html += '</div>';
    }
    // Infos du joueur
    tableau_html += '<div class="ligne infos_user">'+joueurs[currentJ].nom+'</div>';
    $('#tableau-J'+currentJ).html(tableau_html);
}

function bateauHasard(id_bateau){
    // Nombre au hasard entre 1 et longueur max de la grille
    var case_depart_i = Math.floor((Math.random() * nb_cases) + 1);
    var case_depart_j = Math.floor((Math.random() * nb_cases) + 1);
    var orientation = Math.floor((Math.random() * 2));
    orientation = list_orientations[orientation];

    // Pour chaque bateau avec orientation aléatoire et première case aléatoire,
    // on vérifie d'abord que le bateau ne dépasse pas de la grille,
    // puis si une case a ddéjà un bateau, on arrête et on ne place pas le bateau
    var continuer;
    if(orientation == 'Horizontal'){
        if(case_depart_i + (bateaux[id_bateau].longueur-1) < (nb_cases-bateaux[id_bateau].longueur)){
            for (var i = case_depart_i; i < (case_depart_i+bateaux[id_bateau].longueur); i++){
                if(jeu[currentJ].grille[i][case_depart_j].etat != null && jeu[currentJ].grille[i][case_depart_j].etat == "bateau"){
                    continuer = false;
                    break;
                }else{
                    continuer = true;
                }
            }
            if(continuer){
                for (var i = case_depart_i; i < (case_depart_i+bateaux[id_bateau].longueur); i++){
                    jeu[currentJ].grille[i][case_depart_j].bateau = bateaux[id_bateau];
                    jeu[currentJ].grille[i][case_depart_j].etat = "bateau";
                }
            }else{
                bateauHasard(id_bateau);
            }
        }else{
            bateauHasard(id_bateau);
        }
    }else if(orientation == 'Vertical'){
        if(case_depart_j + (bateaux[id_bateau].longueur-1) < (nb_cases-bateaux[id_bateau].longueur)){
            for (var j = case_depart_j; j < (case_depart_j+bateaux[id_bateau].longueur); j++){
                if(jeu[currentJ].grille[case_depart_i][j].etat != null && jeu[currentJ].grille[case_depart_i][j].etat == "bateau"){
                    continuer = false;
                    break;
                }else{
                    continuer = true;
                }
            }
            if(continuer){
                for (var j = case_depart_j; j < (case_depart_j+bateaux[id_bateau].longueur); j++){
                    jeu[currentJ].grille[case_depart_i][j].bateau = bateaux[id_bateau];
                    jeu[currentJ].grille[case_depart_i][j].etat = "bateau";
                }
            }else{
                bateauHasard(id_bateau);
            }
        }else{
            bateauHasard(id_bateau);
        }
    }

}

// Vérification que le joueur a bien fait ses 17 touchés, si oui, il a gagné
function checkGagnant(){
    for(J=0; J<2; J++){
        if(jeu[currentJ].joueur.nb_touche == 17){
            changeUser();
            alert(jeu[currentJ].joueur.nom + " a gagné !");
            changeUser();
        }
        changeUser();
    }
}
