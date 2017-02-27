var joueurs = new Array({'nom':"Dimitri", 'nb_touche':0}, {'nom':"Ordinateur", 'nb_touche':0});
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

var currentJ = 0;

//var nb_case = prompt("Entrer le nombre de case (< 20)");
var nb_cases = 15;

if(nb_cases > 20){
    alert('Le nombre de case doit être inférieur à 20');
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

$(document).on('click', '.case', function(){
    if($(this).parent().hasClass('desactived')){
        return false;
    }
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

}

function initialisationGrille(){
    for(var i=1; i<=nb_cases; i++){
        jeu[currentJ].grille[i] = new Array();
        for(var j=1; j<=nb_cases; j++){
            jeu[currentJ].grille[i][j] = new Object({'etat':null, 'bateau':null});
        }
    }
}

function verifTouche(x,y){
    console.log(jeu[currentJ].grille[x][y]);
    if(jeu[currentJ].grille[x][y].etat == "bateau"){
        jeu[currentJ].grille[x][y].bateau.restant[currentJ]--;
        jeu[currentJ].grille[x][y].etat = "T";
        if(jeu[currentJ].grille[x][y].bateau.restant[currentJ] == 0){
            jeu[currentJ].grille[x][y].bateau.etat[currentJ] = "coule";
            jeu[currentJ].grille[x][y].etat = "coule";
            jeu[currentJ].joueur.nb_touche++;
            console.log('coulé !');
        }else{
            jeu[currentJ].grille[x][y].etat = "touche";
            jeu[currentJ].joueur.nb_touche++;
            jeu[currentJ].grille[x][y].etat = "clique";
        }
    }else if(jeu[currentJ].grille[x][y].etat == "T" || jeu[currentJ].grille[x][y].etat == "X"){
        alert("déjà touché !");
        return false;
    }else{
        console.log("raté");
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
    for(var i=1; i<=nb_cases; i++){
        tableau_html += '<div class="ligne">';
        for(var j=1; j<=nb_cases; j++){
            if(jeu[currentJ].grille[i][j].bateau){
                tableau_html += '<div class="case '+jeu[currentJ].grille[i][j].bateau.etat[currentJ]+' '+jeu[currentJ].grille[i][j].etat+'" style="background-color: '+jeu[currentJ].grille[i][j].bateau.couleur+'" data-x="'+i+'" data-y="'+j+'">'+((jeu[currentJ].grille[i][j].etat == 'clique' || jeu[currentJ].grille[i][j].etat == 'coule')?"X":"")+'</div>';
            }else{
                tableau_html += '<div class="case" data-x="'+i+'" data-y="'+j+'"></div>';
            }
        }
        tableau_html += '</div>';
    }
    console.log("J = " +currentJ);
    $('#tableau-J'+currentJ).html(tableau_html);
}

function bateauHasard(id_bateau){
    // Nombre au hasard entre 1 et longueur max de la grille
    var case_depart_i = Math.floor((Math.random() * nb_cases) + 1);
    var case_depart_j = Math.floor((Math.random() * nb_cases) + 1);
    var orientation = Math.floor((Math.random() * 2));
    orientation = list_orientations[orientation];
    
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

function checkGagnant(){
    console.log(jeu[currentJ]);
    for(J=0; J<2; J++){
        if(jeu[currentJ].joueur.nb_touche == 17){
            alert(jeu[currentJ].joueur.nom + " a gagné !");
        }
        changeUser();
    }
}