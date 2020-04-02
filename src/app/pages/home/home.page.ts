import { Component, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Video } from 'src/app/interfaces/videos';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  safeUrl: any = null;
  videos: Video[] = [];
  videoArray = new Array(15);
  preloadVideoIndex: number = -1;

  activeVideo: number;
  sceneIsActive: boolean = false;
  progress: number = 0;

  menu: boolean = false;
  menuVideo: any;
  @ViewChild('video', { static: false }) video: ElementRef;

  SWIPE_ACTION = { LEFT: 'swipeleft', RIGHT: 'swiperight' };

  constructor(
    private dataService: DataService,
    private sanitizer: DomSanitizer
  ) {}

  changeLanguage(lang: string) {
    console.log(lang);
    this.dataService.language = lang;

    // Local Video Approach
    this.activeVideo = 1;
    this.playVideo();
    this.menu = false;

    setTimeout(() => {
      this.video.nativeElement.addEventListener(
        'ended',
        () => {
          this.sceneIsActive = true;
        },
        false
      );
    }, 1000);

    // Videos on Server Approach
    // this.dataService.getScenes().toPromise()
    //   .then((data: Video[]) => {

    //     console.log(data);
    //     data.sort((a:Video,b:Video) => {
    //       if ( a.order < b.order ){
    //         return -1;
    //       }
    //       if ( a.order > b.order ){
    //         return 1;
    //       }
    //       return 0
    //     });
    //     this.menu = false;
    //     this.videos = data;
    //     this.videos.map((video: Video, index) => {
    //       this.videos[index].safe_url = this.sanitizer.bypassSecurityTrustResourceUrl(video.url);
    //     })
    //     this.activeVideo = 0;
    //     this.playVideo();

    //     this.preloadVideoIndex = 0;

    //     setTimeout(() => {
    //       this.video.nativeElement.addEventListener('ended',() => {
    //         this.sceneIsActive = true
    //       },false);
    //     },1000)
    //   })
    //   .catch(error => {
    //     console.log(error);

    //   });
  }

  ionViewDidEnter() {
    this.menu = true;
  }

  next() {
    console.log('Next', this.activeVideo, this.videos[this.activeVideo]);
    if (this.sceneIsActive) {
      this.activeVideo++;
      if (this.activeVideo == this.videoArray.length) {
        this.menu = true;
        this.safeUrl = null;
      }
      this.playVideo();
    }
  }

  previous() {
    console.log('Previous', this.activeVideo, this.videos[this.activeVideo]);
    if (this.sceneIsActive) {
      if (this.activeVideo == 1) {
        this.menu = true;
        this.safeUrl = null;
        return;
      } else {
        this.activeVideo--;
        this.playVideo();
      }
    }
  }

  playVideo() {
    console.log('Play');
    this.sceneIsActive = false;
    this.safeUrl = `../assets/videos/${this.dataService.language}/${this.activeVideo}.mp4`;
    if (this.video) {
      this.video.nativeElement.load();
      this.video.nativeElement.play();
    }
  }

  loadedVideo() {
    let percent = null;
    let elem: any = document.getElementById('preoload');
    // FF4+, Chrome
    if (
      elem &&
      elem.buffered &&
      elem.buffered.length > 0 &&
      elem.buffered.end &&
      elem.duration
    ) {
      percent = elem.buffered.end(0) / elem.duration;
    }
    // Some browsers (e.g., FF3.6 and Safari 5) cannot calculate target.bufferered.end()
    // to be anything other than 0. If the byte count is available we use this instead.
    // Browsers that support the else if do not seem to have the bufferedBytes value and
    // should skip to there. Tested in Safari 5, Webkit head, FF3.6, Chrome 6, IE 7/8.
    else if (
      elem &&
      elem.bytesTotal != undefined &&
      elem.bytesTotal > 0 &&
      elem.bufferedBytes != undefined
    ) {
      percent = elem.bufferedBytes / elem.bytesTotal;
    }

    if (percent !== null) {
      percent = 100 * Math.min(1, Math.max(0, percent));

      console.log(percent);
      // ... do something with var percent here (e.g. update the progress bar)

      if (percent == 100) {
        this.preloadVideoIndex++;
        elem.load();
        this.progress = this.preloadVideoIndex / this.videoArray.length;
        this.progress = Number(this.progress.toFixed(2));
        console.log(
          'Video loaded' + this.preloadVideoIndex,
          'Loading process: ' + this.progress
        );
      }
    }

    if (this.preloadVideoIndex == this.videoArray.length) {
      console.log('All videos loaded');
      this.activeVideo = 0;
      this.playVideo();
    }
  }

  checkBufferedVideos() {
    /* setInterval(() => {
      this.loadedVideo()
    }, 1000);*/
  }

  swipe(action = this.SWIPE_ACTION.RIGHT) {
    console.log('what?');
    // swipe left, next video
    if (action === this.SWIPE_ACTION.LEFT) {
      this.next();
    }

    // swipe right, previous video
    if (action === this.SWIPE_ACTION.RIGHT) {
      this.previous();
    }
  }
}
