# How KolmoLD can benefit streaming media

KolmoLD can also be applied to streaming media
Suppose we are streaming a video at 480p off of a site that uses adaptive bitrate streaming.
Our buffer holds a few 480p frames. However, once the video player detects that the network could support 720p, our 480p frames in buffer are discarded. 720p frames are downloaded instead.

With the help of KolmoLD, we can avoid having to discard the buffered frames. Algorithms can be provided through Kolmoblocks that allow us to use the 480p frame to construct the 720p frame.

![Streaming Diagram](streaming_diagram.jpg)

To showcase this concept, suppose we have a 480p image and would like to obtain the 720p image.
Our first option is to download the 720p image. Or, we could use a web assembly module that takes in both resolutions and uses the difference of them to to build the 720p from the 480p image. 




