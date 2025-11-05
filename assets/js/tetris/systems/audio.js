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

  setMusicSpeed(speed) {
    if (this.currentMusic) {
      this.currentMusic.playbackRate = speed;
    }
    // Set playback rate for all tracks in the playlist
    this.musicPlaylist.forEach(music => {
      music.playbackRate = speed;
    });
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
audioSystem.loadSound('blockFix', '/assets/audio/sound-effect/block-fit.mp3');
audioSystem.loadSound('scored', '/assets/audio/sound-effect/scored.mp3');
audioSystem.loadSound('gameOver', '/assets/audio/sound-effect/its-over-pro-beta.mp3');

// Load background music playlist - using actual files from static directory
audioSystem.loadMusicPlaylist([
  '/assets/audio/playlist/1.mp3',
  '/assets/audio/playlist/2.mp3',
  '/assets/audio/playlist/3.mp3'
]);