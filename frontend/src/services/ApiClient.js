/**
 * Classe ApiClient - Abstraction pour les appels API
 * Démontre la POO en JavaScript
 */
class ApiClient {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
  }

  /**
   * Effectue une requête API
   * @private
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Erreur API');
      }

      return data;
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  }

  // ===== AUTH METHODS =====
  async login(email, mdp) {
    return this.request('/auth/login.php', {
      method: 'POST',
      body: JSON.stringify({ email, mdp }),
    });
  }

  async register(nom, prenom, email, mdp) {
    return this.request('/auth/register.php', {
      method: 'POST',
      body: JSON.stringify({ nom, prenom, email, mdp }),
    });
  }

  async getMe() {
    return this.request('/auth/me.php', { method: 'GET' });
  }

  async logout() {
    return this.request('/auth/logout.php', { method: 'POST' });
  }

  // ===== POST METHODS =====
  async getPosts() {
    return this.request('/posts/list.php', { method: 'GET' });
  }

  async createPost(contenu, imageUrl = null) {
    return this.request('/posts/create.php', {
      method: 'POST',
      body: JSON.stringify({ contenu, image_url: imageUrl }),
    });
  }

  async deletePost(postId) {
    return this.request('/posts/delete.php', {
      method: 'POST',
      body: JSON.stringify({ id_post: postId }),
    });
  }

  async togglePostLike(postId, type) {
    return this.request('/posts/like.php', {
      method: 'POST',
      body: JSON.stringify({ id_post: postId, type }),
    });
  }

  // ===== MESSAGE METHODS =====
  async getMessages(userId) {
    return this.request(`/messages/thread.php?user_id=${userId}`, {
      method: 'GET',
    });
  }

  async sendMessage(destinataireId, messageText) {
    return this.request('/messages/send.php', {
      method: 'POST',
      body: JSON.stringify({ destinataire_id: destinataireId, message_text: messageText }),
    });
  }

  async getContacts() {
    return this.request('/messages/users.php', { method: 'GET' });
  }

  // ===== PROFILE METHODS =====
  async getProfile() {
    return this.request('/profile/me.php', { method: 'GET' });
  }

  async updateProfile(data) {
    return this.request('/profile/update.php', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async uploadProfileImage(imageUrl) {
    return this.request('/uploads/profile.php', {
      method: 'POST',
      body: JSON.stringify({ image_url: imageUrl }),
    });
  }

  async getUserProfile(userId) {
    return this.request(`/users/profile.php?user_id=${userId}`, {
      method: 'GET',
    });
  }

  async searchUsers(query) {
    return this.request(`/users/search.php?q=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  }

  // ===== NEWS METHODS =====
  async getNews() {
    return this.request('/news/list.php', { method: 'GET' });
  }

  async createNews(titre, description, type_event, date_event) {
    return this.request('/news/create.php', {
      method: 'POST',
      body: JSON.stringify({ titre, description, type_event, date_event }),
    });
  }
}

export default ApiClient;
