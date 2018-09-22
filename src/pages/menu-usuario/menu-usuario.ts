import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { EditarGatoPage } from '../../pages/editar-gato/editar-gato';
import { SubirImagenPage } from '../subir-imagen/subir-imagen';
import { LoginPage } from '../../pages/login/login';
// providers
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { MostrarGatoProvider } from '../../providers/mostrar-gato/mostrar-gato';


@IonicPage()
@Component({
  selector: 'page-menu-usuario',
  templateUrl: 'menu-usuario.html',
})
export class MenuUsuarioPage {

  gatos: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _up: UsuarioProvider,
    public _mgp: MostrarGatoProvider,
    public alertCtrl: AlertController) {
  }

  // cada vez que entramos se refrescan los gatos. Así al volver de editar con el pop, vemos los cambios
  ionViewWillEnter() {
    this._up.getGatos().then((gatos) => {
      this.gatos = gatos;
    });
  }

  modalEditarGato(gatoKey) {
    let argumentos = {'keyGato': gatoKey}
    this.navCtrl.push(EditarGatoPage, argumentos);
  }

  modalBorrarGato(gatoKey, gatoNombre) {
    let indiceArrayGato;
    // obenemos el indice para luego borrarlo en el array
    this.gatos.forEach(function(element,indice) {
      if (element.key == gatoKey) indiceArrayGato = indice;
    });
    this.showAlert("Aviso", "¿Seguro que quieres borrar toda la información de tu gato y sus estrellas?", gatoKey, gatoNombre, indiceArrayGato);
  }

  showAlert(titulo, mensaje, gatoKey, gatoNombre, indice) {
    let alert = this.alertCtrl.create({
      title: titulo,
      message: mensaje,
      inputs: [
        {
          name: gatoNombre,
          type: 'radio',
          label: gatoNombre,
          value: gatoKey,
          checked: true
        },
      ],
      buttons: [
        {
          text: 'No',
        },
        {
          text: 'Sí',
          handler: data => {
            this._mgp.borrarGato(data).then(() => {
              // recargamos los gatos
              this.gatos.splice(indice, 1);
            });
          }
        }
      ]
    });
    alert.present();
  }

  // mostramos un modal para que el usuario suba la imagen y la info del gato
  subirImagen() {
    this._up.getUid().then( uid => {
      if (uid) {
        this.navCtrl.push(SubirImagenPage);
      } else {
        this.showAlertImagen("Aviso!", "Tienes que entrar o registrate para subir una foto de tu gatito.");        
      }
    })        
    .catch( error=>{
      console.log("ERROR en home cogiendo uid: " + JSON.stringify( error ));
    });
  }

  showAlertImagen(titulo, mensaje) {
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

}
