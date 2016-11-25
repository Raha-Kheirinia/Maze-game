/*
Fichier:	labyrinthe.js
Auteur:    Zohreh KHEIRINIA
Matricul:   20002549

Ce programme permet de construire un labyrinthe
*/


//fonction iota: rempli un tableau de n entier de 0 à n-1
var iota =function(n){
    var temp=[];
    for (var i=0; i<n; i++){
      temp.push(i);
    }
     return temp;
};


//fonction contient: verifie si un tableau contient une valeur
var contient=function (tab,x){
    for(var i=0;i<tab.length; i++){
        if ( tab[i]==x){
            return true;
        }
    } return false;
};


//fonction retirer: supprime une valeur d'un tableau
var retire =function (tab,x){
    var newTab=[];
    for ( var i=0; i<tab.length; i++){
        if(x!==tab[i]){
            newTab.push(tab[i]);
        
        }
    }return newTab;
};


//fonction ajouter: ajoute une valeur a un tableau s'il ne contient pas la valeur
var ajouter =function(tab,x){ 
    if (!contient(tab,x)){
         tab.push(x);
    } return tab;
};


//fonction voisins: recherche les cellules voisines de celle passé en paramètre
function voisins(x, y, nx, ny){
    var tab = [];
    var cellule = x + y * nx; //numéro de la cellule d'après  (x, y)
    
    //ajout cellule de droite (est) s'il y a lieu
    if (x < nx - 1)
        tab.push(cellule + 1);
    //ajout cellule de gauche (ouest)
    if (x > 0)
        tab.push(cellule - 1);
    //ajout cellule du bas (sud)
    if (y < ny - 1)
        tab.push(cellule + nx);
    //ajout cellule du haut (nord)
    if (y > 0)
        tab.push(cellule - nx);
    
    return tab;
};

//procédure laby: construit le labyrinthe
function laby(nx, ny, pas){
    var nbCellule = nx * ny; //nombre de cellules dans le labyrinthe
    var mursH = iota(nx * (ny + 1)); //ensemble des murs horizontaux
    var mursV = iota(ny * (nx + 1)); //ensemble des murs verticaux
    mursH = mursH.slice(1, mursH.length - 1); //creation entrée et sortie du labyrinthe
    var nord, sud, ouest, est;
    var cave = [];
    var front = [];
    
    //CREATION DE LA CAVITÉ
    
    while (true) {
        nord = Math.floor(Math.random() * nbCellule);
        //vérifie que la cellule ne fait pas partie du bord du labyrinthe
        if ((nord > nx) && (nord % nx != 0) && (nord < nx * (ny - 1)) && ((nord + 1) % nx != 0))
            break;
    }
    cave.push(nord); // Cavité premiere
    

    var index = 0;
    var caveLength = cave.length - 1;
    while (++caveLength < nbCellule) {
        //remplir front
        do {
            var caveIndex = cave[index];
            var temp = voisins(caveIndex % nx, Math.floor(caveIndex / nx), nx, ny);
            /*Ajouter les cellules voisines des cellules de la cavité 
             qui ne font pas parti de la cavité au front*/
            for (var i = 0, tempLength = temp.length; i < tempLength; i++) {
                var tempIndex = temp[i];
                if (!contient(cave, tempIndex)) {
                    front = ajouter(front, tempIndex);
                }
            }
        } while(++index < caveLength);
        //choisir cellule à ajouter à la cavité
        nord = front[Math.floor(Math.random() * front.length)];//choix d'une cellule du front
        front = retirer(front, nord);
        cave.push(nord);
        //trouver les voisins de cette cellule nouvellement ajoutée
        var choixVoisin = voisins(nord % nx, Math.floor(nord / nx), nx, ny);
        //Passer au travers des voisin
        for (var i = 0, choixLength = choixVoisin.length; i < choixLength; i++) {
            var chxVoisin = choixVoisin[i];
            //Si la cellule voisine fait partie de la cave, retiré le mur qui les sépare
            if (contient(cave, chxVoisin)) {
                sud = nord + nx;
            	ouest = nord + Math.floor(nord / nx);
            	est = ouest + 1;
                var diff = nord - chxVoisin;
                // Choix du mur à retirer
                switch(diff){
                    case -1: 
                        mursV = retirer(mursV, est);
                        break;
                    case 1:
                        mursV = retirer(mursV, ouest);
                        break;
                    case -nx:
                        mursH = retirer(mursH, sud);
                        break;
                    case nx:
                        mursH = retirer(mursH, nord);
                        break;
                }
                break;
            }
        }
    }

    //DESSIN DU LABYRINTHE
    
    //positionne la tortue dans le coin supérieur gauche de la grille
    cs(); pu(); fd(90); lt(90); fd(170); rt(180); pd(); 
    
    //dessine les murs horizontaux
    for (var i = 0; i < ny + 1; i++) {
        for (j = 0; j < nx; j++) {
            if (!contient(mursH, i * nx  + j)) {
                pu(); fd(pas); pd();
            }
            else
                fd(pas);
        }
        pu(); bk(pas * nx); rt(90); fd(pas); lt(90); pd();
    }
    
    //positionne la tortue dans le coin supérieur gauche de la grille
    pu(); rt(90); bk(pas * (ny + 1)); pd();
    
    //dessine les murs verticaux
    for (var i = 0; i < nx + 1; i++) {
        for (j = 0; j < ny; j++) {
            if (!contient(mursV, j * (nx + 1) + i)) {
                pu(); fd(pas); pd();
            }
            else
                fd(pas);
        }
        pu(); bk(pas * ny); lt(90); fd(pas); rt(90); pd();
    }
}


laby(10, 7, 20);





//Les tests unitaires pertinents
function testIota(){
    assert(iota(5)== "0,1,2,3,4"); 
    assert(iota(0)=="");
}
testIota();

function testContient(){
    assert(contient ([9, 2, 5], 2)== true); 
    assert(contient ([9, 2, 5], 4)== false);
};
testContient();

function testAjouter(){
    assert(ajouter ([9, 2, 5], 2)== "9,2,5"); 
    assert(ajouter ([9, 2, 5], 4)== "9,2,5,4");
};
testAjouter();

function testRetirer(){
    assert(retirer ([9, 2, 5], 2)== "9,5"); 
    assert(retirer ([9, 2, 5], 4)== "9,2,5");
};
testRetirer();

function testVoisins(){
    assert(voisins ((7,2,8,4)== "15,22,31")); 
    assert(voisins ((6,1,32,16)== "6,37,70,39"));
};
testVoisins();


