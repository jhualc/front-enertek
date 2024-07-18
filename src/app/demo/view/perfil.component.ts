import {Component, ViewChild} from '@angular/core';
import {BreadcrumbService} from '../../breadcrumb.service';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { Ng2ImgMaxService } from 'ng2-img-max';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/modules/auth/_services/auth.service';
import { ProfileUserService } from 'src/app/modules/chat-panel/services/profile-user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'aperfil',
    templateUrl: './perfil.component.html',
    styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

    imageChangedEvent: any = '';
    croppedImage: any = '';
    showCropper = false;
    avatar:any;
  
    @ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;
  
    constructor(private breadcrumbService: BreadcrumbService,
        private authService: AuthService,
        private http: HttpClient,
        private _serviceProfileUser: ProfileUserService,
        private ng2ImgMax: Ng2ImgMaxService,
        private route: Router,
        ) {
        this.breadcrumbService.setItems([
            { label: 'Pages' },
            { label: 'Empty', routerLink: ['/pages/empty'] }
        ]);
    }

    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
        this.showCropper = true;
      }
   
      imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }
    
      imageLoaded() {
        this.showCropper = true;
      }
    
      cropperReady() {}
    
      loadImageFailed() {}
    
      cropImage() {

        const Blob =  this.dataURItoBlob(this.croppedImage);
        //this.dataURItoBlob(this.croppedImage);
   
         var fd=new FormData();
         fd.append('image','profile.png');
         console.log(fd);

        this.changeAvatar(Blob);
      }

     
     dataURItoBlob(dataURI) {
       console.log(dataURI);
   
       const binary = atob(dataURI.split(',')[1]);
       const array = [];
       for (let i = 0; i < binary.length; i++) {
         array.push(binary.charCodeAt(i));
       }
       return new Blob([new Uint8Array(array)], {
         type: 'image/png'
       });
     }

      AvatarChangeUser(file:any){
        let headers = new HttpHeaders({'Authorization': 'Bearer '+ this.authService.token})
        let LINK = URL_SERVICIOS+"/profile-user";
        let formData = new FormData();
        formData.append("imagen",file,'axalta.png');
        return this.http.post(LINK,formData,{headers: headers});
      }

      changeAvatar(target: any){
      

        this._serviceProfileUser.AvatarChangeUser(target).subscribe((resp:any)=>{
          this.avatar = resp.user.usr_avatar;
          localStorage.setItem("user", JSON.stringify(resp.user));
          this.irAPaginaDestino();
        },error => {
          console.log(error);
        })
      }

      irAPaginaDestino() {
        location.reload();
      }
}
