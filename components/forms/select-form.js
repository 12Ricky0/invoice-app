'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';

const CustomSelect = ({ onChange, term }) => {
    const options = ['Net 1 Day', 'Net 7 Days', 'Net 14 Days', 'Net 30 Days'];
    const editValue = 'Net ' + term + ' Days'
    const [selectedOption, setSelectedOption] = useState(term ? editValue : "Net 30 Days");
    const [showOptions, setShowOptions] = useState(false);

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const selectOption = (option) => {
        setSelectedOption(option);
        toggleOptions();
        onChange(option);
    };


    return (
        <div className="h-[48px] px-4 w-[100%] mt-[9px] mb-[25px] font-bold text-[15px] text-secondary-black md:w-[240px] dark:text-white flex items-center justify-between border rounded-[4px] border-secondary-light-greyish-blue">
            <div className="select-box" >
                <span id="selected-option">{selectedOption}</span>
            </div>
            {showOptions && (
                <div className="w-[87%] md:w-[240px] mr-6 absolute -ms-4 rounded-lg mt-[280px] dark:bg-primary-dark-blue bg-white shadow-3xl dark:shadow-dark">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className=" pt-[17px] pl-6 pb-[15px] border-b border-secondary-light-greyish-blue dark:border-primary-very-dark-blue last:border-0 hover:text-primary-violet cursor-pointer"
                            onClick={() => {
                                selectOption(option)
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
            <Image
                src="/assets/icon-arrow-down.svg"
                alt="arrow down"
                width={9}
                height={4.5}
                onClick={toggleOptions}
                className={`cursor-pointer ${showOptions && 'rotate-180'}`}
            />

        </div>
    );
};

export default CustomSelect;
