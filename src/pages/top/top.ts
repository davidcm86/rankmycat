import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LoginPage } from '../../pages/login/login';
import { MenuUsuarioPage } from '../../pages/menu-usuario/menu-usuario';
import { GatosMasVotadosPage } from '../../pages/gatos-mas-votados/gatos-mas-votados';
import { GatosMejorValoradosPage } from '../../pages/gatos-mejor-valorados/gatos-mejor-valorados';
// poviders
import { UsuarioProvider } from '../../providers/usuario/usuario';
/**
 * Generated class for the TopPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-top',
  templateUrl: 'top.html',
})
export class TopPage {

  userId: any;

  constructor(
    private _user: UsuarioProvider,
    public navCtrl: NavController
  ) {
    this._user.getUid().then( uid => {
      if (uid) {
        this.userId = uid;
      }
    })        
    .catch( error=>{
      console.log("ERROR en votos recibidos mostrar gatos: " + JSON.stringify( error ));
    });
  }

  hacerPush(pagina) {
    switch (pagina) {
      case 'GatosMasVotadosPage':
        this.navCtrl.push(GatosMasVotadosPage);
        break;
      case 'GatosMejorValoradosPage':
        this.navCtrl.push(GatosMejorValoradosPage);
        break;
      case 'MenuUsuarioPage':
        this.navCtrl.push(MenuUsuarioPage);
        break;
      case 'LoginPage':
        this.navCtrl.push(LoginPage);
        break;
    }
    
  }

}
