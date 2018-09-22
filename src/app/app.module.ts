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
// firebase realtime
/*export const firebaseConfig = { // info sacada de firebase "agregar firebase a nuestra web"
  apiKey: "AIzaSyBljajA449wcygESghCF8-Tje4gMnJIFoc",
  authDomain: "rank-my-cat-890dc.firebaseapp.com",
  databaseURL: "https://rank-my-cat-890dc.firebaseio.com",
  projectId: "rank-my-cat-890dc",
  storageBucket: "rank-my-cat-890dc.appspot.com",
  messagingSenderId: "425539845960"
};*/
// firebase cloud
export const firebaseConfig = { // info sacada de firebase "agregar firebase a nuestra web"
apiKey: "AIzaSyA4Sd7H8mcQbi-C0Y2RJykd6Y2a-J7Ez40",
    authDomain: "rank-my-cat-cloud.firebaseapp.com",
    databaseURL: "https://rank-my-cat-cloud.firebaseio.com",
    projectId: "rank-my-cat-cloud",
    storageBucket: "rank-my-cat-cloud.appspot.com",
    messagingSenderId: "651056733060"
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
