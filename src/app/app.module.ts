import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

// pages
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { RanksRecibidosPage } from '../pages/ranks-recibidos/ranks-recibidos';
import { TopPage } from '../pages/top/top';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { SubirImagenPage } from '../pages/subir-imagen/subir-imagen';
import { RecuperarPassPage } from '../pages/recuperar-pass/recuperar-pass';
import { MenuUsuarioPage } from '../pages/menu-usuario/menu-usuario';
import { EditarGatoPage } from '../pages/editar-gato/editar-gato';
import { GatosMasVotadosPage } from '../pages/gatos-mas-votados/gatos-mas-votados';
import { GatosMejorValoradosPage } from '../pages/gatos-mejor-valorados/gatos-mejor-valorados';
import { VerGatoPage } from '../pages/ver-gato/ver-gato';
import { BorrarCuentaPage } from '../pages/borrar-cuenta/borrar-cuenta';
import { SlidesPage } from '../pages/slides/slides';
import { PoliticaPage } from '../pages/politica/politica';

// otras cosas
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';

// Importaciones
import { Ionic2RatingModule } from 'ionic2-rating';

// plugin
import { Camera } from "@ionic-native/camera";
import { ImagePicker } from '@ionic-native/image-picker';
import { IonicStorageModule } from '@ionic/storage';
import { File } from '@ionic-native/file';

// providers
import { SubirGatoProvider } from '../providers/subir-gato/subir-gato';
import { UsuarioProvider } from '../providers/usuario/usuario';
import { MostrarGatoProvider } from '../providers/mostrar-gato/mostrar-gato';

// firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { VotacionesGatoProvider } from '../providers/votaciones-gato/votaciones-gato';
//import * as firebase from 'firebase';
// firebase cloud
export const firebaseConfig = { // info sacada de firebase "agregar firebase a nuestra web"
apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "d",
    storageBucket: "",
    messagingSenderId: ""
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    RanksRecibidosPage,
    TopPage,
    TabsPage,
    SubirImagenPage,
    LoginPage,
    LogoutPage,
    RecuperarPassPage,
    MenuUsuarioPage,
    EditarGatoPage,
    VerGatoPage,
    BorrarCuentaPage,
    GatosMasVotadosPage,
    GatosMejorValoradosPage,
    SlidesPage,
    PoliticaPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,{tabsHideOnSubPages: true}),
    Ionic2RatingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    IonicStorageModule.forRoot(),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    RanksRecibidosPage,
    TopPage,
    TabsPage,
    SubirImagenPage,
    RecuperarPassPage,
    LoginPage,
    LogoutPage,
    MenuUsuarioPage,
    EditarGatoPage,
    VerGatoPage,
    GatosMasVotadosPage,
    GatosMejorValoradosPage,
    SlidesPage,
    PoliticaPage,
    BorrarCuentaPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    ImagePicker,
    File,
    SubirGatoProvider,
    UsuarioProvider,
    MostrarGatoProvider,
    VotacionesGatoProvider
  ]
})
export class AppModule {}
