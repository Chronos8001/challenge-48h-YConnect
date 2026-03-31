<?php

namespace App\Services;

use App\Models\Message;
use App\Models\User;

/**
 * Classe MessageService - Gestion des messages
 * Hérite de BaseService
 */
class MessageService extends BaseService
{
    /**
     * Envoie un message
     */
    public function sendMessage(int $senderId, int $recipientId, string $text): Message
    {
        if (empty(trim($text))) {
            throw new \Exception('Le message ne peut pas être vide');
        }

        $sql = 'INSERT INTO messages (id_expediteur, id_destinataire, message_text, date_envoi)
                VALUES (:senderId, :recipientId, :text, NOW())';
        
        $this->db->execute($sql, [
            'senderId' => $senderId,
            'recipientId' => $recipientId,
            'text' => $text,
        ]);

        $messageId = $this->getPdo()->lastInsertId();
        return $this->getMessageById((int)$messageId);
    }

    /**
     * Récupère le fil de conversation entre deux utilisateurs
     */
    public function getThread(int $userId1, int $userId2): array
    {
        $sql = 'SELECT * FROM messages 
                WHERE (id_expediteur = :user1 AND id_destinataire = :user2)
                   OR (id_expediteur = :user2 AND id_destinataire = :user1)
                ORDER BY date_envoi ASC';
        
        $messages = $this->db->fetchAll($sql, [
            'user1' => $userId1,
            'user2' => $userId2,
        ]);

        return array_map(fn($row) => new Message($row), $messages);
    }

    /**
     * Récupère un message par ID
     */
    public function getMessageById(int $messageId): Message
    {
        $sql = 'SELECT * FROM messages WHERE id_message = :id';
        $messageData = $this->db->fetchOne($sql, ['id' => $messageId]);
        
        if (!$messageData) {
            throw new \Exception('Message non trouvé');
        }

        return new Message($messageData);
    }

    /**
     * Récupère tous les contacts d'un utilisateur
     */
    public function getContacts(int $userId): array
    {
        $sql = 'SELECT DISTINCT u.*, 
                       GROUP_CONCAT(DISTINCT c.competence) as competences
                FROM users u
                WHERE u.id_user != :userId
                LEFT JOIN competences c ON u.id_user = c.id_user
                GROUP BY u.id_user';
        
        $contacts = $this->db->fetchAll($sql, ['userId' => $userId]);
        return array_map(fn($row) => new User($row), $contacts);
    }
}
