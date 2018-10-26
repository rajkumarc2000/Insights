import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NavItem } from '@insights/common/nav-item';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HomeComponent } from '@insights/app/home/home.component';

@Component({
  selector: 'app-menu-list-item',
  templateUrl: './menu-list-item.component.html',
  styleUrls: ['../home/home.component.css'],
  animations: [
    trigger('indicatorRotate', [
      state('collapsed', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class MenuListItemComponent {
  expanded: boolean;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: NavItem;
  @Input() depth: number;
  @Input() isExpanded: boolean = false;
  @Input() selectedOrg:String;

  constructor(public router: Router, private homeController: HomeComponent) {
    if (this.depth === undefined) {
      this.depth = 0;
    }
  }

  onItemSelected(item: NavItem) {
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }else if (!item.children || !item.children.length) {
      this.homeController.onItemSelected(item);
    }
  }
}
