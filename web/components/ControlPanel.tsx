import * as React from 'react';
import type { ChangeEvent } from 'react';
import useAxios from 'axios-hooks';
import { IDeviceInfo } from '../types';

export const ControlPanel = () => {
  const [{ loading, data = [] }] = useAxios<IDeviceInfo[]>('/devices/');

  const handleDeviceSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
  };

  return (
    <div>
      <div className="flex">
        <select className="select select-sm select-bordered w-auto" onChange={handleDeviceSelect}>
          <option disabled selected>
            Select the device
          </option>
          {data.map((device) => (
            <option
              key={device.serial}
              value={device.serial}
            >{`${device.serial} (${device.state})`}</option>
          ))}
        </select>
        {loading ? <span className="loading loading-spinner loading-sm ml-1" /> : null}
      </div>
    </div>
  );
};
