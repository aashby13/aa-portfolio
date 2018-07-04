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
    type: ProjectTypeData;
    role: string;
    image: string;
    info: string;
    index: number;
}

export interface TypesData {
    [key: string]: ProjectTypeData;
}
