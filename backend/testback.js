import PocketBase from 'pocketbase';
const pb = new PocketBase('https://pb-yumly.leo-baudry.fr');
await pb.admins.authWithPassword("lison.pruvost@edu.univ-fcomte.fr", "YUMLYYUMLYYUMLY");


// Récupérer toutes les recettes
export async function getAllRecettes() {
    return await pb.collection('Recette').getFullList({
        sort: 'nom_recette'
    });
}

// Récupérer une recette par ID
export async function getRecetteById(id) {
    return await pb.collection('Recette').getOne(id);
}

// Récupérer tous les noms de recettes
export async function getAllRecetteNames() {
    const recettes = await pb.collection('Recette').getFullList({
        fields: 'id,nom_recette'
    });
    return recettes;
}

// Récupérer toutes les descriptions de recettes
export async function getAllRecetteDescriptions() {
    const recettes = await pb.collection('Recette').getFullList({
        fields: 'id,description_recette'
    });
    return recettes;
}

// Ajouter ou modifier une recette
export async function updateRecette(id, data) {
    await pb.collection('Recette').update(id, data);
}

// Créer une nouvelle recette
export async function createRecette(data) {
    return await pb.collection('Recette').create(data);
}

export async function getRecettesByContinent(continent) {
    if (!continent || continent === "Tous") {
        return await getAllRecettes();
    }

    return await pb.collection('Recette').getFullList({
        filter: `continent = "${continent}"`,
        sort: 'nom_recette'
    });
}

export async function getProduitsAsie() {
    return await pb.collection('Produit').getFullList({
        filter: 'pays_produit = "Asie"',
        sort: 'nom_produit'
    });
}  

export async function getProduitsEurope() {
    return await pb.collection('Produit').getFullList({
        filter: 'pays_produit = "Europe"',
        sort: 'nom_produit'
    });
}

export async function getProduitsAfrique() {
    return await pb.collection('Produit').getFullList({
        filter: 'pays_produit = "Afrique"',
        sort: 'nom_produit'
    });
}

export async function getProduitsLatino() {
    return await pb.collection('Produit').getFullList({
        filter: 'pays_produit = "Amérique latine"',
        sort: 'nom_produit'
    });
}


////////////////////////////////////////

// Fonction pour obtenir l'URL complète d'une image
export function getImageUrl(collection, recordId, filename) {
    if (!filename) return '';
    return `https://pb-yumly.leo-baudry.fr/api/files/${collection.id || collection}/${recordId}/${filename}`;
}

// Fonction pour obtenir la classe de couleur basée sur le continent
export function getColorClass(pays) {
    switch(pays) {
        case 'Amérique latine':
            return 'orange';
        case 'Asie':
            return 'red';
        case 'Afrique':
            return 'green';
        case 'Europe':
        default:
            return 'blue';
    }
}

// Fonction pour parser les données JSON ou texte
export function parseRecetteData(data, fallbackDelimiter = ',') {
    if (!data) return [];
   
    // Si c'est déjà un array
    if (Array.isArray(data)) return data;
   
    // Essayer de parser comme JSON
    try {
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
        // Si ce n'est pas du JSON, diviser par le délimiteur
        if (typeof data === 'string') {
            return data.split(fallbackDelimiter)
                .map(item => item.trim())
                .filter(Boolean);
        }
        return [];
    }
}

// Fonction pour formater les instructions numérotées
export function formatInstructions(instructions) {
    const parsed = parseRecetteData(instructions, '.');
   
    // Si les instructions ne sont pas déjà numérotées
    return parsed.map((instruction, index) => {
        // Enlever les numéros existants au début
        const cleanInstruction = instruction.replace(/^\d+\.?\s*/, '');
        return {
            step: index + 1,
            text: cleanInstruction
        };
    });
}

// Fonction de debug pour voir les données
export function debugRecette(recette) {
    console.log('=== DEBUG RECETTE ===');
    console.log('Nom:', recette.nom_recette);
    console.log('Instructions:', recette.instruction_recette);
    console.log('Ingrédients:', recette.ingredients_recette);
    console.log('Photo grille:', recette.photo_grille_recette);
    console.log('Noms grille:', recette.nom_ingredients_grille_recette);
    console.log('Pays:', recette.pays_recette);
    console.log('==================');
}

// test
// Récupérer toutes les photos de grille d'ingrédients
export async function getAllPhotosGrille() {
    const recettes = await pb.collection('Recette').getFullList({
        fields: 'id,nom_recette,photo_grille_recette,nom_ingredients_grille_recette'
    });
   
    return recettes.filter(recette => recette.photo_grille_recette).map(recette => ({
        id: recette.id,
        nom_recette: recette.nom_recette,
        photo_grille_recette: recette.photo_grille_recette,
        nom_ingredients_grille_recette: recette.nom_ingredients_grille_recette,
        url: getImageUrl('Recette', recette.id, recette.photo_grille_recette)
    }));
}

// Récupérer la photo de grille d'une recette spécifique
export async function getPhotoGrilleById(id) {
    try {
        const recette = await pb.collection('Recette').getOne(id, {
            fields: 'id,nom_recette,photo_grille_recette,nom_ingredients_grille_recette'
        });
       
        if (!recette.photo_grille_recette) {
            return null;
        }
       
        return {
            id: recette.id,
            nom_recette: recette.nom_recette,
            photo_grille_recette: recette.photo_grille_recette,
            nom_ingredients_grille_recette: recette.nom_ingredients_grille_recette,
            url: getImageUrl('Recette', recette.id, recette.photo_grille_recette),
            labels: parseRecetteData(recette.nom_ingredients_grille_recette)
        };
    } catch (error) {
        console.error('Erreur lors de la récupération de la photo grille:', error);
        return null;
    }
}

// Récupérer toutes les recettes qui ont une photo de grille
export async function getRecettesWithPhotoGrille() {
    return await pb.collection('Recette').getFullList({
        filter: 'photo_grille_recette != ""',
        sort: 'nom_recette'
    });
}

// Fonction utilitaire pour vérifier si une recette a une photo de grille
export async function hasPhotoGrille(id) {
    try {
        const recette = await pb.collection('Recette').getOne(id, {
            fields: 'photo_grille_recette'
        });
        return !!recette.photo_grille_recette;
    } catch {
        return false;
    }
}

export function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD") // enlève les accents
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function getAllEpiceries() {
    return await pb.collection('Epicerie').getFullList({
        sort: '-created',
    });
}
  
// test epiceries tt

// Récupérer toutes les épiceries

// Récupérer une épicerie par ID
export async function getEpicerieById(id) {
    return await pb.collection('Epicerie').getOne(id);
}

//test epicerires id

// Fonctions à ajouter dans votre backend existant

// Récupérer toutes les épiceries par catégorie
export async function getEpiceriesByCategorie(categorie) {
    if (!categorie || categorie === "Toutes") {
        return await getAllEpiceries();
    }

    return await pb.collection('Epicerie').getFullList({
        filter: `categorie_epicerie = "${categorie}"`,
        sort: 'nom_epicerie'
    });
}

// Récupérer les épiceries similaires (même catégorie, exclure l'épicerie actuelle)
export async function getEpiceriesSimilaires(id, categorie, limit = 3) {
    return await pb.collection('Epicerie').getFullList({
        filter: `id != "${id}" && categorie_epicerie = "${categorie}"`,
        sort: 'nom_epicerie',
        perPage: limit
    });
}

// Récupérer toutes les catégories d'épiceries disponibles
export async function getAllCategoriesEpiceries() {
    const epiceries = await pb.collection('Epicerie').getFullList({
        fields: 'categorie_epicerie'
    });

    const categories = [...new Set(epiceries.map(e => e.categorie_epicerie))];
    return categories.filter(cat => cat); // Enlever les valeurs vides
}