<?php

namespace App\Services;

use App\Database;

/**
 * Classe abstraite BaseService
 * Classe parente pour tous les services
 * Démontre l'héritage
 */
abstract class BaseService
{
    protected Database $db;

    public function __construct()
    {
        $this->db = Database::getInstance();
    }

    /**
     * Récupère la connexion PDO
     */
    protected function getPdo()
    {
        return $this->db->getConnection();
    }

    /**
     * Méthode de validation commune
     */
    protected function validate(array $data, array $required): array
    {
        $errors = [];
        foreach ($required as $field) {
            if (!isset($data[$field]) || trim((string)$data[$field]) === '') {
                $errors[] = "Le champ '$field' est requis";
            }
        }
        return $errors;
    }

    /**
     * Sanitize une chaîne
     */
    protected function sanitize(string $str): string
    {
        return trim(htmlspecialchars($str, ENT_QUOTES, 'UTF-8'));
    }
}
