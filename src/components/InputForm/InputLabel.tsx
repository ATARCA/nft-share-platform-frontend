import React from "react";

export const InputLabel = ( {label, subLabel}: { label: string, subLabel?: string}) => {

    return <div>
        <div>{label}</div> 
        {subLabel ? <div className="FormSubLabel">{subLabel}</div> : <></> }
    </div>
}
