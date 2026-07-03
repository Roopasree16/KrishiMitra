import React from 'react';
import styles from './EmergencyModal.module.css';
import { Button } from './ui/Button';
import { X, Phone, MapPin, AlertTriangle, Heart } from 'lucide-react';

function EmergencyModal({
  isOpen,
  language = 'en-IN',
  onClose,
  isCritical,
  helplines,
  nearbyServices,
  nearestPolice,
  onCallHelpline,
}) {
  const lang = (language || 'en-IN').split('-')[0];

  const L = {
    'title_crisis': { en: 'Crisis Support', hi: 'संकट सहायता', te: 'సంక్షోభ సహాయం', ta: 'சிக்கல் ஆதரவு', kn: 'ಸಂಕಟ ಬೆಂಬಲ', ml: 'സങ്കടം സഹായം', mr: 'संकट समर्थन', bn: 'সংকট সহায়তা', gu: 'સંકટ સહાય' },
    'title_emergency': { en: 'Emergency Resources', hi: 'आपातकालीन संसाधन', te: 'అత్యవసర వనరులు', ta: 'அவசர வசதிகள்', kn: 'ತುರ್ತು ಸಂಪನ್ಮೂಲಗಳು', ml: 'അറിഞ്ഞറിഞ്ഞ സഹായം', mr: 'आपत्कालीन संसाधन', bn: 'জরুরি সম্পদ', gu: 'તાત્કાલિક સ્ત્રોતો' },
    'please_help': { en: 'Please reach out to a helpline immediately. You are not alone and help is available.', hi: 'कृपया तुरंत हेल्पलाइन से संपर्क करें। आप अकेले नहीं हैं। सहायता उपलब्ध है।', te: 'దయచేసి వెంటనే హెల్ప్‌లైన్‌ను సంప్రదించండి. మీరు ఒంటరిగా లేరని తెలుసుకోండి. సహాయం అందుబాటులో ఉంది.', ta: 'தயவுசெய்து உடனடியாக உதவிக்குரிய தொலைபேசி எண்ணை தொடர்புகொள்ளுங்கள். நீங்கள் ஒரு வீரர்கள் அல்லாவீர்கள். உதவி கிடைக்கிறது.', kn: 'ದಯವಿಟ್ಟು ತಕ್ಷಣ ಸಹಾಯರೇಖೆಯನ್ನು ಸಂಪರ್ಕಿಸಿ. ನೀವು ಒಂಟಿ ಅಲ್ಲ. ಸಹಾಯ ಲಭ್ಯವಿದೆ.', ml: 'ദയവായി ഉടൻ ഹെൽപ്‌ലൈന് ബന്ധപ്പെടുക. നിങ്ങൾ ഒറ്റക്കല്ല, സഹായം ലഭ്യമാണ്.', mr: 'कृपया त्वरित हेल्पलाइनशी संपर्क साधा. आपण एकटे नाही आहात. मदत उपलब्ध आहे.', bn: 'দয়া করে তৎক্ষণাৎ হেল্পলাইনে যোগাযোগ করুন। আপনি একা নন। সাহায্য পাওয়া যায়।', gu: 'કૃપા કરીને તાત્કાલિક હેલ્પલાઇનનો સંપર્ક કરો. તમે એકલા નથી. સહાય ઉપલબ્ધ છે.' },
    'available_helplines': { en: 'Available Helplines', hi: 'उपलब्ध हेल्पलाइन', te: 'అందుబాటులో ఉన్న హెల్ప్‌లైన్లు', ta: 'கிடைக்கும் உதவி எண்ணுகள்', kn: 'ಲಭ್ಯವಿರುವ ಸಹಾಯರೇಖೆಗಳು', ml: 'ലഭ്യമായ ഹെൽപ്‌ലൈൻസ്', mr: 'उपलब्ध हेल्पलाइन', bn: 'উপলব্ধ হেল্পলাইন', gu: 'ઉપલબ્ધ હેલ્પલાઇન્સ' },
    'nearby_services': { en: 'Nearby Services', hi: 'नजदीकी सेवाएँ', te: 'సమీప సేవలు', ta: 'அருகிலுள்ள சேவைகள்', kn: 'ಹತ್ತಿರದ ಸೇವೆಗಳು', ml: 'സമീപ സേവനങ്ങൾ', mr: 'जवळच्या सेवा', bn: 'নিকটবর্তী পরিষেবা', gu: 'નજીકની સેવાઓ' },
    'remember': { en: 'Remember', hi: 'याद रखें', te: 'గుర్తుంచుకోండి', ta: 'நினைவில் வையுங்கள்', kn: 'ಗುರ್ತಿಡಿ', ml: 'ഓര്‍മിക്കുന്നുണ്ടാകൂ', mr: 'लक्षात ठेवा', bn: 'মনে রাখবেন', gu: 'યાદ રાખો' },
    'remember_1': { en: 'Your life has value and meaning', hi: 'आपका जीवन मूल्यवान है', te: 'మీ జీవితం విలువైనది', ta: 'உங்கள் வாழ்க்கைக்கு மதிப்புண்டது', kn: 'ನಿಮ್ಮ ಜೀವನಕ್ಕೆ ಮೌಲ್ಯವಿದೆ', ml: 'നിന്റെ ജീവിതത്തിന് മൂല്യം ഉണ്ട്', mr: 'तुमचे आयुष्य मूल्यवान आहे', bn: 'আপনার জীবন মূল্যবান', gu: 'તમારું જીવન મૂલ્યવાન છે' },
    'remember_2': { en: 'This crisis is temporary', hi: 'यह संकट अस्थायी है', te: 'ఈ సంక్షోభ తాత్కాలికం', ta: 'இந்த சிக்கல் தற்காலிகம்', kn: 'ಈ ಸಂಕಟ ತಾತ್ಕಾಲಿಕವಾಗಿದೆ', ml: 'ഈ സാഹചര്യം താൽക്കാലികമാണ്', mr: 'हे संकट तात्पुरते आहे', bn: 'এই সংকট সাময়িক', gu: 'આ સંકટ અસ્થાયી છે' },
    'remember_3': { en: 'Help is always available', hi: 'सहायता हमेशा उपलब्ध है', te: 'సహాయం ఎప్పుడూ అందుబాటులో ఉంటుంది', ta: 'உதவி எப்போதும் கிடைக்கும்', kn: 'ಸಹಾಯ ಸದಾ ಲಭ್ಯವಿದೆ', ml: 'സഹായം എപ്പോഴും ലഭ്യമാണ്', mr: 'मदत नेहमी उपलब्ध आहे', bn: 'সাহায্য সর্বদা পাওয়া যায়', gu: 'મદદ હંમેશા ઉપલબ્ધ છે' },
    'remember_4': { en: 'You deserve support', hi: 'आपको समर्थन मिलना चाहिए', te: 'మీకు మద్దతు అందాలి', ta: 'உங்களுக்கு ஆதரவு கிடைக்க வேண்டும்', kn: 'ನೀವು ಬೆಂಬಲಕ್ಕೆ ಅರ್ಹರು', ml: 'നിനക്ക് പിന്തുണ തേടാം', mr: 'तुम्हाला सहाय्य मिळायला हवे', bn: 'আপনি সমর্থন পাওয়ার যোগ্য', gu: 'તમે સહાય માટે લાયક છો' },
    'close': { en: 'Close', hi: 'बंद करें', te: 'మూసివేయి', ta: 'மூடு', kn: 'ಮುಚ್ಚಿ', ml: 'മൂടി', mr: 'बंद करा', bn: 'বন্ধ করুন', gu: 'બંધ કરો' },
    'call': { en: 'Call', hi: 'कॉल करें', te: 'కాల్ చేయండి', ta: 'அழைக்கவும்', kn: 'ಕಾಲ್ ಮಾಡಿ', ml: 'വിളിക്കുക', mr: 'कॉल करा', bn: 'কল করুন', gu: 'કોલ કરો' }
  };

  const t = (key) => (L[key] && (L[key][lang] || L[key]['en'])) || '';


  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            {isCritical ? (
              <>
                <AlertTriangle className={styles.criticalIcon} />
                <h2>{t('title_crisis')}</h2>
              </>
            ) : (
              <>
                <Heart className={styles.emergencyIcon} />
                <h2>{t('title_emergency')}</h2>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className={styles.closeButton}
          >
            <X size={20} />
          </Button>
        </div>

        <div className={styles.content}>
          {isCritical && (
            <div className={styles.criticalWarning}>
              <p>
                {t('please_help')}
              </p>
            </div>
          )}

          {helplines && helplines.length > 0 && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Phone size={18} />
                {t('available_helplines')}
              </h3>
              <div className={styles.helplineList}>
                {helplines.map((helpline, index) => (
                  <div key={index} className={styles.helplineCard}>
                    <div className={styles.helplineInfo}>
                      <p className={styles.helplineName}>{helpline.helpline_name || helpline.name}</p>
                      <p className={styles.helplineNumber}>{helpline.helpline_number || helpline.number}</p>
                      {helpline.hours && (
                        <p className={styles.helplineHours}>{helpline.hours}</p>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onCallHelpline(helpline.helpline_number || helpline.number)}
                      className={styles.callButton}
                    >
                      <Phone size={16} />
                      {t('call')}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {nearestPolice && (
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <MapPin size={18} />
                {t('nearby_services')}
              </h3>
              <div className={styles.servicesList}>
                <div className={styles.serviceCard}>
                  <div className={styles.serviceInfo}>
                    <p className={styles.serviceName}>{nearestPolice.name}</p>
                    <p className={styles.serviceDistance}>{nearestPolice.distance_km ? `${nearestPolice.distance_km.toFixed(1)} km away` : 'Distance unknown'}</p>
                    {nearestPolice.lat && nearestPolice.lon && (
                      <p className={styles.serviceAddress}>{`Location: ${nearestPolice.lat.toFixed(4)}, ${nearestPolice.lon.toFixed(4)}`}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>{t('remember')}</h3>
            <ul className={styles.rememberList}>
              <li>{t('remember_1') || 'Your life has value and meaning'}</li>
              <li>{t('remember_2') || 'This crisis is temporary'}</li>
              <li>{t('remember_3') || 'Help is always available'}</li>
              <li>{t('remember_4') || 'You deserve support'}</li>
            </ul>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            variant="secondary"
            onClick={onClose}
            className={styles.closeModalButton}
          >
            {t('close')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EmergencyModal;
