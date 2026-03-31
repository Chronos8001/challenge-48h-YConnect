<?php

namespace App;

use PDO;
use PDOException;

/**
 * Classe Database - Gestion de la connexion PDO
 * Utilise le pattern Singleton
 */
class Database
{
    private static ?self $instance = null;
    private PDO $pdo;

    private function __construct()
    {
        try {
            $this->pdo = new PDO(
                sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', 
                    $_ENV['DB_HOST'] ?? 'localhost',
                    $_ENV['DB_NAME'] ?? 'yconnect'
                ),
                $_ENV['DB_USER'] ?? 'root',
                $_ENV['DB_PASS'] ?? '',
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        } catch (PDOException $e) {
            throw new DatabaseException('Erreur de connexion base de données: ' . $e->getMessage());
        }
    }

    /**
     * Obtient l'instance unique de la connexion
     */
    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Retourne la connexion PDO
     */
    public function getConnection(): PDO
    {
        return $this->pdo;
    }

    /**
     * Prépare et exécute une requête
     */
    public function execute(string $sql, array $params = []): bool
    {
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($params);
    }

    /**
     * Récupère un seul résultat
     */
    public function fetchOne(string $sql, array $params = []): ?array
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $result = $stmt->fetch();
        return $result ?: null;
    }

    /**
     * Récupère tous les résultats
     */
    public function fetchAll(string $sql, array $params = []): array
    {
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    // Interdire le clonage
    private function __clone() {}

    public function __wakeup() {}
}

class DatabaseException extends \Exception {}
