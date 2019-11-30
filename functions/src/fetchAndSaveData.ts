import axios from 'axios';
import { BigQuery } from '@google-cloud/bigquery'
const bigquery = new BigQuery();

import { bayWheelsstationInfo } from './baywheels_station_info';

interface OriginalStationInfo {
    name: string;
    station_id: string;
    capacity: number;
    lat: number;
    lon: number;
}

interface FilteredStationInfo {
    id: number;
    lat: number;
    lng: number;
    capacity: number;
    address: string;
}

const originalBayWheelsStationInfoList: OriginalStationInfo[] = bayWheelsstationInfo.data.stations;

interface OriginalStationStatus {
    station_id: string;
    num_bikes_available: number;
    num_ebikes_available: number;
}

interface FilteredStationStatus {
    date: number;
    bikes_available: number;
    station_id: number
}

interface MergedStatus {
    address: string;
    bikes_available: number;
    day_of_week: number;
    time_in_minutes: number
}

const getStatusInfo = (date: number) => ({ station_id, num_bikes_available, num_ebikes_available }: OriginalStationStatus): FilteredStationStatus => {
    return { station_id: parseInt(station_id), bikes_available: num_bikes_available + num_ebikes_available, date }; 
};
const filterStationInfo = ({ station_id, lat, lon, capacity, name }: OriginalStationInfo): FilteredStationInfo  => {
    return { id: parseInt(station_id), lat, lng: lon, capacity, address: name }
}
const filteredStationInfoList = originalBayWheelsStationInfoList.map(filterStationInfo);

const totalMinutesAfterMidnight = (hours: number, minutes: number) => {
    return (hours * 60) + minutes;
}

const mergeInfoAndStatus = (
    filteredInfo: FilteredStationInfo, 
    filteredStatus: FilteredStationStatus): MergedStatus => {
    const merged = {
        address: filteredInfo.address,
        day_of_week: new Date().getUTCDay(),
        time_in_minutes: totalMinutesAfterMidnight(new Date().getUTCHours(), new Date().getUTCMinutes()),
        bikes_available: filteredStatus.bikes_available
    }
    return merged
}

const mergeInfoListAndStatusList = (
    infoList: FilteredStationInfo[], 
    statusList: FilteredStationStatus[]): (MergedStatus | null)[] => {
        return infoList.map((station) => {
            const statusForId: FilteredStationStatus | undefined = statusList
                        .find(status => status.station_id === station.id);
            return statusForId ? mergeInfoAndStatus(station, statusForId) : null;
        }).filter(status => status !== null);
}

const saveToBigQuery = async (objects: any[]) => {
    return bigquery
      .dataset('bikeshare')
      .table('station_status')
      .insert(objects);
}


const fetchData = async () => {
    const response = await axios.get('https://gbfs.baywheels.com/gbfs/en/station_status.json');
    const originalStationStatus = response.data.data.stations as OriginalStationStatus[];
    const lastUpdated = response.data.last_updated;
    const filteredStatusList: FilteredStationStatus[] = originalStationStatus.map(getStatusInfo(lastUpdated))

    const merged = mergeInfoListAndStatusList(filteredStationInfoList, filteredStatusList);
    return merged;
};

export const fetchAndSaveToBigQuery = async () => {
    const data = await fetchData();
    return saveToBigQuery(data);
}