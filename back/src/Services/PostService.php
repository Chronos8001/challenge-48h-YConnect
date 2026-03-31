<?php

namespace App\Services;

use App\Models\Post;

/**
 * Classe PostService - Gestion des posts
 * Hérite de BaseService
 */
class PostService extends BaseService
{
    /**
     * Crée un nouveau post
     */
    public function create(int $userId, string $content, ?string $imageUrl = null): Post
    {
        if (empty(trim($content))) {
            throw new \Exception('Le contenu du post ne peut pas être vide');
        }

        $sql = 'INSERT INTO posts (id_auteur, contenu, image_url, date_publi)
                VALUES (:userId, :content, :image, NOW())';
        
        $this->db->execute($sql, [
            'userId' => $userId,
            'content' => $content,
            'image' => $imageUrl,
        ]);

        $postId = $this->getPdo()->lastInsertId();
        return $this->getPostById((int)$postId);
    }

    /**
     * Récupère tous les posts
     */
    public function getAllPosts(): array
    {
        $sql = 'SELECT p.*, u.nom, u.prenom, u.image_profile 
                FROM posts p
                JOIN users u ON p.id_auteur = u.id_user
                ORDER BY p.date_publi DESC';
        
        $posts = $this->db->fetchAll($sql);
        return array_map(fn($row) => new Post($row), $posts);
    }

    /**
     * Récupère un post par ID
     */
    public function getPostById(int $postId): Post
    {
        $sql = 'SELECT p.*, u.nom, u.prenom, u.image_profile 
                FROM posts p
                JOIN users u ON p.id_auteur = u.id_user
                WHERE p.id_post = :id';
        
        $postData = $this->db->fetchOne($sql, ['id' => $postId]);
        if (!$postData) {
            throw new \Exception('Post non trouvé');
        }

        return new Post($postData);
    }

    /**
     * Supprime un post (seulement par l'auteur)
     */
    public function deletePost(int $postId, int $userId): void
    {
        $post = $this->getPostById($postId);
        if ($post->getAuthorId() !== $userId) {
            throw new \Exception('Acces refusé');
        }

        $sql = 'DELETE FROM posts WHERE id_post = :id';
        $this->db->execute($sql, ['id' => $postId]);
    }

    /**
     * Ajoute un like/dislike
     */
    public function toggleLike(int $postId, int $userId, string $type): void
    {
        if (!in_array($type, ['like', 'dislike'])) {
            throw new \Exception('Type de vote invalide');
        }

        // Vérifie si existe déjà
        $sql = 'SELECT id_like FROM likes WHERE id_post = :postId AND id_user = :userId';
        $existing = $this->db->fetchOne($sql, ['postId' => $postId, 'userId' => $userId]);

        if ($existing) {
            $this->db->execute('DELETE FROM likes WHERE id_post = :postId AND id_user = :userId', 
                ['postId' => $postId, 'userId' => $userId]);
        } else {
            $sql = 'INSERT INTO likes (id_post, id_user, type) 
                    VALUES (:postId, :userId, :type)';
            $this->db->execute($sql, [
                'postId' => $postId,
                'userId' => $userId,
                'type' => $type,
            ]);
        }
    }
}
