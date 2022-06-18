import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from '../models/ingreso-egreso.model';

export const unSetItems = createAction('[IngrresoEgreso] Unset Items');

export const setItems = createAction(
    '[IngrresoEgreso] set Items',
    props<{ items: IngresoEgreso[] }>() 
    );