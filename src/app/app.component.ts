import { Component } from '@angular/core';
import { ConsoleToggleService } from './services/log/ConsoleToggleService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'tis-web';
  tisToken = null;

  constructor(private consoleToggleService: ConsoleToggleService,) {
    this.consoleToggleService.disableConsoleInProduction();
  }

  ngOnInit() {
    this.tisToken = JSON.parse(localStorage.getItem('tisToken'));
    console.log(this.tisToken);
    if(!this.tisToken){
      localStorage.clear();
      return;
    }
  }
  
}
