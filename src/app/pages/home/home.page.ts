import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  videoPauseTimes = ['0', '1', '2'];
  safeUrl: any = null;
  videoArray = new Array(15);
  preloadVideoIndex = -1;

  sequence = 0;
  sceneIsActive = false;
  progress = 0;

  menu = false;
  @ViewChild('video', { static: false }) video: ElementRef;
  @ViewChild('gesture', { static: false }) gesture: ElementRef;

  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight', UP: 'swipeup' };

  constructor(private dataService: DataService) {}

  changeLanguage(lang: string) {
    this.dataService.language = lang;

    // Local Video Approach
    this.sequence = 1;
    this.playVideo();
    this.menu = false;

    setTimeout(() => {
      this.video.nativeElement.addEventListener('ended', () => {
        this.backToMenu();
      });

      this.video.nativeElement.addEventListener('timeupdate', () => {
        if (
          this.video.nativeElement.currentTime >=
          this.videoPauseTimes[this.sequence]
        ) {
          this.pauseVideo();
        }
      });
    }, 1000);
  }

  ionViewDidEnter() {
    this.menu = true;
  }

  pauseVideo() {
    this.video.nativeElement.pause();
    this.sceneIsActive = true;
  }

  next() {
    console.log('Next', this.sequence);
    if (this.sceneIsActive) {
      this.video.nativeElement.play();
      this.sequence++;
    }
  }

  previous() {
    console.log('Previous', this.sequence);
    if (this.sceneIsActive) {
      if (this.video.nativeElement.currentTime > 0) {
        this.backToMenu();
        return;
      } else {
        this.sequence--;
        this.playVideo();
      }
    }
  }

  playVideo() {
    console.log('Play');
    this.sceneIsActive = false;
    this.safeUrl = `../assets/videos/${this.dataService.language}.mp4`;
    if (this.video) {
      this.video.nativeElement.load();
      this.video.nativeElement.play();
    }
  }

  backToMenu() {
    this.menu = true;
    this.safeUrl = null;
  }

  swipe(action = this.SWIPE_ACTION.RIGHT) {
    console.log(action);
    // swipe left, next video
    if (action === this.SWIPE_ACTION.LEFT) {
      this.next();
    }

    // swipe right, previous video
    if (action === this.SWIPE_ACTION.RIGHT) {
      this.previous();
    }

    // swipte up, back to menu
    if (action === this.SWIPE_ACTION.UP) {
      this.backToMenu();
    }
  }
}
