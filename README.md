# 🏢 ImmoCorp — Backend API

> **Plateforme de gestion locative immobilière**  
> Backend REST API développé avec Spring Boot 3.4.3, PostgreSQL et JWT

---

## 📋 Table des matières

- [Présentation du projet](#-présentation-du-projet)
- [Architecture technique](#-architecture-technique)
- [Prérequis](#-prérequis)
- [Installation & Configuration](#-installation--configuration)
- [Variables d'environnement (.env)](#-variables-denvironnement-env)
- [Structure du projet](#-structure-du-projet)
- [Entités & Modèle de données](#-entités--modèle-de-données)
- [Endpoints API](#-endpoints-api)
- [Authentification JWT](#-authentification-jwt)
- [Gestion des rôles](#-gestion-des-rôles)
- [Génération de PDF](#-génération-de-pdf)
- [Intégration FedaPay](#-intégration-fedapay)
- [Alertes automatiques](#-alertes-automatiques)
- [Notifications Email](#-notifications-email)
- [Notifications SMS Twilio](#-notifications-sms-twilio)
- [Documentation Swagger](#-documentation-swagger)
- [Déploiement](#-déploiement)
- [Dépannage](#-dépannage)

---

## 🎯 Présentation du projet

ImmoCorp est une API REST complète pour la gestion locative immobilière. Elle permet aux propriétaires de :

- Gérer leur portefeuille de biens immobiliers
- Suivre leurs locataires et les baux en cours
- Enregistrer les paiements de loyer
- Générer automatiquement des quittances PDF
- Recevoir des alertes par email en cas de retard de paiement
- Notifier les locataires par SMS (Twilio) et WhatsApp (CallMeBot)
- Initier des paiements mobiles via FedaPay

---

## 🏗 Architecture technique

```
┌─────────────────────────────────────────────────────┐
│                   Flutter (Frontend)                 │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP / REST / JSON
┌─────────────────────▼───────────────────────────────┐
│              Spring Boot API (Backend)               │
│                                                      │
│  Controllers → Services → Repositories → Entities   │
│                                                      │
│  Spring Security (JWT) + Spring Data JPA             │
└──────────┬──────────────────────┬───────────────────┘
           │                      │
┌──────────▼──────────┐  ┌───────▼───────────────────┐
│  PostgreSQL Database │  │  Services externes        │
└─────────────────────┘  │  - FedaPay (paiements)    │
                         │  - Gmail SMTP (emails)     │
                         │  - Twilio (SMS)            │
                         │  - CallMeBot (WhatsApp)    │
                         └───────────────────────────┘
```

### Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| Java | 21 (LTS) | Langage |
| Spring Boot | 3.4.3 | Framework principal |
| Spring Security | 6.4.3 | Sécurité & Auth |
| Spring Data JPA | 3.4.3 | Accès base de données |
| Hibernate | 6.6.8 | ORM |
| PostgreSQL | 42.7.4 | Base de données |
| JWT (jjwt) | 0.12.6 | Tokens d'authentification |
| iText PDF | 5.5.13.3 | Génération de quittances PDF |
| springdoc-openapi | 2.3.0 | Documentation Swagger |
| Lombok | 1.18.36 | Réduction du boilerplate |
| dotenv-java | 3.0.0 | Chargement variables .env |
| Twilio SDK | latest | Envoi SMS |
| Maven | 3.x | Gestionnaire de dépendances |

---

## ⚙️ Prérequis

- **Java 21** — [Télécharger Temurin 21](https://adoptium.net/temurin/releases/?version=21)
- **Maven 3.8+** — [Télécharger Maven](https://maven.apache.org/download.cgi)
- **PostgreSQL 14+** — [Télécharger PostgreSQL](https://www.postgresql.org/download/)
- **IntelliJ IDEA** (recommandé) ou VS Code

```bash
java -version        # openjdk 21.x.x
mvn -version         # Apache Maven 3.x.x
psql --version       # psql 14.x ou supérieur
```

---

## 🚀 Installation & Configuration

### 1. Cloner le projet

```bash
git clone https://github.com/mood350/immocorp.git
cd immocorp-backend
```

### 2. Créer la base de données PostgreSQL

```sql
psql -U postgres
CREATE DATABASE immocorp;
```

### 3. Créer le fichier `.env` à la racine du projet

```env
# Base de données
DB_URL=jdbc:postgresql://localhost:5432/immocorp
DB_USERNAME=postgres
DB_PASSWORD=VOTRE_MOT_DE_PASSE

# JWT
JWT_SECRET=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
JWT_EXPIRATION=86400000

# Mail Gmail
MAIL_USERNAME=VOTRE_EMAIL@gmail.com
MAIL_PASSWORD=VOTRE_APP_PASSWORD

# FedaPay
FEDAPAY_API_KEY=sk_sandbox_VOTRE_CLE
FEDAPAY_CALLBACK_URL=http://localhost:8080/api/paiements/fedapay/callback

# Twilio SMS
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX

# WhatsApp CallMeBot
WHATSAPP_APIKEY=XXXXXX

# Upload PDF
UPLOAD_DIR=./uploads/quittances/
```

> ⚠️ **Ne jamais committer le fichier `.env`** — ajoutez-le dans `.gitignore`

### 4. Compiler et lancer

```bash
mvn clean install -U
mvn spring-boot:run
```

L'API est disponible sur : `http://localhost:8080`

---

## 🔐 Variables d'environnement (.env)

Le projet utilise **dotenv-java** pour charger les variables d'environnement depuis un fichier `.env` local. En production, les vraies variables système sont utilisées automatiquement (`ignoreIfMissing()`).

### ImmocorpApplication.java

```java
@SpringBootApplication
@EnableScheduling
public class ImmocorpApplication {
    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();
        dotenv.entries().forEach(entry ->
            System.setProperty(entry.getKey(), entry.getValue())
        );
        SpringApplication.run(ImmocorpApplication.class, args);
    }
}
```

### application.properties

```properties
# ===== SERVEUR =====
server.port=8080
spring.application.name=immocorp

# ===== BASE DE DONNÉES =====
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver-class-name=org.postgresql.Driver

# ===== JPA =====
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
spring.jpa.properties.hibernate.format_sql=true

# ===== MAIL =====
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# ===== JWT =====
app.jwt.secret=${JWT_SECRET}
app.jwt.expiration=${JWT_EXPIRATION}

# ===== UPLOAD =====
app.upload.quittances-dir=${UPLOAD_DIR}

# ===== FEDAPAY =====
fedapay.api.key=${FEDAPAY_API_KEY}
fedapay.api.url=https://sandbox-api.fedapay.com/v1
fedapay.callback.url=${FEDAPAY_CALLBACK_URL}

# ===== TWILIO =====
twilio.account.sid=${TWILIO_ACCOUNT_SID}
twilio.auth.token=${TWILIO_AUTH_TOKEN}
twilio.phone.number=${TWILIO_PHONE_NUMBER}

# ===== LOGS =====
logging.level.com.immocorp=DEBUG
logging.level.org.springframework.mail=DEBUG
```

### .gitignore

```
.env
target/
uploads/
*.class
```

---

## 📁 Structure du projet

```
immocorp/
├── src/main/java/com/immocorp/
│   ├── ImmocorpApplication.java       — Point d'entrée + chargement .env
│   ├── config/
│   │   ├── JwtService.java
│   │   ├── JwtAuthFilter.java
│   │   ├── SecurityConfig.java
│   │   ├── UserDetailsServiceImpl.java
│   │   └── DataInitializer.java       — Création compte admin au démarrage
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── ProprieteController.java
│   │   ├── LocataireController.java
│   │   ├── BailController.java
│   │   ├── PaiementController.java
│   │   ├── AlerteController.java
│   │   ├── DashboardController.java
│   │   └── FedaPayController.java
│   ├── service/
│   │   ├── AuthService.java
│   │   ├── ProprieteService.java
│   │   ├── LocataireService.java
│   │   ├── BailService.java
│   │   ├── PaiementService.java
│   │   ├── QuittanceService.java
│   │   ├── AlerteService.java
│   │   ├── EmailService.java
│   │   ├── SmsService.java            — Twilio SMS
│   │   └── FedaPayService.java
│   ├── repository/
│   │   ├── UtilisateurRepository.java
│   │   ├── ProprieteRepository.java
│   │   ├── LocataireRepository.java
│   │   ├── BailRepository.java        — avec JOIN FETCH
│   │   ├── PaiementRepository.java
│   │   ├── QuittanceRepository.java
│   │   └── AlerteRepository.java
│   ├── entity/
│   │   ├── Utilisateur.java
│   │   ├── Propriete.java
│   │   ├── Locataire.java
│   │   ├── Bail.java
│   │   ├── Paiement.java
│   │   ├── Quittance.java
│   │   ├── Alerte.java
│   │   ├── Role.java
│   │   ├── StatutPropriete.java
│   │   ├── StatutBail.java
│   │   ├── MoyenPaiement.java
│   │   └── TypeAlerte.java
│   └── dto/
│       ├── AuthRequest.java
│       ├── AuthResponse.java
│       ├── RegisterRequest.java
│       ├── ProprieteDTO.java
│       ├── LocataireDTO.java
│       ├── BailDTO.java
│       ├── PaiementRequest.java
│       ├── PaiementDTO.java
│       ├── FedaPayRequest.java
│       ├── FedaPayResponse.java
│       └── AlerteManuelleRequest.java
├── uploads/quittances/
├── .env                               — Variables locales (ne pas committer)
├── .gitignore
├── pom.xml
└── README.md
```

---

## 🗄 Entités & Modèle de données

```
Utilisateur (Propriétaire)
    │
    ├── 1..* Propriete (statut: DISPONIBLE / OCCUPEE)
    │           └── 0..1 Bail (statut: ACTIF / RESILIE / EXPIRE)
    │                   ├── 1 Locataire
    │                   └── 0..* Paiement
    │                               └── 0..1 Quittance (PDF)
    └── 0..* Alerte
```

| Entité | Champs principaux |
|---|---|
| `Utilisateur` | id, nom, prenom, email, password (BCrypt), telephone, role |
| `Propriete` | id, type, adresse, ville, superficie, loyer, statut |
| `Locataire` | id, nom, prenom, telephone, email, pieceIdentite, dateEntree |
| `Bail` | id, dateDebut, dateFin, montantLoyer, jourEcheance, statut |
| `Paiement` | id, datePaiement, montant, moisConcerne, moyenPaiement, reference |
| `Alerte` | id, type, message, dateAlerte, estLue (défaut: false) |

---

## 🌐 Endpoints API

### 🔐 Authentification (public)

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Créer un compte PROPRIETAIRE |
| POST | `/api/auth/login` | Se connecter, retourne JWT |

### 🏠 Propriétés

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/proprietes` | Lister ses propriétés |
| POST | `/api/proprietes` | Créer une propriété |
| PUT | `/api/proprietes/{id}` | Modifier |
| DELETE | `/api/proprietes/{id}` | Supprimer |

### 👤 Locataires

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/locataires` | Lister ses locataires |
| GET | `/api/locataires/{id}` | Détail |
| POST | `/api/locataires` | Ajouter |
| PUT | `/api/locataires/{id}` | Modifier |
| DELETE | `/api/locataires/{id}` | Supprimer |

### 📄 Baux

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/baux` | Lister ses baux |
| GET | `/api/baux/{id}` | Détail |
| POST | `/api/baux` | Créer (propriete → OCCUPEE) |
| PUT | `/api/baux/{id}` | Modifier |
| PUT | `/api/baux/{id}/resilier` | Résilier (propriete → DISPONIBLE) |

### 💰 Paiements

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/paiements` | Enregistrer un paiement |
| GET | `/api/paiements/bail/{bailId}` | Paiements d'un bail |
| GET | `/api/paiements/quittances/{id}/pdf` | Télécharger PDF |

### 📱 FedaPay

| Méthode | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/paiements/fedapay/initier` | ✅ | Initier paiement mobile |
| POST | `/api/paiements/fedapay/callback` | ❌ | Webhook FedaPay |
| GET | `/api/paiements/fedapay/statut/{id}` | ✅ | Vérifier statut |

### 🔔 Alertes

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/alertes` | Lister ses alertes |
| GET | `/api/alertes/non-lues` | Alertes non lues |
| GET | `/api/alertes/non-lues/count` | Nombre (badge) |
| PUT | `/api/alertes/{id}/lire` | Marquer comme lue |
| POST | `/api/alertes/manuel` | Créer manuellement |

Types valides : `RETARD_PAIEMENT`, `FIN_BAIL_PROCHE`, `LOYER_IMPAYE`, `ECHEANCE_BAIL`

### 📊 Dashboard

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/dashboard` | Statistiques globales |

---

## 🔐 Authentification JWT

```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

| Paramètre | Valeur |
|---|---|
| Algorithme | HS256 |
| Durée | 24h (configurable via `JWT_EXPIRATION`) |

> ⚠️ Token expiré après 24h → reconnectez-vous via `POST /api/auth/login`

---

## 👥 Gestion des rôles

| Rôle | Création | Accès |
|---|---|---|
| `ADMIN` | Automatique au démarrage (`DataInitializer`) | Routes `/api/admin/**` |
| `PROPRIETAIRE` | Via `/api/auth/register` | Toutes ses données |
| `LOCATAIRE` | Via `/api/locataires` par le propriétaire | Pas de login — reçoit SMS/WhatsApp |

**Compte admin par défaut :**
```
Email    : admin@immocorp.com
Password : Admin@2026
```

> ⚠️ Changez le mot de passe admin en production.

---

## 📄 Génération de PDF

Les quittances PDF sont générées automatiquement via **iText 5** après chaque paiement.

Stockage : `./uploads/quittances/quittance_{id}_{mois}.pdf`

---

## 💳 Intégration FedaPay

### Flux de paiement

```
Flutter → POST /fedapay/initier → paymentUrl
    ↓
Flutter ouvre paymentUrl dans WebView
    ↓
Utilisateur paie sur FedaPay
    ↓
FedaPay → POST /fedapay/callback
    ↓
Paiement enregistré + PDF + Email + SMS + WhatsApp
```

### Configuration sandbox

```env
FEDAPAY_API_KEY=sk_sandbox_VOTRE_CLE
FEDAPAY_CALLBACK_URL=https://abc123.ngrok-free.app/api/paiements/fedapay/callback
```

### Exposer localhost (ngrok)

```bash
ngrok http 8080
# Copier l'URL et mettre à jour FEDAPAY_CALLBACK_URL dans .env
```

### Numéros de test Sandbox

| Opérateur | Numéro | Résultat |
|---|---|---|
| Tmoney | `22890000001` | ✅ Approuvé |
| Moov Money | `22899000001` | ✅ Approuvé |
| Test refus | `22800000000` | ❌ Refusé |

---

## ⏰ Alertes automatiques

| Type | Déclencheur |
|---|---|
| `RETARD_PAIEMENT` | Paiement non reçu 3 jours après l'échéance |
| `FIN_BAIL_PROCHE` | Bail expirant dans moins de 30 jours |

| Environnement | Cron | Fréquence |
|---|---|---|
| Développement | `0/10 * * * * *` | Toutes les 10 secondes |
| Production | `0 0 8 * * *` | Chaque jour à 8h00 |

> ⚠️ Remettre `0 0 8 * * *` avant la mise en production.

---

## 📧 Notifications Email

Email HTML envoyé automatiquement au **propriétaire** à chaque alerte.

### Configuration Gmail App Password

1. Activez la validation en 2 étapes sur Gmail
2. **Sécurité → Mots de passe des applications** → générez un code 16 caractères
3. Ajoutez dans `.env` : `MAIL_PASSWORD=xxxx xxxx xxxx xxxx`

---

## 📲 Notifications SMS Twilio

SMS envoyé automatiquement au **locataire** en cas d'alerte.

### Configuration

1. Créez un compte sur [twilio.com](https://twilio.com)
2. Récupérez vos credentials dans le Dashboard
3. Ajoutez dans `.env` :

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
```

### Dépendance pom.xml

```xml
<dependency>
    <groupId>com.twilio.sdk</groupId>
    <artifactId>twilio</artifactId>
    <version>10.1.0</version>
</dependency>
```

### Déclenchement automatique

| Événement | Destinataire | Canal |
|---|---|---|
| Retard de paiement | Locataire | SMS + WhatsApp |
| Paiement confirmé | Locataire | SMS + WhatsApp |
| Fin de bail proche | Locataire | SMS + WhatsApp |
| Toute alerte | Propriétaire | Email |


## 📖 Documentation Swagger

```
http://localhost:8080/swagger-ui/index.html
```

### Authentifier dans Swagger

1. `POST /api/auth/login` → copier le token
2. Cliquer **Authorize** en haut à droite
3. Entrer : `Bearer VOTRE_TOKEN`
4. Cliquer **Authorize** puis **Close**

---

## 🧪 Tests — Séquence recommandée

```bash
# 1. Register + Login
POST /api/auth/register
POST /api/auth/login  →  copier le token

# 2. Créer les données
POST /api/proprietes
POST /api/locataires
POST /api/baux

# 3. Tester FedaPay
POST /api/paiements/fedapay/initier   →  ouvrir paymentUrl
POST /api/paiements/fedapay/callback  →  simuler callback

# 4. Vérifier
GET /api/paiements/bail/{bailId}
GET /api/paiements/quittances/{id}/pdf
GET /api/dashboard
GET /api/alertes
```

---

## 🚢 Déploiement

### Build

```bash
mvn clean package -DskipTests
java -jar target/immocorp-0.0.1-SNAPSHOT.jar
```

### Docker

```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/immocorp-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

```bash
docker build -t immocorp-backend .
docker run -p 8080:8080 \
  -e DB_URL=jdbc:postgresql://host:5432/immocorp \
  -e DB_PASSWORD=motdepasse \
  -e JWT_SECRET=votre_secret \
  -e TWILIO_ACCOUNT_SID=ACxxx \
  -e TWILIO_AUTH_TOKEN=xxx \
  immocorp-backend
```

### Configuration production

```properties
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false
fedapay.api.url=https://api.fedapay.com/v1
```

```env
FEDAPAY_API_KEY=sk_live_VOTRE_CLE_LIVE
```

---

## 🛠 Dépannage

| Erreur | Solution |
|---|---|
| `JWT expired` | `POST /api/auth/login` pour nouveau token |
| `LazyInitializationException` | `@Transactional` + `findByIdWithRelations()` |
| `MalformedInputException` au build | Sauvegarder `application.properties` en UTF-8 |
| `TypeTag::UNKNOWN` | Lombok 1.18.36 + annotation processing activé dans IntelliJ |
| FedaPay `HTTP 404` | `ngrok http 8080` + mettre à jour `FEDAPAY_CALLBACK_URL` |
| `400 Paiement déjà enregistré` | Changer `moisConcerne` |
| `403 Forbidden` | Token JWT manquant ou expiré |
| Variable `.env` non chargée | Vérifier que le fichier est à la racine du projet |
| SMS Twilio non envoyé | Vérifier `TWILIO_ACCOUNT_SID` et numéro vérifié en sandbox |

---

## 👨‍💻 Auteur

**TANANKOUBOUSSI Prince Essorong**  
Projet : ImmoCorp — Gestion Locative  
Backend : Spring Boot 3.4.3 + PostgreSQL + JWT  
Frontend : Flutter (en cours)

---

