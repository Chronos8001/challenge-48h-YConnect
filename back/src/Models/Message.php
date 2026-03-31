<?php

namespace App\Models;

/**
 * Classe Message - Modèle d'un message
 */
class Message
{
    private int $id_message;
    private int $id_expediteur;
    private int $id_destinataire;
    private string $message_text;
    private string $date_envoi;

    public function __construct(array $data = [])
    {
        $this->id_message = (int)($data['id_message'] ?? 0);
        $this->id_expediteur = (int)($data['id_expediteur'] ?? 0);
        $this->id_destinataire = (int)($data['id_destinataire'] ?? 0);
        $this->message_text = (string)($data['message_text'] ?? '');
        $this->date_envoi = (string)($data['date_envoi'] ?? '');
    }

    public function getId(): int { return $this->id_message; }
    public function getSenderId(): int { return $this->id_expediteur; }
    public function getRecipientId(): int { return $this->id_destinataire; }
    public function getText(): string { return $this->message_text; }
    public function getDate(): string { return $this->date_envoi; }

    public function toArray(): array
    {
        return [
            'id_message' => $this->id_message,
            'id_expediteur' => $this->id_expediteur,
            'id_destinataire' => $this->id_destinataire,
            'message_text' => $this->message_text,
            'date_envoi' => $this->date_envoi,
        ];
    }
}
