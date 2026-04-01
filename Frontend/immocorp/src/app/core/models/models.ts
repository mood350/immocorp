export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: 'ADMIN' | 'PROPRIETAIRE';
  actif: boolean;
}

export interface Propriete {
  id?: number;
  type: string;
  adresse: string;
  ville: string;
  superficie: number;
  loyer: number;
  statut?: 'DISPONIBLE' | 'OCCUPEE';
}

export interface Locataire {
  id?: number;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  pieceIdentite: string;
  dateEntree: string;
  dateSortie?: string;
}

export interface Bail {
  id?: number;
  dateDebut: string;
  dateFin?: string;
  montantLoyer: number;
  jourEcheance: number;
  statut?: 'ACTIF' | 'RESILIE' | 'EXPIRE';
  proprieteId: number;
  locataireId: number;
  propriete?: Propriete;
  locataire?: Locataire;
}

export interface Paiement {
  id?: number;
  datePaiement: string;
  montant: number;
  moisConcerne: string;
  moyenPaiement: 'ESPECES' | 'VIREMENT' | 'MOBILE_MONEY' | 'CHEQUE';
  referencePaiement?: string;
  bailId: number;
}

export interface Alerte {
  id?: number;
  type: 'RETARD_PAIEMENT' | 'FIN_BAIL_PROCHE' | 'LOYER_IMPAYE' | 'ECHEANCE_BAIL';
  message: string;
  dateAlerte: string;
  estLue: boolean;
}

export interface DashboardStats {
  totalProprietes: number;
  totalLocataires: number;
  bauxActifs: number;
  totalLoyersPercus: number;
  alertesNonLues: number;
}

export interface Alerte {
  id?: number;
  type: 'RETARD_PAIEMENT' | 'FIN_BAIL_PROCHE' | 'LOYER_IMPAYE' | 'ECHEANCE_BAIL';
  message: string;
  dateAlerte: string;
  estLue: boolean;
  emailEnvoye: boolean;
  bailId?: number;
  proprietaireId?: number;
  proprietaireNom?: string;  // ✅ utile pour l'admin
}
