#!/bin/zsh
# usage: s.sh name [x y]  (coords in 405-wide screenshot space) - tap then screenshot
cd ~/Code/Conjuga/research
if [[ -n $2 ]]; then adb shell input tap $(( $2 * 1220 / 405 )) $(( $3 * 1220 / 405 )); sleep ${WAIT:-2}; fi
adb exec-out screencap -p > shots/$1.png && sips -Z 900 shots/$1.png --out shots/$1.png >/dev/null
