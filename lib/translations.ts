type TranslationData = {
  header: {
    title: string;
    logout: string;
    language: string;
    dashboard: string;
    leaveRequest: string;
    payments: string;
    carePackages: string;
  };
  login: {
    title: string;
    subtitle: string;
    password: string;
    submit: string;
    invalidPassword: string;
    welcome: string;
  };
  dashboard: {
    title: string;
    welcome: string;
    selectService: string;
    leaveRequests: string;
    flightPayments: string;
    carePackages: string;
    recentActivity: string;
    noActivity: string;
  };
  leave: {
    title: string;
    applyFor: string;
    leaveType: string;
    emergency: string;
    vacation: string;
    medical: string;
    soldierName: string;
    soldierRank: string;
    soldierID: string;
    relationshipToSoldier: string;
    startDate: string;
    endDate: string;
    reason: string;
    attachments: string;
    submit: string;
    submitted: string;
    error: string;
    status: string;
    pending: string;
    approved: string;
    rejected: string;
    leaveHistory: string;
  };
  payments: {
    title: string;
    description: string;
    approvableLeaves: string;
    selectLeave: string;
    flightFee: string;
    paymentMethod: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    billingAddress: string;
    city: string;
    state: string;
    zipCode: string;
    submitPayment: string;
    paymentSuccess: string;
    paymentError: string;
    paymentHistory: string;
  };
  carePackages: {
    title: string;
    description: string;
    sendTo: string;
    recipientName: string;
    recipientRank: string;
    recipientUnit: string;
    itemsIncluded: string;
    itemDescription: string;
    quantity: string;
    addItem: string;
    removeItem: string;
    packageWeight: string;
    shippingAddress: string;
    submitPackage: string;
    packageSubmitted: string;
    packageError: string;
    packageHistory: string;
    noPackages: string;
  };
  footer: {
    support: string;
    email: string;
    phone: string;
    whatsapp: string;
    contactUs: string;
    copyright: string;
  };
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
    home: string;
    required: string;
  };
};

export const translations: Record<string, TranslationData> = {
  en: {
    // Header & Navigation
    header: {
      title: 'Military Leave & Services Portal',
      logout: 'Logout',
      language: 'Language',
      dashboard: 'Dashboard',
      leaveRequest: 'Leave Request',
      payments: 'Payments',
      carePackages: 'Care Packages',
    },
    // Login Page
    login: {
      title: 'Military Personnel Portal',
      subtitle: 'Secure Access to Leave & Family Services',
      password: 'Enter Portal Password',
      submit: 'Access Portal',
      invalidPassword: 'Invalid password. Please try again.',
      welcome: 'Welcome to the Military Leave & Services Portal',
    },
    // Dashboard
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome to Your Military Portal',
      selectService: 'Select a Service',
      leaveRequests: 'Leave Requests',
      flightPayments: 'Flight Payments',
      carePackages: 'Care Packages',
      recentActivity: 'Recent Activity',
      noActivity: 'No recent activity',
    },
    // Leave Management
    leave: {
      title: 'Leave Request',
      applyFor: 'Apply for Leave',
      leaveType: 'Type of Leave',
      emergency: 'Emergency Leave',
      vacation: 'Vacation Leave',
      medical: 'Medical Leave',
      soldierName: 'Soldier Name',
      soldierRank: 'Soldier Rank',
      soldierID: 'Soldier ID',
      relationshipToSoldier: 'Your Relationship to Soldier',
      startDate: 'Start Date',
      endDate: 'End Date',
      reason: 'Reason for Leave',
      attachments: 'Attachments (Optional)',
      submit: 'Submit Leave Request',
      submitted: 'Leave request submitted successfully',
      error: 'Error submitting leave request',
      status: 'Status',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      leaveHistory: 'Your Leave Requests',
    },
    // Payments
    payments: {
      title: 'Flight Payments',
      description: 'Pay for military flight fees after approved leave',
      approvableLeaves: 'Available Approved Leaves',
      selectLeave: 'Select Approved Leave',
      flightFee: 'Flight Fee Amount',
      paymentMethod: 'Payment Method',
      cardNumber: 'Card Number',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      billingAddress: 'Billing Address',
      city: 'City',
      state: 'State',
      zipCode: 'Zip Code',
      submitPayment: 'Process Payment',
      paymentSuccess: 'Payment processed successfully',
      paymentError: 'Error processing payment',
      paymentHistory: 'Payment History',
    },
    // Care Packages
    carePackages: {
      title: 'Send Care Packages',
      description: 'Send care packages to military personnel',
      sendTo: 'Send Package To',
      recipientName: 'Recipient Name',
      recipientRank: 'Rank',
      recipientUnit: 'Unit/Base',
      itemsIncluded: 'Items Included',
      itemDescription: 'Item Description',
      quantity: 'Quantity',
      addItem: 'Add Item',
      removeItem: 'Remove Item',
      packageWeight: 'Estimated Weight (lbs)',
      shippingAddress: 'Shipping Address',
      submitPackage: 'Submit Care Package',
      packageSubmitted: 'Care package submitted successfully',
      packageError: 'Error submitting care package',
      packageHistory: 'Sent Packages',
      noPackages: 'No packages sent yet',
    },
    // Footer
    footer: {
      support: 'Support',
      email: 'Email: military@d4battalion.us',
      phone: 'Phone: +(430) 291-3433',
      whatsapp: 'WhatsApp Support',
      contactUs: 'Contact Us',
      copyright: '© 2024 Military Services Portal. All rights reserved.',
    },
    // Common
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      home: 'Home',
      required: 'Required',
    },
  },
  es: {
    // Header & Navigation
    header: {
      title: 'Portal de Servicios Militares',
      logout: 'Cerrar Sesión',
      language: 'Idioma',
      dashboard: 'Panel',
      leaveRequest: 'Solicitud de Permiso',
      payments: 'Pagos',
      carePackages: 'Paquetes de Apoyo',
    },
    // Login Page
    login: {
      title: 'Portal del Personal Militar',
      subtitle: 'Acceso Seguro a Servicios de Permiso y Familia',
      password: 'Ingrese la Contraseña del Portal',
      submit: 'Acceder al Portal',
      invalidPassword: 'Contraseña inválida. Intente de nuevo.',
      welcome: 'Bienvenido al Portal de Servicios Militares',
    },
    // Dashboard
    dashboard: {
      title: 'Panel',
      welcome: 'Bienvenido a Su Portal Militar',
      selectService: 'Seleccionar un Servicio',
      leaveRequests: 'Solicitudes de Permiso',
      flightPayments: 'Pagos de Vuelos',
      carePackages: 'Paquetes de Apoyo',
      recentActivity: 'Actividad Reciente',
      noActivity: 'Sin actividad reciente',
    },
    // Leave Management
    leave: {
      title: 'Solicitud de Permiso',
      applyFor: 'Solicitar Permiso',
      leaveType: 'Tipo de Permiso',
      emergency: 'Permiso de Emergencia',
      vacation: 'Permiso de Vacaciones',
      medical: 'Permiso Médico',
      soldierName: 'Nombre del Soldado',
      soldierRank: 'Rango del Soldado',
      soldierID: 'ID del Soldado',
      relationshipToSoldier: 'Su Relación con el Soldado',
      startDate: 'Fecha de Inicio',
      endDate: 'Fecha de Fin',
      reason: 'Motivo del Permiso',
      attachments: 'Archivos Adjuntos (Opcional)',
      submit: 'Enviar Solicitud de Permiso',
      submitted: 'Solicitud de permiso enviada con éxito',
      error: 'Error al enviar solicitud de permiso',
      status: 'Estado',
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      leaveHistory: 'Sus Solicitudes de Permiso',
    },
    // Payments
    payments: {
      title: 'Pagos de Vuelos',
      description: 'Pague las tarifas de vuelo militar después del permiso aprobado',
      approvableLeaves: 'Permisos Aprobados Disponibles',
      selectLeave: 'Seleccionar Permiso Aprobado',
      flightFee: 'Monto de Tarifa de Vuelo',
      paymentMethod: 'Método de Pago',
      cardNumber: 'Número de Tarjeta',
      expiryDate: 'Fecha de Vencimiento',
      cvv: 'CVV',
      billingAddress: 'Dirección de Facturación',
      city: 'Ciudad',
      state: 'Estado',
      zipCode: 'Código Postal',
      submitPayment: 'Procesar Pago',
      paymentSuccess: 'Pago procesado con éxito',
      paymentError: 'Error al procesar el pago',
      paymentHistory: 'Historial de Pagos',
    },
    // Care Packages
    carePackages: {
      title: 'Enviar Paquetes de Apoyo',
      description: 'Envíe paquetes de apoyo al personal militar',
      sendTo: 'Enviar Paquete A',
      recipientName: 'Nombre del Destinatario',
      recipientRank: 'Rango',
      recipientUnit: 'Unidad/Base',
      itemsIncluded: 'Artículos Incluidos',
      itemDescription: 'Descripción del Artículo',
      quantity: 'Cantidad',
      addItem: 'Agregar Artículo',
      removeItem: 'Eliminar Artículo',
      packageWeight: 'Peso Estimado (lbs)',
      shippingAddress: 'Dirección de Envío',
      submitPackage: 'Enviar Paquete de Apoyo',
      packageSubmitted: 'Paquete de apoyo enviado con éxito',
      packageError: 'Error al enviar paquete de apoyo',
      packageHistory: 'Paquetes Enviados',
      noPackages: 'Sin paquetes enviados aún',
    },
    // Footer
    footer: {
      support: 'Soporte',
      email: 'Correo: military@d4battalion.us',
      phone: 'Teléfono: +(430) 291-3433',
      whatsapp: 'Soporte WhatsApp',
      contactUs: 'Contáctenos',
      copyright: '© 2024 Portal de Servicios Militares. Todos los derechos reservados.',
    },
    // Common
    common: {
      loading: 'Cargando...',
      error: 'Error',
      success: 'Éxito',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
      edit: 'Editar',
      back: 'Atrás',
      home: 'Inicio',
      required: 'Requerido',
    },
  },
  fr: {
    // Header & Navigation
    header: {
      title: 'Portail des Services Militaires',
      logout: 'Déconnexion',
      language: 'Langue',
      dashboard: 'Tableau de Bord',
      leaveRequest: 'Demande de Congé',
      payments: 'Paiements',
      carePackages: 'Colis de Soutien',
    },
    // Login Page
    login: {
      title: 'Portail du Personnel Militaire',
      subtitle: 'Accès Sécurisé aux Services de Congé et Famille',
      password: 'Entrez le Mot de Passe du Portail',
      submit: 'Accéder au Portail',
      invalidPassword: 'Mot de passe invalide. Veuillez réessayer.',
      welcome: 'Bienvenue au Portail des Services Militaires',
    },
    // Dashboard
    dashboard: {
      title: 'Tableau de Bord',
      welcome: 'Bienvenue à Votre Portail Militaire',
      selectService: 'Sélectionner un Service',
      leaveRequests: 'Demandes de Congé',
      flightPayments: 'Paiements de Vol',
      carePackages: 'Colis de Soutien',
      recentActivity: 'Activité Récente',
      noActivity: 'Aucune activité récente',
    },
    // Leave Management
    leave: {
      title: 'Demande de Congé',
      applyFor: 'Demander un Congé',
      leaveType: 'Type de Congé',
      emergency: 'Congé d\'Urgence',
      vacation: 'Congé Annuel',
      medical: 'Congé Médical',
      soldierName: 'Nom du Soldat',
      soldierRank: 'Rang du Soldat',
      soldierID: 'ID du Soldat',
      relationshipToSoldier: 'Votre Relation avec le Soldat',
      startDate: 'Date de Début',
      endDate: 'Date de Fin',
      reason: 'Raison du Congé',
      attachments: 'Pièces Jointes (Facultatif)',
      submit: 'Soumettre la Demande de Congé',
      submitted: 'Demande de congé soumise avec succès',
      error: 'Erreur lors de la soumission de la demande',
      status: 'Statut',
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
      leaveHistory: 'Vos Demandes de Congé',
    },
    // Payments
    payments: {
      title: 'Paiements de Vol',
      description: 'Payez les frais de vol militaire après congé approuvé',
      approvableLeaves: 'Congés Approuvés Disponibles',
      selectLeave: 'Sélectionner un Congé Approuvé',
      flightFee: 'Montant des Frais de Vol',
      paymentMethod: 'Méthode de Paiement',
      cardNumber: 'Numéro de Carte',
      expiryDate: 'Date d\'Expiration',
      cvv: 'CVV',
      billingAddress: 'Adresse de Facturation',
      city: 'Ville',
      state: 'État',
      zipCode: 'Code Postal',
      submitPayment: 'Traiter le Paiement',
      paymentSuccess: 'Paiement traité avec succès',
      paymentError: 'Erreur lors du traitement du paiement',
      paymentHistory: 'Historique des Paiements',
    },
    // Care Packages
    carePackages: {
      title: 'Envoyer des Colis de Soutien',
      description: 'Envoyez des colis de soutien au personnel militaire',
      sendTo: 'Envoyer le Colis À',
      recipientName: 'Nom du Destinataire',
      recipientRank: 'Rang',
      recipientUnit: 'Unité/Base',
      itemsIncluded: 'Articles Inclus',
      itemDescription: 'Description de l\'Article',
      quantity: 'Quantité',
      addItem: 'Ajouter un Article',
      removeItem: 'Supprimer un Article',
      packageWeight: 'Poids Estimé (lbs)',
      shippingAddress: 'Adresse d\'Expédition',
      submitPackage: 'Soumettre le Colis de Soutien',
      packageSubmitted: 'Colis de soutien soumis avec succès',
      packageError: 'Erreur lors de la soumission du colis',
      packageHistory: 'Colis Envoyés',
      noPackages: 'Aucun colis envoyé pour le moment',
    },
    // Footer
    footer: {
      support: 'Support',
      email: 'Courrier: military@d4battalion.us',
      phone: 'Téléphone: +(430) 291-3433',
      whatsapp: 'Support WhatsApp',
      contactUs: 'Nous Contacter',
      copyright: '© 2024 Portail des Services Militaires. Tous droits réservés.',
    },
    // Common
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
      edit: 'Modifier',
      back: 'Retour',
      home: 'Accueil',
      required: 'Requis',
    },
  },
  // German
  de: {
    header: { title: 'Militärisches Servicportal', logout: 'Abmelden', language: 'Sprache', dashboard: 'Dashboard', leaveRequest: 'Urlaubsantrag', payments: 'Zahlungen', carePackages: 'Hilfspakete' },
    login: { title: 'Militärpersonal Portal', subtitle: 'Sicherer Zugang zu Urlaubs- und Familiendiensten', password: 'Portal-Passwort eingeben', submit: 'Portal zugreifen', invalidPassword: 'Ungültiges Passwort. Bitte versuchen Sie es erneut.', welcome: 'Willkommen im Militärischen Servicportal' },
    dashboard: { title: 'Dashboard', welcome: 'Willkommen in Ihrem Militärportal', selectService: 'Dienst auswählen', leaveRequests: 'Urlaubsanträge', flightPayments: 'Flugzahlungen', carePackages: 'Hilfspakete', recentActivity: 'Letzte Aktivität', noActivity: 'Keine aktuelle Aktivität' },
    leave: { title: 'Urlaubsantrag', applyFor: 'Urlaub beantragen', leaveType: 'Urlaubsart', emergency: 'Notfallurlaub', vacation: 'Erholungsurlaub', medical: 'Krankenurlaub', soldierName: 'Name des Soldaten', soldierRank: 'Rang des Soldaten', soldierID: 'Soldaten-ID', relationshipToSoldier: 'Ihre Beziehung zum Soldaten', startDate: 'Startdatum', endDate: 'Enddatum', reason: 'Urlaubsgrund', attachments: 'Anhänge (Optional)', submit: 'Urlaubsantrag einreichen', submitted: 'Urlaubsantrag erfolgreich eingereicht', error: 'Fehler beim Einreichen des Urlaubsantrags', status: 'Status', pending: 'Ausstehend', approved: 'Genehmigt', rejected: 'Abgelehnt', leaveHistory: 'Ihre Urlaubsanträge' },
    payments: { title: 'Flugzahlungen', description: 'Zahlen Sie militärische Fluggebühren nach genehmigtem Urlaub', approvableLeaves: 'Verfügbare genehmigte Urlaube', selectLeave: 'Genehmigten Urlaub auswählen', flightFee: 'Fluggebührbetrag', paymentMethod: 'Zahlungsmethode', cardNumber: 'Kartennummer', expiryDate: 'Ablaufdatum', cvv: 'CVV', billingAddress: 'Rechnungsadresse', city: 'Stadt', state: 'Bundesland', zipCode: 'Postleitzahl', submitPayment: 'Zahlung verarbeiten', paymentSuccess: 'Zahlung erfolgreich verarbeitet', paymentError: 'Fehler bei der Zahlungsverarbeitung', paymentHistory: 'Zahlungsverlauf' },
    carePackages: { title: 'Hilfspakete senden', description: 'Senden Sie Hilfspakete an Militärpersonal', sendTo: 'Paket senden an', recipientName: 'Empfängername', recipientRank: 'Rang', recipientUnit: 'Einheit/Basis', itemsIncluded: 'Enthaltene Artikel', itemDescription: 'Artikelbeschreibung', quantity: 'Menge', addItem: 'Artikel hinzufügen', removeItem: 'Artikel entfernen', packageWeight: 'Geschätztes Gewicht (lbs)', shippingAddress: 'Versandadresse', submitPackage: 'Hilfspaket einreichen', packageSubmitted: 'Hilfspaket erfolgreich eingereicht', packageError: 'Fehler beim Einreichen des Pakets', packageHistory: 'Gesendete Pakete', noPackages: 'Noch keine Pakete gesendet' },
    footer: { support: 'Support', email: 'E-Mail: military@d4battalion.us', phone: 'Telefon: +(430) 291-3433', whatsapp: 'WhatsApp Support', contactUs: 'Kontaktieren Sie uns', copyright: '© 2024 Militärisches Servicportal. Alle Rechte vorbehalten.' },
    common: { loading: 'Laden...', error: 'Fehler', success: 'Erfolg', cancel: 'Abbrechen', save: 'Speichern', delete: 'Löschen', edit: 'Bearbeiten', back: 'Zurück', home: 'Startseite', required: 'Erforderlich' },
  },
  // Italian
  it: {
    header: { title: 'Portale Servizi Militari', logout: 'Esci', language: 'Lingua', dashboard: 'Dashboard', leaveRequest: 'Richiesta Permesso', payments: 'Pagamenti', carePackages: 'Pacchi di Supporto' },
    login: { title: 'Portale Personale Militare', subtitle: 'Accesso Sicuro ai Servizi di Permesso e Famiglia', password: 'Inserire Password Portale', submit: 'Accedi al Portale', invalidPassword: 'Password non valida. Riprova.', welcome: 'Benvenuto al Portale Servizi Militari' },
    dashboard: { title: 'Dashboard', welcome: 'Benvenuto nel Tuo Portale Militare', selectService: 'Seleziona un Servizio', leaveRequests: 'Richieste di Permesso', flightPayments: 'Pagamenti Voli', carePackages: 'Pacchi di Supporto', recentActivity: 'Attività Recente', noActivity: 'Nessuna attività recente' },
    leave: { title: 'Richiesta Permesso', applyFor: 'Richiedi Permesso', leaveType: 'Tipo di Permesso', emergency: 'Permesso di Emergenza', vacation: 'Permesso Ferie', medical: 'Permesso Medico', soldierName: 'Nome Soldato', soldierRank: 'Grado Soldato', soldierID: 'ID Soldato', relationshipToSoldier: 'Tua Relazione con il Soldato', startDate: 'Data Inizio', endDate: 'Data Fine', reason: 'Motivo del Permesso', attachments: 'Allegati (Opzionale)', submit: 'Invia Richiesta Permesso', submitted: 'Richiesta di permesso inviata con successo', error: 'Errore nell\'invio della richiesta', status: 'Stato', pending: 'In attesa', approved: 'Approvato', rejected: 'Rifiutato', leaveHistory: 'Le Tue Richieste di Permesso' },
    payments: { title: 'Pagamenti Voli', description: 'Paga le tariffe di volo militare dopo permesso approvato', approvableLeaves: 'Permessi Approvati Disponibili', selectLeave: 'Seleziona Permesso Approvato', flightFee: 'Importo Tariffa Volo', paymentMethod: 'Metodo di Pagamento', cardNumber: 'Numero Carta', expiryDate: 'Data Scadenza', cvv: 'CVV', billingAddress: 'Indirizzo Fatturazione', city: 'Città', state: 'Stato', zipCode: 'CAP', submitPayment: 'Elabora Pagamento', paymentSuccess: 'Pagamento elaborato con successo', paymentError: 'Errore nell\'elaborazione del pagamento', paymentHistory: 'Storico Pagamenti' },
    carePackages: { title: 'Invia Pacchi di Supporto', description: 'Invia pacchi di supporto al personale militare', sendTo: 'Invia Pacco A', recipientName: 'Nome Destinatario', recipientRank: 'Grado', recipientUnit: 'Unità/Base', itemsIncluded: 'Articoli Inclusi', itemDescription: 'Descrizione Articolo', quantity: 'Quantità', addItem: 'Aggiungi Articolo', removeItem: 'Rimuovi Articolo', packageWeight: 'Peso Stimato (lbs)', shippingAddress: 'Indirizzo Spedizione', submitPackage: 'Invia Pacco di Supporto', packageSubmitted: 'Pacco di supporto inviato con successo', packageError: 'Errore nell\'invio del pacco', packageHistory: 'Pacchi Inviati', noPackages: 'Nessun pacco inviato' },
    footer: { support: 'Supporto', email: 'Email: military@d4battalion.us', phone: 'Telefono: +(430) 291-3433', whatsapp: 'Supporto WhatsApp', contactUs: 'Contattaci', copyright: '© 2024 Portale Servizi Militari. Tutti i diritti riservati.' },
    common: { loading: 'Caricamento...', error: 'Errore', success: 'Successo', cancel: 'Annulla', save: 'Salva', delete: 'Elimina', edit: 'Modifica', back: 'Indietro', home: 'Home', required: 'Richiesto' },
  },
  // Portuguese
  pt: {
    header: { title: 'Portal de Serviços Militares', logout: 'Sair', language: 'Idioma', dashboard: 'Painel', leaveRequest: 'Pedido de Licença', payments: 'Pagamentos', carePackages: 'Pacotes de Apoio' },
    login: { title: 'Portal do Pessoal Militar', subtitle: 'Acesso Seguro a Serviços de Licença e Família', password: 'Digite a Senha do Portal', submit: 'Acessar Portal', invalidPassword: 'Senha inválida. Tente novamente.', welcome: 'Bem-vindo ao Portal de Serviços Militares' },
    dashboard: { title: 'Painel', welcome: 'Bem-vindo ao Seu Portal Militar', selectService: 'Selecionar Serviço', leaveRequests: 'Pedidos de Licença', flightPayments: 'Pagamentos de Voo', carePackages: 'Pacotes de Apoio', recentActivity: 'Atividade Recente', noActivity: 'Nenhuma atividade recente' },
    leave: { title: 'Pedido de Licença', applyFor: 'Solicitar Licença', leaveType: 'Tipo de Licença', emergency: 'Licença de Emergência', vacation: 'Licença de Férias', medical: 'Licença Médica', soldierName: 'Nome do Soldado', soldierRank: 'Posto do Soldado', soldierID: 'ID do Soldado', relationshipToSoldier: 'Sua Relação com o Soldado', startDate: 'Data de Início', endDate: 'Data de Fim', reason: 'Motivo da Licença', attachments: 'Anexos (Opcional)', submit: 'Enviar Pedido de Licença', submitted: 'Pedido de licença enviado com sucesso', error: 'Erro ao enviar pedido de licença', status: 'Estado', pending: 'Pendente', approved: 'Aprovado', rejected: 'Rejeitado', leaveHistory: 'Seus Pedidos de Licença' },
    payments: { title: 'Pagamentos de Voo', description: 'Pague taxas de voo militar após licença aprovada', approvableLeaves: 'Licenças Aprovadas Disponíveis', selectLeave: 'Selecionar Licença Aprovada', flightFee: 'Valor da Taxa de Voo', paymentMethod: 'Método de Pagamento', cardNumber: 'Número do Cartão', expiryDate: 'Data de Validade', cvv: 'CVV', billingAddress: 'Endereço de Faturação', city: 'Cidade', state: 'Estado', zipCode: 'Código Postal', submitPayment: 'Processar Pagamento', paymentSuccess: 'Pagamento processado com sucesso', paymentError: 'Erro ao processar pagamento', paymentHistory: 'Histórico de Pagamentos' },
    carePackages: { title: 'Enviar Pacotes de Apoio', description: 'Envie pacotes de apoio ao pessoal militar', sendTo: 'Enviar Pacote Para', recipientName: 'Nome do Destinatário', recipientRank: 'Posto', recipientUnit: 'Unidade/Base', itemsIncluded: 'Itens Incluídos', itemDescription: 'Descrição do Item', quantity: 'Quantidade', addItem: 'Adicionar Item', removeItem: 'Remover Item', packageWeight: 'Peso Estimado (lbs)', shippingAddress: 'Endereço de Envio', submitPackage: 'Enviar Pacote de Apoio', packageSubmitted: 'Pacote de apoio enviado com sucesso', packageError: 'Erro ao enviar pacote', packageHistory: 'Pacotes Enviados', noPackages: 'Nenhum pacote enviado' },
    footer: { support: 'Suporte', email: 'Email: military@d4battalion.us', phone: 'Telefone: +(430) 291-3433', whatsapp: 'Suporte WhatsApp', contactUs: 'Contacte-nos', copyright: '© 2024 Portal de Serviços Militares. Todos os direitos reservados.' },
    common: { loading: 'Carregando...', error: 'Erro', success: 'Sucesso', cancel: 'Cancelar', save: 'Guardar', delete: 'Eliminar', edit: 'Editar', back: 'Voltar', home: 'Início', required: 'Obrigatório' },
  },
  // Japanese
  ja: {
    header: { title: '軍事サービスポータル', logout: 'ログアウト', language: '言語', dashboard: 'ダッシュボード', leaveRequest: '休暇申請', payments: '支払い', carePackages: 'ケアパッケージ' },
    login: { title: '軍人ポータル', subtitle: '休暇・家族サービスへの安全なアクセス', password: 'ポータルパスワードを入力', submit: 'ポータルにアクセス', invalidPassword: 'パスワードが無効です。もう一度お試しください。', welcome: '軍事サービスポータルへようこそ' },
    dashboard: { title: 'ダッシュボード', welcome: '軍事ポータルへようこそ', selectService: 'サービスを選択', leaveRequests: '休暇申請', flightPayments: 'フライト支払い', carePackages: 'ケアパッケージ', recentActivity: '最近の活動', noActivity: '最近の活動なし' },
    leave: { title: '休暇申請', applyFor: '休暇を申請', leaveType: '休暇タイプ', emergency: '緊急休暇', vacation: '休暇', medical: '病気休暇', soldierName: '兵士名', soldierRank: '兵士階級', soldierID: '兵士ID', relationshipToSoldier: '兵士との関係', startDate: '開始日', endDate: '終了日', reason: '休暇理由', attachments: '添付ファイル（オプション）', submit: '休暇申請を送信', submitted: '休暇申請が正常に送信されました', error: '休暇申請の送信エラー', status: 'ステータス', pending: '保留中', approved: '承認済み', rejected: '却下', leaveHistory: '休暇申請履歴' },
    payments: { title: 'フライト支払い', description: '承認された休暇後に軍事フライト料金を支払う', approvableLeaves: '利用可能な承認済み休暇', selectLeave: '承認済み休暇を選択', flightFee: 'フライト料金', paymentMethod: '支払い方法', cardNumber: 'カード番号', expiryDate: '有効期限', cvv: 'CVV', billingAddress: '請求先住所', city: '市', state: '州', zipCode: '郵便番号', submitPayment: '支払いを処理', paymentSuccess: '支払いが正常に処理されました', paymentError: '支払い処理エラー', paymentHistory: '支払い履歴' },
    carePackages: { title: 'ケアパッケージを送信', description: '軍人にケアパッケージを送信', sendTo: 'パッケージ送信先', recipientName: '受取人名', recipientRank: '階級', recipientUnit: '部隊/基地', itemsIncluded: '含まれるアイテム', itemDescription: 'アイテム説明', quantity: '数量', addItem: 'アイテムを追加', removeItem: 'アイテムを削除', packageWeight: '推定重量（ポンド）', shippingAddress: '配送先住所', submitPackage: 'ケアパッケージを送信', packageSubmitted: 'ケアパッケージが正常に送信されました', packageError: 'パッケージ送信エラー', packageHistory: '送信済みパッケージ', noPackages: 'まだパッケージは送信されていません' },
    footer: { support: 'サポート', email: 'メール: military@d4battalion.us', phone: '電話: +(430) 291-3433', whatsapp: 'WhatsAppサポート', contactUs: 'お問い合わせ', copyright: '© 2024 軍事サービスポータル。全著作権所有。' },
    common: { loading: '読み込み中...', error: 'エラー', success: '成功', cancel: 'キャンセル', save: '保存', delete: '削除', edit: '編集', back: '戻る', home: 'ホーム', required: '必須' },
  },
  // Chinese
  zh: {
    header: { title: '军事服务门户', logout: '登出', language: '语言', dashboard: '仪表板', leaveRequest: '休假申请', payments: '支付', carePackages: '关怀包裹' },
    login: { title: '军人门户', subtitle: '安全访问休假和家庭服务', password: '输入门户密码', submit: '访问门户', invalidPassword: '密码无效。请重试。', welcome: '欢迎来到军事服务门户' },
    dashboard: { title: '仪表板', welcome: '欢迎来到您的军事门户', selectService: '选择服务', leaveRequests: '休假申请', flightPayments: '航班支付', carePackages: '关怀包裹', recentActivity: '最近活动', noActivity: '没有最近活动' },
    leave: { title: '休假申请', applyFor: '申请休假', leaveType: '休假类型', emergency: '紧急休假', vacation: '休假', medical: '病假', soldierName: '士兵姓名', soldierRank: '士兵军衔', soldierID: '士兵ID', relationshipToSoldier: '您与士兵的关系', startDate: '开始日期', endDate: '结束日期', reason: '休假原因', attachments: '附件（可选）', submit: '提交休假申请', submitted: '休假申请提交成功', error: '提交休假申请时出错', status: '状态', pending: '待处理', approved: '已批准', rejected: '已拒绝', leaveHistory: '您的休假申请' },
    payments: { title: '航班支付', description: '批准休假后支付军事航班费用', approvableLeaves: '可用的已批准休假', selectLeave: '选择已批准的休假', flightFee: '航班费用金额', paymentMethod: '支付方式', cardNumber: '卡号', expiryDate: '到期日', cvv: 'CVV', billingAddress: '账单地址', city: '城市', state: '州', zipCode: '邮编', submitPayment: '处理付款', paymentSuccess: '付款处理成功', paymentError: '付款处理错误', paymentHistory: '付款历史' },
    carePackages: { title: '发送关怀包裹', description: '向军人发送关怀包裹', sendTo: '包裹发送至', recipientName: '收件人姓名', recipientRank: '军衔', recipientUnit: '单位/基地', itemsIncluded: '包含物品', itemDescription: '物品描述', quantity: '数量', addItem: '添加物品', removeItem: '移除物品', packageWeight: '估计重量（磅）', shippingAddress: '送货地址', submitPackage: '提交关怀包裹', packageSubmitted: '关怀包裹提交成功', packageError: '提交包裹时出错', packageHistory: '已发送包裹', noPackages: '尚未发送包裹' },
    footer: { support: '支持', email: '邮箱: military@d4battalion.us', phone: '电话: +(430) 291-3433', whatsapp: 'WhatsApp支持', contactUs: '联系我们', copyright: '© 2024 军事服务门户。保留所有权利。' },
    common: { loading: '加载中...', error: '错误', success: '成功', cancel: '取消', save: '保存', delete: '删除', edit: '编辑', back: '返回', home: '首页', required: '必填' },
  },
  // Russian
  ru: {
    header: { title: 'Портал Военных Услуг', logout: 'Выход', language: 'Язык', dashboard: 'Панель', leaveRequest: 'Заявка на отпуск', payments: 'Платежи', carePackages: 'Посылки поддержки' },
    login: { title: 'Портал Военнослужащих', subtitle: 'Безопасный доступ к услугам отпуска и семьи', password: 'Введите пароль портала', submit: 'Войти в портал', invalidPassword: 'Неверный пароль. Попробуйте снова.', welcome: 'Добро пожаловать на Портал Военных Услуг' },
    dashboard: { title: 'Панель', welcome: 'Добро пожаловать на ваш военный портал', selectService: 'Выберите услугу', leaveRequests: 'Заявки на отпуск', flightPayments: 'Платежи за рейсы', carePackages: 'Посылки поддержки', recentActivity: 'Недавняя активность', noActivity: 'Нет недавней активности' },
    leave: { title: 'Заявка на отпуск', applyFor: 'Подать заявку на отпуск', leaveType: 'Тип отпуска', emergency: 'Экстренный отпуск', vacation: 'Отпуск', medical: 'Больничный', soldierName: 'Имя солдата', soldierRank: 'Звание солдата', soldierID: 'ID солдата', relationshipToSoldier: 'Ваше отношение к солдату', startDate: 'Дата начала', endDate: 'Дата окончания', reason: 'Причина отпуска', attachments: 'Вложения (необязательно)', submit: 'Отправить заявку на отпуск', submitted: 'Заявка на отпуск успешно отправлена', error: 'Ошибка при отправке заявки', status: 'Статус', pending: 'Ожидание', approved: 'Одобрено', rejected: 'Отклонено', leaveHistory: 'Ваши заявки на отпуск' },
    payments: { title: 'Платежи за рейсы', description: 'Оплатите военные рейсы после одобренного отпуска', approvableLeaves: 'Доступные одобренные отпуска', selectLeave: 'Выберите одобренный отпуск', flightFee: 'Сумма за рейс', paymentMethod: 'Способ оплаты', cardNumber: 'Номер карты', expiryDate: 'Срок действия', cvv: 'CVV', billingAddress: 'Адрес выставления счета', city: 'Город', state: 'Штат', zipCode: 'Почтовый индекс', submitPayment: 'Обработать платеж', paymentSuccess: 'Платеж успешно обработан', paymentError: 'Ошибка обработки платежа', paymentHistory: 'История платежей' },
    carePackages: { title: 'Отправить посылки поддержки', description: 'Отправляйте посылки поддержки военнослужащим', sendTo: 'Отправить посылку', recipientName: 'Имя получателя', recipientRank: 'Звание', recipientUnit: 'Подразделение/База', itemsIncluded: 'Включенные предметы', itemDescription: 'Описание предмета', quantity: 'Количество', addItem: 'Добавить предмет', removeItem: 'Удалить предмет', packageWeight: 'Примерный вес (фунты)', shippingAddress: 'Адрес доставки', submitPackage: 'Отправить посылку поддержки', packageSubmitted: 'Посылка поддержки успешно отправлена', packageError: 'Ошибка при отправке посылки', packageHistory: 'Отправленные посылки', noPackages: 'Посылки еще не отправлены' },
    footer: { support: 'Поддержка', email: 'Эл. почта: military@d4battalion.us', phone: 'Телефон: +(430) 291-3433', whatsapp: 'Поддержка WhatsApp', contactUs: 'Свяжитесь с нами', copyright: '© 2024 Портал Военных Услуг. Все права защищены.' },
    common: { loading: 'Загрузка...', error: 'Ошибка', success: 'Успех', cancel: 'Отмена', save: 'Сохранить', delete: 'Удалить', edit: 'Редактировать', back: 'Назад', home: 'Главная', required: 'Обязательно' },
  },
  // Arabic
  ar: {
    header: { title: 'بوابة الخدمات العسكرية', logout: 'تسجيل الخروج', language: 'اللغة', dashboard: 'لوحة التحكم', leaveRequest: 'طلب إجازة', payments: 'المدفوعات', carePackages: 'طرود الدعم' },
    login: { title: 'بوابة الأفراد العسكريين', subtitle: 'الوصول الآمن لخدمات الإجازة والعائلة', password: 'أدخل كلمة مرور البوابة', submit: 'الدخول للبوابة', invalidPassword: 'كلمة المرور غير صحيحة. حاول مرة أخرى.', welcome: 'مرحباً بك في بوابة الخدمات العسكرية' },
    dashboard: { title: 'لوحة التحكم', welcome: 'مرحباً بك في بوابتك العسكرية', selectService: 'اختر خدمة', leaveRequests: 'طلبات الإجازة', flightPayments: 'مدفوعات الرحلات', carePackages: 'طرود الدعم', recentActivity: 'النشاط الأخير', noActivity: 'لا يوجد نشاط حديث' },
    leave: { title: 'طلب إجازة', applyFor: 'تقديم طلب إجازة', leaveType: 'نوع الإجازة', emergency: 'إجازة طارئة', vacation: 'إجازة سنوية', medical: 'إجازة مرضية', soldierName: 'اسم الجندي', soldierRank: 'رتبة الجندي', soldierID: 'رقم الجندي', relationshipToSoldier: 'علاقتك بالجندي', startDate: 'تاريخ البدء', endDate: 'تاريخ الانتهاء', reason: 'سبب الإجازة', attachments: 'المرفقات (اختياري)', submit: 'إرسال طلب الإجازة', submitted: 'تم إرسال طلب الإجازة بنجاح', error: 'خطأ في إرسال طلب الإجازة', status: 'الحالة', pending: 'قيد الانتظار', approved: 'موافق عليه', rejected: 'مرفوض', leaveHistory: 'طلبات إجازتك' },
    payments: { title: 'مدفوعات الرحلات', description: 'ادفع رسوم الرحلات العسكرية بعد الموافقة على الإجازة', approvableLeaves: 'الإجازات الموافق عليها المتاحة', selectLeave: 'اختر الإجازة الموافق عليها', flightFee: 'مبلغ رسوم الرحلة', paymentMethod: 'طريقة الدفع', cardNumber: 'رقم البطاقة', expiryDate: 'تاريخ الانتهاء', cvv: 'CVV', billingAddress: 'عنوان الفواتير', city: 'المدينة', state: 'الولاية', zipCode: 'الرمز البريدي', submitPayment: 'معالجة الدفع', paymentSuccess: 'تمت معالجة الدفع بنجاح', paymentError: 'خطأ في معالجة الدفع', paymentHistory: 'سجل المدفوعات' },
    carePackages: { title: 'إرسال طرود الدعم', description: 'أرسل طرود دعم للأفراد العسكريين', sendTo: 'إرسال الطرد إلى', recipientName: 'اسم المستلم', recipientRank: 'الرتبة', recipientUnit: 'الوحدة/القاعدة', itemsIncluded: 'العناصر المضمنة', itemDescription: 'وصف العنصر', quantity: 'الكمية', addItem: 'إضافة عنصر', removeItem: 'إزالة عنصر', packageWeight: 'الوزن التقديري (رطل)', shippingAddress: 'عنوان الشحن', submitPackage: 'إرسال طرد الدعم', packageSubmitted: 'تم إرسال طرد الدعم بنجاح', packageError: 'خطأ في إرسال الطرد', packageHistory: 'الطرود المرسلة', noPackages: 'لم يتم إرسال طرود بعد' },
    footer: { support: 'الدعم', email: 'البريد: military@d4battalion.us', phone: 'الهاتف: +(430) 291-3433', whatsapp: 'دعم واتساب', contactUs: 'اتصل بنا', copyright: '© 2024 بوابة الخدمات العسكرية. جميع الحقوق محفوظة.' },
    common: { loading: 'جاري التحميل...', error: 'خطأ', success: 'نجاح', cancel: 'إلغاء', save: 'حفظ', delete: 'حذف', edit: 'تعديل', back: 'رجوع', home: 'الرئيسية', required: 'مطلوب' },
  },
};

export function translate(key: string, language: string = 'en'): string {
  const keys = key.split('.');
  let value: any = translations[language as keyof typeof translations] || translations.en;

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}

export function getLanguageName(code: string): string {
  const names: Record<string, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
  };
  return names[code] || code;
}
