import { Component, OnInit } from '@angular/core';
declare var jquery: any;
declare var $: any;
declare var Swal: any;
import { CompanyService } from 'src/app/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterDataService } from 'src/app/shared/service/masterData.service';

@Component({
  selector: 'app-logoSignature',
  templateUrl: './logoSignature.component.html',
  styleUrls: ['./logoSignature.component.css']
})
export class LogoSignatureComponent implements OnInit {  

  //Hr
  fileUploadSignHrObj: any;
  imageSignHrUrl:any = 'https://comvisitor-uat-bucket.s3.ap-southeast-1.amazonaws.com/tis/%E0%B8%88%E0%B8%AD%E0%B8%A2.png';
  //Logo
  fileUploadLogoObj: any;
  imageLogoUrl:any = 'https://comvisitor-uat-bucket.s3.ap-southeast-1.amazonaws.com/images/logo/Logo%E0%B8%90%E0%B8%B2%E0%B8%99%E0%B8%82%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B9%E0%B8%A5.jpg';
  //Finance
  fileUploadSignFnObj: any;
  imageSignFnUrl: any = 'https://comvisitor-uat-bucket.s3.ap-southeast-1.amazonaws.com/tis/images/signature.png';

  constructor(private masterDataService: MasterDataService,
    private fb: FormBuilder,) {  
   }

  ngOnInit() { 

  } 

  onFileChanged(event,type) {
    this.preview(event.target.files,type);
    //this.photoList[position]['file'] = this.dataURLtoFile(this.photoList[position]['pathUrl'],position+'.jpg');
  }

  preview(files,type) {
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      //this.message1 = "Only images are supported.";
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]); 
    if(type == '0'){ //sign hr
      reader.onload = (_event) => { 
        console.log(files[0])
        this.fileUploadSignHrObj = {
          oldFileName: files[0].name,
          pathUrl: reader.result,
          file: this.dataURLtoFile(reader.result,'sign_hr.jpg')
        }
        this.imageSignHrUrl = reader.result;
        console.log(this.fileUploadSignHrObj);
      }
    }else if(type == '1'){ //logo
      reader.onload = (_event) => { 
        console.log(files[0])
        this.fileUploadLogoObj = {
          oldFileName: files[0].name,
          pathUrl: reader.result,
          file: this.dataURLtoFile(reader.result,'logo.jpg')
        }
        this.imageLogoUrl = reader.result;
        console.log(this.fileUploadLogoObj);
      }
    }else if(type == '2'){ //sign finance
      reader.onload = (_event) => { 
        console.log(files[0])
        this.fileUploadSignFnObj = {
          oldFileName: files[0].name,
          pathUrl: reader.result,
          file: this.dataURLtoFile(reader.result,'sign_fn.jpg')
        }
        this.imageSignFnUrl = reader.result;
        console.log(this.fileUploadSignFnObj);
      }
    } 
}

dataURLtoFile(dataurl, filename) {
  try {
    //console.log(dataurl);
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
  }
  catch(err) {
    console.log(err);
    // document.getElementById("demo").innerHTML = err.message;
  }
  return new File([u8arr], filename, {type:mime});
}
 
  successDialog(){
    Swal.fire("ทำรายการสำเร็จ!", "", "success");
  }

  failDialog(msg){
    Swal.fire({
      type: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: msg
    })
  }

}
