import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Calendar,
  LogOut,
  Users,
  Settings,
  UserCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const studentMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Subjects", url: "/subjects", icon: BookOpen },
  { title: "My Grades", url: "/grades", icon: GraduationCap },
  { title: "My Attendance", url: "/attendance", icon: Calendar },
];

const teacherAdminMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Students", url: "/students", icon: Users },
  { title: "Subjects", url: "/subjects", icon: BookOpen },
  { title: "Attendance Management", url: "/attendance-management", icon: UserCheck },
  { title: "Grade Management", url: "/grade-management", icon: GraduationCap },
];

const adminMenuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Students", url: "/students", icon: Users },
  { title: "Teachers", url: "/teachers", icon: UserCheck },
  { title: "Subjects", url: "/subjects", icon: BookOpen },
  { title: "Attendance Management", url: "/attendance-management", icon: UserCheck },
  { title: "Grade Management", url: "/grade-management", icon: GraduationCap },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const collapsed = state === "collapsed";

  const isActive = (path) => currentPath === path;
  const getNavCls = ({ isActive }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" : "hover:bg-accent";

  const menuItems = user?.role === 'student' 
    ? studentMenuItems 
    : user?.role === 'admin' 
    ? adminMenuItems 
    : teacherAdminMenuItems;

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">StudentTracker</h2>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-3 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        {!collapsed && user && (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full justify-start text-muted-foreground hover:text-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        )}
        {collapsed && user && (
          <div className="flex flex-col items-center space-y-2">
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full justify-center text-muted-foreground hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}