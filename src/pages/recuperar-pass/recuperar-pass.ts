import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AlertController, NavController } from 'ionic-angular';
// pages
import { TabsPage } from '../../pages/tabs/tabs';

@Component({
  selector: 'page-recuperar-pass',
  templateUrl: 'recuperar-pass.html',
})
export class RecuperarPassPage {
  email: string;
  constructor(private afAuth: AngularFireAuth, public alertCtrl: AlertController, public navCtrl: NavController,) {
  }

  async recuperarPass(email) {
    try {
      const errorResult = await this.afAuth.auth.sendPasswordResetEmail(email);
      if (!errorResult) {
        this.showAlert("Último paso!", "Revisa tu correo para cambiar la contraseña.");
        this.navCtrl.setRoot(TabsPage);     
      }
    } catch(error) {
      let message = this.translations(error.code);
      this.showAlert("Revisa los campos!", message);
    }
  }

  showAlert(titulo, mensaje) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['Ok']
    });
    alert.present();
  }

  translations(messageCode) {
    let returnMessage = "";
    switch(messageCode) {
      case 'auth/invalid-email':
        returnMessage = "El email es incorrecto.";
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        returnMessage = "Alguno de los datos no es correcto.";
        break;
      case 'auth/email-already-in-use':
        returnMessage = "Ese email ya está en uso.";
        break;
      case 'auth/weak-password':
        returnMessage = "El password debe tener 6 caracteres.";
        break;
      case 'auth/argument-error':
        returnMessage = "Debes introducir un email.";
        break;
    }
    return returnMessage;
  }
}
