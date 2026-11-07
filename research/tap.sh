#!/bin/zsh
# usage: tap.sh "Exact label"  - taps the element whose text or content-desc matches exactly
adb shell uiautomator dump /sdcard/ui.xml >/dev/null
b=$(adb shell cat /sdcard/ui.xml | grep -o "<node [^>]*\(text\|content-desc\)=\"$1\"[^>]*>" | head -1 | grep -o 'bounds="[^"]*"' | grep -o '[0-9]\+')
[[ -z $b ]] && { echo "not found: $1"; exit 1; }
a=(${=b}); adb shell input tap $(( (a[1]+a[3])/2 )) $(( (a[2]+a[4])/2 ))
