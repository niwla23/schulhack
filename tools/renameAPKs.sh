read -p "Version Name (format: major.minor.patch): " SCHULHACK_VERSION 
rename app schulhack_v${SCHULHACK_VERSION} *.apk
rename '-release' '_release' *.apk