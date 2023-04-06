### Related Technologies


### Build

For development
```
# 1 root directory
npm run build &&  pac pcf push --publisher-prefix bode 
```

For production
```
# 1 root directory
npm run build -- --buildMode production


# 2 DocProcessorComponent/ directory
dotnet msbuild /t:Build /p:Configuration=Release
```