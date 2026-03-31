<?php

namespace App\Services;

use App\Models\User;

/**
 * Classe ProfileService - Gestion des profils utilisateurs
 * Hérite de BaseService
 */
class ProfileService extends BaseService
{
    /**
     * Met à jour le profil d'un utilisateur
     */
    public function updateProfile(int $userId, array $data): User
    {
        $updates = [];
        $params = ['userId' => $userId];

        if (isset($data['description'])) {
            $updates[] = 'description = :description';
            $params['description'] = $data['description'];
        }

        if (isset($data['filiere'])) {
            $updates[] = 'filiere = :filiere';
            $params['filiere'] = $data['filiere'];
        }

        if (isset($data['image_url'])) {
            $updates[] = 'image_profile = :image_url';
            $params['image_url'] = $data['image_url'];
        }

        if (!empty($updates)) {
            $sql = 'UPDATE users SET ' . implode(', ', $updates) . ' WHERE id_user = :userId';
            $this->db->execute($sql, $params);
        }

        // Mise à jour des compétences
        if (isset($data['competences'])) {
            $this->updateCompetences($userId, $data['competences']);
        }

        return $this->getUserProfile($userId);
    }

    /**
     * Récupère le profil d'un utilisateur
     */
    public function getUserProfile(int $userId): User
    {
        $sql = 'SELECT u.*, GROUP_CONCAT(c.competence) as competences 
                FROM users u
                LEFT JOIN competences c ON u.id_user = c.id_user
                WHERE u.id_user = :id
                GROUP BY u.id_user';
        
        $userData = $this->db->fetchOne($sql, ['id' => $userId]);
        if (!$userData) {
            throw new \Exception('Utilisateur non trouvé');
        }

        if ($userData['competences']) {
            $userData['competences'] = explode(',', $userData['competences']);
        }

        return new User($userData);
    }

    /**
     * Met à jour les compétences d'un utilisateur
     */
    private function updateCompetences(int $userId, array $competences): void
    {
        // Supprime les anciens
        $this->db->execute('DELETE FROM competences WHERE id_user = :userId', 
            ['userId' => $userId]);

        // Insère les nouveaux
        foreach ($competences as $competence) {
            $competence = trim($competence);
            if (!empty($competence)) {
                $this->db->execute(
                    'INSERT INTO competences (id_user, competence) VALUES (:userId, :competence)',
                    ['userId' => $userId, 'competence' => $competence]
                );
            }
        }
    }
}
