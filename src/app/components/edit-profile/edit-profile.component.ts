import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataHandlerService } from 'src/app/services/datahandler.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
  standalone:true,
  imports:[CommonModule,ReactiveFormsModule],
})
export class EditProfileComponent implements OnInit {
  webdata: any;
  backgroundImg: any;
  innrrImg: any;
  jsonWebdt: any;
  editProfile: any;
  userData: any;
  errMsg = '';

  constructor(private location: Location, private activeRoute: ActivatedRoute, private dataServe: DataHandlerService, private router: Router) {
  }
  ngOnInit(): void {
    let data = localStorage.getItem('userData');
    if (data) {
      this.userData = JSON.parse(data)
    }
    this.editProfile = new FormGroup({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required])
    })
    this.activeRoute.paramMap.subscribe((param: any) => {
      this.editProfile.patchValue({
        firstName: (param.get('fname') || '').trim() || '',
        lastName: (param.get('lname') || '').trim() || '',
        email: (param.get('email') || '').trim() || ''
      });
    });
    let wData = localStorage.getItem("webData")
    if (wData) {
      let d1 = JSON.parse(wData)
      this.webdata = d1;
      this.backgroundImg = this.webdata?.imageData?.headers?.[0]?.mobile_login_image;
      this.innrrImg = this.webdata?.imageData?.headers?.[0]?.logo?.replace(' ', '%20');
      this.jsonWebdt = JSON.parse(d1?.theme)
    }
  }
  updateProfile() {
    let data = {
      "userId": this.userData?.userid,
      "name": this.editProfile.value.firstName,
      "lastName": this.editProfile.value.lastName,
      'email': this.editProfile.value.email
    }
    this.dataServe.updateOwnProfileDetails(data).subscribe((res: any) => {
      if (res?.type == "success") {
        let data = localStorage.getItem('userData');
        if (data) {
          this.userData = JSON.parse(data)
          // update fields from form
          this.userData.email = this.editProfile.value.email;
          this.userData.lastName = this.editProfile.value.lastName;
          this.userData.username = this.editProfile.value.firstName;
          localStorage.setItem('userData', JSON.stringify(this.userData));
        }
        this.router.navigate(['/menu/profile'])
      } else {
        this.errMsg = res?.message;
      }
    })

  }
  goBack(): void {
    this.location.back();
  }

}
