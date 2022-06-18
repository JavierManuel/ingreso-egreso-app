import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IngresoEgreso } from '../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { doc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private firestore: AngularFirestore, private authService: AuthService) { }

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {
    const uid = this.authService.user.uid;

    delete ingresoEgreso.uid;

    return this.firestore.doc(`${ uid }/ingreso-egreso`)
    .collection('items')
    .add({ ...ingresoEgreso });
  }

  initIngresosEgresosListener(uid: string) {
    console.log(uid);
    return this.firestore.collection(`${ uid }/ingreso-egreso/items`)
    //.valueChanges().subscribe( algo => {console.log(algo)});
    .snapshotChanges()
    .pipe(
      map(snapshot => /*{*/
        /*return snapshot.map(doc=> {
          //const data:any = doc.payload.doc.data();
          return {
            uid: doc.payload.doc.id,
            ...doc.payload.doc.data() as any
          }
        })*/
        /*return*/ snapshot.map(doc => ({
          uid: doc.payload.doc.id,
          ...doc.payload.doc.data() as any
        })
        )
      /*})*/
      )
    );//.subscribe( algo => {console.log(algo)});
  }

  borrarIngresoEgreso(uidItem?: string) {
    const uid = this.authService.user.uid;
    return this.firestore.doc(`${uid}/ingreso-egreso/items/${uidItem}`).delete();
  }

}
