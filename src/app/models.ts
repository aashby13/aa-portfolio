export interface ProjectTypeData {
  id: string;
  text: string;
}

export interface ProjectRoleData {
  id: string;
  me: string;
  company: string;
}

export interface ProjectMoreData {
  class: string;
  video: string;
  desc: string;
}

export interface ProjectInfoData {
  title: string;
  strings?: string[];
  numbers?: number[];
}

export interface ProjectData {
  id: string;
  index: number;
  name: string;
  type: ProjectTypeData | string;
  role: string;
  info: ProjectInfoData[];
  more: ProjectMoreData;
}

export interface TypesData {
  [key: string]: ProjectTypeData;
}

export interface ProjectJsonData {
  projects: ProjectData[];
  roles: ProjectRoleData[];
  types: ProjectTypeData[];
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
