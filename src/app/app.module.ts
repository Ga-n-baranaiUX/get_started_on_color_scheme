import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ColorDescriptionsComponent } from './components/color-descriptions/color-descriptions';
import { ColorPalleteComponent } from './components/color-pallete/color-pallete';
import { ColorWheelComponent } from './components/color-wheel/color-wheel';
import { ControllerComponent } from './components/controller/controller';
import { TonesComponent } from './components/tones/tones';
import { ContentColorComponent } from './components/voice-meets/content-color';
import { VoiceMeetsComponent } from './components/voice-meets/voice-meets';
import { ColorService } from './services/color.service';
import { HomeViewComponent } from './views/home-view';

@NgModule({
  declarations: [
    AppComponent,
    HomeViewComponent,
    ColorWheelComponent,
    ColorPalleteComponent,
    ControllerComponent,
    TonesComponent,
    VoiceMeetsComponent,
    ContentColorComponent,
    ColorDescriptionsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [
    ColorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
