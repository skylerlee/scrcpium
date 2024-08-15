import * as React from 'react';
import { type ChangeEvent, useContext } from 'react';
import useAxios from 'axios-hooks';
import { AppContext } from '../store';
import { IDeviceInfo } from '../types';

export const ControlPanel = () => {
  const [{ loading, data = [] }] = useAxios<IDeviceInfo[]>('/devices/');
  const { serial, setSerial } = useContext(AppContext);

  const handleDeviceSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      setSerial(e.target.value);
    }
  };

  return (
    <div>
      <div className="flex">
        <select
          className="select select-sm select-bordered w-auto"
          disabled={!!serial}
          value={serial}
          onChange={handleDeviceSelect}
        >
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
