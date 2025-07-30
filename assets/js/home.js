
// let duration = 15; // 25 minutes in second
let durations = [25 * 60, 5 * 60, 15 * 60]; // 25 minutes, 5 minutes, 15 minutes in seconds
let currentSession = 0; // 0 for work, 1 for short break, 2 for long break
if (currentSession == 0) {
    duration = durations[0]; // 25 minutes for work
} else if (currentSession == 1) {
    duration = durations[1]; // 5 minutes for short break
} else {
    duration = durations[2]; // 15 minutes for long break
}

let timer = duration;
let interval = null;
let isRunning = false;
let audio = $('audio')[0]; // Get the audio element
let shortBreakCount = 0; // Counter for short breaks
let startTime = null;

function updateDisplay() {
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    document.getElementById('timer').textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

}

// Update mode display based on current session
function updateMode() {
    const modes = $('.mode');
    if (currentSession == 0) {
        modes.removeClass('mode-active');
        $('#pomodoro').addClass('mode-active');
        audio.pause(); // Pause audio if playing
    } else if (currentSession == 1) {
        modes.removeClass('mode-active');
        $('#short-break').addClass('mode-active');
    } else {
        modes.removeClass('mode-active');
        audio.pause(); // Pause audio if playing
        $('#long-break').addClass('mode-active');
    }
}
// update base on click
function changeMode() {
    const modes = $('.mode');
    modes.removeClass('mode-active');
    $(this).addClass('mode-active');
    const modeId = $(this).attr('id');
    if (modeId === 'pomodoro') {
        duration = 25 * 60; // 25 minutes for work
        currentSession = 0; // Set current session to work
    } else if (modeId === 'short-break') {
        duration = durations[1] // 5 minutes for short break
        currentSession = 1; // Set current session to short break
    } else {
        duration = 15 * 60; // 15 minutes for long break
        currentSession = 2; // Set current session to long break
    }
    console.log(currentSession);
    resetTimer(); // Reset the timer to the new duration

}

function updateTimmer() {
    if (currentSession == 0) {
        duration = 25 * 60; // 25 minutes for work
    } else if (currentSession == 1) {
        duration = 5 * 60; // 5 minutes for short break
    } else {
        duration = 15 * 60; // 15 minutes for long break
    }
    timer = duration;
}

function startTimer() {
    if (currentSession == 1) {
        const audio = $('audio')[0];
        audio.play(); // Play audio for short break
    }
    startTime = Date.now(); // Record the start time
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now(); // Record the start time
        interval = setInterval(() => {
            let now = Date.now();
            elapsedTime = Math.floor((now - startTime) / 1000); // Calculate elapsed time in seconds
            console.log(`Elapsed time: ${elapsedTime} seconds`);
            timer = duration - elapsedTime; // Decrease timer by elapsed time
            if (timer > 0) {
                updateDisplay();
            } else {
                currentSession = (currentSession + 1) % 3; // Cycle through sessions
                if (currentSession == 1) {
                    shortBreakCount++; // Increment short break count
                    if (shortBreakCount >= 4) {
                        currentSession = 2; // Switch to long break after 4 short breaks
                        shortBreakCount = 0; // Reset short break count
                    }
                }
                if (currentSession == 2 && shortBreakCount < 4) { // switch to long break only if short breaks are equal to 4
                    currentSession = 0;
                }
                updateTimmer(); // Update duration based on current session
                updateDisplay();
                updateMode(); // Change mode display
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(interval);
    audio.pause(); // Pause audio if playing
    isRunning = false;
    duration = timer; // Save the current timer value
}

function resetTimer() {
    clearInterval(interval);
    isRunning = false;
    audio.pause(); // Pause audio if playing
    duration = durations[currentSession]; // Reset duration based on current session
    timer = duration; // Reset timer to the initial duration
    updateDisplay();
}

// Initialize display
updateDisplay();

// update mode base on click

$('.mode').on('click', changeMode);