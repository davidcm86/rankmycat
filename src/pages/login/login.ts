import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController, Platform } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../../pages/tabs/tabs';
import { PoliticaPage } from '../../pages/politica/politica';
import { SubirImagenPage } from '../subir-imagen/subir-imagen';
import { Storage } from '@ionic/storage';
// providers
import { UsuarioProvider } from '../../providers/usuario/usuario';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  pages: Array<{title: string, component: any}>;
  uid: string = null;
  paises: any;
  entrar: any = 0;
  registrarme: any = 0;
  politica: any;

  constructor(
    private afAuth: AngularFireAuth,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    private storage: Storage,
    private platform:Platform,
    private _user: UsuarioProvider) {
      this._user.getPaises().then((paises)=>{
        this.paises = paises;
      });
  }

  loginFacebook() {
      /*return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => {
          this.showAlert("Bienvenido!", "Disfruta de todos nuestros gatitos y no olvides subir a los tuyos para que todos sepan lo guapos que son!");
          this.uid = this.afAuth.auth.currentUser.uid;
          this.setUid(this.uid);
          this.navCtrl.setRoot(TabsPage);
        }).catch(error => {
          let message = this.translations(error.code);
          if (message.length > 0) {
            this.showAlert("Mensaje!", message);
          }
        });*/
        /*if (this.platform.is('cordova')) {
          return this.fb.login(['email', 'public_profile']).then(res => {
            const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
            return firebase.auth().signInWithCredential(facebookCredential);
          })
        } else {
          return this.afAuth.auth
            .signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then(res => {
              this.showAlert("Bienvenido!", "Disfruta de todos nuestros gatitos y no olvides subir a los tuyos para que todos sepan lo guapos que son!");
              this.uid = this.afAuth.auth.currentUser.uid;
              this._user.saveDatosUsuario(this.uid, res.additionalUserInfo.profile.email, res.additionalUserInfo.profile.locale);
              this.setUid(this.uid);
              this.navCtrl.setRoot(TabsPage);
            }).catch(error => {
              let message = this.translations(error.code);
              if (message.length > 0) {
                this.showAlert("Mensaje!", message);
              }
            });
       }*/
    
  }
  
  async login(user: User) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      if (result) {
        this.showAlert("Bienvenido!", "Disfruta de todos nuestros gatitos y no olvides subir a los tuyos para que todos sepan lo guapos que son!");
        this.uid = this.afAuth.auth.currentUser.uid;
        this.setUid(this.uid);
        this.navCtrl.setRoot(TabsPage);
      }  
    }
    catch (error) {
      let message = this.translations(error.code);
      this.showAlert("Revisa los campos!", message);
    }
  }
 
  register(user: User) {
    if (user.email != undefined && user.password != undefined && user.pais != undefined && user.politica != undefined) {
      let longitudCadena = user.pais;
      if (longitudCadena.length > 3) {
        user.pais = user.pais.split("-");
      }
      let nombrePais = user.pais[0];
      let idPais = user.pais[1];
      let titulo = "Aviso!";
      let mensaje = "¿Seguro que quieres hacer el registro con estos datos?";
      this.showAlertCheck(titulo, mensaje, user.email, user.password, idPais, nombrePais);
    } else {
      this.showAlert("Revisa los campos!", 'Debes introducir un email, password, país y aceptar la política de privacidad.');
    }
  }

  setUid(uid) {
    if (this.platform.is("cordova")) {
      // dispositivo
      this.storage.ready()
        .then( ()=>{
          this.storage.set('uid', uid);
        }).catch(()=>{
          console.log('fallo cordova');
        });
    } else {
      // escritorio
      if (uid) {
        localStorage.setItem('uid', uid);
      } else {
        localStorage.removeItem('uid');
      }
    }
  }

  politicaPrivacidad() {
    this.navCtrl.push(PoliticaPage);
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
        returnMessage = "Debes introducir un email y password.";
        break;
      case 'auth/account-exists-with-different-credential':
        returnMessage = "Ya tienes el registro normal hecho. No puedes hacer el registro con Facebook.";
        break;
    }
    return returnMessage;
  }

  showAlert(titulo, mensaje) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: ['Ok']
    });
    alert.present();
  }

  showAlertCheck(titulo, mensaje, user, pass, paisId, paisNombre) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      inputs: [
        {
          name: user,
          type: 'checkbox',
          label: 'Email: ' + user,
          value: user,
          checked: true,
          disabled: true
        },
        {
          name: pass,
          type: 'checkbox',
          label: 'Password: ' + pass,
          value: pass,
          checked: true,
          disabled: true
        },
        {
          name: paisNombre,
          type: 'checkbox',
          label: 'País: ' + paisNombre,
          value: paisId,
          checked: true,
          disabled: true
        },
      ],
      buttons: [
        {
          text: 'No',
          handler: data => {
          }
        },
        {
          text: 'Sí',
          handler: (data) => {
            this.continuarLogin(data);
          }
        }
      ]
    });
    alert.present();
  }

  async continuarLogin(data) {
    let email = data[0];
    let password = data[1];
    let pais = data[2];
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (result) {
        this.uid = this.afAuth.auth.currentUser.uid;
        this.setUid(this.uid);
        // guardar en usuariosGatos el dato pais del usuario 
        this._user.saveDatosUsuario(this.uid, email, pais);
        this.navCtrl.setRoot(TabsPage);
        this.showAlert("Enhorabuena!", "El Registro se ha realizado correctamente. Ya puedes subir la foto de tu gatito!");
      }
    } catch (error) {
      console.log(error.code);
      let message = this.translations(error.code);
      this.showAlert("Revisa los campos!", message);
    }
  }

  subirImagen() {
    let modal = this.modalCtrl.create(SubirImagenPage);
    modal.present();
  }

  irHome() {
    this.navCtrl.setRoot(TabsPage);
  }

  // mostrar y ocultar capas. << Seguro que hay una manera mejor de hacerlo :( >>
  verEntrar(valor) {
    if (valor == 0) {
      this.entrar = 1;
      this.registrarme = 0;
    } else {
      this.entrar = 0;
    }
  }

  verRegistrarme(valor) {
    if (valor == 0) {
      this.registrarme = 1;
      this.entrar = 0;
    } else {
      this.registrarme = 0;
    }
  }
}

interface User {
  email: string;
  password: string;
  pais: any;
  politica: any;
}