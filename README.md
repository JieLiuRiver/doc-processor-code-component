## Doc Processor Code Component
This is a code component that processes doc documents and provides the following features:

- Configures [charts](https://echarts.apache.org/zh/index.html)
- Replaces variables `{variable}` in the doc document with corresponding text
- Replaces placeholders for charts `{%chartA}` in the doc document with corresponding chart images.

For more detailed information about this code component, please refer to the `code component` documentation of `PowerApps`

### Demo
<video width="640" controls>
    <source id="mp4" type="video/mp4" src="./docs/usage_xjZOqnCc.mp4" >
</video>

### Setup
To set up this code component, follow these steps:

Install the required dependencies by running `npm install`.
Start the development server by running `npm run start`.

### Docs file
There are two files located in the `docs/` directory: one is a `docx` file for testing document upload, and the other is an `xlsx` file containing custom chart images.

### Build

To build this code component, follow these steps:

- In the root directory, run `npm run build && pac pcf push --publisher-prefix yourprefixname` to build and publish the code component in development mode.
- In the `DocProcessorComponent/` directory, run `dotnet msbuild /t:Build /p:Configuration=Release` to build the code component for production.
  

Please note that building the code component for production requires running a command in a specific directory.