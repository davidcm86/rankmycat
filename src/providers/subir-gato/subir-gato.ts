import { Injectable } from '@angular/core';
import { ToastController, Platform } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

// providers
import { UsuarioProvider } from '../../providers/usuario/usuario';

// conexion firebase
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import 'firebase/firestore';

@Injectable()
export class SubirGatoProvider {

  private db: any;
  public uid: any;

  constructor(
    public toastCtrl: ToastController,
    public afDB: AngularFirestore,
    private afAuth: AngularFireAuth,
    private platform: Platform,
    private storage: Storage,
    public _usuario: UsuarioProvider,
    public http: Http) {
      this.db = firebase.firestore();
  }

  editarGatoFirebase( archivo ) {
    // una vez que empezamos a cargar la imagen....
    let promesa = new Promise((resolve, reject) => {
      this.mostrarToast('Guardando...');
      if (archivo.img != undefined) {
        let result = this.cloudVision(archivo.img);
        result.subscribe(res =>{
          if (res.json().responses[0]['labelAnnotations'][0]['description'] == 'cat') {
            // crear la referencia a nuestra bbdd
            let storeRef = firebase.storage().ref();
            let nombreArchivo:string = new Date().valueOf().toString();
            let fecha = new Date();
            let ano = Number(fecha.getFullYear());
            let mes = Number(fecha.getMonth())+1;
            let dia = Number(fecha.getDate());
            let dbUpload = this.db;
            // han subido imagen con gato. Eliminar la que había recuperando su ruta.
            var desertRef = storeRef.child(archivo.rutaImagen);
            desertRef.delete().then(function() {
            }).catch(function(error) {
            });
            // tarea para subir el archivo al storage a una carpeta con el nombre que queremos
            let uploadTask: firebase.storage.UploadTask = 
              storeRef.child(`img/${ano}/${mes}/${dia}/${nombreArchivo}`)
              .putString(archivo.img, 'base64', {contentType: 'image/jpeg'});
              uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
              ()=>{}, // cuantos mb se han subido
              (error) => {
                // manejo de error
                console.log("Error en la carga imagen. Posiblemente no hay login.");
                console.log(JSON.stringify(error));
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
                this.mostrarToast("Necesitas hacer login para subir tu gato a la APP!");
                reject();
              },
              ()=>{
                // todo bien
                // sacar la url dónde se encuentra la imagen. Tenemos el uploadTask, por lo que cogerá esa referencia
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                  let urlImagen = JSON.stringify(downloadURL);
                  // debo de hacerlo 2 veces para quitar todas las ", no sé realmente porque
                  urlImagen = urlImagen.replace('"', '');
                  urlImagen = urlImagen.replace('"', '');
                  let fecha = new Date();
                  let anio = Number(fecha.getFullYear());
                  let mes = Number(fecha.getMonth())+1;
                  let dia = Number(fecha.getDate());
                  let gatoEditado = {
                    nombreGato: archivo.nombreGato,
                    raza: archivo.raza,
                    sexo: archivo.sexo,
                    rutaImagen: 'img/' + anio + '/' + mes + '/' + dia + '/' + nombreArchivo,
                    img: urlImagen,
                    edad: archivo.edad,
                    timestampEditado: firebase.firestore.FieldValue.serverTimestamp()
                  };
                  dbUpload.collection('gatos').doc(`${archivo.key}`).set(gatoEditado, {merge: true});
                });
                this.mostrarToast("Los datos de su gato han sido cambiados correctamente.");
                resolve();
              }
            )
          }
        });
      } else {
        let gatoEditado = {
          nombreGato: archivo.nombreGato,
          raza: archivo.raza,
          sexo: archivo.sexo
        };
        this.db.collection('gatos').doc(`${archivo.key}`).set(gatoEditado, {merge: true});
      }
      resolve();
    });
    return promesa;
  }

  cargarImagenFirebase( archivo ) {
    // una vez que empezamos a cargar la imagen....
    let promesa = new Promise((resolve, reject) => {
      this.mostrarToast('Guardando...');
      // crear la referencia a nuestra bbdd
      let storeRef = firebase.storage().ref();
      let nombreArchivo: string = new Date().valueOf().toString();
      var usuarioId = this.afAuth.auth.currentUser.uid;
      let dbUpload = this.db;
      let fecha = new Date();
      let ano = Number(fecha.getFullYear());
      let mes = Number(fecha.getMonth())+1;
      let dia = Number(fecha.getDate());
      let result = this.cloudVision(archivo.img);
      result.subscribe(res =>{
        if (res.json().responses[0]['labelAnnotations'][0]['description'] == 'cat') {
          // tarea para subir el archivo al storage a una carpeta con el nombre que queremos
          let uploadTask: firebase.storage.UploadTask = 
            storeRef.child(`img/${ano}/${mes}/${dia}/${nombreArchivo}`)
            .putString(archivo.img, 'base64', {contentType: 'image/jpeg'});

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
            ()=>{}, // cuantos mb se han subido
            (error) => {
              // manejo de error
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
              this.mostrarToast("Necesitas hacer login para subir a tu gato a la APP!");
              reject();
            },
            ()=>{
              // todo bien
              // sacar la url dónde se encuentra la imagen. Tenemos el uploadTask, por lo que cogerá esa referencia
              //let url = uploadTask.snapshot.downloadURL;
              this.getLastKey(2).then((lastKey)=>{
                console.log('El lastKey adquirido pasando procedencia 2 es: ' + lastKey);
                this.getArrayGatosUsuario().then((usuario)=>{
                  if (usuario['misGatos']) {
                    let misGatos = [];
                    for (let keyGato of usuario['misGatos']) {
                      misGatos.push(keyGato);
                    }
                    misGatos.push(lastKey);
                    this.db.collection("usuariosGatos").doc(`${usuarioId}`).set({misGatos});
                  } else {
                    // crear suarios_gatos con el gato pasado
                    let misGatos = [
                      lastKey
                    ];
                    this.db.collection("usuariosGatos").doc(`${usuarioId}`).set({misGatos});
                  }
                });
                /*
                * dentro de esta instancia no puedo meter datos como this.afAuth.auth.currentUser.uid o
                * la instancia de this.db, pero declarando esto más arriba como variable, si me deja utilizarlo dentro
                */ 
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                  let urlImagen = JSON.stringify(downloadURL);
                  // debo de hacerlo 2 veces para quitar todas las ", no sé realmente porque
                  urlImagen = urlImagen.replace('"', '');
                  urlImagen = urlImagen.replace('"', '');
                  let fecha = new Date();
                  let anio = Number(fecha.getFullYear());
                  let mes = Number(fecha.getMonth())+1;
                  let dia = Number(fecha.getDate());
                  let post: any = {
                    'img': urlImagen,
                    'nombreGato': archivo.nombreGato,
                    'raza': archivo.raza,
                    'sexo': archivo.sexo,
                    'edad': archivo.edad,
                    'key': lastKey,
                    'userId': usuarioId,
                    'votos': 0,
                    'mediaVotos': 0,
                    'contMediaVotos': 0,
                    'activo': 1,
                    'timestampCreado': firebase.firestore.FieldValue.serverTimestamp(),
                    'rutaImagen': 'img/' + anio + '/' + mes + '/' + dia + '/' + nombreArchivo
                  };
                  dbUpload.collection("gatos").doc(`${lastKey}`).set(post);
                });
              });
              this.mostrarToast("Su gato está listo para ser rankeado.");
              resolve();
            }
          )
        } else {
          this.mostrarToast("La imagen subida no cumple los requisitos para ser aprobada. Pruebe con otra imagen de un gato.");
          resolve(false);
        }
      });
    });
    return promesa;
  }

  // se hace una llamada a la api cloud vision para ver si el mayor porcentaje es de gatos
  cloudVision(base64Image) {
    const body = {
      "requests": [
        {
          "image": {
            "content": base64Image
          },
          "features": [
            {
              "type": "LABEL_DETECTION"
            }
          ]
        }
      ]
    }
    return this.http.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyA9EKfU7P6FpLgIVUkXXa2FSS7HHRIEp4k', body);
  }

  getLastKey(procedencia) {
    let promesa = new Promise((resolve, reject) => {
      // antes de recuperar el último id para sumarle 1 y que se introduzca el nuevo id para el gato
      // debemos mirar en huerfanosIds si existe ids que utiliar antes.
      if (procedencia == 2) {
        let dbUpload = this.db;
        this.db.collection("huerfanosIds").orderBy("id", "asc").limit(1)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach(function (doc) {
            var obj = JSON.parse(JSON.stringify(doc.data()));
            console.log('id recuperado: ' + obj.id);
            if (obj.id != undefined) {
              let huerfano = obj.id;
              dbUpload.collection("huerfanosIds").doc(`${huerfano}`).delete();
              resolve(huerfano);
            }
          });
        });
      }
      // si no encuentra ninguna ya cogemos el último
      this.db.collection("gatos").orderBy("key", "desc").limit(1)
      .get()
      .then((querySnapshot) => {
        let arr = [];
        querySnapshot.forEach(function (doc) {
          var obj = JSON.parse(JSON.stringify(doc.data()));
          obj.$key = doc.id
          arr.push(obj);
        });
        if (arr.length > 0) {
          resolve(arr[0].key + 1); // el nuevo id a crear será el último más 1
        } else {
          resolve(null);
        }
      })
      .catch((error: any) => {
        // si error significa que no hay nada creado, devolvemos 1
        resolve(1);
      });
    });
    return promesa;
  }

  getArrayGatosUsuario() {
    let promesa = new Promise((resolve, reject) => {
      this.db.collection('usuariosGatos').doc(`${this.afAuth.auth.currentUser.uid}`)
      .get()
      .then((querySnapshot) => {
          if (querySnapshot.data() != undefined) {
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
    return promesa;
  }

  mostrarToast(mensaje:string) {
    this.toastCtrl.create({
      message: mensaje,
      duration: 7000
    }).present();
  }

}
