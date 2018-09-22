import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { SubirGatoProvider } from '../../providers/subir-gato/subir-gato';
// bbdd
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import 'firebase/firestore';
// providers
import { UsuarioProvider } from '../../providers/usuario/usuario';

@Injectable()
export class MostrarGatoProvider {

  public gato: any;
  private db: any;

  constructor(
    public afDB: AngularFirestore,
    public _sgp: SubirGatoProvider,
    private afAuth: AngularFireAuth,
    public toastCtrl: ToastController,
    private _user: UsuarioProvider) {
      this.db = firebase.firestore();
  }

  getGato(lastKeyGatoVisto) {
    let promesa = new Promise( (resolve, reject)=>{
      this._sgp.getLastKey(1).then((lastKey)=>{
        var minimum = 1;
        var maximum: any;
        var lastKeyNumber: any;
        // evitamos coger el mismo id gato de nuevo
        do {
          lastKeyNumber = lastKey;
          maximum = lastKeyNumber -1; // ya que al lastKey le sumamos 1 en su método para crear el siguiente id gato
          var randomNumber = Math.floor(Math.random() * maximum) + minimum;
        } while (randomNumber == lastKeyGatoVisto);
        this.db.collection('gatos').doc(`${randomNumber}`)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.data() != undefined && querySnapshot.data().activo == 1) {
              var data = JSON.parse(JSON.stringify(querySnapshot.data()));
              resolve(data);
            } else {
              resolve(false);
            }
        })
        .catch((error: any) => {
            reject(error);
        });
      });
    })
    .catch( error=> console.log( "Error en promesa Usuario: " + JSON.stringify(error) ) );
    return promesa;
  }

  getGatoFromKeyGato(keyGato) {
    let promesa = new Promise( (resolve, reject)=>{
      this.db.collection('gatos').doc(`${keyGato}`)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.data() != undefined) {
          var gato = JSON.parse(JSON.stringify(querySnapshot.data()));
          resolve(gato);
        } else {
          resolve(false);
        }
      })
      .catch((error: any) => {
        resolve(false);
      });
    })
    .catch( error=> console.log( "Error en getGatoFromKeyGato: " + JSON.stringify(error) ) );
    return promesa;
  }

  borrarGato(keyGato) {
    let promesa = new Promise((resolve, reject) => {
      // recuperar gato
      this.getGatoFromKeyGato(keyGato).then((gatoRecuperado)=>{
        this.gato = gatoRecuperado;
        let storeRef = firebase.storage().ref();
        var desertRef = storeRef.child(this.gato.rutaImagen);
        // borrar imagen
        desertRef.delete().then(function() {
          //console.log('imagen bien borrada');
        }).catch(function(error) {
          console.log('error al borrar la imagen');
        });
        // borrar gato de usuariosGatos y de gatos
        this._sgp.getArrayGatosUsuario().then((usuario)=>{
          if (usuario['misGatos']) {
            var misGatos = [];
            for (let keyGatoDentro of usuario['misGatos']) {
              if (keyGatoDentro != keyGato) {
                misGatos.push(keyGatoDentro);
              }
            }
            this.db.collection('usuariosGatos').doc(`${this.afAuth.auth.currentUser.uid}`).set({misGatos}, {merge: true});
            // borrar gato
            this.db.collection('gatos').doc(`${keyGato}`).delete();
            // meter el id huerfano que se queda en la tabla de huerfanosIds
            let idHuerfano = {
              'id': Number(keyGato),
            };
            this.db.collection("huerfanosIds").doc(`${keyGato}`).set(idHuerfano);
            this.mostrarToast("Su gato ha sido borrado correctamente.");
          }
        }); 
      })
      resolve();
    });
    return promesa;
  }

  mostrarToast(mensaje:string) {
    this.toastCtrl.create({
      message: mensaje,
      duration: 3000
    }).present();
  }

  // mostramos los 10 gatos mejor valorados cogiendo la variable de bbdd que indica el mínimo de votos que debe tener
  // tener en cuenta que al crear rango <,>...luego el order tiene que ser de ese mismo campo, por ello aquí no puedo poner
  top10mejorValorados() {
    let promesa = new Promise((resolve, reject) => {
      this.db.collection('gatos').where("activo", "==", 1)
        .orderBy("mediaVotos", "desc")
        .limit(10)
        .get()
        .then((querySnapshot) => {
          let arr = [];
          querySnapshot.forEach(function (doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id
            arr.push(obj);
          });
          if (arr.length > 0) {
            resolve(arr);
          } else {
            resolve(null);
          }
        })
        .catch((error: any) => {
          resolve(false);
        });
    })
    .catch( error=> console.log( "Error en getGatoFromKeyGato: " + JSON.stringify(error) ) );
    return promesa;
  }

  // mostramos los 10 gatos más votados
  top10MasVotados() {
    let promesa = new Promise((resolve, reject) => {
      this.db.collection('gatos').where("activo", "==", 1)
        .orderBy("votos", "desc")
        .limit(10)
        .get()
        .then((querySnapshot) => {
          let arr = [];
          querySnapshot.forEach(function (doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            obj.$key = doc.id
            arr.push(obj);
          });
          if (arr.length > 0) {
            resolve(arr);
          } else {
            resolve(null);
          }
        })
        .catch((error: any) => {
          resolve(false);
        });
    })
    .catch( error=> console.log( "Error en getGatoFromKeyGato: " + JSON.stringify(error) ) );
    return promesa;
  }

  borrarUsuario() {
    let promesa = new Promise((resolve, reject) => {
      // coger los id gatos de usuariosGatos y borrarlos, antes borrar la imagen con la ruta que cogemos
      // recuperamos los gatos de ese usuario
      this._user.getUid().then( uid => {
        this._sgp.getArrayGatosUsuario().then((usuario)=>{
          if (usuario['misGatos']) {
            var misGatos = [];
            for (let keyGatoDentro of usuario['misGatos']) {
              console.log('KeyGatoBorrar: ' + keyGatoDentro);
              // por cada gato borramos su imagen
              this.getGatoFromKeyGato(keyGatoDentro).then((gatoRecuperado)=>{
                this.gato = gatoRecuperado;
                let storeRef = firebase.storage().ref();
                var desertRef = storeRef.child(this.gato.rutaImagen);
                // borrar imagen
                desertRef.delete().then(function() {
                  //console.log('imagen bien borrada');
                }).catch(function(error) {
                  console.log('error al borrar la imagen');
                });
              });
              // una vez la imagen borrada podemos borrar los gatos
              this.db.collection('gatos').doc(`${keyGatoDentro}`).delete();
            }
          }
        }); 
        this.db.collection("usuarios").doc(`${uid}`).delete();
        this.db.collection("usuariosGatos").doc(`${uid}`).delete();
        this.db.collection("votaciones").doc(`${uid}`).delete();
        // borrar el usuario de firebase y desloguear
        var user = firebase.auth().currentUser; 
        user.delete().then(function() {
          resolve("true");
        }, function(error) {
          resolve("false");
        });
      });
    })
    .catch( error=> console.log( "Error en getGatoFromKeyGato: " + JSON.stringify(error) ) );
    return promesa;
  }

}
