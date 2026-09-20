let currentCard = null;

async function loadDueCard() {
    const response = await fetch("/cards/due");
    const cards = await response.json();

    document.getElementById("due-count").textContent = `${cards.length} κάρτες για σήμερα`;

    if (cards.length === 0) {
        document.getElementById("card-container").innerHTML = "<p>Καμία κάρτα για σήμερα 🎉</p>";
        document.getElementById("difficulty-buttons").classList.add("hidden");
        return;
    }

    currentCard = cards[0];
    document.getElementById("card-category").textContent = currentCard.category;
    document.getElementById("card-question").textContent = currentCard.question;
    document.getElementById("card-answer").textContent = currentCard.answer;
    document.getElementById("card-answer").classList.add("hidden");
    document.getElementById("flip-btn").classList.remove("hidden");
    document.getElementById("difficulty-buttons").classList.add("hidden");
}

document.getElementById("flip-btn").addEventListener("click", () => {
    document.getElementById("card-answer").classList.remove("hidden");
    document.getElementById("flip-btn").classList.add("hidden");
    document.getElementById("difficulty-buttons").classList.remove("hidden");
});

document.querySelectorAll(".difficulty-buttons button").forEach(button => {
    button.addEventListener("click", async () => {
        const difficulty = button.dataset.difficulty;
        await fetch(`/cards/${currentCard.id}/review`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ difficulty: difficulty })
        });
        loadDueCard();
    });
});

loadDueCard();