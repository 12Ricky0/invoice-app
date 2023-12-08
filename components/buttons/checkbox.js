
export default function Checkbox({ onChange, value }) {
    return (
        <div className="">
            <label className="group flex items-center cursor-pointer">
                <input id="myCheckbox" value={value} onChange={onChange} className="opacity-0 h-0 w-0 absolute cursor-pointer checked:bg-blue-500" type="checkbox" />
                <span className={`checkmark w-4 h-4 relative rounded-[3px] inline-block dark:bg-primary-very-dark-blue bg-secondary-light-greyish-blue hover:border border-primary-violet opacity-[1]`}></span>
            </label>
        </div>
    )
}