class PomodoroTimer {
    constructor() {
        this.timeLeft = 25 * 60; // 25 minutes in seconds
        this.isRunning = false;
        this.currentMode = 'work';
        this.pomodorosCompleted = 0;
        this.interval = null;
        this.workSessions = 0;

        this.init();
    }

    init() {
        this.updateDisplay();
        this.bindEvents();
    }

    bindEvents() {
        document.getElementById('start').addEventListener('click', () => this.start());
        document.getElementById('pause').addEventListener('click', () => this.pause());
        document.getElementById('reset').addEventListener('click', () => this.reset());
        document.getElementById('work').addEventListener('click', () => this.setMode('work'));
        document.getElementById('short-break').addEventListener('click', () => this.setMode('short-break'));
        document.getElementById('long-break').addEventListener('click', () => this.setMode('long-break'));
        document.getElementById('one-min').addEventListener('click', () => this.setCustomTimer(1));
        document.getElementById('three-min').addEventListener('click', () => this.setCustomTimer(3));
        document.getElementById('five-min').addEventListener('click', () => this.setCustomTimer(5));
    }

    setCustomTimer(minutes) {
        this.pause();
        this.currentMode = `custom-${minutes}`;
        this.timeLeft = minutes * 60;
        this.updateModeButtons();
        this.updateDisplay();
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.interval = setInterval(() => this.tick(), 1000);
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.interval);
    }

    reset() {
        this.pause();
        this.setMode(this.currentMode);
    }

    setMode(mode) {
        this.pause();
        this.currentMode = mode;
        this.updateModeButtons();

        switch (mode) {
            case 'work':
                this.timeLeft = 25 * 60;
                break;
            case 'short-break':
                this.timeLeft = 5 * 60;
                break;
            case 'long-break':
                this.timeLeft = 15 * 60;
                break;
        }

        this.updateDisplay();
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.completeSession();
        }
    }

    completeSession() {
        this.pause();
        this.playNotification();

        if (this.currentMode === 'work') {
            this.workSessions++;
            this.pomodorosCompleted++;
            document.getElementById('pomodoros').textContent = this.pomodorosCompleted;

            if (this.workSessions % 4 === 0) {
                this.setMode('long-break');
            } else {
                this.setMode('short-break');
            }
        } else {
            this.setMode('work');
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        document.getElementById('time').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    updateModeButtons() {
        document.querySelectorAll('.modes button').forEach(btn => btn.classList.remove('active'));
        if (['work', 'short-break', 'long-break'].includes(this.currentMode)) {
            document.getElementById(this.currentMode).classList.add('active');
        } else if (this.currentMode.startsWith('custom-')) {
            const min = this.currentMode.split('-')[1];
            if (min === '1') document.getElementById('one-min').classList.add('active');
            if (min === '3') document.getElementById('three-min').classList.add('active');
            if (min === '5') document.getElementById('five-min').classList.add('active');
        }
    }

    playNotification() {
        // Simple beep using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});
