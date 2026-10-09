// Mock Dati: 24 storie di esempio con immagini segnaposto natalizie sempre diverse
const storiesData = {};
for (let i = 1; i <= 24; i++) {
    storiesData[i] = {
        title: `La Magia del Giorno ${i}`,
        text: `Questo è il testo segnaposto per la storia del giorno ${i}. C'era una volta, in un villaggio coperto di soffice neve bianca, un piccolo elfo che preparava i regali di Natale... Puoi personalizzare questo spazio inserendo i tuoi racconti e le tue poesie speciali giorno dopo giorno.`,
        // Utilizziamo ID e seed diversi per avere immagini natalizie differenti
        image: `https://picsum.photos/seed/christmas${i}/200/200`
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('calendarGrid');
    const overlay = document.getElementById('storyOverlay');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlayBody = document.getElementById('overlayBody');
    const closeBtn = document.getElementById('closeBtn');

    // Recupera lo stato delle caselle salvate da localStorage (se presenti)
    let openedBoxes = JSON.parse(localStorage.getItem('adventCalendarOpened')) || [];

    // Genera le 24 caselle del calendario
    for (let day = 1; day <= 24; day++) {
        const boxData = storiesData[day];

        const box = document.createElement('div');
        box.classList.add('box');
        box.setAttribute('data-day', day);

        // Verifica se la casella era già stata aperta in precedenza
        if (openedBoxes.includes(day)) {
            box.classList.add('opened');
        }

        box.innerHTML = `
            <div class="box-content">
                <span class="story-link" data-day="${day}">${boxData.title}</span>
            </div>
            <div class="door" style="background-image: url('${boxData.image}')">
                <div class="door-number">${day}</div>
            </div>
        `;

        // Click sulla casella per aprire la porta del calendario
        box.addEventListener('click', (e) => {
            // Evita di scatenare l'apertura se si clicca direttamente sul link interno già visibile
            if (e.target.classList.contains('story-link')) return;

            if (!box.classList.contains('opened')) {
                box.classList.add('opened');
                // Salva lo stato nel localStorage
                if (!openedBoxes.includes(day)) {
                    openedBoxes.push(day);
                    localStorage.setItem('adventCalendarOpened', JSON.stringify(openedBoxes));
                }
            }
        });

        grid.appendChild(box);
    }

    // Gestione dei click sui titoli delle storie per aprire l'overlay
    grid.addEventListener('click', (e) => {
        if (e.target.classList.contains('story-link')) {
            const day = e.target.getAttribute('data-day');
            const story = storiesData[day];
            
            overlayTitle.textContent = story.title;
            overlayBody.textContent = story.text;
            overlay.classList.add('active');
        }
    });

    // Chiusura dell'overlay con la X
    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    // Chiusura dell'overlay cliccando fuori dal contenuto
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });
});
