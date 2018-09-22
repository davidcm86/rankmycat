import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//pages
import { VerGatoPage } from '../../pages/ver-gato/ver-gato';
// providers
import { MostrarGatoProvider } from '../../providers/mostrar-gato/mostrar-gato';


@IonicPage()
@Component({
  selector: 'page-gatos-mas-votados',
  templateUrl: 'gatos-mas-votados.html',
})
export class GatosMasVotadosPage {

  public gatos:any;
  public keys:any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _mgato: MostrarGatoProvider,) {
  }

  ionViewWillEnter() {
    this._mgato.top10MasVotados().then((gatos) => {
      this.gatos = gatos;
    });
  }

  modalVerGato(gatoKey, index) {
    let argumentos = {'keyGato': gatoKey, 'topGato': index+1}
    this.navCtrl.push(VerGatoPage, argumentos);
  }

}
