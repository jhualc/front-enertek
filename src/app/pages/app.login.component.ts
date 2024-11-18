import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../modules/auth/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
})
export class AppLoginComponent implements OnInit {

  
  loginForm!: FormGroup;
  hasError: boolean = false;
  hasErrorText: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

    console.log("Ingrsarndo");
    this.initForm();
  }

  initForm(): void {
    this.loginForm = this.fb.group({
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(6),
          Validators.maxLength(100),
        ]),
      ],
      password: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit(): void {
    this.hasError = false;

    if (this.loginForm.invalid) {
      this.hasError = true;
      this.hasErrorText = 'Por favor complete el formulario correctamente.';
      return;
    }

    // Llamada al servicio de autenticación
    this.authService
      .login(this.loginForm.value.email, this.loginForm.value.password)
      .subscribe(
        (resp: any) => {
          console.log("Autenticado",resp);
          if (resp && !resp.error) {
            // Guardar el token y redirigir
            let response = this.authService.setToken(resp.Token);
            console.log("REsponse::", response);
            this.router.navigate(['/inicio']); // Redirigir después del login exitoso
          } else {
            this.hasError = true;
            this.hasErrorText = 'Usuario o contraseña incorrectos.';
          }
        },
        (error) => {
          this.hasError = true;
          this.hasErrorText = 'Error al iniciar sesión. Intente nuevamente.';
          console.error('Login failed', error);
        }
      );
  }
}
