import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css'],
})
export class AdminMenuComponent implements OnInit {

  public constructor(private router: Router, private route: ActivatedRoute) {
  }

  public ngOnInit() {
  }

  public openFreeViewForm() {
    this.router.navigate(['freegen'], {relativeTo: this.route});
  }

  public openSimpleViewForm() {
    this.router.navigate(['simplegen'], {relativeTo: this.route});
  }

}
