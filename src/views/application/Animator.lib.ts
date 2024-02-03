export function Animator(fps: number, callback: (params: { time: number; frame: number }) => void) {
  const delay = 1000 / fps; // calc. time per frame
  let time: null | number = null; // start time
  let frame = -1; // frame count
  // let tref: FrameRequestCallback; // rAF time reference

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function loop(timestamp: number) {
    if (time === null) time = timestamp; // init start time
    const seg = Math.floor((timestamp - time) / delay); // calc frame no.
    if (seg > frame) {
      // moved to next frame?
      frame = seg; // update
      callback({
        // callback function
        time: timestamp,
        frame: frame,
      });
    }
    // tref =
    requestAnimationFrame(loop);
  }

  loop(0);
}
