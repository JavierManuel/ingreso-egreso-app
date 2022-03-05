import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});

  constructor( private fb: FormBuilder,
                private authService: AuthService,
                private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    console.log(this.loginForm.invalid);
  }

  login() {
    console.log(this.loginForm);
    console.log(this.loginForm.invalid);
    if (this.loginForm.invalid ) {return;}

    Swal.fire({
      title: 'Espere por favor',
      willOpen: () => {
        Swal.showLoading()
      },
      showConfirmButton: false
    });

    const {email, password } = this.loginForm.value;

    this.authService.loginUsuario(email, password)
    .then(credenciales => {
      console.log(credenciales)
      Swal.close();
      this.router.navigate(['/']);
    })
    .catch(err => {Swal.fire({
      icon: 'error',
      title: 'Oops',
      text: err.message
    })
  });
  }

}
