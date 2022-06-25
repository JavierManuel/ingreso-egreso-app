import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription = new Subscription;
  ingresosSubs:Subscription = new Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit(): void {
    /*this.userSubs = this.store.select('user').pipe(filter(auth => auth.user.uid != ''))
    .subscribe(({user}) => { console.log(user);
      this.ingresoEgresoService.initIngresosEgresosListener(user.uid);});*/
  
    this.userSubs = this.store.select('user')
    .pipe(
      filter( auth => auth.user.uid != '')
    )
    .subscribe( ({user}) => {
      console.log(user);
      this.ingresosSubs = this.ingresoEgresoService.initIngresosEgresosListener(user.uid)
      .subscribe(ingresoegresoFB => {
        console.log(ingresoegresoFB);
        this.store.dispatch(ingresoEgresoActions.setItems({items: ingresoegresoFB}))
      });
    });
  }

  ngOnDestroy(): void {
    this.ingresosSubs?.unsubscribe();
    this.userSubs?.unsubscribe();
  }

}
