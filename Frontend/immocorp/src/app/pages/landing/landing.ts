import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class LandingComponent {

  features = [
    {
      icon: 'home',
      title: 'Gestion des biens',
      desc: 'Centralisez tous vos biens immobiliers. Suivez leur statut, superficie et loyer en temps réel.'
    },
    {
      icon: 'people',
      title: 'Suivi des locataires',
      desc: 'Gérez vos locataires, leurs contrats et coordonnées depuis une interface intuitive.'
    },
    {
      icon: 'description',
      title: 'Baux intelligents',
      desc: 'Créez et gérez vos baux avec alertes automatiques avant expiration.'
    },
    {
      icon: 'receipt_long',
      title: 'Quittances PDF',
      desc: 'Générez automatiquement des quittances de loyer au format PDF après chaque paiement.'
    },
    {
      icon: 'notifications_active',
      title: 'Alertes en temps réel',
      desc: 'Recevez des notifications par email et SMS pour les retards et échéances.'
    },
    {
      icon: 'payments',
      title: 'Paiements Mobile Money',
      desc: 'Intégration FedaPay pour accepter les paiements mobiles directement.'
    },
  ];

  stats = [
    { value: '100%',  label: 'Automatisé'      },
    { value: 'PDF',   label: 'Quittances auto'  },
    { value: 'SMS',   label: 'Alertes Twilio'   },
    { value: '24/7',  label: 'Disponible'       },
  ];

  steps = [
    { num: '01', title: 'Créez votre compte',      desc: 'Inscrivez-vous en 30 secondes et accédez à votre espace propriétaire.' },
    { num: '02', title: 'Ajoutez vos biens',        desc: 'Renseignez vos propriétés, leur adresse, superficie et loyer mensuel.' },
    { num: '03', title: 'Gérez vos locataires',     desc: 'Ajoutez vos locataires et créez leurs baux en quelques clics.' },
    { num: '04', title: 'Encaissez & suivez',       desc: 'Enregistrez les paiements, recevez les quittances et les alertes automatiquement.' },
  ];
}
