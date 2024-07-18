import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {


  loginForm!: FormGroup;
  hasError: Boolean= false;
  hasErrorText: any = '';

  hasSuccess: Boolean= false;
  hasSuccessText: any = 'Usuario Creado correctamente';

  constructor( private fb: FormBuilder,
                private authService: AuthService,
                private route: Router,
                private router: ActivatedRoute){
                
    if(this.authService.isLogin()){
      this.route.navigate(['/dash']);
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
          Validators.maxLength(30)
        ])
      ],
      password:[
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30)
        ])
      ]
    })
  }

  submit(){
    this.hasError= false;
  //  console.log(this.loginForm.value);
    
    this.authService.register(this.loginForm.value)
      .subscribe((resp: any) => {
        console.log(resp);
        if(!resp.error && resp){
        
          
          this.hasSuccess =  true;
          this.hasSuccessText = "USUARIO CREADO";

          setTimeout(()=> {
            this.route.navigate(["/auth/login"]);
          }, 2000);

        }else{
          if(resp.error.error == 'Unauthorized'){
          
            this.hasError = true;
            this.hasErrorText = "El usuario o la contraseña son incorrectos";
          }
        }
      })
      
      
  }

}
