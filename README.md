# challenge-48h-YConnect

Structure du projet (authentification + base de donnees) :

```text
challenge-48h-YConnect/
├── index.php                 # Redirige vers /public
├── README.md
├── assets/
│   └── css/
│       └── styles.css        # Styles communs
├── config/
│   └── database.php          # Connexion PDO
├── database/
│   └── init_db.php           # Creation des tables SQL
└── public/
	├── index.php             # Point d'entree web
	├── register.php          # Inscription
	├── login.php             # Connexion
	├── dashboard.php         # Page protegee
	└── logout.php            # Deconnexion
```

Lancement rapide :

1. Verifier que la base `yconnect` existe dans MySQL.
2. Ouvrir `http://localhost/challenge-48h-YConnect/database/init_db.php` une fois pour creer les tables.
3. Ouvrir `http://localhost/challenge-48h-YConnect/` pour acceder a l'inscription/connexion.

Identifiants SQL utilises actuellement dans `config/database.php` :

- host: `localhost`
- dbname: `yconnect`
- username: `root`
- password: vide