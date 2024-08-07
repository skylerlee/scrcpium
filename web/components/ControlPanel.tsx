import * as React from 'react';
import useAxios from 'axios-hooks';
import { IDeviceInfo } from '../types';

export const ControlPanel = () => {
  const [{ loading, data = [] }] = useAxios<IDeviceInfo[]>('/devices');

  return (
    <div>
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn-sm">
          Click
        </div>
        <ul tabIndex={0} className="dropdown-content menu rounded-box shadow w-auto p-1 z-[1]">
          {data.map((device) => (
            <li key={device.serial} className="">
              <a>{`${device.serial} (${device.state})`}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
