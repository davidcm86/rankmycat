import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-slides',
  templateUrl: 'slides.html',
})
export class SlidesPage {

  slides:any[] = [
    {
      title: "¡Bienvenid@!",
      description: "Esta <b>aplicación</b> te permitirá disfrutar de todos los <b>gatitos</b> que la gente suba a la APP, además podrás votarlos con <b>estrellas</b> como otros usuarios a tus <b>gatos</b>, así sabrás lo bonitos que son!",
      image: "assets/imgs/ica-slidebox-img-1.png",
    },
    {
      title: "¿Cómo puedo subir la foto de mi gato?",
      description: "Tienes que registrarte en la <b>APP</b> con unos <b>sencillos</b> pasos y después solo tendrás que pinchar en el icono de la <b>cámara</b> para subir tu gatito.",
      image: "assets/imgs/ica-slidebox-img-2.png",
    },
    {
      title: "¿Cómo voto a otros gatos?",
      description: "Desde el primer momento que entras a la APP ya verás el primer <b>gatito</b>, puedes darle desde 1 estrella a 5 estrellas como máxima calificación. Al pinchar sobre la <b>estrella</b> la APP te mostrará el siguiente gato.",
      image: "assets/imgs/ica-slidebox-img-3.png",
    },
    {
      title: "¡Cuéntame más!",
      description: "Al votar a otros <b>gatos</b> estos recibirán un <b>voto</b> de tu parte, ellos lo verán y podrán devolverte el voto a tus gatos. Cuantos más votos des más <b>votos recibiras!</b>. Además tenemos ranking de gatos!",
      image: "assets/imgs/ica-slidebox-img-4.png",
    }
  ];
  
  ionViewWillEnter() {
    if (this.platform.is("cordova")) {
      // dispositivo
      this.storage.ready()
        .then(()=>{
          this.storage.get('slides').then((val) => {
            if (val == "true") {
              this.navCtrl.setRoot(TabsPage);
            }
          });
        }).catch(()=>{
          console.log('Fallo storege slides');           
        });
    } else {
      // escritorio
      if (localStorage.getItem("slides") == "true") {
        this.navCtrl.setRoot(TabsPage);
      }
    }
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    private storage: Storage,) {
  }

  saltar_tutorial() {
    if (this.platform.is("cordova")) {
      // dispositivo
      this.storage.ready()
        .then(()=>{
          this.storage.set('slides', 'true');
          this.navCtrl.setRoot(TabsPage);
        }).catch(()=>{
          console.log('Fallo storege slides 2');           
        });
    } else {
      // escritorio
      localStorage.setItem('slides', 'true');
      this.navCtrl.setRoot(TabsPage);
    }
  }


}
