import { Book, Circle, Home, Settings, Users } from "lucide-react";

export type MenuItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
};

export const menuItems: MenuItem[] = [
  {
    label: "控制面板",
    href: "/dash",
    icon: <Home className="h-5 w-5 shrink-0" />,
  },
  {
    label: "题库管理",
    href: "/q",
    icon: <Book className="h-5 w-5 shrink-0" />,
    children: [
      {
        label: "题目列表",
        href: "/q/questions",
        icon: <Circle className="h-2 w-2 fill-current" />,
      },
      {
        label: "试卷列表",
        href: "/q/papers",
        icon: <Circle className="h-2 w-2 fill-current" />,
      },
    ],
  },
  {
    label: "用户管理",
    href: "/users",
    icon: <Users className="h-5 w-5 shrink-0" />,
  },
  {
    label: "设置",
    href: "/settings",
    icon: <Settings className="h-5 w-5 shrink-0" />,
    children: [
      {
        label: "个人信息",
        href: "/settings/profile",
        icon: <Circle className="h-2 w-2 fill-current" />,
      },
    ],
  },
];
