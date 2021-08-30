import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from 'src/app/services/lang.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  constructor(private router: Router,public langService: LangService) { }

  ngOnInit() {
  }
  change2Arabic() {
    this.langService.change2Arabic();
   }
   change2English() {
   this.langService.change2English();
   }
   logout(){

   }

}
