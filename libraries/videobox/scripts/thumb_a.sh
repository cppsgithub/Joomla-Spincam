(test -f "$2.jpg"  || test -f "$2.jpg__"  || (avconv -loglevel quiet -i "$1"             -f mjpeg -y "$2.jpg__"  && mv "$2.jpg__"  "$2.jpg"))  || rm "$2.jpg__"