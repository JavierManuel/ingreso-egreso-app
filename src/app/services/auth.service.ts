import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { Usuario } from '../models/usuario.model';
import* as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userSubscription: Subscription = new Subscription;
  private _user: Usuario | undefined;

  get user() {
    return {... this._user};
  }

  constructor(
              public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      if (fuser) {
        this.userSubscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges()
        .subscribe( (firestoreUser: any) => {
          const user = Usuario.fromFirebase(firestoreUser);
          this._user = user;

          this.store.dispatch( authActions.setUser({user}));

        })
        //this.store.dispatch(authActions.setUser())
      } else {
        this._user = new Usuario('', '', '');
        this.userSubscription.unsubscribe();
        this.store.dispatch( authActions.unSetUser());
        this.store.dispatch( ingresoEgresoActions.unSetItems());
      }
    })
  }

  crearUsuario( nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password)
    .then( ({ user }) => {

      const newUser = new Usuario( (user != null ? user.uid: ''), nombre, email);

      return this.firestore.doc(`${ user?.uid }/usuario`).set( {...newUser} );
      
    });
  }

  loginUsuario( email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null )
    );
  }

}
