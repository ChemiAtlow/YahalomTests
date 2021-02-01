import React, { useState } from 'react';
import { FormField } from '.';
import { useClickOutside } from '../../hooks';
import './Autocomplete.scoped.scss';

interface AutocompleteProps
    extends Omit<React.ComponentProps<typeof FormField>, 'search' | 'onChange' | 'type'> {
    value: string;
    options: string[];
    onChange: (change: string) => void;
}

const Autocomplete: React.FC<AutocompleteProps> = ({ options, onChange, value, ...rest }) => {
    const [showOptions, setShowOptions] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
    const [activeOption, setActiveOption] = useState(0);
    const onValueChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = target;
        const filteredOptions = options.filter((opt) =>
            new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i').test(opt)
        );
        setFilteredOptions(filteredOptions);
        setShowOptions(true);
        onChange(value);
    };
    const clickOption = (selected: React.MouseEvent<HTMLLIElement> | string) => {
        setShowOptions(false);
        setFilteredOptions([]);
        setActiveOption(0);
        onChange(typeof selected === 'string' ? selected : selected.currentTarget.innerText);
    };
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter') {
            clickOption(filteredOptions[activeOption]);
        } else if (e.code === 'ArrowUp') {
            setActiveOption(activeOption !== 0 ? activeOption - 1 : filteredOptions.length - 1);
        } else if (e.code === 'ArrowDown') {
            setActiveOption(activeOption !== filteredOptions.length - 1 ? activeOption + 1 : 0);
        }
    };
    const optionsRef = useClickOutside<HTMLDivElement>({
        callback: () => setShowOptions(false),
        activate: showOptions,
    });
    return (
        <div className="autocomplete" ref={optionsRef}>
            <FormField
                {...rest}
                onKeyDown={onKeyDown}
                onChange={onValueChange}
                value={value}
                type="text"
                search
                blockErrors
            />
            {showOptions && value && (
                <ul className="autocomplete-options">
                    {filteredOptions.length ? (
                        filteredOptions.map((optionName, index) => {
                            return (
                                <li
                                    className={`autocomplete-options__item ${
                                        index === activeOption ? 'active' : ''
                                    }`}
                                    key={optionName}
                                    onClick={clickOption}>
                                    {optionName}
                                </li>
                            );
                        })
                    ) : (
                        <li className="autocomplete-options__item empty">
                            No suggestion found
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default Autocomplete;
