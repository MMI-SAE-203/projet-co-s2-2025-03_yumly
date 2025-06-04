export default function formulaire() {
  return {
    nom: '',
    prenom: '',
    email: '',
    objet: '',
    message: '',
    showNotification: false,
    notificationMessage: '',
    notificationType: 'success', // 'success' ou 'error'

    async envoyer() {
      // Validation côté client
      if (!this.nom.trim() || !this.prenom.trim() || !this.email.trim() || !this.objet.trim() || !this.message.trim()) {
        this.showNotificationMessage('Tous les champs sont obligatoires', 'error');
        return;
      }

      // Validation email simple
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.showNotificationMessage('Veuillez saisir une adresse email valide', 'error');
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
            this.showNotificationMessage(`Erreurs de validation :\n${errors.join('\n')}`, 'error');
          } else {
            this.showNotificationMessage(`Erreur serveur : ${response.status} - ${errorData.message || 'Pas de message'}`, 'error');
          }
          return;
        }

        await response.json();
        this.showNotificationMessage("Message envoyé et enregistré avec succès !", 'success');

        // Réinitialiser les champs
        this.nom = '';
        this.prenom = '';
        this.email = '';
        this.objet = '';
        this.message = '';

      } catch (error) {
        this.showNotificationMessage("❌ Erreur lors de l'enregistrement. Merci de réessayer.", 'error');
      }
    },

    showNotificationMessage(message, type = 'success') {
      this.notificationMessage = message;
      this.notificationType = type;
      this.showNotification = true;
      
      // Auto-hide après 5 secondes
      setTimeout(() => {
        this.showNotification = false;
      }, 5000);
    },

    hideNotification() {
      this.showNotification = false;
    }
  };
}