import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../modules/auth/_services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './app.login.component.html',
})
export class AppLoginComponent {
  loginForm!: FormGroup;
  hasError: Boolean= false;
  hasErrorText: any = '';
  generica = 'rHJ7$p583YL@';
  dark: boolean;
  checked: boolean;

  constructor( private fb: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private router: ActivatedRoute){
    
if(this.authService.isLogin()){
  this.route.navigate(['dash']);
}
    
}

ngOnInit(): void {
this.initForm();
}

initForm(){
this.loginForm = this.fb.group({
    email:[
      null,
      Validators.compose([
      Validators.required,
      Validators.email,
      Validators.minLength(6),
      Validators.maxLength(100)
      ])
    ]
  })
}

submit(){
  this.hasError= false;
//  console.log(this.loginForm.value);

  this.authService.login(this.loginForm.value.email, this.generica)
    .subscribe((resp: any) => {
      console.log(resp);
      if(!resp.error && resp){
        console.log("Ingreso al submit");
        document.location.reload();

      }else{
        if(resp.error.error == 'Unauthorized'){
        
          this.hasError = true;
          this.hasErrorText = "Por favor inicie con el correo registrado";
        }
      }
    })
  }

}
