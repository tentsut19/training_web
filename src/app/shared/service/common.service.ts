import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Constant } from '../constant';
import { ApiResponse, DropDownModel, Dropdown } from '../model/model';

var jsonResponse: any;
@Injectable({
  providedIn: 'root'
})
export class CommonService {
  personnel;
  constructor(private http: HttpClient, private constant: Constant) { 
    
  }

  getDateTh(date){
    //console.log(date);
    let dateTh = new Date(date);
    var dd = dateTh.getDate();
    var mm = dateTh.getMonth() + 1; //January is 0!
    var yyyy = dateTh.getFullYear();

    let month = "";
    let day = "";
    if (dd < 10) {
      day = "0" + dd;
    } else {
      day = "" + dd;
    }
    if (mm < 10) {
      month = "0" + mm;
    } else {
      month = "" + mm;
    }

    var startTime =
        (dateTh.getHours() < 10
        ? "0" + dateTh.getHours()
        : dateTh.getHours()) +
        "." +
        (dateTh.getMinutes() < 10
        ? "0" + dateTh.getMinutes()
        : dateTh.getMinutes());

    var convertDateTh = day + " " + this.convertMonthTH(month) + " " + (Number(yyyy) + 543) + " " + startTime + " น."
    return convertDateTh;
  }

  getDateThNotimeDDMMYYYY(date){
    if(date == "" || date == null){
      return "";
    } 
    date = date.replaceAll("-","");
    console.log(date);
    let dateTh = new Date(date);
    var dd = dateTh.getDate();
    var mm = dateTh.getMonth() + 1; //January is 0!
    var yyyy = dateTh.getFullYear(); 
    let month = "";
    let day = "";
    if (dd < 10) {
      day = "0" + dd;
    } else {
      day = "" + dd;
    }
    if (mm < 10) {
      month = "0" + mm;
    } else {
      month = "" + mm;
    }
    console.log(month);
    var convertDateTh = day + " " + this.convertMonthTH(month) + " " + (Number(yyyy) + 543);
    return convertDateTh;
  }

  getDateThNotimeDDMMYYYY2(date){
    if(date == "" || date == null){
      return "";
    } 
    console.log(date);
    let dateSplit = date.split("-");
    //console.log(dateSplit);
    var yyyy = dateSplit[2]; 
    let month = dateSplit[1];
    let day = dateSplit[0];
    var convertDateTh = day + " " + this.convertMonthTH(month) + " " + (Number(yyyy) + 543);
    return convertDateTh;
  }

  getDateThNotimeYYYYMMDD2(date){
    if(date == "" || date == null){
      return "";
    } 
    // console.log(date);
    let dateTimeSplit = date.split(" ");
    let dateSplit = dateTimeSplit[0].split("-");
    //console.log(dateSplit);
    var yyyy = dateSplit[0]; 
    let month = dateSplit[1];
    let day = dateSplit[2];
    var convertDateTh = day + " " + this.convertMonthTH(month) + " " + (Number(yyyy) + 543);
    return convertDateTh;
  }

  getDateTimeThYYYYMMDD2(date){
    if(date == "" || date == null){
      return "";
    } 
    // console.log(date);
    let dateTimeSplit = date.split(" ");
    let dateSplit = dateTimeSplit[0].split("-");
    //console.log(dateSplit);
    var yyyy = dateSplit[0]; 
    let month = dateSplit[1];
    let day = dateSplit[2];
    var convertDateTh = day + " " + this.convertMonthTH(month) + " " + (Number(yyyy) + 543) + " " +dateTimeSplit[1].slice(0, 5);
    return convertDateTh;
  }

  convertStringDateTimeToDate(originalStringDate){
    // const originalStringDate = "2025-05-03 00:55:18";
    const date = new Date(originalStringDate);
    
    // แปลงเป็น yyyy-mm-dd ด้วยการจัดรูปแบบเอง
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    
    const formattedDate = `${yyyy}-${mm}-${dd}`;
    console.log(formattedDate); // "2025-05-03"
    return formattedDate;
  }

  convertDateToStrng(date){
    //console.log(date);
    let dateTh = new Date();
    if(date){
      dateTh = new Date(date);
    }
    
    var dd = dateTh.getDate();
    var mm = dateTh.getMonth() + 1; //January is 0!
    var yyyy = dateTh.getFullYear();

    let month = "";
    let day = "";
    if (dd < 10) {
      day = "0" + dd;
    } else {
      day = "" + dd;
    }
    if (mm < 10) {
      month = "0" + mm;
    } else {
      month = "" + mm;
    }

    var startTime =
        (dateTh.getHours() < 10
        ? "0" + dateTh.getHours()
        : dateTh.getHours()) +
        "." +
        (dateTh.getMinutes() < 10
        ? "0" + dateTh.getMinutes()
        : dateTh.getMinutes());

    var convertDateTh = yyyy + "-" + month + "-" +day;
    return convertDateTh;
  }

  convertDateToStrngDDMMYYYY(date){
    console.log(date);
    let dateCurrent = new Date();
    if(date){
      dateCurrent = new Date(date);
    }
    
    var dd = dateCurrent.getDate();
    var mm = dateCurrent.getMonth() + 1; //January is 0!
    var yyyy = dateCurrent.getFullYear();

    let month = "";
    let day = "";
    if (dd < 10) {
      day = "0" + dd;
    } else {
      day = "" + dd;
    }
    if (mm < 10) {
      month = "0" + mm;
    } else {
      month = "" + mm;
    }

    var startTime =
        (dateCurrent.getHours() < 10
        ? "0" + dateCurrent.getHours()
        : dateCurrent.getHours()) +
        "." +
        (dateCurrent.getMinutes() < 10
        ? "0" + dateCurrent.getMinutes()
        : dateCurrent.getMinutes());

    return day + "-" + month + "-" +yyyy;
  }
  
  convertMonthTH(m) {
    var month = "";
    if ("01" == m) {
      month = "มกราคม";
    } else if ("02" == m) {
      month = "กุมภาพันธ์";
    } else if ("03" == m) {
      month = "มีนาคม";
    } else if ("04" == m) {
      month = "เมษายน";
    } else if ("05" == m) {
      month = "พฤษภาคม";
    } else if ("06" == m) {
      month = "มิถุนายน";
    } else if ("07" == m) {
      month = "กรกฎาคม";
    } else if ("08" == m) {
      month = "สิงหาคม";
    } else if ("09" == m) {
      month = "กันยายน";
    } else if ("10" == m) {
      month = "ตุลาคม";
    } else if ("11" == m) {
      month = "พฤศจิกายน";
    } else if ("12" == m) {
      month = "ธันวาคม";
    }
    return month;
  }

  convertAddressToAddressDisplay(address){
    let addressDisplay = "";
    if(address != null){
      if(address.detail != null && address.detail != ""){
        addressDisplay = addressDisplay + address.detail + " ";
      }
      if(address.subdistrict != null && address.subdistrict != ""){
        addressDisplay = addressDisplay + "ตำบล" + address.subdistrict + " ";
      }
      if(address.district != null && address.district != ""){
        addressDisplay = addressDisplay + "อำเภอ" + address.district + " ";
      }
      if(address.province != null && address.province != ""){
        addressDisplay = addressDisplay + "จังหวัด" + address.province + " ";
      }
      if(address.postcode != null && address.postcode != ""){
        addressDisplay = addressDisplay + address.postcode;
      }
    }
    return addressDisplay;
  }

  getDayList(){
    let dayList = [];
    dayList.push('');
    for(let i=1;i<=31;i++){
      if(i<10){
        dayList.push('0'+i);
      }else{
        dayList.push(i+'');
      }
    }
    return dayList;
  }

  getDayDetailList(){
    let dayList = [];
    var day = {'key':'','description':'ไม่ระบุ'};
    dayList.push(day);
    for(let i=1;i<=31;i++){
      if(i<10){
        day = {'key':'0'+i,'description':'0'+i};
        dayList.push(day);
      }else{
        day = {'key':i+'','description':i+''};
        dayList.push(day);
      }
    }
    return dayList;
  }

  getYearDetailList(){
    let yearList = [];
    var year = {'key':'','description':'ไม่ระบุ'};
    yearList.push(year);

    let date = new Date();
    let currentYear = date.getFullYear();

    for(let i=0;i<100;i++){
      year = {'key':((currentYear + 543) - i)+'','description':((currentYear + 543) - i)+''};
      yearList.push(year);
    }
    return yearList;
  }

  getMonthList(){
    return [
      {'key':'','description':'ไม่ระบุ'},
      {'key':'01','description':'มกราคม'},
      {'key':'02','description':'กุมภาพันธ์'},
      {'key':'03','description':'มีนาคม'},
      {'key':'04','description':'เมษายน'},
      {'key':'05','description':'พฤษภาคม'},
      {'key':'06','description':'มิถุนายน'},
      {'key':'07','description':'กรกฎาคม'},
      {'key':'08','description':'สิงหาคม'},
      {'key':'09','description':'กันยายน'},
      {'key':'10','description':'ตุลาคม'},
      {'key':'11','description':'พฤศจิกายน'},
      {'key':'12','description':'ธันวาคม'}
    ];
  }

  getMonthListDefault(){
    return [
      {'key':'','description':'--- เลือกเดือน ---'},
      {'key':'01','description':'มกราคม'},
      {'key':'02','description':'กุมภาพันธ์'},
      {'key':'03','description':'มีนาคม'},
      {'key':'04','description':'เมษายน'},
      {'key':'05','description':'พฤษภาคม'},
      {'key':'06','description':'มิถุนายน'},
      {'key':'07','description':'กรกฎาคม'},
      {'key':'08','description':'สิงหาคม'},
      {'key':'09','description':'กันยายน'},
      {'key':'10','description':'ตุลาคม'},
      {'key':'11','description':'พฤศจิกายน'},
      {'key':'12','description':'ธันวาคม'}
    ];
  }
 
  getYearAdList(){
    let yearList = [];
    let date = new Date();
    let currentYear = date.getFullYear();
    yearList.push('');
    for(let i=0;i<100;i++){
      yearList.push((currentYear + 543) - i);
    }
    return yearList;
  }

  getYearDetailExpredList(){
    let yearList = [];
    var year = {'key':'','description':'ไม่ระบุ'};
    yearList.push(year);
    let date = new Date();
    let currentYear = date.getFullYear();

    for(let i=30;i>=1;i--){
      year = {'key':((currentYear + 543) + i)+'','description':((currentYear + 543) + i)+''};
      yearList.push(year);
    }

    for(let i=0;i<=5;i++){
      year = {'key':((currentYear + 543) - i)+'','description':((currentYear + 543) - i)+''};
      yearList.push(year);
    } 
    return yearList;
  }

  getYearAdExpredList(){
    let yearList = [];
    let date = new Date();
    let currentYear = date.getFullYear();

    for(let i=30;i>=1;i--){
      yearList.push((currentYear + 543) + i);
    }

    for(let i=0;i<=5;i++){
      yearList.push((currentYear + 543) - i);
    } 
    return yearList;
  }

  getYearList(){
    let yearList = [];
    let date = new Date();
    let currentYear = date.getFullYear();
    for(let i=0;i<100;i++){
      let year = {};
      year["th"] = (currentYear + 543) - i;
      year["en"] = (currentYear) - i;
      yearList.push(year);
    }
    return yearList;
  }

  getYearNewList(){
    let yearList = [];
    let date = new Date();
    let currentYear = date.getFullYear()+1;
    for(let i=0;i<100;i++){
      let year = {};
      year["th"] = (currentYear + 543) - i;
      year["en"] = (currentYear) - i;
      yearList.push(year);
    }
    return yearList;
  }

  getHourList(){
    let hourList = [];
    for(let i=0;i<=23;i++){
      if(i<10){
        hourList.push('0'+i);
      }else{
        hourList.push(i+'');
      }
    }
    return hourList;
  }

  getMinList(){
    let minList = [];
    for(let i=0;i<=59;i++){
      if(i<10){
        minList.push('0'+i);
      }else{
        minList.push(i+'');
      }
    }
    return minList;
  }

  generateYearList(){
    let yearList = [];
    let currentYear = new Date().getFullYear();
    currentYear = currentYear - 1;
    //console.log('currentYear : ' + currentYear);
    //generate next 3 year
    for(let i=0;i<5;i++){
      let year = 
      {
        'enYear':currentYear+i,
        'thYear':(currentYear+i) + 543
      };
      yearList.push(year);
    }
    return yearList;
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

  public isResHasData = (res: ApiResponse<any>): boolean =>
    res && res.code === '00' && res.data;

   public isResHasData_V2 = (res: any): boolean =>
    res && res.code === 'success' && res.data;


  public mapDropDown(res: ApiResponse<DropDownModel[]>, keyName: string, valueName: string): Dropdown[] {
    if (this.isResHasData(res)) {
      return res.data.map((data) => ({
        id: data[keyName],
        desc: data[valueName],
      }));
    }
    return [];
  }

  public mapDropDown_V2(datas, keyName: string, valueName: string): Dropdown[] {
    if(datas){
      return datas.map((data) => ({
        id: data[keyName],
        desc: data[valueName],
      }));
    }
    return [];
  }
 
}