const size = {
    "0-5": "0.125rem",
    "1-25": "0.3125rem",
    "2-5": "0.625rem",
    "15": "3.75rem",
    "25": "6.25rem",
    "30": "7.5rem",
};

const ellipsisPlugin = (variants = []) => ({ addUtilities, config, e }) => {
    const lines = config("theme.truncate.lines");
    const keys = Object.keys(lines);
    if (!keys.length) return;
    const utilities = keys.map((key) => ({
        [`.${e(`truncate-${key}-lines`)}`]: {
            overflow: "hidden",
            display: "-webkit-box",
            "-webkit-line-clamp": lines[key],
            "-webkit-box-orient": "vertical",
        },
    }));
    addUtilities(utilities, variants);
};

module.exports = {
    theme: {
        extend: {
            lineHeight: size,
            margin: size,
            padding: size,
            width: size,
            height: size,
            inset: {
                "-15": "-3.75rem",
                "-2-5": "-0.625rem",
                "-5": "-1.25rem",
                "2-5": "0.625rem",
                "5": "1.25rem",
            },
        },
        truncate: {
            lines: {
                2: "2",
                3: "3",
                5: "5",
                8: "8",
            },
        },
    },
    variants: {},
    plugins: [ellipsisPlugin()],
};
