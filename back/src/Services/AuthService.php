<?php

namespace App\Services;

use App\Models\User;

/**
 * Classe AuthService - Gestion de l'authentification
 * Hérite de BaseService
 */
class AuthService extends BaseService
{
    /**
     * Enregistre un nouvel utilisateur
     */
    public function register(string $nom, string $prenom, string $email, string $mdp): User
    {
        $sql = 'SELECT id_user FROM users WHERE email = :email LIMIT 1';
        $existing = $this->db->fetchOne($sql, ['email' => $email]);
        
        if ($existing) {
            throw new \Exception('Email déjà utilisé');
        }

        $hashedPassword = password_hash($mdp, PASSWORD_BCRYPT);
        $sql = 'INSERT INTO users (nom, prenom, email, mdp, role, filiere) 
                VALUES (:nom, :prenom, :email, :mdp, 0, "")';
        
        $this->db->execute($sql, [
            'nom' => $nom,
            'prenom' => $prenom,
            'email' => $email,
            'mdp' => $hashedPassword,
        ]);

        $userId = $this->getPdo()->lastInsertId();
        return $this->getUserById((int)$userId);
    }

    /**
     * Authenticate un utilisateur
     */
    public function login(string $email, string $mdp): User
    {
        $sql = 'SELECT * FROM users WHERE email = :email LIMIT 1';
        $userData = $this->db->fetchOne($sql, ['email' => $email]);

        if (!$userData || !password_verify($mdp, $userData['mdp'])) {
            throw new \Exception('Identifiants invalides');
        }

        return new User($userData);
    }

    /**
     * Récupère un utilisateur par ID
     */
    public function getUserById(int $userId): User
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
     * Recherche des utilisateurs
     */
    public function searchUsers(string $query): array
    {
        $query = "%{$query}%";
        $sql = 'SELECT u.*, GROUP_CONCAT(c.competence) as competences 
                FROM users u
                LEFT JOIN competences c ON u.id_user = c.id_user
                WHERE u.nom LIKE :q OR u.prenom LIKE :q OR u.email LIKE :q
                GROUP BY u.id_user
                LIMIT 20';
        
        $results = $this->db->fetchAll($sql, ['q' => $query]);
        return array_map(fn($row) => new User($row), $results);
    }
}
