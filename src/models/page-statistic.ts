export interface PageStatistic {
    id: string;
    name?: string;
    views?: number;
    visitor?: Visitor[];
}


export interface Visitor {
    asn: {
        asn: string;
        domain: null | string;
        name: string;
        route: string;
        type: string;
    };
    browser: string;
    calling_code: string;
    city: string;
    continent_code: string;
    continent_name: string;
    count: string;
    country_code: string;
    country_name: string;
    currency: {
        code: string;
        name: string;
        native: string;
        plural: string;
        symbol: string;
    };
    date: {
        nanoseconds: number;
        seconds: number;
    };
    device: string;
    emoji_flag: string;
    emoji_unicode: string;
    flag: string;
    ip: string;
    is_eu: boolean;
    languages: Language[];
    latitude: number;
    longitude: number;
    operating_system: string;
    postal: string;
    region: string;
    region_code: string;
    region_type: string;
    threat: {
        // TODO: Check this type
        blocklist: string[];
        is_anonymous: boolean;
        is_bogon: boolean;
        is_data_center: boolean;
        is_cloud_relay: boolean;
        is_known_abuser: boolean;
        is_known_attacker: boolean;
        is_proxy: boolean;
        is_threat: boolean;
        is_tor: boolean;
    };
    time_zone: {
        abbr: string;
        current_time: string;
        is_dst: boolean;
        name: string;
        offset: string;
    };
}

interface Language {
    code: string;
    name: string;
    native: string;
}
