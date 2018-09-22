import { Injectable, } from '@angular/core';
//bbdd
import * as firebase from 'firebase';
import 'firebase/firestore';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

// provider
import { UsuarioProvider } from '../../providers/usuario/usuario';


@Injectable()
export class VotacionesGatoProvider {

  private db: any;

  constructor(
    public afDB: AngularFirestore,
    private afAuth: AngularFireAuth,
    private _user: UsuarioProvider
  ) {
    this.db = firebase.firestore();
  }


  // votar el gato y sumar voto
  // procedencia = home, procedencia = votos (si es votos no se meten en votaciones)
  votarGato(idGato, rate, totalVotos, mediaVotos, contMediaVotos, procedencia = 'home') {
    let totalVotosSuma = totalVotos+1;
    let mediaTotalVotos = (contMediaVotos+rate) / totalVotosSuma;
    let votacion = {
      mediaVotos: Math.round( mediaTotalVotos * 10 ) / 10,
      votos: totalVotosSuma,
      contMediaVotos: contMediaVotos+rate
    };
    this.db.collection("gatos").doc(`${idGato}`).set(votacion, { merge: true });
    if (procedencia == 'home') {
      this._user.getUid().then((returnUserId) => { // solo si hay login seguimos con votaciones
        if (returnUserId != null) {
          // recuperar las votaciones del usuario, sus gatos votados y meter el ultimo que ha votado
          this.getVotacionesUsuario(null).then((usuario)=>{
            if (usuario['gatosVotados'] != null) {
              let gatosVotados = [];
              var longArrayGatosVotados = usuario['gatosVotados'].length;
              if (longArrayGatosVotados != undefined) { // si solo hay un elemento, no recorre el array....lo metemos entonces nosotros
                for (let keyGato of usuario['gatosVotados']) {
                  gatosVotados.push(keyGato);
                }
              } else {
                gatosVotados.push(usuario['gatosVotados']);
              }
              if (longArrayGatosVotados == 25) gatosVotados.pop();
              gatosVotados.unshift(idGato);
              this.db.collection("votaciones").doc(`${this.afAuth.auth.currentUser.uid}`).set({gatosVotados}, { merge: true });
            } else {
              let gatosVotados = [];
              gatosVotados.push(idGato);
              this.db.collection("votaciones").doc(`${this.afAuth.auth.currentUser.uid}`).set({gatosVotados}, { merge: true });
            }
          });
          this.getKeyUsuarioFromGato(idGato).then((userId)=>{
            if (userId != returnUserId) { // el usuarioId del gato que recibe el voto, distinto a el mismo
              // antes de nada mirar si mi usuario tiene gato para devolver voto desde usuario/gato votado
              this.existeGatoSubido(returnUserId).then((gatoId)=>{
                if (gatoId) {
                  // guardar ese gatoId en votaciones/votosRecibidos para el userId del gato votado
                  // mirar si ya existe para crearlo, e ir metiendolo como se hace en votosRecibidos
                  this.getVotacionesUsuario(userId).then((votaciones)=>{
                    if (votaciones['votosRecibidos'] != null) {
                      let votosRecibidos = [];
                      var longArrayVotosRecibidos = votaciones['votosRecibidos'].length;
                      if (longArrayVotosRecibidos != undefined) { // si solo hay un elemento, no recorre el array....lo metemos entonces nosotros
                        for (let keyGato of votaciones['votosRecibidos']) {
                          votosRecibidos.push(keyGato);
                        }
                      } else {
                        votosRecibidos.push(votaciones['votosRecibidos']);
                      }
                      if (longArrayVotosRecibidos == 25) votosRecibidos.pop();
                      votosRecibidos.unshift(gatoId);
                      this.db.collection("votaciones").doc(`${userId}`).set({votosRecibidos}, { merge: true });
                    } else {
                      let votosRecibidos = [];
                      votosRecibidos.push(gatoId);
                      this.db.collection("votaciones").doc(`${userId}`).set({votosRecibidos}, { merge: true });
                    }
                  });
                }
              });
            }
          });
        }
      });
    } else {
      // estamos en ranks recibidos, por lo que hay que quitar el gato que acabo de votar
      this._user.getUid().then((returnUserId) => { // solo si hay login seguimos con votaciones
        if (returnUserId != null) {
          this.getVotacionesUsuario(returnUserId).then((votaciones)=>{
            if (votaciones['votosRecibidos'] != null) {
              let votosRecibidos = [];
              var longArrayVotosRecibidos = votaciones['votosRecibidos'].length;
              if (longArrayVotosRecibidos != undefined) { // si solo hay un elemento, no recorre el array....lo metemos entonces nosotros
                let keyQuitadaArray = false;
                for (let keyGato of votaciones['votosRecibidos']) {
                  if (idGato != keyGato) {
                    votosRecibidos.push(keyGato);
                  } else {
                    if (!keyQuitadaArray) {
                      keyQuitadaArray = true;
                    } else {
                      // ya hemos quitado un id, dejamos los demás aunque estén repetidos
                      votosRecibidos.push(keyGato);
                    }
                  }
                }
                this.db.collection("votaciones").doc(`${returnUserId}`).set({votosRecibidos});
              } else {
                this.db.collection("votaciones").doc(`${returnUserId}`).set(null);
              }
            }
          });
        }
      });
    }
  }
  
  // ¿ese usuarioId tiene algún gato subido?
  existeGatoSubido(userId) {
    let promesa = new Promise( (resolve, reject)=>{
      this.db.collection('usuariosGatos').doc(`${userId}`)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.data() != undefined) {
          var gato = JSON.parse(JSON.stringify(querySnapshot.data()));
          // coger uno de los gatos al hacer, es común que exista más de un gato
          let totalGatos = gato['misGatos'].length;
          let randomNumber = Math.floor(Math.random() * totalGatos) + 1;
          randomNumber = randomNumber-1; // para que coincide con los indices del array
          resolve(gato['misGatos'][randomNumber]);
        } else {
          resolve(false);
        }
      })
      .catch((error: any) => {
        resolve(false);
      });
    })
    .catch( error=> console.log( "Error en promesa getKeyUsuarioFromGato: " + JSON.stringify(error) ) );
    return promesa;
  }

  // obtenemos idUsuario mediante el idGato
  getKeyUsuarioFromGato(idGato) {
    let promesa = new Promise( (resolve, reject)=>{
      this.db.collection('gatos').doc(`${idGato}`)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.data() != undefined) {
          var data = JSON.parse(JSON.stringify(querySnapshot.data()));
          resolve(data.userId);
        } else {
          resolve(false);
        }
      })
      .catch((error: any) => {
        resolve(false);
      });
    })
    .catch( error=> console.log( "Error en promesa getKeyUsuarioFromGato: " + JSON.stringify(error) ) );
    return promesa;
  }

  getVotacionesUsuario(userId) {
    let elUserId;
    if (!userId || userId == null) {
      elUserId = this.afAuth.auth.currentUser.uid;
    } else {
      elUserId = userId;
    }
    let promesa = new Promise((resolve, reject) => {
      this.db.collection('votaciones').doc(`${elUserId}`)
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
        resolve(false);
      });
    });
    return promesa;
  }

  borrarGatoVotacion(gatoVotadoKeyBorrado) {
    this._user.getUid().then((returnUserId) => {
      this.getVotacionesUsuario(returnUserId).then((votaciones)=>{
        var votosRecibidos = [];
        if (votaciones['votosRecibidos'] != null) {
          var longArrayVotosRecibidos = votaciones['votosRecibidos'].length;
          if (longArrayVotosRecibidos != undefined) { // si solo hay un elemento, no recorre el array....lo metemos entonces nosotros
            for (let keyGato of votaciones['votosRecibidos']) {
              if (gatoVotadoKeyBorrado != keyGato) {
                votosRecibidos.push(keyGato);
              }
            }
          }
        }
        this.db.collection('votaciones').doc(`${returnUserId}`).set({votosRecibidos}, { merge: true });
      });
    });
  }
}
