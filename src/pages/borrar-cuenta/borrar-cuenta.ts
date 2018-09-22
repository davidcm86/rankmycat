import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// providers
import { MostrarGatoProvider } from '../../providers/mostrar-gato/mostrar-gato';
// pages
import { TabsPage } from '../../pages/tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-borrar-cuenta',
  templateUrl: 'borrar-cuenta.html',
})
export class BorrarCuentaPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public _mgp: MostrarGatoProvider,
    private platform: Platform,
    private storage: Storage) {
  }

  borrarCuenta() {
    this.showAlert("Aviso!", "¿Estas completamente segur@?");
  }

  showAlert(titulo, mensaje) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'No',
        },
        {
          text: 'Sí',
          handler: data => {
            this._mgp.borrarUsuario().then((result) => {
              // mandar al root
              if (result == "true") {
                // borrar uid storage
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
                this.navCtrl.setRoot(TabsPage);
                this.showAlertNormal("Aviso!", "Cuenta borrada correctamente.");
              } else {
                this.showAlertNormal("Aviso!", "Estas a un solo paso. Sal de la APP y vuelve a entrar para verificar que realmente eres tú y vuelve a borrar tu cuenta.");
              }
            });
          }
        }
      ]
    });
    alert.present();
  }

  showAlertNormal(titulo, mensaje) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      buttons: [
        {
          text: 'OK',
        },
      ]
    });
    alert.present();
  }

}
