For /f "delims=." %%A in (
    'wmic os get LocalDateTime^|findstr ^^20'
) Do Set DT=%%A
Set "TIMESTAMP=%DT:~0,4%/%DT:~4,2%/%DT:~6,2%/%DT:~8,2%/%DT:~10,2%/%DT:~12,2%"
npm publish --tag=%TIMESTAMP%