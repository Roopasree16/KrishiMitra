import React, { useState } from 'react';
import styles from './VirtualKeyboard.module.css';
import { Button } from './ui/Button';
import { Delete, RotateCcw } from 'lucide-react';

const KEYBOARD_LAYOUTS = {
  'en': [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
  ],
  'hi': [
    ['क', 'ख', 'ग', 'घ', 'च', 'छ', 'ज', 'झ', 'ट', 'ठ'],
    ['ड', 'ढ', 'त', 'थ', 'द', 'ध', 'न', 'प', 'फ', 'ब'],
    ['भ', 'म', 'य', 'र', 'ल', 'व', 'श', 'ष', 'स', 'ह'],
  ],
  'te': [
    ['అ', 'ఆ', 'ఇ', 'ఈ', 'ఉ', 'ఊ', 'ఎ', 'ఏ', 'ఐ', 'ఒ'],
    ['ఓ', 'ఔ', 'క', 'ఖ', 'గ', 'ఘ', 'చ', 'ఛ', 'జ', 'ఝ'],
    ['ట', 'ఠ', 'డ', 'ఢ', 'ణ', 'త', 'థ', 'ద', 'ధ', 'న'],
  ],
  'ta': [
    ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ'],
    ['ஓ', 'ஔ', 'க', 'ங', 'চ', 'ஞ', 'ட', 'ண', 'த', 'ந'],
    ['ப', 'ம', 'ய', 'ர', 'ல', 'வ', 'ழ', 'ள', 'ற', 'ன'],
  ],
  'kn': [
    ['ಅ', 'ಆ', 'ಇ', 'ಈ', 'ಉ', 'ಊ', 'ಎ', 'ಏ', 'ಐ', 'ಒ'],
    ['ಓ', 'ಔ', 'ಕ', 'ಖ', 'ಗ', 'ಘ', 'ಙ', 'ಚ', 'ಛ', 'ಜ'],
    ['ಝ', 'ಟ', 'ಠ', 'ಡ', 'ಢ', 'ಣ', 'ತ', 'ಥ', 'ದ', 'ಧ'],
  ],
  'ml': [
    ['അ', 'ആ', '�', 'ഈ', 'ഉ', 'ഊ', 'എ', 'ഏ', 'ഐ', 'ഒ'],
    ['ഓ', 'ഔ', 'ക', 'ഖ', 'ഗ', 'ഘ', 'ങ', 'ച', 'ഛ', 'ജ'],
    ['ഝ', 'ഞ', 'ട', 'ഠ', 'ഡ', 'ഢ', 'ണ', 'ത', 'ഥ', 'ദ'],
  ],
  'mr': [
    ['अ', 'आ', 'इ', 'ई', 'उ', 'ऊ', 'ए', 'ऐ', 'ओ', 'औ'],
    ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज', 'झ', 'ञ'],
    ['ट', 'ठ', 'ड', 'ढ', 'ण', 'त', 'थ', 'द', 'ध', 'न'],
  ],
  'bn': [
    ['অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'ঌ', 'এ', 'ঐ'],
    ['ও', 'ঔ', 'ক', 'খ', 'গ', 'ঘ', 'ঙ', 'চ', 'ছ', 'জ'],
    ['ঝ', 'ঞ', 'ট', 'ঠ', 'ড', 'ঢ', 'ণ', 'ত', 'থ', 'দ'],
  ],
  'gu': [
    ['અ', 'આ', '�', 'ઈ', 'ઉ', 'ઊ', 'એ', 'ઐ', 'ઓ', 'ઔ'],
    ['ક', 'ખ', 'ગ', 'ઘ', 'ઙ', 'ચ', 'છ', 'જ', 'ઝ', 'ञ'],
    ['ટ', 'ઠ', 'ડ', 'ઢ', 'ણ', 'ત', 'થ', 'દ', 'ધ', 'ન'],
  ],
  'or': [
    ['ଅ', 'ଆ', 'ଇ', 'ଈ', 'ଉ', 'ଊ', 'ଏ', 'ଐ', 'ଓ', 'ଔ'],
    ['କ', 'ଖ', 'ଗ', 'ଘ', 'ଚ', 'ଛ', 'ଜ', 'ଝ', 'ଟ', 'ଠ'],
    ['ଡ', 'ଢ', 'ଣ', 'ତ', 'ଥ', 'ଦ', 'ଧ', 'ନ', 'ପ', 'ଫ'],
    ['ବ', 'ଭ', 'ମ', 'ଯ', 'ର', 'ଲ', 'ବ', 'ଶ', 'ଷ', 'ସ'],
  ],
};

function VirtualKeyboard({
  language,
  onKeyPress,
  onBackspace,
  onSpace,
  onEnter,
  isVisible,
  onToggle,
}) {
  const [shift, setShift] = useState(false);
  
  if (!isVisible) return null;

  const langCode = language.split('-')[0].toLowerCase();
  const layout = KEYBOARD_LAYOUTS[langCode] || KEYBOARD_LAYOUTS['en'];

  const keysForRender = layout.map((row) =>
    row.map((k) => (shift && langCode === 'en' ? k.toLowerCase() : k))
  );

  return (
    <div className={styles.keyboard}>
      <div className={styles.keyboardContent}>
        {layout.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {keysForRender[rowIndex].map((key) => (
              <button
                key={key + rowIndex}
                className={styles.key}
                onClick={() => onKeyPress(key)}
              >
                {key}
              </button>
            ))}
          </div>
        ))}

        <div className={styles.row}>
          <Button variant="ghost" size="sm" onClick={() => setShift((s) => !s)}>
            {shift ? 'Shift' : 'shift'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onSpace}
            className={styles.spaceKey}
          >
            Space
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={onBackspace}
            className={styles.backspaceKey}
          >
            <Delete size={16} />
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              // clear
              onToggle && onToggle(false);
            }}
            className={styles.clearKey}
          >
            <RotateCcw size={16} />
          </Button>

          <Button
            variant="success"
            size="sm"
            onClick={onEnter}
            className={styles.enterKey}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default VirtualKeyboard;
