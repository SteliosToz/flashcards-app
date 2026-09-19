from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///flashcards.db"

db = SQLAlchemy(app)


class Card(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(300), nullable=False)
    answer = db.Column(db.String(300), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    interval = db.Column(db.Integer, default=1)
    next_review = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


@app.route("/")
def home():
    return "Hello, Flashcards!"


@app.route("/cards", methods=["POST"])
def create_card():
    data = request.json
    new_card = Card(
        question=data["question"],
        answer=data["answer"],
        category=data["category"]
    )
    db.session.add(new_card)
    db.session.commit()
    return jsonify({"message": "Card created", "id": new_card.id}), 201


@app.route("/cards", methods=["GET"])
def get_cards():
    cards = Card.query.all()
    result = []
    for card in cards:
        result.append({
            "id": card.id,
            "question": card.question,
            "answer": card.answer,
            "category": card.category
        })
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True)