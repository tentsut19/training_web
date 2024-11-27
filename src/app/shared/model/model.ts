export interface ApiResponse<T> {
    code?: string;
    message?: string;
    data?: T;
}

export interface Dropdown {
    id?: string | number;
    desc?: string;
}

export interface DropDownModel {
    dropdownId?: string;
    dropdownName?: string;
    propOne?: string;
    propTwo?: string;
}

//Device Model
export interface Device {
    id?: string | number;
    imei?: string;
    name?: string;
    description?: string;
    is_active?: Boolean | number;
    agency_id?: string | number;
    //updateDate?: any;
}

export interface DeviceSummaryInfo {
    limit?: number;
    active?: number;
    inactive?: number;
}