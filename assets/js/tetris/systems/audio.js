class AudioSystem {
  constructor() {
    this.sounds = {};
    this.musicPlaylist = [];
    this.currentMusicIndex = 0;
    this.currentMusic = null;
    this.musicEnabled = true;
    this.soundEnabled = true;
  }

  loadSound(name, url) {
    const audio = new Audio(url);
    audio.preload = 'auto';
    this.sounds[name] = audio;
  }

  loadMusicPlaylist(urls) {
    this.musicPlaylist = urls.map(url => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audio.volume = 0.3;
      return audio;
    });
    
    if (this.musicPlaylist.length > 0) {
      // Start with a random track
      this.currentMusicIndex = Math.floor(Math.random() * this.musicPlaylist.length);
      this.currentMusic = this.musicPlaylist[this.currentMusicIndex];
      this.setupMusicEvents();
    }
  }

  setupMusicEvents() {
    if (this.currentMusic) {
      this.currentMusic.addEventListener('ended', () => {
        this.playNextTrack();
      });
    }
  }

  playNextTrack() {
    if (this.musicPlaylist.length === 0) return;
    
    // Choose next track randomly
    this.currentMusicIndex = Math.floor(Math.random() * this.musicPlaylist.length);
    this.currentMusic = this.musicPlaylist[this.currentMusicIndex];
    this.setupMusicEvents();
    
    if (this.musicEnabled) {
      this.playMusic();
    }
  }

  playSound(name) {
    if (!this.soundEnabled || !this.sounds[name]) return;
    
    const sound = this.sounds[name];
    sound.currentTime = 0;
    sound.play().catch(e => console.log('Audio play failed:', e));
  }

  playMusic() {
    if (!this.musicEnabled || !this.currentMusic) return;
    
    this.currentMusic.play().catch(e => console.log('Music play failed:', e));
  }

  pauseMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
    }
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
    }
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    if (this.musicEnabled) {
      this.playMusic();
    } else {
      this.pauseMusic();
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
  }
}

export const audioSystem = new AudioSystem();

// Load sound effects - using actual files from static directory
audioSystem.loadSound('blockFix', '/assets/js/tetris/sound-effect/block-fit.mp3');
audioSystem.loadSound('scored', '/assets/js/tetris/sound-effect/scored.mp3');
audioSystem.loadSound('gameOver', '/assets/js/tetris/sound-effect/its-over-pro-beta.mp3');

// Load background music playlist - using actual files from static directory
audioSystem.loadMusicPlaylist([
  '/assets/js/tetris/playlist/1.mp3',
  '/assets/js/tetris/playlist/2.mp3',
  '/assets/js/tetris/playlist/3.mp3'
]);