
let currentCard = null;
let initialDueCount = 0;

async function loadStats() {
    const response = await fetch("/stats");
    const stats = await response.json();

    document.getElementById("stat-total").textContent = stats.total_cards;
    document.getElementById("stat-mastered").textContent = stats.mastered;
    document.getElementById("stat-ease").textContent = stats.avg_ease_factor;
}

async function loadNextReview() {
    const response = await fetch("/cards/next");
    const data = await response.json();

    if (!data.next_review) {
        document.getElementById("next-review-text").textContent = "Πρόσθεσε νέες κάρτες για να ξεκινήσεις!";
        return;
    }

    const nextDate = new Date(data.next_review);
    const now = new Date();
    const diffMs = nextDate - now;
    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    let text;
    if (diffHours < 24) {
        text = `Επόμενη κάρτα σε ${diffHours} ώρες`;
    } else {
        text = `Επόμενη κάρτα σε ${diffDays} μέρες`;
    }

    document.getElementById("next-review-text").textContent = text;
}

async function loadDueCard() {
    const response = await fetch("/cards/due");
    const cards = await response.json();

    document.getElementById("due-count").textContent = `${cards.length} κάρτες για σήμερα`;

    if (initialDueCount === 0 && cards.length > 0) {
        initialDueCount = cards.length;
    }

    if (initialDueCount > 0)  {
        const completed = initialDueCount - cards.length;
        const percent = Math.round((completed / initialDueCount) * 100);
        document.getElementById("progress-bar-container").classList.remove("hidden");
        document.getElementById("progress-bar-fill").style.width = `${percent}%`;
    }

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
    document.getElementById("card").classList.remove("flipped");
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
    document.getElementById("card").classList.add("flipped");
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

        const checkResponse = await fetch("/cards/due");
        const remainingCards = await checkResponse.json();
        if (remainingCards.length === 0) {
            celebrate();
        }

        loadDueCard();
        loadStats();
        loadNextReview();
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
    loadStats();
    loadNextReview();
});

document.getElementById("info-toggle-btn").addEventListener("click", () => {
    document.getElementById("info-panel").classList.toggle("hidden");
});

loadDueCard();
loadStats();
loadNextReview();
async function loadManageList() {
    const response = await fetch("/cards");
    const cards = await response.json();

    const list = document.getElementById("manage-list");
    list.innerHTML = "";

    if (cards.length === 0) {
        list.innerHTML = "<p class='manage-item-text'>Δεν υπάρχουν κάρτες ακόμα.</p>";
        return;
    }

    cards.forEach(card => {
        const item = document.createElement("div");
        item.className = "manage-item";
        item.innerHTML = `
            <div>
                <p class="manage-item-category">${card.category}</p>
                <p class="manage-item-text">${card.question}</p>
            </div>
            <button class="btn-delete" data-id="${card.id}">✕</button>
        `;
        list.appendChild(item);
    });

    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.addEventListener("click", async () => {
            const cardId = btn.dataset.id;
            await fetch(`/cards/${cardId}`, { method: "DELETE" });
            loadManageList();
            loadDueCard();
            loadStats();
            loadNextReview();
        });
    });
}

function celebrate() {
    const colors = ["#3d8a5a", "#a3801f", "#a04545", "#6b6558", "#8a8478"];
    for (let i = 0; i < 30; i++) {
        const piece = document.createElement("div");
        piece.className = "confetti-piece";
        piece.style.left = `${Math.random() * 100}vw`;
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.animationDelay = `${Math.random() * 0.3}s`;
        document.body.appendChild(piece);
        setTimeout(() => piece.remove(), 1800);
    }
}

document.getElementById("manage-toggle-btn").addEventListener("click", () => {
    document.getElementById("manage-list").classList.toggle("hidden");
    loadManageList();
});