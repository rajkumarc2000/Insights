export class NavItem {
  displayName: string;
  disabled?: boolean;
  iconName: string;
  route?: string;
  children?: NavItem[];
  isToolbarDisplay?:boolean=true;
  showIcon?:boolean=false;
}
