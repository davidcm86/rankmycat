import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events } from 'ionic-angular';
import { RanksRecibidosPage } from '../../pages/ranks-recibidos/ranks-recibidos';
import { TopPage } from '../../pages/top/top';
import { HomePage } from '../../pages/home/home';
import { MenuController } from 'ionic-angular/components/app/menu-controller';

// providers
import { UsuarioProvider } from '../../providers/usuario/usuario';

//bbdd
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})


export class TabsPage {
  authState: any = null;
  ranksRecibidos: any;
  top: any;
  home: any;
  totalVotosRecibidos: any = 0;

  private itemDoc: AngularFirestoreDocument<any>;
  item: Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private _user: UsuarioProvider,
    private platform: Platform,
    public events: Events,
    public afDB: AngularFirestore) {
      /*
      * Para sacar las estrellas recibidas nos suscribimos a: `/votaciones/${uid}/votosRecibidos`, pero al principio
      * no existe, por lo que luego no muestra las estrellas. Para ello hacemos que cuando pausen la app (dan a home o cierran)
      * al volver a iniciar, cogemos de nuevo esa ruta que quizás ahora si existe y ya estaría enlazada y funcionaría el
      * valueChanged hacia esa ruta que antes no existía y ahora quizás si.
      *
      */
      // pausan la APP y luego vuelven. Esto lo captura.
      this.platform.resume.subscribe(() => {
        this._user.getUid().then( uid => {
          if (uid) {
            this.menuCtrl.enable(false, 'login');
            this.menuCtrl.enable(true, 'no-login');
            this.getVotosRecibidos(uid);
          } else {
            this.menuCtrl.enable(true, 'login');
            this.menuCtrl.enable(false, 'no-login');
          }
        })        
        .catch( error=>{
          console.log("ERROR en tabs cogiendo uid: " + JSON.stringify( error ));
        });  
      });

      this._user.getUid().then( uid => {
          // observar votosRecibidos
        if (uid) {
          this.menuCtrl.enable(false, 'login');
          this.menuCtrl.enable(true, 'no-login');
          this.getVotosRecibidos(uid);
        } else {
          this.menuCtrl.enable(true, 'login');
          this.menuCtrl.enable(false, 'no-login');
        }
      })        
      .catch( error=>{
        console.log("ERROR en tabs cogiendo uid: " + JSON.stringify( error ));
      });
      this.ranksRecibidos = RanksRecibidosPage;
      this.top = TopPage;
      this.home = HomePage;
  }

  // nos suscribimos a las votaciones
  getVotosRecibidos(uid) {
    this.itemDoc = this.afDB.doc<any>(`votaciones/${uid}`);
    this.itemDoc.valueChanges().subscribe(data => {
      if (data != undefined && data.votosRecibidos != undefined) {
        this.totalVotosRecibidos = data.votosRecibidos.length;
      }
    });
  }

}
