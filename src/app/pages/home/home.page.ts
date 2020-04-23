import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  // videoPauseTimes = [
  //   0,
  //   8,
  //   18,
  //   38,
  //   64,
  //   90,
  //   109,
  //   134,
  //   145,
  //   174,
  //   194,
  //   214,
  //   232,
  //   268,
  //   318,
  //   362,
  // ];
  videoPauseTimes = [
    0,
    7.8,
    17.8,
    37.8,
    63.8,
    89.7,
    108.8,
    133.8,
    144.7,
    173.6,
    193.6,
    213.6,
    231.6,
    271.6,
    321.6,
    // 361.6,
  ];
  ofset = 0;
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
          this.videoPauseTimes[this.sequence] + this.ofset
        ) {
          console.log(
            this.video.nativeElement.currentTime,
            this.videoPauseTimes[this.sequence],
            this.sequence
          );
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
      this.sceneIsActive = false;
      this.sequence++;
    }
  }

  previous() {
    console.log('Previous', this.sequence);
    if (this.sceneIsActive) {
      if (this.video.nativeElement.currentTime < this.videoPauseTimes[1]) {
        this.backToMenu();
        return;
      } else {
        this.video.nativeElement.currentTime = this.videoPauseTimes[
          this.sequence - 1
        ];
        this.video.nativeElement.play();
        this.sceneIsActive = false;
      }
    }
  }

  playVideo() {
    console.log('Play');
    this.sceneIsActive = false;
    this.safeUrl = `../assets/videos/${this.dataService.language}.mp4`;
    if (this.video) {
      this.video.nativeElement.load();
      // this.video.nativeElement.playbackRate = 2;
      // this.video.nativeElement.currentTime = this.videoPauseTimes[
      //   this.sequence
      // ];
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
    // if (action === this.SWIPE_ACTION.RIGHT) {
    //   this.previous();
    // }

    // swipte up, back to menu
    if (action === this.SWIPE_ACTION.UP) {
      this.backToMenu();
    }
  }
}
