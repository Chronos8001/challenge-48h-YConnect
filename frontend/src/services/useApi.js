/**
 * Exemple de refactorisation avec POO
 * Cet exemple montre comment utiliser ApiClient et les modèles
 * 
 * Au lieu de :
 * - Appels fetch répétés dans le composant
 * - Variables d'état dispersées
 * 
 * Maintenant :
 * - Un service centralisé (ApiClient)
 * - Modèles de données encapsulés
 * - Logique métier séparée
 */

import ApiClient from '../services/ApiClient';
import { User, Post, Message } from '../services/models';

// Créer une instance unique du client API
const apiClient = new ApiClient('/api');

// Exemples d'utilisation dans votre composant

export async function loadUserProfile(userId) {
  try {
    const response = await apiClient.getUserProfile(userId);
    return new User(response.profile);
  } catch (error) {
    console.error('Failed to load profile:', error);
    return null;
  }
}

export async function loadPosts() {
  try {
    const response = await apiClient.getPosts();
    return response.posts.map(data => new Post(data));
  } catch (error) {
    console.error('Failed to load posts:', error);
    return [];
  }
}

export async function createNewPost(content, imageUrl = null) {
  try {
    const response = await apiClient.createPost(content, imageUrl);
    return new Post(response.post);
  } catch (error) {
    console.error('Failed to create post:', error);
    throw error;
  }
}

export async function deleteUserPost(postId) {
  try {
    await apiClient.deletePost(postId);
  } catch (error) {
    console.error('Failed to delete post:', error);
    throw error;
  }
}

export async function toggleLikePost(postId, type) {
  try {
    await apiClient.togglePostLike(postId, type);
  } catch (error) {
    console.error('Failed to toggle like:', error);
    throw error;
  }
}

export async function loadMessages(userId) {
  try {
    const response = await apiClient.getMessages(userId);
    return response.messages.map(data => new Message(data));
  } catch (error) {
    console.error('Failed to load messages:', error);
    return [];
  }
}

export async function sendUserMessage(recipientId, text) {
  try {
    const response = await apiClient.sendMessage(recipientId, text);
    return new Message(response.message);
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
}

export async function loadContacts() {
  try {
    const response = await apiClient.getContacts();
    return response.users.map(data => new User(data));
  } catch (error) {
    console.error('Failed to load contacts:', error);
    return [];
  }
}

export async function searchUsersByQuery(query) {
  try {
    const response = await apiClient.searchUsers(query);
    return response.users.map(data => new User(data));
  } catch (error) {
    console.error('Failed to search users:', error);
    return [];
  }
}

export async function updateUserProfile(data) {
  try {
    const response = await apiClient.updateProfile(data);
    return new User(response.profile);
  } catch (error) {
    console.error('Failed to update profile:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const response = await apiClient.getMe();
    return new User(response.user);
  } catch (error) {
    console.error('Failed to get current user:', error);
    return null;
  }
}

export async function userLogin(email, password) {
  try {
    const response = await apiClient.login(email, password);
    return new User(response.user);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function userLogout() {
  try {
    await apiClient.logout();
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

// Export aussi l'ApiClient pour usage direct si besoin
export { apiClient };
