import React from 'react';
import Icon from '../Icon';
import './ToggleSwitch.scoped.scss';

type ToggleSwitchProps = React.InputHTMLAttributes<HTMLInputElement> & (
        | {
              variety?: 'regular' | 'large';
              checkedIcon?: never;
              uncheckedIcon?: never;
          }
        | {
              variety: 'icons' | 'small-icons';
              checkedIcon: React.ComponentProps<typeof Icon>['icon'];
              uncheckedIcon: React.ComponentProps<typeof Icon>['icon'];
          });

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
    children,
    className,
    variety,
    checkedIcon,
    uncheckedIcon,
    ...rest
}) => (
    <label className={`toggle  ${rest.disabled ? 'disabled' : ''}`}>
        <div
            className={`toggle-switch ${rest.checked ? 'checked' : ''} ${variety ?? 'regular'} ${
                rest.disabled ? 'disabled' : ''
            }`}>
            <span className={`state ${rest.checked ? 'checked' : ''}`} />
            <input type="checkbox" {...rest} />

            {(variety === 'icons' || variety === 'small-icons') && (
                <>
                <span className={`icon-unchecked ${rest.checked ? '' : 'activated'}`}>
                    <Icon color={rest.checked ? 'black' : 'white'} icon={uncheckedIcon!} />
                </span>
                <span className={`icon-checked ${rest.checked ? 'activated' : ''}`}>
                    <Icon color={rest.checked ? 'white' : 'black'} icon={checkedIcon!} />
                </span>
                </>
            )}
        </div>
        {children}
    </label>
);

export default ToggleSwitch;
