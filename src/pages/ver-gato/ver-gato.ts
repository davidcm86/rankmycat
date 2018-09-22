import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

// providers
import { MostrarGatoProvider } from '../../providers/mostrar-gato/mostrar-gato';


@IonicPage()
@Component({
  selector: 'page-ver-gato',
  templateUrl: 'ver-gato.html',
})
export class VerGatoPage {

  raza: any;
  nombre: any;
  sexo: any;
  mediaVotos: any;
  img: any;
  key: any;
  rutaImagen: any;
  gato: any = {};
  imagen64: string;
  topGato: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _mgp: MostrarGatoProvider) {
      this._mgp.getGatoFromKeyGato(this.navParams.get('keyGato')).then(gatoRecuperado=>{
        if (gatoRecuperado) {
          this.gato = gatoRecuperado;
          this.raza = this.gato.raza;
          this.nombre = this.gato.nombreGato;
          this.sexo = this.gato.sexo;
          this.img = this.gato.img;
          this.key = this.gato.key;
          this.mediaVotos = this.gato.mediaVotos;
          this.rutaImagen = this.gato.rutaImagen;
          this.gato.iconoSexo = 'female';
          this.topGato = this.navParams.get('topGato');
          if (this.gato.sexo == 'masculino') {
            this.gato.iconoSexo = 'male';
          }
        }
      });
  }



}
