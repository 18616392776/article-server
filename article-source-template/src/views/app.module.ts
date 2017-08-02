import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UiComponentsModule } from 'tanbo-ui';

import { AppComponent } from './app';


@NgModule({
    imports: [
        UiComponentsModule,
        BrowserAnimationsModule,
        BrowserModule,
    ],
    declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
