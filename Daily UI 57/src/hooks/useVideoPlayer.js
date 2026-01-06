import { useEffect, useRef, useState } from 'react';
import { useActor } from '@xstate/react';
import { createVideoPlayerActor } from '../machines/videoPlayerMachine';

/**
 * Custom hook for video player with state machine
 */
export const useVideoPlayer = (videoSrc, isHLS = false) => {
  const videoRef = useRef(null);
  const [actor] = useState(() => createVideoPlayerActor(null));
  const [state, send] = useActor(actor);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [hoverTime, setHoverTime] = useState(null);

  // Initialize video element
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      // Update actor context with video element
      send({
        type: 'SET_VIDEO_ELEMENT',
        videoElement: video,
      });

      // Event listeners
      const handleLoadedMetadata = () => {
        send({ type: 'DURATION_CHANGE', duration: video.duration });
      };

      const handleTimeUpdate = () => {
        send({ type: 'TIME_UPDATE', currentTime: video.currentTime });
        
        // Update buffered ranges
        const buffered = video.buffered;
        const ranges = [];
        for (let i = 0; i < buffered.length; i++) {
          ranges.push({
            start: buffered.start(i),
            end: buffered.end(i),
          });
        }
        send({ type: 'BUFFERED_UPDATE', bufferedRanges: ranges });
      };

      const handleWaiting = () => {
        send({ type: 'PAUSE' });
      };

      const handlePlaying = () => {
        send({ type: 'PLAY' });
      };

      const handlePause = () => {
        send({ type: 'PAUSE' });
      };

      const handleError = () => {
        send({ 
          type: 'ERROR', 
          error: video.error ? video.error.message : 'Unknown error' 
        });
      };

      const handleQualityChange = (e) => {
        send({ type: 'QUALITY_CHANGE', quality: e.detail });
      };

      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('pause', handlePause);
      video.addEventListener('error', handleError);
      video.addEventListener('qualitychange', handleQualityChange);

      // Load video
      if (videoSrc) {
        send({ type: 'LOAD_VIDEO', src: videoSrc, isHLS });
      }

      // Page Visibility API
      const handleVisibilityChange = () => {
        send({ 
          type: 'PAGE_VISIBILITY_CHANGE', 
          isVisible: !document.hidden 
        });
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Picture-in-Picture events
      const handleEnterPictureInPicture = () => {
        send({ type: 'TOGGLE_PICTURE_IN_PICTURE' });
      };
      const handleLeavePictureInPicture = () => {
        send({ type: 'TOGGLE_PICTURE_IN_PICTURE' });
      };
      video.addEventListener('enterpictureinpicture', handleEnterPictureInPicture);
      video.addEventListener('leavepictureinpicture', handleLeavePictureInPicture);

      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('error', handleError);
        video.removeEventListener('qualitychange', handleQualityChange);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        video.removeEventListener('enterpictureinpicture', handleEnterPictureInPicture);
        video.removeEventListener('leavepictureinpicture', handleLeavePictureInPicture);
      };
    }
  }, [videoSrc, isHLS, send]);

  // Generate thumbnail preview (simulated - in production, use actual thumbnail API)
  const generateThumbnail = async (time) => {
    if (!videoRef.current) return null;
    
    const video = videoRef.current;
    
    // Check if video is ready
    if (video.readyState < 2) {
      return null;
    }
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 180;
      const ctx = canvas.getContext('2d');
      
      const currentTime = video.currentTime;
      video.currentTime = time;
      
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Seek timeout'));
        }, 2000);
        
        video.addEventListener('seeked', () => {
          clearTimeout(timeout);
          resolve();
        }, { once: true });
      });
      
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
      
      video.currentTime = currentTime;
      return thumbnail;
    } catch (error) {
      console.warn('Failed to generate thumbnail:', error);
      return null;
    }
  };

  const handleProgressHover = async (time) => {
    setHoverTime(time);
    const thumbnail = await generateThumbnail(time);
    setThumbnailPreview(thumbnail);
  };

  const handleProgressLeave = () => {
    setHoverTime(null);
    setThumbnailPreview(null);
  };

  return {
    videoRef,
    state: state.context,
    currentState: state.value,
    send,
    thumbnailPreview,
    hoverTime,
    handleProgressHover,
    handleProgressLeave,
  };
};
