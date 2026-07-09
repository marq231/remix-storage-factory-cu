import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
      'nav.home': 'Home',
      'nav.grants': 'Grants',
      'nav.loans': 'Loans',
      'nav.about': 'About Us',
      'nav.eligibility': 'Check Eligibility',
      'nav.apply_loan': 'Apply for Loan',
      
      // Common
      'common.apply': 'Apply',
      'common.next': 'Next',
      'common.submit': 'Submit',
      'common.cancel': 'Cancel',
      'common.back': 'Back',
      'common.required': 'Required',
      'common.optional': 'Optional',
      
      // Grants
      'grants.title': 'Grant Programs',
      'grants.check_eligibility': 'Check Your Eligibility',
      'grants.apply': 'Apply for Grant',
      
      // Loans
      'loans.title': 'Loan Programs',
      'loans.apply': 'Apply for Loan',
    }
  },
  es: {
    translation: {
      'nav.home': 'Inicio',
      'nav.grants': 'Subvenciones',
      'nav.loans': 'Préstamos',
      'nav.about': 'Acerca de Nosotros',
      'nav.eligibility': 'Verificar Elegibilidad',
      'nav.apply_loan': 'Solicitar Préstamo',
      'common.apply': 'Solicitar',
      'common.next': 'Siguiente',
      'common.submit': 'Enviar',
      'common.cancel': 'Cancelar',
      'common.back': 'Atrás',
      'common.required': 'Requerido',
      'common.optional': 'Opcional',
      'grants.title': 'Programas de Subvenciones',
      'grants.check_eligibility': 'Verificar Tu Elegibilidad',
      'grants.apply': 'Solicitar Subvención',
      'loans.title': 'Programas de Préstamos',
      'loans.apply': 'Solicitar Préstamo',
    }
  },
  fr: {
    translation: {
      'nav.home': 'Accueil',
      'nav.grants': 'Subventions',
      'nav.loans': 'Prêts',
      'nav.about': 'À Propos de Nous',
      'nav.eligibility': 'Vérifier L\'Admissibilité',
      'nav.apply_loan': 'Demander un Prêt',
      'common.apply': 'Demander',
      'common.next': 'Suivant',
      'common.submit': 'Soumettre',
      'common.cancel': 'Annuler',
      'common.back': 'Retour',
      'common.required': 'Requis',
      'common.optional': 'Optionnel',
      'grants.title': 'Programmes de Subventions',
      'grants.check_eligibility': 'Vérifier Votre Admissibilité',
      'grants.apply': 'Demander une Subvention',
      'loans.title': 'Programmes de Prêts',
      'loans.apply': 'Demander un Prêt',
    }
  },
  de: {
    translation: {
      'nav.home': 'Startseite',
      'nav.grants': 'Zuschüsse',
      'nav.loans': 'Darlehen',
      'nav.about': 'Über Uns',
      'nav.eligibility': 'Berechtigung Prüfen',
      'nav.apply_loan': 'Darlehen Beantragen',
      'common.apply': 'Beantragen',
      'common.next': 'Weiter',
      'common.submit': 'Absenden',
      'common.cancel': 'Abbrechen',
      'common.back': 'Zurück',
      'common.required': 'Erforderlich',
      'common.optional': 'Optional',
      'grants.title': 'Zuschuss-Programme',
      'grants.check_eligibility': 'Überprüfen Sie Ihre Berechtigung',
      'grants.apply': 'Zuschuss Beantragen',
      'loans.title': 'Darlehensprogramme',
      'loans.apply': 'Darlehen Beantragen',
    }
  },
  pt: {
    translation: {
      'nav.home': 'Início',
      'nav.grants': 'Bolsas',
      'nav.loans': 'Empréstimos',
      'nav.about': 'Sobre Nós',
      'nav.eligibility': 'Verificar Elegibilidade',
      'nav.apply_loan': 'Solicitar Empréstimo',
      'common.apply': 'Solicitar',
      'common.next': 'Próximo',
      'common.submit': 'Enviar',
      'common.cancel': 'Cancelar',
      'common.back': 'Voltar',
      'common.required': 'Obrigatório',
      'common.optional': 'Opcional',
      'grants.title': 'Programas de Bolsas',
      'grants.check_eligibility': 'Verifique Sua Elegibilidade',
      'grants.apply': 'Solicitar Bolsa',
      'loans.title': 'Programas de Empréstimos',
      'loans.apply': 'Solicitar Empréstimo',
    }
  },
  ja: {
    translation: {
      'nav.home': 'ホーム',
      'nav.grants': '助成金',
      'nav.loans': 'ローン',
      'nav.about': 'について',
      'nav.eligibility': '適格性を確認',
      'nav.apply_loan': 'ローンを申し込む',
      'common.apply': '申し込む',
      'common.next': '次へ',
      'common.submit': '送信',
      'common.cancel': 'キャンセル',
      'common.back': '戻る',
      'common.required': '必須',
      'common.optional': 'オプション',
      'grants.title': '助成金プログラム',
      'grants.check_eligibility': 'あなたの適格性を確認',
      'grants.apply': '助成金を申し込む',
      'loans.title': 'ローンプログラム',
      'loans.apply': 'ローンを申し込む',
    }
  },
  zh: {
    translation: {
      'nav.home': '首页',
      'nav.grants': '补助金',
      'nav.loans': '贷款',
      'nav.about': '关于我们',
      'nav.eligibility': '检查资格',
      'nav.apply_loan': '申请贷款',
      'common.apply': '申请',
      'common.next': '下一步',
      'common.submit': '提交',
      'common.cancel': '取消',
      'common.back': '返回',
      'common.required': '必需',
      'common.optional': '可选',
      'grants.title': '补助金计划',
      'grants.check_eligibility': '检查您的资格',
      'grants.apply': '申请补助金',
      'loans.title': '贷款计划',
      'loans.apply': '申请贷款',
    }
  },
  ar: {
    translation: {
      'nav.home': 'الرئيسية',
      'nav.grants': 'المنح',
      'nav.loans': 'القروض',
      'nav.about': 'معلومات عنا',
      'nav.eligibility': 'تحقق من الأهلية',
      'nav.apply_loan': 'تقدم بطلب للحصول على قرض',
      'common.apply': 'تقدم',
      'common.next': 'التالي',
      'common.submit': 'إرسال',
      'common.cancel': 'إلغاء',
      'common.back': 'رجوع',
      'common.required': 'مطلوب',
      'common.optional': 'اختياري',
      'grants.title': 'برامج المنح',
      'grants.check_eligibility': 'تحقق من أهليتك',
      'grants.apply': 'تقدم بطلب للحصول على منحة',
      'loans.title': 'برامج القروض',
      'loans.apply': 'تقدم بطلب للحصول على قرض',
    }
  },
  hi: {
    translation: {
      'nav.home': 'होम',
      'nav.grants': 'अनुदान',
      'nav.loans': 'ऋण',
      'nav.about': 'हमारे बारे में',
      'nav.eligibility': 'पात्रता जांचें',
      'nav.apply_loan': 'ऋण के लिए आवेदन करें',
      'common.apply': 'आवेदन',
      'common.next': 'अगला',
      'common.submit': 'जमा करें',
      'common.cancel': 'रद्द करें',
      'common.back': 'वापस',
      'common.required': 'आवश्यक',
      'common.optional': 'वैकल्पिक',
      'grants.title': 'अनुदान कार्यक्रम',
      'grants.check_eligibility': 'अपनी पात्रता जांचें',
      'grants.apply': 'अनुदान के लिए आवेदन करें',
      'loans.title': 'ऋण कार्यक्रम',
      'loans.apply': 'ऋण के लिए आवेदन करें',
    }
  },
  ko: {
    translation: {
      'nav.home': '홈',
      'nav.grants': '보조금',
      'nav.loans': '대출',
      'nav.about': '우리에 대해',
      'nav.eligibility': '적격성 확인',
      'nav.apply_loan': '대출 신청',
      'common.apply': '신청',
      'common.next': '다음',
      'common.submit': '제출',
      'common.cancel': '취소',
      'common.back': '뒤로',
      'common.required': '필수',
      'common.optional': '선택사항',
      'grants.title': '보조금 프로그램',
      'grants.check_eligibility': '적격성을 확인하세요',
      'grants.apply': '보조금 신청',
      'loans.title': '대출 프로그램',
      'loans.apply': '대출 신청',
    }
  },
  ru: {
    translation: {
      'nav.home': 'Главная',
      'nav.grants': 'Гранты',
      'nav.loans': 'Кредиты',
      'nav.about': 'О Нас',
      'nav.eligibility': 'Проверить Право',
      'nav.apply_loan': 'Подать Заявку на Кредит',
      'common.apply': 'Подать Заявку',
      'common.next': 'Далее',
      'common.submit': 'Отправить',
      'common.cancel': 'Отмена',
      'common.back': 'Назад',
      'common.required': 'Обязательно',
      'common.optional': 'Необязательно',
      'grants.title': 'Программы Грантов',
      'grants.check_eligibility': 'Проверьте Ваше Право',
      'grants.apply': 'Подать Заявку на Грант',
      'loans.title': 'Программы Кредитов',
      'loans.apply': 'Подать Заявку на Кредит',
    }
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export default i18n;
