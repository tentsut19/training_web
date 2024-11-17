import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  personnel;
  constructor(private http: HttpClient, private constant: Constant) { 
    
  }
  groupPerm1 = [4,5,21,22]
  permission = {'pageId':'000','positionId':0, p_insert:false,p_update:false,p_view:false,p_delete:false};

  checkPermission(pageId,positionId){
    //console.log(positionId);
    //ภาพรวมระบบ
    if(pageId == '100'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      } 
    }
    //ตั้งค่าข้อมูลพื้นฐาน
    else if(pageId == '200'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ข้อมูลบริษัท
    else if(pageId == '201'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ข้อมูลแผนกงาน
    else if(pageId == '202'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ข้อมูลตำแหน่งงาน
    else if(pageId == '203'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ตั้งค่าสิทธิ์การใช้งานระบบ
    else if(pageId == '204'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ข้อมูลพื้นฐาน
    else if(pageId == '205'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ปฏิทินวันหยุดนักขัตฤกษ์
    else if(pageId == '206'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //บุคคลภายนอก
    else if(pageId == '300'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ข้อมูลบุคคลภายนอก
    else if(pageId == '301'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ข้อมูลพนักงาน
    else if(pageId == '400'){ 
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ประวัติพนักงาน
    else if(pageId == '401'){
      if(positionId == 3 || positionId == 8 || positionId == 20){
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }else {
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      } 
    }
    //ระบบคลังสินค้า/บริการ
    else if(pageId == '500'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ข้อมูลคลังสินค้า
    else if(pageId == '501'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //หมวดหมู่สินค้า
    else if(pageId == '502'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ข้อมูลรายการเบิก
    else if(pageId == '503'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }

    //ระบบลูกค้าสัมพันธ์
    else if(pageId == '600'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ข้อมูลลูกค้า
    else if(pageId == '601'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }

    //ระบบจัดการข้อมูลงาน
    else if(pageId == '700'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    } 
    //ลงเวลาทำงาน (รปภ.)
    else if(pageId == '701'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ลงเวลาทำงาน รปภ. (พาร์ทไทม์)
    else if(pageId == '702'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ันทึกจ่ายเงิน รปภ. (พาร์ทไทม์)
    else if(pageId == '703'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    } 
    //ระบบรายงาน
    else if(pageId == '800'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    // ผลปฏิบัติงาน รปภ. (พาร์ทไทม์)
    else if(pageId == '801'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    } 
    //สลิปเงินเดือน รปภ.
    else if(pageId == '802'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:false,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
    //ตรวจสอบโอนจ่าย
    else if(pageId == '900'){
      if(this.checkContain(this.groupPerm1,positionId)){
        return {'pageId':pageId,'positionId':positionId, p_insert:false,p_update:false,p_view:true,p_delete:false};
      }else{
        return {'pageId':pageId,'positionId':positionId, p_insert:true,p_update:true,p_view:true,p_delete:true};
      }
    }
  }

  private checkContain(groupList,positionId){
    for(let i=0;i<groupList.length;i++){
      if(groupList[i] == positionId){
        return true;
      }
    }
    return false;
  }
 
}