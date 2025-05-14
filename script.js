let numSelected = null;
let tileSelected = null;
let errors = 0;
let hapticsEnabled = true;

const board = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
];

const solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
];

window.onload = function() {
    // Load haptics preference
    if (localStorage.getItem("hapticsEnabled") !== null) {
        hapticsEnabled = localStorage.getItem("hapticsEnabled") === 'true';
    }
    
    setGame();
    updateHapticToggle();
    
    // Prevent zooming on mobile
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
}

function setGame() {
    // Create haptic toggle button
    const hapticToggle = document.createElement("button");
    hapticToggle.id = "haptic-toggle";
    hapticToggle.addEventListener("click", toggleHaptics);
    document.body.appendChild(hapticToggle);

    // Create number selection buttons
    for (let i = 1; i <= 9; i++) {
        let number = document.createElement("div");
        number.id = i;
        number.innerText = i;
        number.addEventListener("click", selectNumber);
        number.addEventListener("touchstart", selectNumber, {passive: true});
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Create Sudoku board
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            
            if (board[r][c] != "-") {
                tile.innerText = board[r][c];
                tile.classList.add("tile-start");
            }
            
            tile.addEventListener("click", selectTile);
            tile.addEventListener("touchstart", selectTile, {passive: true});
            tile.classList.add("tile");
            document.getElementById("board").appendChild(tile);
        }
    }
}

function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
    triggerHapticFeedback(15);
}

function selectTile() {
    if (numSelected) {
        if (this.innerText != "") {
            return;
        }
 
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);

        if (solution[r][c] == numSelected.id) {
            triggerHapticFeedback(20);
            this.innerText = numSelected.id;
            if (checkCompletion()) {
                setTimeout(showCongratulations, 500);
            }
        }
        else {
            triggerHapticFeedback(50);
            errors += 1;
            document.getElementById("errors").innerText = errors;
            this.classList.add("shake");
            setTimeout(() => this.classList.remove("shake"), 500);
        }
    }
}

function triggerHapticFeedback(duration) {
    if (hapticsEnabled && 'vibrate' in navigator) {
        navigator.vibrate(duration);
    }
}

function checkCompletion() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            if (tile.innerText == "" || tile.innerText != solution[r][c]) {
                return false;
            }
        }
    }
    return true;
}

function showCongratulations() {
    if (hapticsEnabled && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 200]);
    }
    
    document.getElementById("final-errors").innerText = errors;
    document.getElementById("congrats-modal").style.display = "block";
}

function toggleHaptics() {
    hapticsEnabled = !hapticsEnabled;
    localStorage.setItem("hapticsEnabled", hapticsEnabled);
    updateHapticToggle();
    triggerHapticFeedback(hapticsEnabled ? 10 : 50);
}

function updateHapticToggle() {
    const toggleBtn = document.getElementById("haptic-toggle");
    if (toggleBtn) {
        toggleBtn.textContent = hapticsEnabled ? "📳 Haptics ON" : "🔇 Haptics OFF";
        toggleBtn.style.backgroundColor = hapticsEnabled ? "var(--light-green)" : "var(--beige)";
    }
}

// Close modal when clicking outside
window.addEventListener("click", function(event) {
    if (event.target == document.getElementById("congrats-modal")) {
        document.getElementById("congrats-modal").style.display = "none";
    }
});

// Play again button
document.getElementById("play-again").addEventListener("click", function() {
    location.reload();
});