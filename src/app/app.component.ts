import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  trainingData = null;

  ngOnInit() {
    this.trainingData = localStorage.getItem('trainingData');
    if(!this.trainingData){
      localStorage.clear();
      return;
    }
  }
}
