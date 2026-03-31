<?php

namespace App\Models;

/**
 * Classe Post - Modèle d'un post
 */
class Post
{
    private int $id_post;
    private int $id_auteur;
    private string $contenu;
    private ?string $image_url;
    private string $date_publi;
    private string $prenom;
    private string $nom;
    private ?string $image_profile;

    public function __construct(array $data = [])
    {
        $this->id_post = (int)($data['id_post'] ?? 0);
        $this->id_auteur = (int)($data['id_auteur'] ?? 0);
        $this->contenu = (string)($data['contenu'] ?? '');
        $this->image_url = $data['image_url'] ?? null;
        $this->date_publi = (string)($data['date_publi'] ?? '');
        $this->prenom = (string)($data['prenom'] ?? '');
        $this->nom = (string)($data['nom'] ?? '');
        $this->image_profile = $data['image_profile'] ?? null;
    }

    public function getId(): int { return $this->id_post; }
    public function getAuthorId(): int { return $this->id_auteur; }
    public function getContent(): string { return $this->contenu; }
    public function getImageUrl(): ?string { return $this->image_url; }
    public function getDate(): string { return $this->date_publi; }
    public function getAuthorName(): string { return trim("{$this->prenom} {$this->nom}"); }
    public function getAuthorImage(): ?string { return $this->image_profile; }

    public function toArray(): array
    {
        return [
            'id_post' => $this->id_post,
            'id_auteur' => $this->id_auteur,
            'contenu' => $this->contenu,
            'image_url' => $this->image_url,
            'date_publi' => $this->date_publi,
            'prenom' => $this->prenom,
            'nom' => $this->nom,
            'image_profile' => $this->image_profile,
        ];
    }
}
