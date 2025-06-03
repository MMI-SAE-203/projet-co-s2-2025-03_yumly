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
