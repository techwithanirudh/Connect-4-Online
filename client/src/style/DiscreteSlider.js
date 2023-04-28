import * as React from "react";
import Box from "@mui/material/Box";
import Slider from "./Slider";

function valuetext(value) {
    return value;
}

const marks = [
    {
        value: 1,
        label: "Easy",
    },
    {
        value: 2,
        label: "Medium",
    },
    {
        value: 3,
        label: "Hard",
    },
];

const DiscreteSlider = (props) => {
    const handleDifficultyChange = props.handleDifficultyChange;

    return (
        <Box sx={{ width: 150, pt: 0, marginRight: '16px!important', marginBottom: '16px!important' }}>
            <Slider
                aria-label='Difficulty'
                defaultValue={2}
                getAriaValueText={valuetext}
                step={1}
                marks={marks}
                min={1}
                max={3}
                valueLabelDisplay='off'
                onChange={(e, val) => {
                    handleDifficultyChange(val);
                }}
            />
        </Box>
    );
};

export default DiscreteSlider;
