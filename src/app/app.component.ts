import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Storage } from '@ionic/storage';

import { SlidesPage } from '../pages/slides/slides';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { MenuUsuarioPage } from '../pages/menu-usuario/menu-usuario';

import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { RecuperarPassPage } from '../pages/recuperar-pass/recuperar-pass';
import { BorrarCuentaPage } from '../pages/borrar-cuenta/borrar-cuenta';
import { PoliticaPage } from '../pages/politica/politica';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  //rootPage: any = TabsPage;
  //rootPage: any = SlidesPage;

  pages: Array<{title: string, component: any}>;
  pagesNoLogin: Array<{title: string, component: any}>;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public menuCtrl: MenuController,
    private storage: Storage,
  ) {
    if (this.platform.is("cordova")) {
      // dispositivo
      this.storage.ready()
        .then(()=>{
          this.storage.get('slides').then((val) => {
            if (val == "true") {
              this.rootPage = TabsPage;
            } else {
              this.rootPage = SlidesPage;
            }
          });
        }).catch(()=>{
          console.log('Fallo storege slides');           
        });
    } else {
      // escritorio
      if (localStorage.getItem("slides") == "true") {
        this.rootPage = TabsPage;
      } else {
        this.rootPage = SlidesPage;
      }
    }

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Entra o Registrate', component: LoginPage },
      { title: 'Recuperar contraseña', component: RecuperarPassPage },
      { title: 'Política de privacidad', component: PoliticaPage }
    ];
    this.pagesNoLogin = [
      { title: 'Mis gatos', component: MenuUsuarioPage },
      { title: 'Política de privacidad', component: PoliticaPage },
      { title: 'Borrar mi cuenta', component: BorrarCuentaPage },
      { title: 'Salir', component: LogoutPage },
    ];
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.platform.ready().then(() => {
        this.splashScreen.hide();
      });
    });
  }

  openPage(page) {
    // determinadas págigas hacemos push y en otras las cargamos
    if (page.title == "Entra o Registrate" || page.title == "Mis gatos" || page.title == "Recuperar contraseña" || 
      page.title == "Política de privacidad" || page.title == "Borrar mi cuenta") {
      this.nav.push(page.component);
    } else {
      this.nav.setRoot(page.component);
    }
    
  }
}
