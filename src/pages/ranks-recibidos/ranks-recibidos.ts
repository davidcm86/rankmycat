import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { MenuUsuarioPage } from '../../pages/menu-usuario/menu-usuario';

// poviders
import { VotacionesGatoProvider } from '../../providers/votaciones-gato/votaciones-gato';
import { UsuarioProvider } from '../../providers/usuario/usuario';
import { MostrarGatoProvider } from '../../providers/mostrar-gato/mostrar-gato';

// bbdd
import * as firebase from 'firebase';
import 'firebase/firestore';
import { Observable } from 'rxjs/Observable';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';


@Component({
  selector: 'page-ranks-recibidos',
  templateUrl: 'ranks-recibidos.html',
})
export class RanksRecibidosPage {

  keyGato: any;
  gatos: any;
  gato: any = {};
  estrellaTexto: string;
  mensaje: string;
  tituloHayVotos: any;
  mensaheH1: string;
  userId: any;
  idGatos: any;
  public db: any;
  private itemDoc: AngularFirestoreDocument<any>;
  item: Observable<any>;

  constructor(
    private _vgp: VotacionesGatoProvider,
    private _user: UsuarioProvider,
    public navCtrl: NavController,
    public _mgp: MostrarGatoProvider,
    public toastCtrl: ToastController,
    public afDB: AngularFirestore,
  ) {
    const db = firebase.firestore();
    this._user.getUid().then( uid => {
      if (uid) {
        this.itemDoc = this.afDB.doc<any>(`votaciones/${uid}`);
        this.itemDoc.valueChanges().subscribe(data => {
          if (data != undefined && data.votosRecibidos != undefined) {
            var gatosRecuperados = [];
            this.idGatos = data.votosRecibidos;
            for (let idCat of data.votosRecibidos) {
              // si estoy observando con ossnapshot, luego no puedo bindear las variables de dentro la consulta a mi view
              // por ello utilizo AngularFirestore, que si me permite el bindeo
              db.collection("gatos").doc(`${idCat}`)
                .get()
                .then((querySnapshot) => {
                  if (querySnapshot.data() != undefined && querySnapshot.data().activo == 1) {
                    var gato = JSON.parse(JSON.stringify(querySnapshot.data()));
                    if (gato) {
                      gato['rate'] = gato['mediaVotos'];
                      gatosRecuperados.push(gato);
                    } else {
                      // si han borrado gato, mostraremos una sombra con su idGato para que lo puedan borrar
                      let gatoBorrado = {
                        key: idCat
                      };
                      gatosRecuperados.push(gatoBorrado);
                    }
                  } else {
                    let gatoBorrado = {
                      key: idCat
                    };
                    gatosRecuperados.push(gatoBorrado);
                  }
              })
            }
          }
          this.gatos = gatosRecuperados;
          this.mensaheH1 = "¡Devuelve las estrellas que estos gatitos te han dado con la puntuación que quieras!";
          if (this.idGatos != undefined && this.idGatos.length == 0) this.mensaheH1 = "¡De momento, no tienes estrellas que devolver a otros gatos!";
        });
        if (this.mensaheH1 == undefined ) this.mensaheH1 = "¡De momento, no tienes estrellas que devolver a otros gatos!";
        this.userId = uid;
      } else {
        this.mensaheH1 = "Registrate en la APP y sube tu gatito para que los demás puedan rankearle y así tu puedas devolver estrellas.";
      }
    }).catch( error=>{
      console.log("ERROR en votos recibidos mostrar gatos: " + JSON.stringify( error ));
    });
  }


  salvarPuntuacion($event, keyGato, index) { // $event = rate
    var rate: any;
    this.keyGato = keyGato;
    if ($event) {
      rate = $event;
    }
    this._mgp.getGatoFromKeyGato(keyGato).then(gatoRecuperado=>{
      if (gatoRecuperado) {
        this.gato = gatoRecuperado;
        if (!rate) rate = this.gato.mediaVotos;
      }
      this._vgp.votarGato(keyGato, rate, this.gato.votos, this.gato.mediaVotos, this.gato.contMediaVotos, 'votos');
      this.mensaheH1 = "¡Devuelve las estrellas que estos gatitos te han dado con la puntuación que quieras!";
      if (this.gatos.length == 0) {
        this.mensaheH1 = "¡De momento, no tienes estrellas que devolver a otros gatos!";
      }
      this.estrellaTexto = "estrellas";
      if (rate == 1) this.estrellaTexto = "estrella";
      this.mensaje = "Su puntuación ha sido de " + rate + " " + this.estrellaTexto;
      this.mostrarToast(this.mensaje, 3000);
    });
  }

  // borramos el gatoId de votaciones, es un gatoId que un usuario borró de su cuenta
  borrarVotacionGatoBorrado(keyGatoBorrado, index) {
    this._vgp.borrarGatoVotacion(keyGatoBorrado);
    // recogemos el index del array y eliminamos de la vista. Ya se elimino y voto de la bbdd.
    this.gatos.splice(index, 1); // ahora lo hacemos mediante valueChanged
    this.mensaheH1 = "¡Devuelve las estrellas que estos gatitos te han dado con la puntuación que quieras!";
    if (this.gatos.length == 0) {
      this.mensaheH1 = "¡De momento, no tienes estrellas que devolver a otros gatos!";
    }
  }

  mostrarToast(mensaje, duracion) {
    let toast = this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    });
    toast.present();
  }

  irLoginPage() {
    this.navCtrl.push(LoginPage);
  }

  irMenuUsuarioPage() {
    this.navCtrl.push(MenuUsuarioPage);
  }

}
