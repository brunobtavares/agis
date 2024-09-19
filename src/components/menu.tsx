import { MenuItem } from 'primereact/menuitem';
import { TabMenu } from 'primereact/tabmenu';

export function CustomMenu() {
  const items: MenuItem[] = [
    {
      label: 'Home',
      icon: 'pi pi-fw pi-home',
    },
    {
      label: 'Home',
      icon: 'pi pi-fw pi-power-off',
    },
  ];

  return <TabMenu model={items} />;
}
