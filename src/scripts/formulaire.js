export default function formulaire() {
  return {
    nom: '',
    prenom: '',
    email: '',
    objet: '',
    message: '',

    async envoyer() {
      // Validation côté client
      if (!this.nom.trim() || !this.prenom.trim() || !this.email.trim() || !this.objet.trim() || !this.message.trim()) {
        alert('Tous les champs sont obligatoires');
        return;
      }

      // Validation email simple
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        alert('Veuillez saisir une adresse email valide');
        return;
      }

      const formData = {
        nom: this.nom.trim(),
        prenom: this.prenom.trim(),
        email: this.email.trim(),
        objet: this.objet.trim(),
        message: this.message.trim(),
      };

      try {
        const response = await fetch('https://pb-yumly.leo-baudry.fr/api/collections/contact/records', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();

          // Affichage plus détaillé des erreurs de validation
          if (errorData.data && typeof errorData.data === 'object') {
            const errors = [];
            for (const [field, fieldErrors] of Object.entries(errorData.data)) {
              if (Array.isArray(fieldErrors)) {
                errors.push(`${field}: ${fieldErrors.join(', ')}`);
              } else if (typeof fieldErrors === 'object' && fieldErrors.message) {
                errors.push(`${field}: ${fieldErrors.message}`);
              } else {
                errors.push(`${field}: ${JSON.stringify(fieldErrors)}`);
              }
            }
            alert(`Erreurs de validation :\n${errors.join('\n')}`);
          } else {
            alert(`Erreur serveur : ${response.status} - ${errorData.message || 'Pas de message'}`);
          }
          return;
        }

        await response.json();
        alert("Message envoyé et enregistré !");

        // Réinitialiser les champs
        this.nom = '';
        this.prenom = '';
        this.email = '';
        this.objet = '';
        this.message = '';

      } catch (error) {
        alert("Erreur lors de l'enregistrement. Merci de réessayer.");
      }
    }
  };
}
