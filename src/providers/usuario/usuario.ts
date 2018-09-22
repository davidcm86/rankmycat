import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
// bbdd
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase';
import 'firebase/firestore';


@Injectable()
export class UsuarioProvider {

  uid:string = null; // la clave del usuario logado o registrado
  authState: any = null;
  private db: any;

  constructor(
    private storage:Storage,
    private platform:Platform,
    public afDB: AngularFirestore
  ) {
    this.db = firebase.firestore();
  }

  getUid() {
    let promesa = new Promise( (resolve, reject)=>{
      if (this.platform.is("cordova")) {
        // dispositivo
        this.storage.ready()
          .then(()=>{
            // leer del storage
              this.storage.get('uid').then((val) => {
                if (val != null) {
                  resolve(val);
                } else {
                  resolve(false);
                }
              });
            }).catch(()=>{
              resolve(false);              
            });
      } else {
        // escritorio
        resolve(localStorage.getItem("uid"));
      }
    })
    .catch( error=> console.log( "Error en promesa Usuario: " + JSON.stringify(error) ) );
    return promesa;
  }

  getGatos() {
    var gatosRecuperados = [];
    let promesa = new Promise((resolve, reject) => {
      this.getUid().then((uid) => {
        this.db.collection('usuariosGatos').doc(`${uid}`)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.data() != undefined && querySnapshot.data().misGatos != undefined) {
            var idGatos = JSON.parse(JSON.stringify(querySnapshot.data().misGatos));
            for (let idCat of idGatos) {
              this.db.collection('gatos').doc(`${idCat}`)
                  .get()
                  .then((querySnapshot) => {
                    let gato = querySnapshot.data();
                    gato['rate'] = gato['mediaVotos'];
                    gatosRecuperados.push(gato);
              })  
            }
            resolve(gatosRecuperados);
          } else {
            resolve(0);
          }
        })
        .catch((error: any) => {
          resolve(0);
        });
      });
    });
    return promesa;
  }

  getPaises() {
    return new Promise((resolve, reject) => {
      this.db.collection("paises").orderBy("nombre")
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
            reject(error);
        });
    });
  }

  // guardar datos usuario
  saveDatosUsuario(id, email, pais) {
    let misDatos = {
      'email': email.toLowerCase(),
      'pais': pais
    }
    this.db.collection("usuarios").doc(`${id}`).set({misDatos});
  }


}
