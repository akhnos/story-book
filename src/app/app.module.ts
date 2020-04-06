import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import {
  BrowserModule,
  HammerGestureConfig,
  HAMMER_GESTURE_CONFIG
} from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { NavigationBar } from '@ionic-native/navigation-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePage } from './pages/home/home.page';
import { TokenInterceptor } from './services/token.interceptor';

declare var Hammer;

export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    swipe: { direction: Hammer.DIRECTION_ALL }
  };
}

@NgModule({
  declarations: [AppComponent, HomePage],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    StatusBar,
    SplashScreen,
    NavigationBar,
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
