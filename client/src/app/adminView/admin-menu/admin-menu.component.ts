import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css'],
})
export class AdminMenuComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  openFreeViewForm() {
    this.router.navigate(['freegen'], {relativeTo: this.route});
  }

  openSimpleViewForm() {
    this.router.navigate(['simplegen'], {relativeTo: this.route});
  }
  closeSimpleViewForm() {
    this.router.navigate([''], {relativeTo: this.route});
  }

}
