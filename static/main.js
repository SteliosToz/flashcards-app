let currentCard = null;

async function loadDueCard() {
    const response = await fetch("/cards/due");
    const cards = await response.json();

    document.getElementById("due-count").textContent = `${cards.length} κάρτες για σήμερα`;

    if (cards.length === 0) {
        document.getElementById("card").classList.add("hidden");
        document.getElementById("no-cards-message").classList.remove("hidden");
        document.getElementById("difficulty-buttons").classList.add("hidden");
        return;
    }

    document.getElementById("card").classList.remove("hidden");
    document.getElementById("no-cards-message").classList.add("hidden");

    currentCard = cards[0];
    document.getElementById("card-category").textContent = currentCard.category;
    document.getElementById("card-question").textContent = currentCard.question;
    document.getElementById("card-answer").textContent = currentCard.answer;
    document.getElementById("card-answer").classList.add("hidden");
    document.getElementById("flip-btn").classList.remove("hidden");
    document.getElementById("difficulty-buttons").classList.add("hidden");

    const categoryColors = {
        "English": "#faf7f0",
        "JavaScript": "#f3ede6",
        "Git": "#eef2ec",
        "CSS": "#eef0f5",
        "Python": "#f5eeee",
        "Dev": "#eeeef5"
    };
    const cardColor = categoryColors[currentCard.category] || "#faf7f0";
    document.getElementById("card").style.backgroundColor = cardColor;
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

document.getElementById("toggle-form-btn").addEventListener("click", () => {
    document.getElementById("add-card-form").classList.toggle("hidden");
});

document.getElementById("add-card-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const question = document.getElementById("new-question").value;
    const answer = document.getElementById("new-answer").value;
    const category = document.getElementById("new-category").value;

    await fetch("/cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer, category })
    });

    document.getElementById("add-card-form").reset();
    document.getElementById("add-card-form").classList.add("hidden");
    loadDueCard();
});

loadDueCard();