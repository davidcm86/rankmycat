import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';
import { SubirImagenPage } from '../subir-imagen/subir-imagen';
import { LoginPage } from '../../pages/login/login';
import { MenuUsuarioPage } from '../../pages/menu-usuario/menu-usuario';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
// providers
import { MostrarGatoProvider } from '../../providers/mostrar-gato/mostrar-gato';
import { VotacionesGatoProvider } from '../../providers/votaciones-gato/votaciones-gato';
import { UsuarioProvider } from '../../providers/usuario/usuario';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rate: any;
  media: any;
  raza: any;
  estrellaTexto: string;
  mensaje: string;
  gato: any = {};
  lastRate: number;
  lastKeyGato: number;
  lastMediaVotosGato: number;
  lastTotalVotosGato: number;
  contMediaVotos: number;
  totalVotacionesSinLogin: number = 0;
  userId: any;
  email: any;
  constructor(
    public navCtrl: NavController,
    private _user: UsuarioProvider,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public _mgp: MostrarGatoProvider,
    public _vgp: VotacionesGatoProvider) {
      this.siguienteGato(null, true);
  }

  siguienteGato($event, cogerLastRate) {
    if ($event) {
      this.rate = $event;
      // aqui mismo puedo recibir los datos del gato nuevo y mandarlo a la vista
      this.estrellaTexto = "estrellas";
      if (this.rate == 1) this.estrellaTexto = "estrella";
      this.mensaje = "Su puntuación ha sido de " + this.rate + " " + this.estrellaTexto;
      
      this._mgp.getGato(this.lastKeyGato).then(gatoRecuperado=>{
        if (gatoRecuperado) {
          this.mostrarToast(this.mensaje, 3000);
          this._vgp.votarGato(this.lastKeyGato, this.rate, this.lastTotalVotosGato, this.lastMediaVotosGato, this.contMediaVotos);
          this.gato = gatoRecuperado;
          this.gato.iconoSexo = 'female';
          if (this.gato.sexo == 'masculino') {
            this.gato.iconoSexo = 'male';
          }
          this.gato.raza = this.traducirSlugRazaGato(this.gato.raza);
          this.rate = this.gato.mediaVotos;
          this.media = this.gato.mediaVotos;
          /*existe el problema de al mostrar un gato rate 3 y el siguiente 3 tb, no funciona el módulo, 
           por lo que tengo que setear disinto rate, para ello el sumo un 0.1*/
          if (this.media == this.lastRate) this.media = this.media + 0.1;
          this.lastRate = this.media;
          this.lastKeyGato = this.gato.key;
          this.lastMediaVotosGato = this.gato.mediaVotos;
          this.lastTotalVotosGato = this.gato.votos;
          this.contMediaVotos = this.gato.contMediaVotos;
          this.mensajeRegistro();
       } else {
        this.siguienteGato(null, false);
       }
      });
    } else {
      // acabamos de abrir la aplicacion y vamos a mostrar el primer gato
      this._mgp.getGato(this.lastKeyGato).then(gatoRecuperado=>{
        if (gatoRecuperado) {
          if (this.lastRate) {
            if (!cogerLastRate) this.lastRate = this.rate; // si no encuentra gato, igualamos el rate al lastRate
            this._vgp.votarGato(this.lastKeyGato, this.lastRate, this.lastTotalVotosGato, this.lastMediaVotosGato, this.contMediaVotos);
            this.estrellaTexto = "estrellas";
            if (this.lastRate == 1) this.estrellaTexto = "estrella";
            this.mensaje = "Su puntuación ha sido de " + this.lastRate + " " + this.estrellaTexto;
            this.mostrarToast(this.mensaje, 3000);
          }
          this.gato = gatoRecuperado;
          this.gato.iconoSexo = 'female';
          if (this.gato.sexo == 'masculino') {
            this.gato.iconoSexo = 'male';
          }
          this.gato.raza = this.traducirSlugRazaGato(this.gato.raza);
          this.media = this.gato.mediaVotos;
          if (this.media == this.lastRate) this.media = this.media + 0.1;
          this.lastRate = this.media;
          this.lastKeyGato = this.gato.key;
          this.lastMediaVotosGato = this.gato.mediaVotos;
          this.lastTotalVotosGato = this.gato.votos;
          this.contMediaVotos = this.gato.contMediaVotos;
          this.mensajeRegistro();
        } else {
          this.siguienteGato(null, false);
        }
      });
    }
  }

  mensajeRegistro() {
    // si no tiene login, mostramos un aviso cada vez que venga a home para que se registre o entre
    this._user.getUid().then((returnUserId) => {
      if (returnUserId == undefined) {
        if (this.totalVotacionesSinLogin == 4) {
          let mensaje = "Puedes seguir votando gatitos sin registro, pero para un mejor ";
          mensaje += " servicio y para poder subir tu gatito. ¡Regístrate o entra!";
          this.showAlert("¡¡¡ MIAU !!!", mensaje);
        }
        this.totalVotacionesSinLogin++;
      } else {
        this.userId = returnUserId;
      }
    });
  }

  mostrarToast(mensaje, duracion) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  // mostramos un modal para que el usuario suba la imagen y la info del gato
  subirImagen() {
    this._user.getUid().then( uid => {
      if (uid) {
        this.navCtrl.push(SubirImagenPage);
      } else {
        this.showAlert("Aviso!", "Tienes que entrar o registrate para subir una foto de tu gatito.");        
      }
    })        
    .catch( error=>{
      console.log("ERROR en home cogiendo uid: " + JSON.stringify( error ));
    });
  }

  showAlert(titulo, mensaje) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: mensaje,
      buttons: [
        {
          text: 'Entrar/Registrarme',
          handler: () => {
            this.navCtrl.push(LoginPage);
          }
        },
        {
          text: 'Ok',
        }
      ]
    });
    alert.present();
  }

  irLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  irMenuUsuarioPage() {
    this.navCtrl.push(MenuUsuarioPage);
  }

  traducirSlugRazaGato(slugRaza) {
    let texto;
    switch(slugRaza) {
      case 'gato-comun':
        texto = 'Gato Común';
        break;
      case 'ragdoll':
        texto = 'Ragdoll';
        break;
      case 'maine-coon':
        texto = 'Maine coon';
        break;
      case 'bosque-noruego':
        texto = 'Bosque noruego';
        break;
      case 'bombay':
        texto = 'Bombay';
        break;
      case 'angora-turco':
        texto = 'Angora turco';
        break;
      case 'sphynx':
        texto = 'Sphynx';
        break;
      case 'bengala':
        texto = 'Bengala';
        break;
      case 'persa':
        texto = 'Persa';
        break;
      case 'siames':
        texto = 'Siames';
        break;
      case 'british-shorthair':
        texto = 'British shorthair';
        break;
      case 'otro-gato-pelo-corto':
        texto = 'Otro gato pelo corto';
        break;
      case 'otro-gato-pelo-largo':
        texto = 'Otro gato pelo largo';
        break;
      case 'otro-gato-exotico':
        texto = 'Otro gato exótico';
        break;
    }
    return texto;
  }

}
