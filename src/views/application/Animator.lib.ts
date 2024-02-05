export function Animator(
  fps: number,
  callback: (params: { time: number; frame: number }) => boolean,
) {
  const delay = 1000 / fps; // calc. time per frame
  let time: null | number = null; // start time
  let frame = -1; // frame count
  let id = 0;
  // let tref: FrameRequestCallback; // rAF time reference

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function loop(timestamp: number) {
    if (time === null) time = timestamp; // init start time
    const seg = Math.floor((timestamp - time) / delay); // calc frame no.
    let res = true;
    if (seg > frame) {
      // moved to next frame?
      frame = seg; // update
      res = callback({
        // callback function
        time: timestamp,
        frame: frame,
      });
    }
    // tref =
    if (res) {
      id = requestAnimationFrame(loop);
    } else {
      console.log(id, 'cancelAnimationFrame');
      cancelAnimationFrame(id);
      cancelAnimationFrame(--id);
    }
  }

  return loop(0);
}
