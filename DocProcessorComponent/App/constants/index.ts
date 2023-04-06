export const GENERATE_REPORT_STEPS = [
    {
        name: 'Upload Report'
    },
    {
        name: 'Customize Chart'
    },
    {
        name: 'Generate Numbers'
    },
    {
        name: 'Preview Report'
    },
    {
        name: 'Save & Export'
    }
]

export const FONT_WEIGHTS = ["normal", "bold", "bolder", "lighter"]
export const ALIGN_TYPES = ["left", "center", "right"]
export const AXIS_TYPES = ["category", "value"]
export const LINE_TYPES = ["solid", "dashed", "dotted"]

export const EChartTypes = [
    {
        label: "Line Chart",
        value: "line"
    },
    {
        label: "Bar Chart",
        value: "bar"
    },
    {
        label: "Pie Chart",
        value: "pie"
    }
]

export const CHART_WIDTH = 700
export const CHART_HEIGHT = 500
export const CHART_PIXEL_RATIO = 0.8

export const MAMMOTH_URL = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.5.1/mammoth.browser.min.js'


export const MAMMOTH_STYLE_MAP = [
    "p[style-name='Normal'] => p",
    "p[style-name='Body Text'] => p",
    "p[style-name='Title'] => h1",
    "p[style-name='Heading 1'] => h2",
    "p[style-name='Heading 2'] => h3",
    "p[style-name='Heading 3'] => h4",
    "p[style-name='Heading 4'] => h5",
    "p[style-name='Heading 5'] => h6",
    "p[style-name='Heading 6'] => h6",
    "p[style-name='List Paragraph'] => li",
    "p[style-name='Caption'] => figcaption",
    "p[style-name='Quote'] => blockquote",
    "p[style-name='Intense Quote'] => blockquote",
    "p[style-name='Emphasis'] => em",
    "p[style-name='Strong'] => strong",
    "p[style-name^='Heading'] => span.heading",
    "r[style-name='Strong'] => strong",
    "r[style-name='Emphasis'] => em",
    "r[style-name='Code'] => code",
    "table => table",
    "p[style-name='Body Text Indent'] => blockquote",
  ];