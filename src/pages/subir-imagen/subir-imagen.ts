import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { ImagePicker, ImagePickerOptions } from '@ionic-native/image-picker';
import { SubirGatoProvider } from "../../providers/subir-gato/subir-gato";
import { File } from '@ionic-native/file';


@IonicPage()
@Component({
  selector: 'page-subir-imagen',
  templateUrl: 'subir-imagen.html',
})
export class SubirImagenPage {

  nombre: string = "";
  raza: string = "";
  sexo: string = "";
  imagenPreview: string = "";
  imagen64: string;
  smallImg = null;
  edad: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private camera: Camera, 
              public imagePicker: ImagePicker,
              public _sgp: SubirGatoProvider,
              public file: File) {
  }

  cerrarModalSubirImagen() {
    this.viewCtrl.dismiss();
  }

  mostrarCamara() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
      this.imagenPreview = 'data:image/jpeg;base64,' + imageData;
      this.imagen64 = imageData;
    }, (err) => {
     // Handle error
     console.log("ERROR EN CAMARA", JSON.stringify(err));
    });
  }

  seleccionarFoto() {
    let opciones:ImagePickerOptions = {
      quality: 100,
      outputType: 1,
      maximumImagesCount: 1
    }
    this.imagePicker.getPictures(opciones).then((results) => {
      for (var i = 0; i < results.length; i++) {
        let imagen = this.getFileContentAsBase64(results[i]);
        imagen.then((img64) => {
          this.imagenPreview = img64;
          // quitar 'data:image/jpeg;base64,' para salvarlo en bbdd
          let dataBbddImagen = img64.split('data:image/jpeg;base64,'); // pasamos solo el nombre del archivo
          this.imagen64 = dataBbddImagen[1];
        }).catch((err) => {
          console.log('errors getFileContentAsBase64');
          console.log(JSON.stringify(err));
        });
      }
    }, (err) => {
      console.log("ERROR al seleccionar imagen", JSON.stringify(err));
    });
  }

  generateFromImage(img, MAX_WIDTH: number = 700, MAX_HEIGHT: number = 700, quality: number = 1, callback) {
    var canvas: any = document.createElement("canvas");
    var image = new Image();
    image.onload = () => {
      var width = image.width;
      var height = image.height;
      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, width, height);
      // IMPORTANT: 'jpeg' NOT 'jpg'
      var dataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(dataUrl)
    }
    image.src = img;
  }
 
  getImageSize(data_url) {
    var head = 'data:image/jpeg;base64,';
    return ((data_url.length - head.length) * 3 / 4 / (1024*1024)).toFixed(4);
  }

  // se convierte la imagen en base64, para android hay una opción pero para IOS no, por ello la función
  getFileContentAsBase64(path){
    let nombreFichero = path.split('cache/'); // pasamos solo el nombre del archivo
    let resul = this.file.readAsDataURL(this.file.cacheDirectory, nombreFichero[1]);
    return resul;
  };


  crearPost() {
    this.generateFromImage(this.imagenPreview, 550, 450, 0.75, data => {
      data = data.replace('data:image/jpeg;base64,', '');
      let archivo = {
        img: data,
        nombreGato: this.nombre,
        raza: this.raza,
        sexo: this.sexo,
        edad: this.edad
      }
      this._sgp.cargarImagenFirebase(archivo).then(()=>{
        this.navCtrl.pop();
      });
    });
  }

}
