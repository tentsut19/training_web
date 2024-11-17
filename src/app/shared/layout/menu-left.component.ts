import { Component } from '@angular/core';
import { PermissionService } from 'src/app/shared/service';
declare var jquery: any;
declare var $: any;
@Component({
  selector: 'layout-menu-left',
  templateUrl: './menu-left.component.html'
})


export class MenuLeftComponent { 
  authenMenbarber;
  public isCustomerCollapsed = true;
  public isBranchCollapsed = true;
  public isSettingCollapsed = true;
  public isActive = true;
  public isSuperAdmin = false;
  public isAdmin3s = false;
  public isHr = false;
  public isOutsider = false;

  tisToken = null;
  constructor( 
    private permissionService :PermissionService
  ) { 
  }

  pagePermission = [
    
  ]

  ngOnInit() {
    this.tisToken = JSON.parse(localStorage.getItem('tisToken'));
    console.log(this.tisToken)

    if(this.tisToken.type && "outsider" == this.tisToken.type){
      this.isOutsider = true;
    }

    this.initUserAdmin();
    this.pagePermission = []; 
    if(this.tisToken.position){
      if(this.tisToken.position.id == 8 || this.tisToken.position.id == 9){
        this.isHr = true
      }
      if(this.tisToken.position.id == 35){
        this.isAdmin3s = true
      }
      //ภาพรวมระบบ
      let page = this.permissionService.checkPermission('100',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ตั้งค่าข้อมูลพื้นฐาน
      page = this.permissionService.checkPermission('200',this.tisToken.position.id);
      console.log(page)
      this.pagePermission.push(page.p_view);

      //ข้อมูลบริษัท
      page = this.permissionService.checkPermission('201',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ข้อมูลแผนกงาน
      page = this.permissionService.checkPermission('202',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ข้อมูลตำแหน่งงาน
      page = this.permissionService.checkPermission('203',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ตั้งค่าสิทธิ์การใช้งานระบบ
      page = this.permissionService.checkPermission('204',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ข้อมูลพื้นฐาน
      page = this.permissionService.checkPermission('205',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ปฏิทินวันหยุดนักขัตฤกษ์
      page = this.permissionService.checkPermission('206',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //บุคคลภายนอก
      page = this.permissionService.checkPermission('300',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ข้อมูลพนักงาน
      page = this.permissionService.checkPermission('400',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ระบบคลังสินค้า/บริการ
      page = this.permissionService.checkPermission('500',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ข้อมูลคลังสินค้า
      page = this.permissionService.checkPermission('501',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //หมวดหมู่สินค้า
      page = this.permissionService.checkPermission('502',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ข้อมูลรายการเบิก
      page = this.permissionService.checkPermission('503',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ระบบลูกค้าสัมพันธ์
      page = this.permissionService.checkPermission('600',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ระบบจัดการข้อมูลงาน
      page = this.permissionService.checkPermission('700',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ลงเวลาทำงาน (รปภ.)
      page = this.permissionService.checkPermission('701',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //xxxxxxxxxxx
      page = this.permissionService.checkPermission('702',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //ลงเวลาทำงาน รปภ. (พาร์ทไทม์)
      page = this.permissionService.checkPermission('703',this.tisToken.position.id);
      this.pagePermission.push(page.p_view);

      //บันทึกจ่ายเงิน รปภ. (พาร์ทไทม์)
      page = this.permissionService.checkPermission('800',this.tisToken.position.id);
      this.pagePermission.push(page.p_view); 

      //ผลปฏิบัติงาน รปภ. (พาร์ทไทม์)
      page = this.permissionService.checkPermission('801',this.tisToken.position.id);
      this.pagePermission.push(page.p_view); 

      //สลิปเงินเดือน รปภ.
      page = this.permissionService.checkPermission('802',this.tisToken.position.id);
      this.pagePermission.push(page.p_view); 

      //ตรวจสอบโอนจ่าย
      page = this.permissionService.checkPermission('900',this.tisToken.position.id);
      this.pagePermission.push(page.p_view); 

      console.log(this.pagePermission);
    }
  }

  logoutUser() {
    localStorage.clear();
    localStorage.removeItem('authenMenbarberToken');

    window.location.href = "/";
  }

  initUserAdmin(){
    console.log(this.tisToken);
  }

}
