// // File: /lib/notificationSound.ts

// /**
//  * Utility for playing notification sounds
//  */

// class NotificationSound {
//   private audioContext: AudioContext | null = null;
//   private isMuted = false;
  
//   // Initialize audio context on user interaction (browser requirement)
//   init() {
//     if (typeof window === 'undefined') return;
    
//     // Create audio context on first user interaction
//     const initOnInteraction = () => {
//       if (!this.audioContext) {
//         this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//       }
//       document.removeEventListener('click', initOnInteraction);
//       document.removeEventListener('keydown', initOnInteraction);
//     };
    
//     document.addEventListener('click', initOnInteraction);
//     document.addEventListener('keydown', initOnInteraction);
//   }
  
//   // Play a simple notification sound using Web Audio API
//   playNotificationSound() {
//     if (this.isMuted) return;
//     if (typeof window === 'undefined') return;
    
//     try {
//       // Create audio context if not exists
//       if (!this.audioContext) {
//         this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//       }
      
//       const oscillator = this.audioContext.createOscillator();
//       const gainNode = this.audioContext.createGain();
      
//       oscillator.connect(gainNode);
//       gainNode.connect(this.audioContext.destination);
      
//       oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
//       oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
      
//       gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
//       gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
      
//       oscillator.start(this.audioContext.currentTime);
//       oscillator.stop(this.audioContext.currentTime + 0.5);
      
//     } catch (error) {
//       console.error('Error playing notification sound:', error);
//       // Fallback to simple beep if Web Audio API fails
//       this.playFallbackSound();
//     }
//   }
  
//   // Fallback sound using HTML5 Audio
//   private playFallbackSound() {
//     if (this.isMuted) return;
//     if (typeof window === 'undefined') return;
    
//     try {
//       // Create a simple beep using AudioContext or fallback to basic beep
//       const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
//       const oscillator = audioContext.createOscillator();
//       const gainNode = audioContext.createGain();
      
//       oscillator.connect(gainNode);
//       gainNode.connect(audioContext.destination);
      
//       oscillator.frequency.value = 800;
//       gainNode.gain.value = 0.3;
      
//       oscillator.start();
//       setTimeout(() => oscillator.stop(), 100);
//     } catch (error) {
//       console.log('Notification sound played (fallback)');
//     }
//   }
  
//   // Mute/unmute sounds
//   mute() {
//     this.isMuted = true;
//   }
  
//   unmute() {
//     this.isMuted = false;
//   }
  
//   toggleMute() {
//     this.isMuted = !this.isMuted;
//     return this.isMuted;
//   }
  
//   isSoundMuted() {
//     return this.isMuted;
//   }
// }

// // Create a singleton instance
// const notificationSound = new NotificationSound();

// // Initialize on module load (but actual audio context starts on user interaction)
// if (typeof window !== 'undefined') {
//   notificationSound.init();
// }

// export default notificationSound;

// File: /lib/notificationSound.ts

/**
 * Utility for playing notification sounds with Web Audio API
 */

class NotificationSound {
  private audioContext: AudioContext | null = null;
  private isMuted = false;
  private lastPlayedTime = 0;
  private readonly MIN_TIME_BETWEEN_SOUNDS = 1000; // 1 second minimum between sounds
  
  constructor() {
    // Load mute preference from localStorage
    if (typeof window !== 'undefined') {
      const storedMute = localStorage.getItem('notificationSoundMuted');
      this.isMuted = storedMute === 'true';
    }
  }
  
  // Initialize audio context on user interaction (browser requirement)
  init() {
    if (typeof window === 'undefined') return;
    
    // Create audio context on first user interaction
    const initOnInteraction = () => {
      if (!this.audioContext) {
        try {
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        } catch (error) {
          console.error('Failed to create AudioContext:', error);
        }
      }
    };
    
    // Initialize on any user interaction
    document.addEventListener('click', initOnInteraction, { once: true });
    document.addEventListener('keydown', initOnInteraction, { once: true });
  }
  
  // Play a pleasant notification sound
  playNotificationSound() {
    // Don't play if muted or too soon after last sound
    if (this.isMuted) return;
    if (typeof window === 'undefined') return;
    
    const now = Date.now();
    if (now - this.lastPlayedTime < this.MIN_TIME_BETWEEN_SOUNDS) {
      return;
    }
    
    this.lastPlayedTime = now;
    
    try {
      // Try Web Audio API first (better sound quality)
      if (this.audioContext && this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }
      
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      // Create a pleasant notification sound
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Set frequency curve for pleasant "ding" sound
      oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(1000, this.audioContext.currentTime + 0.2);
      
      // Set volume envelope
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
      
    } catch (error) {
      console.error('Error playing Web Audio notification:', error);
      // Fallback to HTML5 audio
      this.playFallbackSound();
    }
  }
  
  // Fallback using HTML5 Audio element
  private playFallbackSound() {
    try {
      // Create a simple beep
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.3;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log('Using silent notification mode');
    }
  }
  
  // Mute/unmute methods with localStorage persistence
  mute() {
    this.isMuted = true;
    if (typeof window !== 'undefined') {
      localStorage.setItem('notificationSoundMuted', 'true');
    }
  }
  
  unmute() {
    this.isMuted = false;
    if (typeof window !== 'undefined') {
      localStorage.setItem('notificationSoundMuted', 'false');
    }
  }
  
  toggleMute() {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('notificationSoundMuted', this.isMuted.toString());
    }
    return this.isMuted;
  }
  
  isSoundMuted() {
    return this.isMuted;
  }
}

// Create a singleton instance
const notificationSound = new NotificationSound();

// Initialize on module load
if (typeof window !== 'undefined') {
  notificationSound.init();
}

export default notificationSound;