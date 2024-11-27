import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable()
export class ConfirmationGuard implements CanDeactivate<any> {
  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return confirm('คุณแน่ใจหรือไม่ว่าต้องการออกจากหน้านี้?\nอย่าลืมกดบันทึกก่อนออกจากหน้านี้');
  }
}
