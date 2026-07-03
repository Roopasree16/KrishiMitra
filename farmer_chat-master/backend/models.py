from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class ChatHistory(db.Model):
    __tablename__ = 'chat_history'
    
    id = db.Column(db.Integer, primary_key=True)
    user_message = db.Column(db.Text, nullable=False)
    bot_reply = db.Column(db.Text, nullable=False)
    language = db.Column(db.String(10), default='en')
    sentiment_score = db.Column(db.Float)  # polarity score from TextBlob
    emotion = db.Column(db.String(20))  # distressed, sad, neutral
    is_emergency = db.Column(db.Boolean, default=False)  # True if very negative or user asks for help
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_message': self.user_message,
            'bot_reply': self.bot_reply,
            'language': self.language,
            'sentiment_score': self.sentiment_score,
            'emotion': self.emotion,
            'is_emergency': self.is_emergency,
            'timestamp': self.timestamp.isoformat() if self.timestamp else None,
        }


class EmergencyContact(db.Model):
    __tablename__ = 'emergency_contacts'
    
    id = db.Column(db.Integer, primary_key=True)
    country = db.Column(db.String(50), default='India')
    helpline_name = db.Column(db.String(255))
    helpline_number = db.Column(db.String(20))
    helpline_url = db.Column(db.String(255))
    language = db.Column(db.String(10), default='en')
    
    def to_dict(self):
        return {
            'id': self.id,
            'country': self.country,
            'helpline_name': self.helpline_name,
            'helpline_number': self.helpline_number,
            'helpline_url': self.helpline_url,
            'language': self.language,
        }
