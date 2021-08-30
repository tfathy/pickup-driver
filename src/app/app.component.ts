import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LangService } from './services/lang.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit{
  appDirection ='rtl' ;
  lang = 'ar';
  constructor(private langService: LangService, private router: Router) {}
  ngOnInit(): void {
    this.langService.getDefaultLanguage().then(result=>{
      this.appDirection = result.appDirection;
      this.lang = result.lang;
    });

  }

  onLogOut() {
    this.router.navigate(['/', 'login']);
  }
}
