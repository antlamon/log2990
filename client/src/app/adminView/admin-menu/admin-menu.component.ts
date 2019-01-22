import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css'],
})
export class AdminMenuComponent implements OnInit {

  isHidden: boolean;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.isHidden=false;
  }

  ngOnInit() {
  }

  openFreeViewForm() {
    this.router.navigate(['freegen'], {relativeTo: this.route});
    this.isHidden=true;
  }

  

  openSimpleViewForm() {
    this.router.navigate(['simplegen'], {relativeTo: this.route});
    this.isHidden=true;
  }
  closeSimpleViewForm() {
    this.router.navigate([''], {relativeTo: this.route});
    this.isHidden=false;
  }

}
