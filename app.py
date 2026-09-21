from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///flashcards.db"

db = SQLAlchemy(app)


class Card(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.String(300), nullable=False)
    answer = db.Column(db.String(300), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    interval = db.Column(db.Integer, default=1)
    ease_factor = db.Column(db.Float, default=2.5)
    next_review = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


@app.route("/")
def home():
    return render_template("index.html")


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


@app.route("/cards/<int:card_id>", methods=["PUT"])
def update_card(card_id):
    card = Card.query.get_or_404(card_id)
    data = request.json
    card.question = data.get("question", card.question)
    card.answer = data.get("answer", card.answer)
    card.category = data.get("category", card.category)
    db.session.commit()
    return jsonify({"message": "Card updated"})


@app.route("/cards/<int:card_id>", methods=["DELETE"])
def delete_card(card_id):
    card = Card.query.get_or_404(card_id)
    db.session.delete(card)
    db.session.commit()
    return jsonify({"message": "Card deleted"})


@app.route("/cards/<int:card_id>/review", methods=["POST"])
def review_card(card_id):
    card = Card.query.get_or_404(card_id)
    data = request.json
    difficulty = data["difficulty"]

    if difficulty == "hard":
        card.ease_factor = max(1.3, card.ease_factor - 0.2)
        card.interval = 1
    elif difficulty == "medium":
        card.interval = round(card.interval * card.ease_factor)
    elif difficulty == "easy":
        card.ease_factor = card.ease_factor + 0.15
        card.interval = round(card.interval * card.ease_factor)

    card.next_review = datetime.utcnow() + timedelta(days=card.interval)
    db.session.commit()

    return jsonify({
        "message": "Card reviewed",
        "new_interval": card.interval,
        "new_ease_factor": round(card.ease_factor, 2),
        "next_review": card.next_review.isoformat()
    })


@app.route("/cards/due", methods=["GET"])
def get_due_cards():
    now = datetime.utcnow()
    due_cards = Card.query.filter(Card.next_review <= now).all()
    result = []
    for card in due_cards:
        result.append({
            "id": card.id,
            "question": card.question,
            "answer": card.answer,
            "category": card.category
        })
    return jsonify(result)


@app.route("/categories", methods=["GET"])
def get_categories():
    categories = db.session.query(Card.category).distinct().all()
    result = [c[0] for c in categories]
    return jsonify(result)
@app.route("/stats", methods=["GET"])

def get_stats():
    total_cards = Card.query.count()
    now = datetime.utcnow()
    due_today = Card.query.filter(Card.next_review <= now).count()
    mastered = Card.query.filter(Card.interval >= 21).count()

    all_cards = Card.query.all()
    if all_cards:
        avg_ease = sum(c.ease_factor for c in all_cards) / len(all_cards)
    else:
        avg_ease = 0

    return jsonify({
        "total_cards": total_cards,
        "due_today": due_today,
        "mastered": mastered,
        "avg_ease_factor": round(avg_ease, 2)
    })

@app.route("/cards/next", methods=["GET"])
def get_next_review():
    now = datetime.utcnow()
    next_card = Card.query.filter(Card.next_review > now).order_by(Card.next_review.asc()).first()
    if next_card:
        return jsonify({"next_review": next_card.next_review.isoformat()})
    return jsonify({"next_review": None})

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)