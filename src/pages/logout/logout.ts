import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform} from 'ionic-angular';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { AngularFireAuth } from 'angularfire2/auth';
import { Storage } from '@ionic/storage';
// paginas
import { TabsPage } from '../../pages/tabs/tabs';


@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private afAuth: AngularFireAuth,
    public alertCtrl: AlertController,
    private platform:Platform,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    this.menuCtrl.enable(true, 'login'); // mostramos menu para hacer login
    this.menuCtrl.enable(false, 'no-login');
    this.afAuth.auth.signOut();
    if (!this.platform.is("cordova")) {
      localStorage.removeItem("uid");
    }
    if (this.platform.is("cordova")) {
      // dispositivo
      this.storage.ready()
        .then(()=>{
          this.storage.clear();
        });
    } else {
      // escritorio
      localStorage.removeItem("uid");
    }
    this.showAlert("Hasta pronto!", "No dejes que pase un día sin acariciar un gatito ;)");
    this.navCtrl.setRoot(TabsPage);
  }

  showAlert(titulo, mensaje) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['Ok']
    });
    alert.present();
  }

}
