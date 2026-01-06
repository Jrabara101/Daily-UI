import { createMachine, createActor, assign } from 'xstate';

/**
 * Custom Media State Machine for Video Player
 * Manages: Idle, Loading, Buffering, Playing, Paused, Seeking, Error states
 */
export const videoPlayerMachine = createMachine({
  id: 'videoPlayer',
  initial: 'idle',
  context: {
    videoElement: null,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
    bufferedRanges: [],
    error: null,
    isTheaterMode: false,
    isPictureInPicture: false,
    isPageVisible: true,
    currentQuality: null,
    hls: null,
  },
  states: {
    idle: {
      on: {
        LOAD_VIDEO: {
          target: 'loading',
          actions: assign(({ event, context }) => {
            if (context.videoElement && event.type === 'LOAD_VIDEO') {
              if (event.isHLS && window.Hls && window.Hls.isSupported()) {
                const hls = new window.Hls();
                hls.loadSource(event.src);
                hls.attachMedia(context.videoElement);
                hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
                  context.videoElement?.play();
                });
                hls.on(window.Hls.Events.LEVEL_SWITCHED, (eventType, data) => {
                  context.videoElement?.dispatchEvent(
                    new CustomEvent('qualitychange', { detail: data.level })
                  );
                });
                return { hls };
              } else {
                context.videoElement.src = event.src;
                context.videoElement.load();
              }
            }
            return {};
          }),
        },
      },
    },
    loading: {
      on: {
        PLAY: {
          target: 'playing',
          actions: ({ context }) => {
            context.videoElement?.play();
          },
        },
        PAUSE: {
          target: 'paused',
          actions: ({ context }) => {
            context.videoElement?.pause();
          },
        },
        ERROR: {
          target: 'error',
          actions: assign(({ event }) => {
            if (event.type === 'ERROR') {
              return { error: event.error };
            }
            return {};
          }),
        },
        DURATION_CHANGE: {
          actions: assign(({ event }) => {
            if (event.type === 'DURATION_CHANGE') {
              return { duration: event.duration };
            }
            return {};
          }),
        },
      },
    },
    buffering: {
      on: {
        PLAY: {
          target: 'playing',
          actions: ({ context }) => {
            context.videoElement?.play();
          },
        },
        PAUSE: {
          target: 'paused',
          actions: ({ context }) => {
            context.videoElement?.pause();
          },
        },
        TIME_UPDATE: {
          actions: assign(({ event }) => {
            if (event.type === 'TIME_UPDATE') {
              return { currentTime: event.currentTime };
            }
            return {};
          }),
        },
        BUFFERED_UPDATE: {
          actions: assign(({ event }) => {
            if (event.type === 'BUFFERED_UPDATE') {
              return { bufferedRanges: event.bufferedRanges };
            }
            return {};
          }),
        },
      },
    },
    playing: {
      on: {
        PAUSE: {
          target: 'paused',
          actions: ({ context }) => {
            context.videoElement?.pause();
          },
        },
        SEEK: {
          target: 'seeking',
          actions: assign(({ event, context }) => {
            if (context.videoElement && event.type === 'SEEK') {
              context.videoElement.currentTime = event.time;
            }
            return {};
          }),
        },
        TIME_UPDATE: {
          actions: assign(({ event }) => {
            if (event.type === 'TIME_UPDATE') {
              return { currentTime: event.currentTime };
            }
            return {};
          }),
        },
        BUFFERED_UPDATE: {
          actions: assign(({ event }) => {
            if (event.type === 'BUFFERED_UPDATE') {
              return { bufferedRanges: event.bufferedRanges };
            }
            return {};
          }),
        },
        SET_VOLUME: {
          actions: assign(({ event, context }) => {
            if (context.videoElement && event.type === 'SET_VOLUME') {
              context.videoElement.volume = event.volume;
              return { volume: event.volume };
            }
            return {};
          }),
        },
        SET_PLAYBACK_RATE: {
          actions: assign(({ event, context }) => {
            if (context.videoElement && event.type === 'SET_PLAYBACK_RATE') {
              context.videoElement.playbackRate = event.rate;
              return { playbackRate: event.rate };
            }
            return {};
          }),
        },
        TOGGLE_THEATER_MODE: {
          actions: assign(({ context }) => ({
            isTheaterMode: !context.isTheaterMode,
          })),
        },
        TOGGLE_PICTURE_IN_PICTURE: {
          actions: [
            async ({ context }) => {
              if (context.isPictureInPicture) {
                await document.exitPictureInPicture();
              } else if (context.videoElement && document.pictureInPictureEnabled) {
                await context.videoElement.requestPictureInPicture();
              }
            },
            assign(({ context }) => ({
              isPictureInPicture: !context.isPictureInPicture,
            })),
          ],
        },
        PAGE_VISIBILITY_CHANGE: {
          actions: assign(({ event, context }) => {
            if (event.type === 'PAGE_VISIBILITY_CHANGE' && !event.isVisible && context.videoElement) {
              context.videoElement.pause();
            }
            return { isPageVisible: event.isVisible };
          }),
        },
        ERROR: {
          target: 'error',
          actions: assign(({ event }) => {
            if (event.type === 'ERROR') {
              return { error: event.error };
            }
            return {};
          }),
        },
      },
    },
    paused: {
      on: {
        PLAY: {
          target: 'playing',
          actions: ({ context }) => {
            context.videoElement?.play();
          },
        },
        SEEK: {
          target: 'seeking',
          actions: assign(({ event, context }) => {
            if (context.videoElement && event.type === 'SEEK') {
              context.videoElement.currentTime = event.time;
            }
            return {};
          }),
        },
        TIME_UPDATE: {
          actions: assign(({ event }) => {
            if (event.type === 'TIME_UPDATE') {
              return { currentTime: event.currentTime };
            }
            return {};
          }),
        },
        SET_VOLUME: {
          actions: assign(({ event, context }) => {
            if (context.videoElement && event.type === 'SET_VOLUME') {
              context.videoElement.volume = event.volume;
              return { volume: event.volume };
            }
            return {};
          }),
        },
        TOGGLE_THEATER_MODE: {
          actions: assign(({ context }) => ({
            isTheaterMode: !context.isTheaterMode,
          })),
        },
        TOGGLE_PICTURE_IN_PICTURE: {
          actions: [
            async ({ context }) => {
              if (context.isPictureInPicture) {
                await document.exitPictureInPicture();
              } else if (context.videoElement && document.pictureInPictureEnabled) {
                await context.videoElement.requestPictureInPicture();
              }
            },
            assign(({ context }) => ({
              isPictureInPicture: !context.isPictureInPicture,
            })),
          ],
        },
      },
    },
    seeking: {
      on: {
        TIME_UPDATE: {
          target: 'paused',
          actions: assign(({ event }) => {
            if (event.type === 'TIME_UPDATE') {
              return { currentTime: event.currentTime };
            }
            return {};
          }),
        },
        PLAY: {
          target: 'playing',
          actions: ({ context }) => {
            context.videoElement?.play();
          },
        },
      },
    },
    error: {
      on: {
        LOAD_VIDEO: {
          target: 'loading',
          actions: [
            assign(({ event, context }) => {
              if (context.videoElement && event.type === 'LOAD_VIDEO') {
                if (event.isHLS && window.Hls && window.Hls.isSupported()) {
                  const hls = new window.Hls();
                  hls.loadSource(event.src);
                  hls.attachMedia(context.videoElement);
                  hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
                    context.videoElement?.play();
                  });
                  hls.on(window.Hls.Events.LEVEL_SWITCHED, (eventType, data) => {
                    context.videoElement?.dispatchEvent(
                      new CustomEvent('qualitychange', { detail: data.level })
                    );
                  });
                  return { hls };
                } else {
                  context.videoElement.src = event.src;
                  context.videoElement.load();
                }
              }
              return {};
            }),
            assign(() => ({ error: null })),
          ],
        },
      },
    },
  },
  on: {
    QUALITY_CHANGE: {
      actions: assign(({ event }) => {
        if (event.type === 'QUALITY_CHANGE') {
          return { currentQuality: event.quality };
        }
        return {};
      }),
    },
    SET_VIDEO_ELEMENT: {
      actions: assign(({ event }) => {
        if (event.type === 'SET_VIDEO_ELEMENT') {
          return { videoElement: event.videoElement };
        }
        return {};
      }),
    },
  },
});

export const createVideoPlayerActor = (videoElement) => {
  const actor = createActor(videoPlayerMachine);
  actor.start();
  
  // Set video element in context
  if (videoElement) {
    actor.send({
      type: 'SET_VIDEO_ELEMENT',
      videoElement,
    });
  }
  
  return actor;
};