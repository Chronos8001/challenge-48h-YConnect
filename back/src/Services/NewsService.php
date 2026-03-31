<?php

namespace App\Services;

/**
 * Classe NewsService - Gestion des news
 * Hérite de BaseService
 */
class NewsService extends BaseService
{
    /**
     * Crée une nouvelle news (admin uniquement)
     */
    public function create(string $titre, string $description, string $type_event, string $date_event, int $userId): array
    {
        $sql = 'INSERT INTO news (titre, description, type_event, date_event, id_user)
                VALUES (:titre, :desc, :type, :date, :userId)';
        
        $this->db->execute($sql, [
            'titre' => $titre,
            'desc' => $description,
            'type' => $type_event,
            'date' => $date_event,
            'userId' => $userId,
        ]);

        $newsId = $this->getPdo()->lastInsertId();
        return $this->getNewsById((int)$newsId);
    }

    /**
     * Récupère toutes les news
     */
    public function getAllNews(): array
    {
        $sql = 'SELECT * FROM news ORDER BY date_event DESC';
        return $this->db->fetchAll($sql);
    }

    /**
     * Récupère une news par ID
     */
    public function getNewsById(int $newsId): array
    {
        $sql = 'SELECT * FROM news WHERE id_news = :id';
        $news = $this->db->fetchOne($sql, ['id' => $newsId]);
        
        if (!$news) {
            throw new \Exception('News non trouvée');
        }

        return $news;
    }
}
