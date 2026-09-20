from app import app, db, Card

sample_cards = [
    {
        "question": "Τι κάνει η μέθοδος .map() σε JavaScript;",
        "answer": "Δημιουργεί νέο array, εφαρμόζοντας μια function σε κάθε στοιχείο του αρχικού",
        "category": "JavaScript"
    },
    {
        "question": "Τι είναι το CSS Flexbox;",
        "answer": "Ένα σύστημα διάταξης (layout) για ευέλικτη τοποθέτηση στοιχείων σε μία γραμμή/στήλη",
        "category": "CSS"
    },
    {
        "question": "Τι σημαίνει REST σε REST API;",
        "answer": "REpresentational State Transfer — αρχιτεκτονικό μοτίβο για web APIs",
        "category": "Dev"
    },
    {
        "question": "Τι κάνει η εντολή git commit;",
        "answer": "Δημιουργεί ένα snapshot (στιγμιότυπο) των αλλαγών στο repository",
        "category": "Git"
    },
    {
        "question": "Τι σημαίνει CRUD;",
        "answer": "Create, Read, Update, Delete — οι 4 βασικές λειτουργίες διαχείρισης δεδομένων",
        "category": "Dev"
    }
]

with app.app_context():
    for card_data in sample_cards:
        card = Card(
            question=card_data["question"],
            answer=card_data["answer"],
            category=card_data["category"]
        )
        db.session.add(card)
    db.session.commit()
    print(f"Προστέθηκαν {len(sample_cards)} κάρτες!")