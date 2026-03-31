/**
 * Classe User - Modèle utilisateur côté client
 */
class User {
  constructor(data = {}) {
    this.id_user = data.id_user || null;
    this.nom = data.nom || '';
    this.prenom = data.prenom || '';
    this.email = data.email || '';
    this.role = data.role || 0;
    this.filiere = data.filiere || '';
    this.description = data.description || '';
    this.image_profile = data.image_profile || null;
    this.competences = data.competences || [];
  }

  getFullName() {
    return `${this.prenom} ${this.nom}`.trim();
  }

  isAdmin() {
    return this.role === 1;
  }

  toJSON() {
    return {
      id_user: this.id_user,
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      role: this.role,
      filiere: this.filiere,
      description: this.description,
      image_profile: this.image_profile,
      competences: this.competences,
    };
  }
}

/**
 * Classe Post - Modèle post côté client
 */
class Post {
  constructor(data = {}) {
    this.id_post = data.id_post || null;
    this.id_auteur = data.id_auteur || null;
    this.contenu = data.contenu || '';
    this.image_url = data.image_url || null;
    this.date_publi = data.date_publi || null;
    this.prenom = data.prenom || '';
    this.nom = data.nom || '';
    this.image_profile = data.image_profile || null;
    this.likes = data.likes || 0;
    this.dislikes = data.dislikes || 0;
  }

  getAuthorName() {
    return `${this.prenom} ${this.nom}`.trim();
  }

  toJSON() {
    return {
      id_post: this.id_post,
      id_auteur: this.id_auteur,
      contenu: this.contenu,
      image_url: this.image_url,
      date_publi: this.date_publi,
      prenom: this.prenom,
      nom: this.nom,
      image_profile: this.image_profile,
    };
  }
}

/**
 * Classe Message - Modèle message côté client
 */
class Message {
  constructor(data = {}) {
    this.id_message = data.id_message || null;
    this.id_expediteur = data.id_expediteur || null;
    this.id_destinataire = data.id_destinataire || null;
    this.message_text = data.message_text || '';
    this.date_envoi = data.date_envoi || null;
  }

  toJSON() {
    return {
      id_message: this.id_message,
      id_expediteur: this.id_expediteur,
      id_destinataire: this.id_destinataire,
      message_text: this.message_text,
      date_envoi: this.date_envoi,
    };
  }
}

export { User, Post, Message };
