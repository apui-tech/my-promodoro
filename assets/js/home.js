
// let duration = 15; // 25 minutes in second
let durations = [25*60, 5*60, 15*60]; // 25 minutes, 5 minutes, 15 minutes in seconds
let currentSession = 0; // 0 for work, 1 for short break, 2 for long break
let duration = 0; // Initialize duration variable

duration = durations[currentSession]; // Set initial duration based on current session

let timer = duration;
let interval = null;
let isRunning = false;
let audio = $('audio')[0]; // Get the audio element
audio.load(); // Load the audio file
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
    duration = durations[currentSession]; // Update duration based on current session
   
    timer = duration;
}

function startTimer() {
    audio.play();
    audio.pause();
    audio.currentTime = 0; // Reset audio to the beginning

    if (currentSession == 1) {
        const audio = $('audio')[0];
        audio.play(); // Play audio for short break
    }
    startTime = Date.now(); // Record the start time
    if (!isRunning) {
        isRunning = true;
        startTime = Date.now(); // Record the start time
        interval = setInterval(() => {
            console.log(`Current session: ${currentSession}`);
            let now = Date.now();
            let elapsedTime = Math.floor((now - startTime) / 1000); // Calculate elapsed time in seconds
            console.log(`Elapsed time: ${elapsedTime} seconds`);
            console.log(`duration: ${duration} seconds`);
            timer = duration - elapsedTime; // Decrease timer by elapsed time
            if (timer >= 0) {
                updateDisplay();
            } else {
                clearInterval(interval); // Clear the interval when timer reaches 0
                if (currentSession == 0) {
                    shortBreakCount++; // Increment short break count
                    if(shortBreakCount == 4){
                        currentSession = 2; // Switch to long break after 4 short breaks
                        shortBreakCount = 0; // Reset short break count
                    }
                    else {
                        currentSession = 1; // Switch to short break after work session
                        audio.play(); // Play audio for short break
                    }
                }
                else{
                    currentSession = 0; // Switch back to work session after break
                }
                

                updateTimmer(); // Update duration based on current session
                updateDisplay();
                updateMode(); // Change mode display

                isRunning = false; // Reset isRunning flag
                startTimer(); // Restart the timer for the next session                
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