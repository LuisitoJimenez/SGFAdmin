export interface ModuleModel {
  name: string;
  link: string;
  icon: string;
  alt: string;
  submenus: SubMenuModel[];
}

export interface SubMenuModel {
  name: string;
  link: string;
  icon: string;
  alt: string;
}
