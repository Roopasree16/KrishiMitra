import React from 'react';
import styles from './ChatMessage.module.css';
import { Volume2, Copy, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';

function ChatMessage({ message, isUser, isLoading, sentiment_score, emotion, is_critical }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const speakMessage = () => {
    const utterance = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(utterance);
  };

  const getSentimentLabel = (score) => {
    if (score <= -0.8) return 'Very Negative';
    if (score <= -0.4) return 'Negative';
    if (score < 0.4) return 'Neutral';
    if (score < 0.8) return 'Positive';
    return 'Very Positive';
  };

  if (isLoading) {
    return (
      <div className={styles.messageContainer}>
        <div className={styles.botMessage}>
          <div className={styles.loadingDots}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
  }

  const getSentimentAttribute = (score) => {
    if (score <= -0.8) return 'very-negative';
    if (score <= -0.4) return 'negative';
    if (score < 0.4) return 'neutral';
    if (score < 0.8) return 'positive';
    return 'very-positive';
  };

  return (
    <div className={`${styles.messageContainer} ${isUser ? styles.userContainer : styles.botContainer}`}>
      <div className={isUser ? styles.userMessage : styles.botMessage}>
        <p className={styles.messageText}>{message}</p>
        {isUser && (
          <>
            {(is_critical || emotion || sentiment_score !== undefined) && (
              <div className={styles.sentimentBadge}>
                {is_critical && <AlertCircle size={12} title="Critical sentiment detected" />}
                {emotion && <span className={styles.emotionLabel}>{emotion}</span>}
                {sentiment_score !== undefined && <span className={styles.sentimentScore} data-sentiment={getSentimentAttribute(sentiment_score)}>{getSentimentLabel(sentiment_score)}</span>}
              </div>
            )}
          </>
        )}
        {!isUser && (
          <div className={styles.messageActions}>
            <button
              className={styles.actionButton}
              onClick={speakMessage}
              title="Speak message"
            >
              <Volume2 size={16} />
            </button>
            <button
              className={styles.actionButton}
              onClick={copyToClipboard}
              title="Copy message"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
