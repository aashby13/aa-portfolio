export interface ProjectTypeData {
  id: string;
  text: string;
}

export interface ProjectRoleData {
  id: string;
  me: string;
  company: string;
}

export interface ProjectData {
  id: string;
  name: string;
  type: ProjectTypeData | string;
  role: string;
  image: string;
  info: string;
  index: number;
}

export interface TypesData {
  [key: string]: ProjectTypeData;
}

export interface ProjectJsonData {
  projects: Array<ProjectData>;
  roles: Array<ProjectRoleData>;
  types: Array<ProjectTypeData>;
}

export interface ScrollData {
  curScroll: number;
  prevScroll: number;
  curVel: number;
  prevVel: number;
  count: number;
}

export interface ScrollImageItemData {
  id: string;
  index: number;
}

export interface DotNavItemData {
  path: string;
}

export interface ResolveFilter {
  type: 'key' | 'value' | 'index';
  match: any;
}

export interface ResolveMapKeys {
  0: string;
  1: string;
}
