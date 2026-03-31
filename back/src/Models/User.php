<?php

namespace App\Models;

/**
 * Classe User - Modèle de l'utilisateur
 * Encapsulation des données utilisateur
 */
class User
{
    private int $id_user;
    private string $nom;
    private string $prenom;
    private string $email;
    private int $role;
    private string $filiere;
    private ?string $description;
    private ?string $image_profile;
    private ?array $competences;

    public function __construct(array $data = [])
    {
        $this->id_user = (int)($data['id_user'] ?? 0);
        $this->nom = (string)($data['nom'] ?? '');
        $this->prenom = (string)($data['prenom'] ?? '');
        $this->email = (string)($data['email'] ?? '');
        $this->role = (int)($data['role'] ?? 0);
        $this->filiere = (string)($data['filiere'] ?? '');
        $this->description = $data['description'] ?? null;
        $this->image_profile = $data['image_profile'] ?? null;
        $this->competences = $data['competences'] ?? [];
    }

    // Getters avec encapsulation
    public function getId(): int { return $this->id_user; }
    public function getNom(): string { return $this->nom; }
    public function getPrenom(): string { return $this->prenom; }
    public function getEmail(): string { return $this->email; }
    public function getRole(): int { return $this->role; }
    public function getFiliere(): string { return $this->filiere; }
    public function getDescription(): ?string { return $this->description; }
    public function getImageProfile(): ?string { return $this->image_profile; }
    public function getCompetences(): array { return $this->competences; }

    // Setters
    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function setFiliere(string $filiere): self
    {
        $this->filiere = $filiere;
        return $this;
    }

    public function setCompetences(array $competences): self
    {
        $this->competences = $competences;
        return $this;
    }

    public function setImageProfile(string $image): self
    {
        $this->image_profile = $image;
        return $this;
    }

    /**
     * Retourne les données en tableau
     */
    public function toArray(): array
    {
        return [
            'id_user' => $this->id_user,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'email' => $this->email,
            'role' => $this->role,
            'filiere' => $this->filiere,
            'description' => $this->description,
            'image_profile' => $this->image_profile,
            'competences' => $this->competences,
        ];
    }

    /**
     * Vérifie si l'utilisateur est admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 1;
    }

    /**
     * Retourne le nom complet
     */
    public function getFullName(): string
    {
        return trim("{$this->prenom} {$this->nom}");
    }
}
